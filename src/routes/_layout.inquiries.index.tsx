import { createFileRoute, Link } from '@tanstack/react-router'
import { Typography, Divider, Button, Input, Tag, type TableProps, Table, Select, Card, Empty } from 'antd';
import { CheckCircleFilled, EyeOutlined, FieldTimeOutlined, InboxOutlined, MailOutlined, RightOutlined, FileZipOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import { INQUIRIES_PAGE_QUERY } from '@/graphql/queries';
import { useReadQuery } from '@apollo/client/react';
import { format } from 'date-fns';
const { Title } = Typography;
const { Search } = Input;

// Move this outside or keep it if you want the columns static
const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <span className='text-m font-semibold'>{text}</span>
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text: string) => <span className='text-m'>{format(new Date(text), "MMMM dd, yyyy")}</span>
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    align: 'center',
    render: (status: string) => {
      let config = {
        label: 'Pending',
        color: 'default',
        icon: <FieldTimeOutlined />,
        bgColor: '#D0E5FB',
        textColor: '#1280ED',
      };

      if (status === 'REPLIED') {
        config = {
          label: 'Replied',
          color: 'success',
          icon: <CheckCircleFilled />,
          bgColor: '#E8F8F3',
          textColor: '#10B981',
        };
      } else if (status === 'UNREAD') {
        config = {
          label: 'Unread',
          color: 'error',
          icon: <MailOutlined />,
          bgColor: '#FFF1F0',
          textColor: '#FF4D4F',
        };
      } else if (status === 'READ') {
        config = {
          label: 'Read',
          color: 'processing',
          icon: <EyeOutlined />,
          bgColor: '#E6F7FF',
          textColor: '#1890FF',
        };
      } else if (status === 'ARCHIVED') {
        config = {
          label: 'Archived',
          color: 'default',
          icon: <FileZipOutlined />,
          bgColor: '#F5F5F5',
          textColor: '#8C8C8C',
        };
      }

      return (
        <Tag
          color={config.color as any}
          variant='solid'
          icon={config.icon}
          style={{
            padding: '4px 16px',
            borderRadius: '20px',
            backgroundColor: config.bgColor,
            color: config.textColor,
            border: 'none',
            textTransform: 'capitalize',
            fontWeight: 600,
            fontSize: '12px'
          }}
        >
          {config.label}
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
        <Link to="/inquiries/$inquiryId" params={{ inquiryId: record.id }}>
          <Button type="link" icon={<RightOutlined />} iconPlacement="end">View Details</Button>
        </Link>
      </div>
    )
  }
];

export const Route = createFileRoute('/_layout/inquiries/')({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const queryRef = preloadQuery(INQUIRIES_PAGE_QUERY);
    return { queryRef };
  }
})

function RouteComponent() {
  const { queryRef } = Route.useLoaderData();
  const { data: inquiriesData, error: inquiriesError } = useReadQuery(queryRef);
  // 1. Initialize logic state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 2. Filter logic using useMemo to ensure it updates when inquiriesData changes
  const filteredData = useMemo(() => {
    return inquiriesData?.inquiries.filter((item: any) => {
      const matchesSearch = item.name?.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];
  }, [inquiriesData, searchText, statusFilter]);

  // 3. Handlers
  const handleSearch = (value: string) => setSearchText(value);
  const handleStatusChange = (value: string) => setStatusFilter(value);

  const inquiriesStat = [
    {
      title: 'Total Inquiries',
      value: inquiriesData?.inquiries.length ?? 0,
      icon: <InboxOutlined className='text-[32px] text-blue-600' />,
      bgClass: 'bg-blue-50'
    },
    {
      title: 'Unread',
      value: inquiriesData?.inquiries.filter((item: any) => item.status === 'UNREAD').length ?? 0,
      icon: <MailOutlined className='text-[32px] text-red-600' />,
      bgClass: 'bg-red-50'
    },
    {
      title: 'Read',
      value: inquiriesData?.inquiries.filter((item: any) => item.status === 'READ').length ?? 0,
      icon: <EyeOutlined className='text-[32px] text-cyan-600' />,
      bgClass: 'bg-cyan-50'
    },
    {
      title: 'Archived',
      value: inquiriesData?.inquiries.filter((item: any) => item.status === 'ARCHIVED').length ?? 0,
      icon: <FileZipOutlined className='text-[32px] text-gray-600' />,
      bgClass: 'bg-gray-50'
    }
  ]

  return (
    <>
      {/* Header */}
      <div className='flex justify-between items-end'>
        <div className='flex flex-col gap-1'>
          <Title level={2} className="m-0!">Inquiries</Title>
          <span className='text-gray-500 m-0'>Stay connected—review and respond to messages from website visitors.</span>
        </div>
      </div>

      <Divider />

      {/* Stats */}
      <div className='flex gap-4 mb-6'>
        {inquiriesStat.map((stat, idx) => (
          <StatCard
            key={idx}
            icon={stat.icon}
            label={stat.title}
            value={stat.value}
            bgClass={stat.bgClass}
          />
        ))}
      </div>

      {/* Table */}
      {inquiriesError && <div className="p-4 text-center text-red-500">Error loading inquiries: {inquiriesError.message}</div>}
      {(inquiriesData?.inquiries?.length ?? 0) > 0 ? (
        <Table
          pagination={inquiriesData?.inquiries?.length > 5 ? { pageSize: 5, showTotal: (total) => `${total} inquiries` } : false}
          columns={columns}
          dataSource={filteredData}
          bordered
          style={{ border: '1px solid #1280ED', borderRadius: '12px' }}
          rowKey="id"
          title={() => (
            <div className='flex gap-2 items-center'>
              <Search
                id="search"
                placeholder="Search Name..."
                allowClear
                onSearch={handleSearch}
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
                  { value: 'READ', label: 'Read' },
                  { value: 'UNREAD', label: 'Unread' },
                  { value: 'ARCHIVED', label: 'Archived' }
                ]}
              />
            </div>
          )}
        />) : (
        <Empty
        />
      )}
    </>
  )
}

function StatCard({ icon, label, value, bgClass }: { icon: React.ReactNode, label: string, value: number, bgClass: string }) {
  return (
    <Card className="bg-white p-4 rounded-xl border flex-1 border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start">
        <div>
          <Title level={5} className="text-xs! font-medium! text-gray-500! uppercase! tracking-wider!">{label}</Title>
          <Title level={3} className="text-2xl! font-bold! text-[#1280ED]! mt-1!">{value}</Title>
        </div>
        <div className={`p-2 rounded-xl ${bgClass} group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}