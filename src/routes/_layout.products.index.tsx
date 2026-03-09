import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, Divider, Typography, Input, Table, Tag, Tooltip, Select, Modal, message } from 'antd'
import type { TableProps } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { PRODUCTS_PAGE_QUERY } from '@/graphql/queries'
import { REMOVE_PRODUCT_MUTATION } from '@/graphql/mutations'
import { useMutation, useReadQuery } from '@apollo/client/react'

const { Search } = Input;
const { Title } = Typography;

// Move this outside or keep it if you want the columns static

export const Route = createFileRoute('/_layout/products/')({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const queryRef = preloadQuery(PRODUCTS_PAGE_QUERY)
    return { queryRef }
  }
})

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { queryRef } = Route.useLoaderData()
  const { data: productsData } = useReadQuery(queryRef)
  const [removeProduct, { loading: loadingRemoveProduct }] = useMutation(REMOVE_PRODUCT_MUTATION);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const filteredData = useMemo(() => {
    return productsData?.adminProducts.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.category?.name === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];
  }, [productsData, searchText, statusFilter]);

  const handleSearch = (value: string) => setSearchText(value);
  const handleStatusChange = (value: string) => setStatusFilter(value);

  const showConfirmDelete = (id: string) => {
    modal.confirm({
      title: 'Confirm Changes',
      content: 'Are you sure you want to delete this product? This action can\'t be undone',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        await handleDeleteProduct(id);
      },
    });
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await removeProduct({
        variables: {
          removeProductId: id
        },
        refetchQueries: [PRODUCTS_PAGE_QUERY]
      })
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to delete product');
    }
  }

  const columns: TableProps['columns'] = useMemo(() => [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className='text-m font-semibold'>{text}</span>
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '40%',
      render: (category: any) => (
        <Tag color="geekblue" className="capitalize">
          {category?.name || 'Uncategorized'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      align: 'center',
      filters: [
        {
          text: 'Active',
          value: 'true',
        },
        {
          text: 'Inactive',
          value: 'false',
        },
      ],
      onFilter: (value, record) => record.isActive.toString() === value,
      filterSearch: true,
      render: (text: boolean) => {
        const isActive = text === true;
        return (
          <Tag
            color={isActive ? 'success' : 'default'}
            variant='solid'
            icon={isActive ? <EyeFilled /> : <EyeInvisibleFilled />}
            style={{
              padding: '4px 16px',
              borderRadius: '20px',
              backgroundColor: isActive ? '#E8F8F3' : '#F1F5F9', // Subtle background
              color: isActive ? '#10B981' : '#64748B', // Tailwind emerald-500 or slate-500
              border: 'none',
              textTransform: 'capitalize',
              fontWeight: 600,
              fontSize: '12px'
            }}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
        )
      }
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title="Edit">
            <Link to="/products/$productId" params={{ productId: record.id }}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete Post" onClick={() => showConfirmDelete(record.id)} disabled={loadingRemoveProduct} loading={loadingRemoveProduct} />
          </Tooltip>
        </div>
      )
    }
  ], [navigate]);

  return (
    <>
      {modalContextHolder}
      {contextHolder}
      {/* Header */}
      <div className='flex justify-between items-end mb-6'>
        <div className='flex flex-col gap-1'>
          <Title level={2} className="m-0!">Products</Title>
          <span className='text-gray-500 m-0'>Manage and organize your products across all categories.</span>
        </div>
        <div className='flex items-center'>
          <Link to="/products/create-new-product">
            <Button
              type="primary"
              icon={<PlusOutlined />}
            >
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      <Divider />

      {/* Table */}
      <Table
        pagination={productsData?.adminProducts?.length > 5 ? {
          pageSize: 5,
          showTotal: (total) => `${total} products`,
        } : false}
        columns={columns}
        dataSource={filteredData}
        bordered
        style={{ border: '1px solid #1280ED', borderRadius: '12px' }}
        rowKey="id"
        title={() => (
          <div className='flex gap-2 items-center'>
            <Search
              id="search"
              placeholder="Search products..."
              allowClear
              onSearch={handleSearch}
              // Also filter on change if you want "live" search
              onChange={(e) => handleSearch(e.target.value)}
              enterButton
              style={{ width: 300 }}
            />
            <Select
              id="status"
              defaultValue="all"
              style={{ width: 200 }}
              onChange={handleStatusChange}
              placeholder="Filter Status"
              options={[
                { value: 'all', label: 'All' },
                ...productsData?.categories.map((category) => ({
                  value: category.name,
                  label: category.name,
                }))
              ]}
            />
          </div>
        )}
      />
    </>
  )
}
