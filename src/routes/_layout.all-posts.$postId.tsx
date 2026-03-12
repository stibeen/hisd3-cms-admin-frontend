import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GET_ARTICLE_BY_ID } from "@/graphql/queries";
import {
  CREATE_CATEGORY_MUTATION,
  UPDATE_ARTICLE_BY_ID_MUTATION,
} from "@/graphql/mutations";
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
} from "antd";
import {
  ContainerOutlined,
  SendOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import type { InputRef } from "antd";
import { ArticleStatus } from "@/graphql/generated/graphql";

const { TextArea } = Input;
const { Title } = Typography;

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
  const { data: articleData, error: articleError } = useReadQuery(queryRef);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    categoryId: null as string | null,
    status: "" as ArticleStatus,
    slug: "",
  });

  const [name, setName] = useState("");
  const inputRef = useRef<InputRef>(null);
  const [createCategory, { loading: createCategoryLoading }] = useMutation(
    CREATE_CATEGORY_MUTATION,
  );
  const [updateArticle, { loading: updateArticleLoading }] = useMutation(
    UPDATE_ARTICLE_BY_ID_MUTATION,
  );
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  // Sync form data with article data when it loads
  useEffect(() => {
    if (articleData?.adminArticle) {
      const article = articleData.adminArticle;
      setFormData({
        title: article.title || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        categoryId: article.category?.id || null,
        status: (article.status as ArticleStatus) || ArticleStatus.Draft,
        slug: article.slug || "",
      });
      setPreviewUrl(
        article.media?.[0]?.url
          ? `${article.media[0].url}?ngrok-skip-browser-warning=true`
          : null,
      );
    }
  }, [articleData]);

  const handleAddCategory = async () => {
    if (!name.trim()) return;
    try {
      await createCategory({
        variables: {
          createCategoryInput: {
            name: name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
          },
        },
        refetchQueries: [GET_ARTICLE_BY_ID],
      });
      setName("");
      messageApi.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      messageApi.error("Failed to add category");
    }
  };

  const handleUpdateArticle = async (status: ArticleStatus) => {
    try {
      let uploadedMediaId = null;

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
            ...formData,
            categoryId: formData.categoryId || null,
            status: status,
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

  const showConfirmPublish = (status: ArticleStatus) => {
    const isDraft = status === ArticleStatus.Draft;
    modal.confirm({
      title: isDraft ? "Save as Draft?" : "Publish Post?",
      content: `Are you sure you want to ${isDraft ? "save this as a draft" : "publish this post"}?`,
      okText: "Yes",
      cancelText: "Cancel",
      onOk: async () => {
        await handleUpdateArticle(status);
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
      {messageContextHolder}
      {modalContextHolder}
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
          <Button
            type="default"
            icon={<ContainerOutlined />}
            onClick={() => showConfirmPublish(ArticleStatus.Draft)}
            loading={updateArticleLoading}
          >
            Save as Draft
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            disabled={updateArticleLoading}
            loading={updateArticleLoading}
            onClick={() => showConfirmPublish(ArticleStatus.Published)}
          >
            Publish Post
          </Button>
        </div>
      </div>

      <Divider />

      {/* Form */}
      <div className="flex gap-6 mb-3">
        <div className="w-2/3 flex flex-col gap-2">
          <label className="m-0 text-lg font-semibold" htmlFor="post-title">
            Post Title
          </label>
          <Input
            id="post-title"
            placeholder="Enter post title..."
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <label className="m-0 text-lg font-semibold" htmlFor="post-excerpt">
            Excerpt
          </label>
          <TextArea
            id="post-excerpt"
            rows={4}
            placeholder="Enter post excerpt..."
            value={formData.excerpt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
            }
          />
        </div>
        <div className="w-1/3 flex flex-col gap-2">
          <label className="m-0 text-lg font-semibold" htmlFor="post-category">
            Category
          </label>
          <Select
            id="post-category"
            style={{ width: 350 }}
            placeholder="None"
            options={[
              ...(articleData?.categories?.map((c: any) => ({
                value: c.id,
                label: c.name,
              })) || []),
            ]}
            value={formData.categoryId || undefined}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, categoryId: value }))
            }
            popupRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Input
                    id="post-category-input"
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
          <label className="m-0 text-lg font-semibold" htmlFor="post-slug">
            Slug
          </label>
          <Input
            id="post-slug"
            placeholder="/post-slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
          />
          <label className="m-0 text-lg font-semibold" htmlFor="post-cover">
            Cover Image
          </label>
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

      {/* Content */}
      <div className="flex flex-col gap-2">
        <label className="m-0 text-lg font-semibold">Content</label>
        <SimpleEditor
          className="border rounded-md"
          style={{ height: 500 }}
          content={formData.content}
          onChange={(newContent) =>
            setFormData((prev) => ({ ...prev, content: newContent }))
          }
        />
        {/* <SimpleEditor
                    value={formData.content}
                    onChange={(newContent) => setFormData(prev => ({ ...prev, content: newContent }))}
                /> */}
      </div>
    </>
  );
}
