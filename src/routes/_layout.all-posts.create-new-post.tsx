import { useRef, useState } from 'react';
import { ContainerOutlined, SendOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Divider, Input, message, Select, Space, Typography, Modal, Upload } from 'antd';
import type { InputRef } from 'antd';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { useMutation, useReadQuery } from '@apollo/client/react';
import { CREATE_ARTICLE_MUTATION, CREATE_CATEGORY_MUTATION } from '@/graphql/mutations';
import { GET_ALL_CATEGORIES, POSTS_PAGE_QUERY } from '@/graphql/queries';
import { ArticleStatus } from '@/graphql/generated/graphql';

const { TextArea } = Input;
const { Title } = Typography;

export const Route = createFileRoute('/_layout/all-posts/create-new-post')({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const categoryQueryRef = preloadQuery(GET_ALL_CATEGORIES);
    const postsQueryRef = preloadQuery(POSTS_PAGE_QUERY);
    return {
      categoryQueryRef,
      postsQueryRef
    };
  }
})

function RouteComponent() {
  const navigate = useNavigate();
  const { categoryQueryRef, postsQueryRef } = Route.useLoaderData();
  const { data: categoriesData } = useReadQuery(categoryQueryRef);
  const { data: postsData } = useReadQuery(postsQueryRef);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [createArticle, { loading: createArticleLoading }] = useMutation(CREATE_ARTICLE_MUTATION);
  const [createCategory] = useMutation(CREATE_CATEGORY_MUTATION);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, contextHolder] = Modal.useModal();
  // i changed this
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryId: null,
    status: 'DRAFT' as ArticleStatus,
    slug: '',
    coverImageId: null,
    coverImageUrl: null,
  });

  const handleAddCategory = async () => {
    try {
      await createCategory({
        variables: {
          createCategoryInput: {
            name: name,
            slug: name.toLowerCase()
          }
        },
        refetchQueries: [GET_ALL_CATEGORIES]
      });
      setName('');
      await messageApi.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      messageApi.error('Failed to add category');
    }
  };

  const showConfirm = () => {
    modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to publish this article?',
      onOk() {
        handleCreateArticle('PUBLISHED' as ArticleStatus);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleCreateArticle = async (status: ArticleStatus) => {
    try {
      const { coverImageId, coverImageUrl, ...actualPayload } = formData;
      await createArticle({
        variables: {
          payload: {
            ...actualPayload,
            categoryId: formData.categoryId || null,
            status: status,
            mediaIds: formData.coverImageId ? [formData.coverImageId] : [],
          }
        },
        refetchQueries: [POSTS_PAGE_QUERY]
      })
      messageApi.success('Article created successfully');
      navigate({ to: '/all-posts' });
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to create article');
    }
  }

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append('file', file); // Use the key your backend expects (usually 'file' or 'image')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/media/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        // Include auth headers since this is a separate REST call from Apollo
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      const data = await response.json();

      // 1. Tell the UI it was successful
      onSuccess(data);

      // 2. Save the ID/URL to your form state so it gets sent with your article
      setFormData(prev => ({ ...prev, coverImageId: data.id, coverImageUrl: data.url }));

      messageApi.success('Image uploaded successfully');
    } catch (err) {
      onError(err);
      messageApi.error('Upload failed');
    }
  };


  return (
    <>
      {messageContextHolder}
      {contextHolder}
      {/* Header */}
      <div className='flex justify-between items-end mb-6'>
        <div className='flex flex-col gap-1'>
          <Title level={2} className="m-0!">Create New Post</Title>
          <span className='text-gray-500 m-0'>Create and publish new posts to the website.</span>
        </div>
        <div className='flex gap-2'>
          <Button
            type="default"
            icon={<ContainerOutlined />}
            onClick={() => handleCreateArticle('DRAFT' as ArticleStatus)}
            disabled={createArticleLoading}
            loading={createArticleLoading}
          >
            Save Draft
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={showConfirm}
            disabled={createArticleLoading}
            loading={createArticleLoading}
          >
            Publish Post
          </Button>
        </div>
      </div>

      <Divider />

      {/* Post Title, Excerpt, Category, Slug */}
      <div className='flex gap-6 mb-3'>
        <div className='w-2/3 flex flex-col gap-2'>
          <label className="m-0 text-lg font-semibold" htmlFor='post-title'>Post Title</label>
          <Input id='post-title' placeholder="Enter post title..." value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} />
          <label className="m-0 text-lg font-semibold" htmlFor='post-excerpt'>Excerpt</label>
          <TextArea id='post-excerpt' rows={4} placeholder="Enter post excerpt..." value={formData.excerpt} onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))} />
        </div>
        <div className='w-1/3 flex flex-col gap-2'>
          <label className="m-0 text-lg font-semibold" htmlFor='post-category'>Category</label>
          <Select
            id='post-category'
            style={{ width: 350 }}
            placeholder="None"
            options={[...(categoriesData?.categories.map((c) => ({ label: c.name, value: c.id })) || [])
            ]}
            value={formData.categoryId || null}
            onChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            popupRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    id='post-category-input'
                    placeholder="Add New Category"
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={handleAddCategory}>
                    Add Category
                  </Button>
                </Space>
              </>
            )}
          />
          <label className="m-0 text-lg font-semibold" htmlFor='post-slug'>Slug</label>
          <Input id='post-slug' placeholder="/post-slug" value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} />
          <label className="m-0 text-lg font-semibold" htmlFor='post-cover'>Cover Image</label>
          <Upload
            customRequest={handleUpload}
            maxCount={1}
            listType='picture'
          >
            <Button icon={<UploadOutlined />}>Click to Upload Cover Image</Button>
          </Upload>
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-col gap-2'>
        <label className="m-0 text-lg font-semibold">Content</label>
        <SimpleEditor
          className='border rounded-md' style={{ height: 500 }}
          content={formData.content}
          onChange={(content) => setFormData(prev => ({ ...prev, content }))}
        />
      </div>
    </>
  )
}
