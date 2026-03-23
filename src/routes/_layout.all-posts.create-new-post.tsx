import { useState } from "react";
import {
  UploadOutlined,
  SaveOutlined,
  PictureTwoTone,
  SettingOutlined,
} from "@ant-design/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Button,
  Divider,
  Input,
  message,
  Select,
  Space,
  Typography,
  Modal,
  Upload,
  Form,
  Tooltip,
} from "antd";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useMutation, useReadQuery } from "@apollo/client/react";
import { CREATE_ARTICLE_MUTATION } from "@/graphql/mutations";
import { GET_ALL_CATEGORIES, POSTS_PAGE_QUERY } from "@/graphql/queries";
import { ArticleStatus } from "@/graphql/generated/graphql";
import CategoryModal from "@/components/CategoryModal";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import uploadImage from "@/utils/uploadImage";

const { TextArea } = Input;
const { Title } = Typography;

export const Route = createFileRoute("/_layout/all-posts/create-new-post")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const categoryQueryRef = preloadQuery(GET_ALL_CATEGORIES);
    const postsQueryRef = preloadQuery(POSTS_PAGE_QUERY);
    return {
      categoryQueryRef,
      postsQueryRef,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { categoryQueryRef, postsQueryRef } = Route.useLoaderData();
  const { data: categoriesData } = useReadQuery(categoryQueryRef);
  useReadQuery(postsQueryRef);
  const [form] = Form.useForm();
  const [createArticle, { loading: createArticleLoading }] = useMutation(
    CREATE_ARTICLE_MUTATION,
    {
      refetchQueries: [POSTS_PAGE_QUERY],
      onCompleted: () => {
        messageApi.success("Article created successfully");
        navigate({ to: "/all-posts" });
      },
      onError: (error) => {
        console.error(error);
        messageApi.error(
          "Failed to create article. Check console for more details.",
        );
      },
    },
  );
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, contextHolder] = Modal.useModal();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false);

  const showConfirm = () => {
    modal.confirm({
      title: "Confirm",
      content: "Are you sure you want to save changes for this article?",
      onOk() {
        handleCreateArticle();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleCreateArticle = async () => {
    let uploadedMediaId = null;
    const { image, ...actualPayload } = form.getFieldsValue();
    // A. Check if user selected a file but it hasn't been uploaded yet
    if (selectedFile) {
      messageApi.loading("Uploading image...", 0); // Show sticky loading
      const uploadResult = await uploadImage(selectedFile);
      uploadedMediaId = uploadResult.id;
      messageApi.destroy(); // Remove loading message
    }

    // B. Now execute the GraphQL mutation with the ID we just got
    await createArticle({
      variables: {
        payload: {
          ...actualPayload,
          // categoryId: formData.categoryId || null,
          // status: formData.status,
          // If we uploaded a file, use its ID. Otherwise, use existing coverImageId.
          mediaIds: uploadedMediaId ? [uploadedMediaId] : [],
        },
      },
    });
  };

  return (
    <>
      <Form form={form} onFinish={showConfirm} layout="vertical">
        {messageContextHolder}
        {contextHolder}
        <CategoryModal
          open={categoryModalOpen}
          onOk={() => setCategoryModalOpen(false)}
          onCancel={() => setCategoryModalOpen(false)}
        />
        <ImagePreviewModal
          open={imagePreviewModalOpen}
          onOk={() => setImagePreviewModalOpen(false)}
          onCancel={() => setImagePreviewModalOpen(false)}
          previewUrl={previewUrl}
          title="Cover Image Preview"
        />

        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-1">
            <Title level={2} className="m-0!">
              Create New Post
            </Title>
            <span className="text-gray-500 m-0">
              Create and publish new posts to the website.
            </span>
          </div>
          <div className="flex gap-2">
            <Form.Item name="status" initialValue={"DRAFT" as ArticleStatus}>
              <Select
                style={{ width: 150 }}
                options={[
                  {
                    label: "Draft",
                    value: "DRAFT" as ArticleStatus,
                  },
                  {
                    label: "Published",
                    value: "PUBLISHED" as ArticleStatus,
                  },
                ]}
                // value={formData.status}
                // onChange={(value) =>
                //   setFormData((prev) => ({ ...prev, status: value }))
                // }
              />
            </Form.Item>
            <Button
              type="default"
              htmlType="button"
              onClick={() => navigate({ to: "/all-posts" })}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              disabled={createArticleLoading}
              loading={createArticleLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <Divider />

        {/* Main Layout Area */}
        <div className="flex gap-8 mb-3">
          {/* Left Column (Main Content) */}
          <div className="w-2/3 flex flex-col gap-4">
            <Form.Item
              name="title"
              label={
                <span className="font-medium text-gray-700">Post Title</span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter a post title",
                },
              ]}
              className="mb-0!"
            >
              <Input placeholder="Enter post title..." size="large" />
            </Form.Item>

            <Form.Item
              name="content"
              label={<span className="font-medium text-gray-700">Content</span>}
              rules={[
                {
                  required: true,
                  message: "Please enter post content",
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

            <Form.Item
              name="excerpt"
              label={<span className="font-medium text-gray-700">Excerpt</span>}
              rules={[
                {
                  required: true,
                  message: "Please enter a post excerpt",
                },
              ]}
              className="mb-0!"
            >
              <TextArea rows={4} placeholder="Enter post excerpt..." />
            </Form.Item>
          </div>

          {/* Right Column (Meta Settings) */}
          <div className="w-1/3 flex flex-col gap-4">
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
                      className="w-full h-full object-contain hover:cursor-pointer"
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
                    ...(categoriesData?.categoriesAdmin?.map((c) => ({
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
                <Input placeholder="/post-slug" />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}
