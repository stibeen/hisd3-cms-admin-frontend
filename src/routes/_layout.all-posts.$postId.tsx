import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GET_ARTICLE_BY_ID } from '@/graphql/queries';
import { CREATE_CATEGORY_MUTATION, UPDATE_ARTICLE_BY_ID_MUTATION } from '@/graphql/mutations';
import { useMutation, useReadQuery } from '@apollo/client/react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { Button, Divider, Input, message, Select, Space, Typography } from 'antd';
import { ContainerOutlined, SendOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import type { InputRef } from 'antd';
import { ArticleStatus } from '@/graphql/generated/graphql';

const { TextArea } = Input;
const { Title } = Typography;

export const Route = createFileRoute('/_layout/all-posts/$postId')({
    component: RouteComponent,
    loader: ({ context: { preloadQuery }, params }) => {
        const queryRef = preloadQuery(GET_ARTICLE_BY_ID, {
            variables: { id: params.postId }
        })
        return { queryRef }
    }
})

function RouteComponent() {
    const navigate = useNavigate();
    const params = Route.useParams();
    const { queryRef } = Route.useLoaderData();
    const { data: articleData, error: articleError } = useReadQuery(queryRef);
    // console.log(articleData.adminArticle?.content)
    const [formData, setFormData] = useState({
        title: articleData?.adminArticle?.title || '',
        excerpt: articleData?.adminArticle?.excerpt || '',
        content: articleData?.adminArticle?.content || '',
        categoryId: articleData?.adminArticle?.category?.id || null,
        status: articleData?.adminArticle?.status as ArticleStatus || '',
        slug: articleData?.adminArticle?.slug || '',
    });

    // Sync formData with articleData when it's loaded
    // useEffect(() => {
    //     if (articleData?.adminArticle) {
    //         setFormData({
    //             title: articleData.adminArticle.title || '',
    //             excerpt: articleData.adminArticle.excerpt || '',
    //             content: articleData.adminArticle.content || '',
    //             category: articleData.adminArticle.category?.id || '',
    //             status: articleData.adminArticle.status || '',
    //             slug: articleData.adminArticle.slug || '',
    //         });
    //     }
    // }, [articleData]);

    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);
    const [createCategory, { loading: createCategoryLoading }] = useMutation(CREATE_CATEGORY_MUTATION);
    const [updateArticle, { loading: updateArticleLoading }] = useMutation(UPDATE_ARTICLE_BY_ID_MUTATION);
    const [messageApi, messageContextHolder] = message.useMessage();

    const handleAddCategory = async () => {
        try {
            await createCategory({
                variables: {
                    createCategoryInput: {
                        name: name,
                        slug: name.toLowerCase()
                    }
                },
                refetchQueries: [GET_ARTICLE_BY_ID]
            });
            setName('');
            await messageApi.success('Category added successfully');
        } catch (error) {
            console.error('Error adding category:', error);
            messageApi.error('Failed to add category');
        }
    };

    const handleUpdateArticle = async (status: ArticleStatus) => {
        try {
            await updateArticle({
                variables: {
                    updateArticleId: params.postId,
                    payload: {
                        ...formData,
                        categoryId: formData.categoryId || null,
                        status: status,
                    }
                },
                refetchQueries: [GET_ARTICLE_BY_ID]
            })
            messageApi.success('Article updated successfully');
            navigate({ to: '/all-posts' });
        } catch (error) {
            console.error(error);
            messageApi.error('Failed to update article');
        }
    }

    if (articleError) return <div className="p-10 text-center text-red-500">Error: {articleError.message}</div>;

    return (
        <>
            {messageContextHolder}
            {/* Header */}
            <div className='flex justify-between items-end mb-6'>
                <div className='flex flex-col gap-1'>
                    <Title level={2} className="m-0!">Edit Post</Title>
                    <span className='text-gray-500 m-0'>Edit and publish post to the website.</span>
                </div>
                <div className='flex gap-2'>
                    <Button
                        type="default"
                        icon={<ContainerOutlined />}
                        onClick={() => handleUpdateArticle('DRAFT' as ArticleStatus)}
                    >
                        Save as Draft
                    </Button>
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        disabled={updateArticleLoading}
                        loading={updateArticleLoading}
                        onClick={() => handleUpdateArticle('PUBLISHED' as ArticleStatus)}
                    >
                        Publish Post
                    </Button>
                </div>
            </div>

            <Divider />

            {/* Form */}
            <div className='flex gap-6 mb-3'>
                <div className='w-2/3 flex flex-col gap-2'>
                    <label className="m-0 text-lg font-semibold" htmlFor="post-title">Post Title</label>
                    <Input id='post-title' placeholder="Enter post title..." value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} />
                    <label className="m-0 text-lg font-semibold" htmlFor="post-excerpt">Excerpt</label>
                    <TextArea id='post-excerpt' rows={4} placeholder="Enter post excerpt..." value={formData.excerpt} onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))} />
                </div>
                <div className='w-1/3 flex flex-col gap-2'>
                    <label className="m-0 text-lg font-semibold" htmlFor="post-category">Category</label>
                    <Select
                        id='post-category'
                        style={{ width: 350 }}
                        placeholder="None"
                        options={[
                            ...(articleData?.categories?.map((c: any) => ({ value: c.id, label: c.name })) || [])
                        ]}
                        value={formData.categoryId || undefined}
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
                                    <Button type="text" icon={<PlusOutlined />} onClick={handleAddCategory} disabled={createCategoryLoading || !name.trim()}>
                                        Add Category
                                    </Button>
                                </Space>
                            </>
                        )}
                    />
                    <label className="m-0 text-lg font-semibold" htmlFor="post-slug">Slug</label>
                    <Input id='post-slug' placeholder="/post-slug" value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} />
                </div>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-2'>
                <label className="m-0 text-lg font-semibold">Content</label>
                <SimpleEditor
                    className='border rounded-md'
                    style={{ height: 500 }}
                    content={formData.content}
                    onChange={(newContent) => setFormData(prev => ({ ...prev, content: newContent }))}
                />
                {/* <SimpleEditor
                    value={formData.content}
                    onChange={(newContent) => setFormData(prev => ({ ...prev, content: newContent }))}
                /> */}
            </div>
        </>
    )
}
