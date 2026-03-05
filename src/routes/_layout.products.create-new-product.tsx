import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { createFileRoute } from '@tanstack/react-router'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Input, Select, Space, Switch, Typography, type InputRef } from 'antd'
import { useRef, useState } from 'react'
const { Title } = Typography

export const Route = createFileRoute('/_layout/products/create-new-product')({
  component: RouteComponent,
})

function RouteComponent() {
  const [items, setItems] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [activeStatus, setActiveStatus] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const indexRef = useRef(0);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, name || `New item ${indexRef.current++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <>
      {/* Header */}
      <div className='flex justify-between items-end mb-6'>
        <div className='flex flex-col gap-1'>
          <Title level={2} className="m-0!">Create New Product</Title>
          <span className='text-gray-500 m-0'>Create and publish new products to the website.</span>
        </div>
        <div className='flex gap-2'>
          <Button
            type="primary"
            icon={<PlusOutlined />}
          >
            Add Product
          </Button>
        </div>
      </div>
      <Divider />

      {/* Form */}
      <div className='flex gap-6 mb-3'>
        <div className='w-2/3 flex flex-col gap-2'>
          <Title level={4} className="m-0!">Product Name</Title>
          <Input id='product-name' placeholder="Enter product name..." />
          <Title level={4} className="m-0!">Slug</Title>
          <Input id='product-slug' placeholder="/product-slug" />
        </div>
        <div className='w-1/3 flex flex-col gap-2'>
          <Title level={4} className="m-0!">Category</Title>
          <Select
            style={{ width: 350 }}
            placeholder="None"
            popupRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    id='product-category'
                    placeholder="Add New Category"
                    ref={inputRef}
                    value={name}
                    onChange={onNameChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add Category
                  </Button>
                </Space>
              </>
            )}
            options={items.map((item) => ({ label: item, value: item }))}
          />
          <Title level={4} className="m-0!">Active Status</Title>
          <div className='flex justify-between items-center gap-2 border border-gray-300 rounded-md p-2'>
            <span className='text-gray-500 m-0'>{activeStatus ? 'Visible to the public' : 'Hidden from the public'}</span>
            <Switch
              onChange={(checked) => setActiveStatus(checked)}
            />
          </div>
        </div>
      </div>

      {/* Description WYSIWYG*/}
      <div className='flex flex-col gap-2'>
        <Title level={4} className="m-0!">Description</Title>
        <SimpleEditor className='border rounded-md' style={{ height: 500 }} />
      </div>

    </>
  )
}
