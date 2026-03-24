import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  PictureTwoTone,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
  Modal,
  Form,
  Tooltip,
} from "antd";
import { useState } from "react";
import { useMutation, useReadQuery } from "@apollo/client/react";
import { CREATE_PRODUCT_MUTATION } from "@/graphql/mutations";
import { GET_ALL_CATEGORIES, PRODUCTS_PAGE_QUERY } from "@/graphql/queries";
import CategoryModal from "@/components/CategoryModal";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import uploadImage from "@/utils/uploadImage";

const { Title } = Typography;
const { TextArea } = Input;

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
  const [createProduct, { loading: createProductLoading }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      refetchQueries: [PRODUCTS_PAGE_QUERY],
      onCompleted: () => {
        messageApi.success("Product created successfully");
        navigate({ to: "/products" });
      },
      onError: (error) => {
        console.error(error);
        messageApi.error(
          "Failed to create product. Check console for more details.",
        );
      },
    },
  );
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false);

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
    let uploadedMediaId = null;
    const { image, ...actualPayload } = form.getFieldsValue();
    if (selectedFile) {
      messageApi.loading("Uploading current cover image...", 0);
      const uploadResult = await uploadImage(selectedFile);
      uploadedMediaId = uploadResult.id;
      messageApi.destroy();
    }

    await createProduct({
      variables: {
        createProductInput: {
          ...actualPayload,
          mediaIds: uploadedMediaId ? [uploadedMediaId] : [],
          slug: actualPayload.slug?.trim()
            ? actualPayload.slug.toLowerCase().replace(/\s+/g, "-")
            : actualPayload.name.toLowerCase().replace(/\s+/g, "-"),
        },
      },
    });
  };

  return (
    <>
      <Form form={form} onFinish={showConfirmAddProduct} layout="vertical">
        {contextHolder}
        {modalContextHolder}
        <CategoryModal
          open={categoryModalOpen}
          onOk={() => setCategoryModalOpen(false)}
          onCancel={() => setCategoryModalOpen(false)}
          categories={categoriesData?.categoriesAdmin || []}
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
              Create New Product
            </Title>
            <span className="text-gray-500 m-0">
              Create and publish new product to the website.
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
              disabled={createProductLoading}
              loading={createProductLoading}
              htmlType="submit"
            >
              Add Product
            </Button>
          </div>
        </div>

        <Divider />

        {/* Form */}
        <div className="flex gap-8 mb-3">
          <div className="w-2/3 flex flex-col gap-4">
            {/* Product Name */}
            <Form.Item
              name="name"
              label={
                <span className="font-medium text-gray-700">Product Name</span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter product name",
                },
              ]}
              className="mb-0!"
            >
              <Input placeholder="Enter product name..." size="large" />
            </Form.Item>

            {/* Product Description */}
            <Form.Item
              name="description"
              label={
                <span className="font-medium text-gray-700">Description</span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter product description",
                },
              ]}
              className="mb-0!"
            >
              <SimpleEditor
                className="border rounded-md"
                style={{ height: 500 }}
                // content={formData.content}
                // onChange={(content) =>
                //   setFormData((prev) => ({ ...prev, content }))
                // }
              />
            </Form.Item>

            {/* Product Tagline */}
            <Form.Item
              name="tagline"
              label={<span className="font-medium text-gray-700">Tagline</span>}
              rules={[
                {
                  required: true,
                  message: "Please enter product tagline",
                },
              ]}
              className="mb-0!"
            >
              <TextArea rows={4} placeholder="Enter product tagline..." />
            </Form.Item>
          </div>
          <div className="w-1/3 flex flex-col gap-2">
            {/* Image Upload */}
            <Form.Item
              name="image"
              label={
                <span className="font-medium text-gray-700">Cover Image</span>
              }
              rules={[
                {
                  validator: () => {
                    if (!selectedFile && !previewUrl) {
                      return Promise.reject(
                        new Error("Please upload gallery image"),
                      );
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
                    ...(categoriesData?.categoriesAdmin.map((c) => ({
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

              <Form.Item
                name="slug"
                label={<span className="font-medium text-gray-700">Slug</span>}
                className="mb-0!"
              >
                <Input placeholder="/product-slug" />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}
