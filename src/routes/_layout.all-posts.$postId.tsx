import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GET_ARTICLE_BY_ID } from "@/graphql/queries";
import { UPDATE_ARTICLE_BY_ID_MUTATION } from "@/graphql/mutations";
import { useMutation, useReadQuery } from "@apollo/client/react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
  Button,
  Divider,
  Input,
  message,
  Modal,
  Select,
  Space,
  Typography,
  Upload,
  Form,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  PictureTwoTone,
  SettingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ArticleStatus } from "@/graphql/generated/graphql";
import CategoryModal from "@/components/CategoryModal";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import uploadImage from "@/utils/uploadImage";

const { TextArea } = Input;
const { Title } = Typography;

export const Route = createFileRoute("/_layout/all-posts/$postId")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery }, params }) => {
    const queryRef = preloadQuery(GET_ARTICLE_BY_ID, {
      variables: { id: params.postId },
    });
    return { queryRef };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const params = Route.useParams();
  const { queryRef } = Route.useLoaderData();
  const [form] = Form.useForm();
  const { data: articleData, error: articleError } = useReadQuery(queryRef);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [updateArticle, { loading: updateArticleLoading }] = useMutation(
    UPDATE_ARTICLE_BY_ID_MUTATION,
    {
      refetchQueries: [GET_ARTICLE_BY_ID],
      onCompleted: () => {
        messageApi.success("Article updated successfully");
        navigate({ to: "/all-posts" });
      },
      onError: (error) => {
        console.error(error);
        messageApi.error(
          "Failed to update article. Check console for more details.",
        );
      },
    },
  );
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false);

  // Sync form data with article data when it loads
  useEffect(() => {
    if (articleData?.adminArticle) {
      const article = articleData.adminArticle;
      form.setFieldsValue({
        title: article.title || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        categoryId: article.category?.id || null,
        status: (article.status as ArticleStatus) || ArticleStatus.Draft,
        slug: article.slug || "",
      });
      setPreviewUrl(article.media?.[0]?.url ? `${article.media[0].url}` : null);
    }
  }, [articleData]);

  const handleUpdateArticle = async () => {
    try {
      let uploadedMediaId = null;
      const { image, ...actualPayload } = form.getFieldsValue();
      if (selectedFile) {
        messageApi.loading("Uploading current cover image...", 0);
        const uploadResult = await uploadImage(selectedFile);
        uploadedMediaId = uploadResult.id;
        messageApi.destroy();
      }

      await updateArticle({
        variables: {
          updateArticleId: params.postId,
          payload: {
            ...actualPayload,
            mediaIds: uploadedMediaId
              ? [uploadedMediaId]
              : articleData?.adminArticle?.media?.[0]?.id
                ? [articleData.adminArticle.media[0].id]
                : [],
          },
        },
        refetchQueries: [GET_ARTICLE_BY_ID],
      });
      messageApi.success("Article updated successfully");
      navigate({ to: "/all-posts" });
    } catch (error) {
      messageApi.destroy();
      console.error(error);
      messageApi.error("Failed to update article");
    }
  };

  const showConfirm = () => {
    modal.confirm({
      title: "Save Changes?",
      content: `Are you sure you want to save changes for this article?`,
      okText: "Yes",
      cancelText: "Cancel",
      onOk: async () => {
        await handleUpdateArticle();
      },
    });
  };

  if (articleError)
    return (
      <div className="p-10 text-center text-red-500">
        Error: {articleError.message}
      </div>
    );

  return (
    <>
      <Form form={form} onFinish={showConfirm} layout="vertical">
        {messageContextHolder}
        {modalContextHolder}
        <CategoryModal
          open={categoryModalOpen}
          onOk={() => setCategoryModalOpen(false)}
          onCancel={() => setCategoryModalOpen(false)}
          categories={articleData?.categoriesAdmin || []}
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
              Edit Post
            </Title>
            <span className="text-gray-500 m-0">
              Edit and publish post to the website.
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
              disabled={updateArticleLoading}
              loading={updateArticleLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <Divider />

        {/* Form */}
        <div className="flex gap-8 mb-3">
          <div className="w-2/3 flex flex-col gap-4">
            {/* Title */}
            <Form.Item
              name="title"
              label={
                <span className="font-medium text-gray-700">Post Title</span>
              }
              rules={[{ required: true, message: "Please enter a title" }]}
              className="mb-0!"
            >
              <Input placeholder="Enter post title..." size="large" />
            </Form.Item>

            {/* Content */}
            <Form.Item
              name="content"
              valuePropName="content"
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
              />
            </Form.Item>

            {/* Excerpt */}
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
          <div className="w-1/3 flex flex-col gap-4">
            {/* Cover Image */}
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
              {/* Category */}
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
                    ...(articleData?.categoriesAdmin.map((c) => ({
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

              {/* Slug */}
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
