import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GET_PRODUCT_BY_ID, PRODUCTS_PAGE_QUERY } from "@/graphql/queries";
import { UPDATE_PRODUCT_BY_ID_MUTATION } from "@/graphql/mutations";
import { useMutation, useReadQuery } from "@apollo/client/react";
import {
  Button,
  Divider,
  Input,
  Select,
  Space,
  Switch,
  Typography,
  message,
  Modal,
  Upload,
  Form,
  Tooltip,
} from "antd";
import {
  PictureTwoTone,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import CategoryModal from "@/components/CategoryModal";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import uploadImage from "@/utils/uploadImage";

const { TextArea } = Input;
const { Title } = Typography;

export const Route = createFileRoute("/_layout/products/$productId")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery }, params }) => {
    const queryRef = preloadQuery(GET_PRODUCT_BY_ID, {
      variables: {
        adminProductId: params.productId,
      },
    });
    const productsListQueryRef = preloadQuery(PRODUCTS_PAGE_QUERY);
    return { queryRef, productsListQueryRef };
  },
});

function RouteComponent() {
  const { queryRef, productsListQueryRef } = Route.useLoaderData();
  const { data: productData } = useReadQuery(queryRef);
  useReadQuery(productsListQueryRef);
  const params = Route.useParams();
  const navigate = useNavigate();
  const [updateProduct, { loading: updateProductLoading }] = useMutation(
    UPDATE_PRODUCT_BY_ID_MUTATION,
    {
      refetchQueries: [GET_PRODUCT_BY_ID],
      onCompleted: () => {
        messageApi.success("Product updated successfully");
        navigate({ to: "/products" });
      },
      onError: (error) => {
        console.error(error);
        messageApi.error("Failed to update product");
      },
    },
  );
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [isActive, setIsActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false);

  // Initialize/Sync form data when product data is available
  useEffect(() => {
    if (productData?.adminProduct) {
      const product = productData.adminProduct;
      form.setFieldsValue({
        name: product.name || "",
        description: product.description || "",
        tagline: product.tagline,
        isActive: product.isActive,
        slug: product.slug,
        categoryId: product.category?.id,
      });
      setPreviewUrl(product.media?.[0]?.url ? `${product.media[0].url}` : null);
    }
  }, [productData]);

  const showConfirmChanges = () => {
    modal.confirm({
      title: "Confirm Changes",
      content: "Are you sure you want to save changes to this product?",
      okText: "Yes, Save",
      cancelText: "Cancel",
      onOk: async () => {
        await handleUpdateProduct();
      },
    });
  };

  const handleUpdateProduct = async () => {
    //   let iconURL = null;
    let uploadedMediaId = null;
    const { image, ...actualPayload } = form.getFieldsValue();
    if (selectedFile) {
      messageApi.loading("Uploading current cover image...", 0);
      const uploadResult = await uploadImage(selectedFile);
      // iconURL = uploadResult.url;
      uploadedMediaId = uploadResult.id;
      messageApi.destroy();
    }

    await updateProduct({
      variables: {
        updateProductInput: {
          ...actualPayload,
          id: params.productId,
          mediaIds: uploadedMediaId
            ? [uploadedMediaId]
            : productData?.adminProduct?.media?.[0]?.id
              ? [productData.adminProduct.media[0].id]
              : [],
          // icon: iconURL
          //   ? `${import.meta.env.VITE_API_URL}${iconURL}`
          //   : formData.icon,
          slug: actualPayload.slug.trim()
            ? actualPayload.slug.toLowerCase().replace(/\s+/g, "-")
            : actualPayload.name.toLowerCase().replace(/\s+/g, "-"),
        },
      },
    });
  };

  return (
    <>
      <Form form={form} onFinish={showConfirmChanges} layout="vertical">
        {contextHolder}
        {modalContextHolder}
        <CategoryModal
          open={categoryModalOpen}
          onOk={() => setCategoryModalOpen(false)}
          onCancel={() => setCategoryModalOpen(false)}
        />
        <ImagePreviewModal
          title="Product Cover Image"
          open={imagePreviewModalOpen}
          onOk={() => setImagePreviewModalOpen(false)}
          onCancel={() => setImagePreviewModalOpen(false)}
          previewUrl={previewUrl}
        />
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-1">
            <Title level={2} className="m-0!">
              Edit Product
            </Title>
            <span className="text-gray-500 m-0">
              Edit and upload product to the website.
            </span>
          </div>
          <div className="flex justify-center gap-2">
            <Form.Item name="isActive" className="mb-0!">
              <div className="flex justify-between items-center gap-2 border border-gray-300 rounded-md p-2">
                <span className="text-gray-500 m-0">
                  {isActive
                    ? "Visible to the public"
                    : "Hidden from the public"}
                </span>
                <Switch
                  defaultChecked={productData?.adminProduct?.isActive}
                  onChange={(checked) => {
                    setIsActive(checked);
                    form.setFieldsValue({
                      isActive: checked,
                    });
                  }}
                />
              </div>
            </Form.Item>
            <Button
              type="default"
              htmlType="button"
              onClick={() => navigate({ to: "/products" })}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              disabled={updateProductLoading}
              loading={updateProductLoading}
              htmlType="submit"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <Divider />

        {/* Form */}
        <div className="flex gap-6 mb-3">
          <div className="w-2/3 flex flex-col gap-2">
            {/* Product Title */}
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please enter product name" }]}
              label={
                <span className="font-medium text-gray-700">Product Name</span>
              }
              className="mb-0!"
            >
              <Input placeholder="Enter product name..." size="large" />
            </Form.Item>

            {/* Product Description */}
            <Form.Item
              name="description"
              valuePropName="content"
              label={
                <span className="font-medium text-gray-700">
                  Product Description
                </span>
              }
              rules={[
                { required: true, message: "Please enter product description" },
              ]}
              className="mb-0!"
            >
              <SimpleEditor
                className="border rounded-md"
                style={{ height: 500 }}
              />
            </Form.Item>

            {/* Product Tagline */}
            <Form.Item
              name="tagline"
              rules={[
                { required: true, message: "Please enter product tagline" },
              ]}
              label={
                <span className="font-medium text-gray-700">
                  Product Tagline
                </span>
              }
              className="mb-0!"
            >
              <TextArea rows={4} placeholder="Enter product tagline..." />
            </Form.Item>
          </div>

          <div className="w-1/3 flex flex-col gap-2">
            {/* Product Icon */}
            <Form.Item
              name="image"
              label={<span className="font-medium text-gray-700">Icon</span>}
              rules={[
                {
                  validator: () => {
                    if (!selectedFile && !previewUrl) {
                      return Promise.reject(new Error("Please upload icon"));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              className="mb-0!"
            >
              <div className="flex flex-col items-center gap-4">
                {/* Preview */}
                <div className="w-full aspect-video rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 shadow-inner">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={() => setImagePreviewModalOpen(true)}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <PictureTwoTone className="text-5xl mb-2" />
                      <p>No Image Uploaded</p>
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex gap-2 w-full">
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
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />} className="w-full">
                      {previewUrl ? "Change Image" : "Upload Image"}
                    </Button>
                  </Upload>
                  {previewUrl && (
                    <Button
                      danger
                      className="flex-1"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </Form.Item>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-4">
              {/* Product Category */}
              <Form.Item
                name="categoryId"
                label={
                  <span className="font-medium text-gray-700">Category</span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please select a category",
                  },
                ]}
                className="mb-0!"
              >
                <Select
                  className="w-full"
                  placeholder="None"
                  options={[
                    ...(productData.categoriesAdmin?.map((c) => ({
                      label: c.name,
                      value: c.id,
                    })) || []),
                  ]}
                  popupRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Space style={{ padding: "0 8px 4px" }}>
                        <Tooltip title="Manage Categories">
                          <Button
                            type="text"
                            icon={<SettingOutlined />}
                            onClick={() => setCategoryModalOpen(true)}
                          >
                            Manage Categories
                          </Button>
                        </Tooltip>
                      </Space>
                    </>
                  )}
                />
              </Form.Item>
              {/* Product Slug */}
              <Form.Item
                name="slug"
                label={<span className="font-medium text-gray-700">Slug</span>}
                className="mb-0!"
              >
                <Input placeholder="/post-slug" />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}
