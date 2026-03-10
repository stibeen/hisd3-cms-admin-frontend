import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Input,
  message,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
  type InputRef,
  Modal,
} from "antd";
import { useRef, useState } from "react";
import { useMutation, useReadQuery } from "@apollo/client/react";
import {
  CREATE_CATEGORY_MUTATION,
  CREATE_PRODUCT_MUTATION,
} from "@/graphql/mutations";
import { GET_ALL_CATEGORIES, PRODUCTS_PAGE_QUERY } from "@/graphql/queries";
const { Title } = Typography;
const { TextArea } = Input;

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/media/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) throw new Error("Upload failed");
  return await response.json(); // Returns { id, url }
};

export const Route = createFileRoute("/_layout/products/create-new-product")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const categoryQueryRef = preloadQuery(GET_ALL_CATEGORIES);
    const productsQueryRef = preloadQuery(PRODUCTS_PAGE_QUERY);
    return {
      categoryQueryRef,
      productsQueryRef,
    };
  },
});

function RouteComponent() {
  const { categoryQueryRef } = Route.useLoaderData();
  const { productsQueryRef } = Route.useLoaderData();
  const { data: categoriesData } = useReadQuery(categoryQueryRef);
  useReadQuery(productsQueryRef);
  const navigate = useNavigate();
  const [createCategory, { loading: createCategoryLoading }] = useMutation(
    CREATE_CATEGORY_MUTATION,
  );
  const [createProduct, { loading: createProductLoading }] = useMutation(
    CREATE_PRODUCT_MUTATION,
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [name, setName] = useState("");
  const inputRef = useRef<InputRef>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // icon: "", // commented ICON  because we now using media[] to store media files
    name: "",
    description: "",
    tagline: "",
    isActive: false,
    slug: "",
    categoryId: null as string | null,
  });

  const handleAddCategory = async () => {
    try {
      await createCategory({
        variables: {
          createCategoryInput: {
            name: name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
          },
        },
        refetchQueries: [GET_ALL_CATEGORIES],
      });
      setName("");
      await messageApi.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      messageApi.error("Failed to add category");
    }
  };

  const showConfirmAddProduct = () => {
    modal.confirm({
      title: "Confirm Changes",
      content: "Are you sure you want to save changes to this product?",
      okText: "Yes, Save",
      cancelText: "Cancel",
      onOk: async () => {
        await handleCreateProduct();
      },
    });
  };

  const handleCreateProduct = async () => {
    try {
      // let iconURL = null;
      let uploadedMediaId = null;
      if (selectedFile) {
        messageApi.loading("Uploading current cover image...", 0);
        const uploadResult = await uploadImage(selectedFile);
        // iconURL = uploadResult.url;
        uploadedMediaId = uploadResult.id;
        messageApi.destroy();
      }

      await createProduct({
        variables: {
          createProductInput: {
            ...formData,
            // icon: iconURL ? `${import.meta.env.VITE_API_URL}${iconURL}` : null,
            mediaIds: uploadedMediaId ? [uploadedMediaId] : [],
            slug: formData.slug.trim()
              ? formData.slug.toLowerCase().replace(/\s+/g, "-")
              : formData.name.toLowerCase().replace(/\s+/g, "-"),
          },
        },
        refetchQueries: [PRODUCTS_PAGE_QUERY],
      });
      navigate({ to: "/products" });
    } catch (error) {
      messageApi.destroy();
      console.error(error);
      messageApi.error("Failed to update product");
    }
  };

  return (
    <>
      {contextHolder}
      {modalContextHolder}
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col gap-1">
          <Title level={2} className="m-0!">
            Create New Product
          </Title>
          <span className="text-gray-500 m-0">
            Create and publish new product to the website.
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={createProductLoading}
            loading={createProductLoading}
            onClick={showConfirmAddProduct}
          >
            Add Product
          </Button>
        </div>
      </div>
      <Divider />

      {/* Form */}
      <div className="flex gap-6 mb-3">
        <div className="w-2/3 flex flex-col gap-2">
          <label className="m-0 text-lg font-semibold" htmlFor="product-name">
            Product Name
          </label>
          <Input
            id="product-name"
            placeholder="Enter product name..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label className="m-0 text-lg font-semibold" htmlFor="product-slug">
            Slug
          </label>
          <Input
            id="product-slug"
            placeholder="/product-slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
          <label
            className="m-0 text-lg font-semibold"
            htmlFor="product-tagline"
          >
            Tagline
          </label>
          <TextArea
            rows={4}
            id="product-tagline"
            placeholder="Enter product tagline..."
            value={formData.tagline}
            onChange={(e) =>
              setFormData({ ...formData, tagline: e.target.value })
            }
          />
        </div>
        <div className="w-1/3 flex flex-col gap-2">
          <label
            className="m-0 text-lg font-semibold"
            htmlFor="product-category"
          >
            Category
          </label>
          <Select
            id="product-category"
            style={{ width: 350 }}
            placeholder="None"
            options={[
              ...(categoriesData?.categories?.map((c: any) => ({
                value: c.id,
                label: c.name,
              })) || []),
            ]}
            value={formData.categoryId || undefined}
            onChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
            popupRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    id="product-category-input"
                    placeholder="Add New Category"
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={handleAddCategory}
                    disabled={createCategoryLoading || !name.trim()}
                  >
                    Add Category
                  </Button>
                </Space>
              </>
            )}
          />
          <label
            className="m-0 text-lg font-semibold"
            htmlFor="product-active-status"
          >
            Active Status
          </label>
          <div className="flex justify-between items-center gap-2 border border-gray-300 rounded-md p-2">
            <span className="text-gray-500 m-0">
              {formData.isActive
                ? "Visible to the public"
                : "Hidden from the public"}
            </span>
            <Switch
              id="product-active-status"
              onChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
              checked={formData.isActive}
            />
          </div>
          <label htmlFor="product-icon">Icon</label>
          <Upload
            beforeUpload={(file) => {
              setSelectedFile(file);
              const url = URL.createObjectURL(file);
              setPreviewUrl(url);
              return false;
            }}
            onRemove={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            maxCount={1}
            listType="picture-card"
            showUploadList={false}
          >
            {previewUrl ? (
              <div className="relative group w-full h-full">
                <img
                  src={previewUrl}
                  alt="Cover Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity flex-col gap-2">
                  <UploadOutlined className="text-white text-xl" />
                  <span className="text-white text-xs">Change Image</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload Cover</div>
              </div>
            )}
          </Upload>
        </div>
      </div>

      {/* Description WYSIWYG*/}
      <div className="flex flex-col gap-2">
        <label className="m-0 text-lg font-semibold">Description</label>
        <SimpleEditor
          className="border rounded-md"
          style={{ height: 500 }}
          content={formData.description}
          onChange={(newContent) =>
            setFormData((prev) => ({ ...prev, description: newContent }))
          }
        />
      </div>
    </>
  );
}
