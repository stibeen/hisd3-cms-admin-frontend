import { createFileRoute } from '@tanstack/react-router'
import { Divider, Typography, Table, Button, Tooltip, Input, Upload, Avatar, message } from 'antd'
import type { TableProps } from 'antd';
import { LinkedinFilled, GithubFilled, DeleteOutlined, EditOutlined, UploadOutlined, UserAddOutlined, XOutlined, CameraTwoTone, FacebookFilled } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useState } from 'react';
import { useReadQuery } from '@apollo/client/react';
import { TEAM_PAGE_QUERY } from '@/graphql/queries'

// Helper function to convert file to base64 for preview
const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const { Title } = Typography;

// Move this outside or keep it if you want the columns static
const columns: TableProps['columns'] = [
  {
    title: 'Member Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: any) => {
      return (
        <div className='flex items-center gap-2'>
          {record.image ? (
            <Avatar src={record.image} />
          ) : (
            <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${text}`} />
          )}
          <span className='text-m font-semibold'>{text}</span>
        </div>
      )
    }
  },
  {
    title: 'Designation',
    dataIndex: 'position',
    key: 'position',
    width: 150,
    align: 'center',
    render: (text: string) => <span className='text-m font-normal'>{text}</span>
  },
  {
    title: 'Social Links',
    dataIndex: 'socials',
    key: 'socials',
    width: 150,
    align: 'center',
    render: (socials: { facebook?: string; github?: string; linkedin?: string; x?: string }) => (
      <div className='flex gap-2 justify-center'>
        {socials?.facebook && (
          <a href={socials.facebook} target="_blank" rel="noopener noreferrer">
            <FacebookFilled className="text-xl text-blue-600" />
          </a>
        )}
        {socials?.github && (
          <a href={socials.github} target="_blank" rel="noopener noreferrer">
            <GithubFilled className="text-xl" />
          </a>
        )}
        {socials?.linkedin && (
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedinFilled className="text-xl text-blue-600" />
          </a>
        )}
        {socials?.x && (
          <a href={socials.x} target="_blank" rel="noopener noreferrer">
            <XOutlined className="text-xl text-blue-600" />
          </a>
        )}
      </div>
    )
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    width: 120,
    align: 'center',
    render: () => (
      <div className='flex gap-2 justify-center'>
        <Tooltip title="Edit">
          <Button type="text" icon={<EditOutlined />} aria-label="Edit Post" />
        </Tooltip>
        <Tooltip title="Delete">
          <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete Post" />
        </Tooltip>
      </div>
    )
  }
];

export const Route = createFileRoute('/_layout/team')({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const queryRef = preloadQuery(TEAM_PAGE_QUERY)
    return { queryRef }
  }
})

function RouteComponent() {
  const { queryRef } = Route.useLoaderData()
  const { data: teamData } = useReadQuery(queryRef)
  const [data] = useState(teamData?.teamMembers || []);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    // Added customRequest to simulate upload success
    customRequest({ onSuccess }) {
      setTimeout(() => {
        if (onSuccess) {
          onSuccess("ok");
        }
      }, 1000);
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj as File).then((url) => {
          setLoading(false);
          setImageUrl(url);
        });
        messageApi.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        setLoading(false);
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      {contextHolder}
      {/* Header */}
      <div className='flex justify-between items-end mb-6'>
        <div className='flex flex-col gap-1'>
          <Title level={2} className="m-0!">Team Management</Title>
          <span className='text-gray-500 m-0'>Manage and organize your team members.</span>
        </div>
      </div>
      <Divider />
      <div className='flex justify-center gap-6'>
        {/* Table */}
        <div className='w-2/3'>
          <Table
            pagination={teamData?.teamMembers?.length > 5 ? {
              pageSize: 5,
              showTotal: (total) => `${total} team members`,
            } : false}
            columns={columns}
            dataSource={data}
            bordered
            style={{ border: '1px solid #1280ED', borderRadius: '12px' }}
            rowKey="id"
          />
        </div>
        {/* Form */}
        <div className='w-1/3 border border-[#1280ED] rounded-lg p-4'>
          <Title level={3} className="m-0! flex justify-center"><UserAddOutlined />Add New Team Member</Title>
          <Divider />
          <div className='flex flex-col gap-2'>
            <Title level={4} className="m-0!">Profile Picture</Title>
            <div className='flex gap-5 items-center'>
              <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300'>
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <CameraTwoTone className='text-4xl' />
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <Upload {...props} showUploadList={false}>
                  <Button
                    type='primary'
                    className='bg-[#1280ED] text-white'
                    icon={<UploadOutlined />}
                    loading={loading}
                  >
                    {imageUrl ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                </Upload>
                {imageUrl && <Button type='default' onClick={() => {
                  setImageUrl('')
                }}>
                  Remove Photo
                </Button>}
              </div>
            </div>

            <Title level={4} className="m-0!">Member Name</Title>
            <Input id='memberName' placeholder="Enter member name..." />
            <Title level={4} className="m-0!">Designation</Title>
            <Input id='designation' placeholder="Enter designation..." />
            <Title level={4} className="m-0!">Social Links</Title>
            <Input id='linkedin' placeholder="Linkedin Profile URL" prefix={<LinkedinFilled />} />
            <Input id='github' placeholder="Github Profile URL" prefix={<GithubFilled />} />
            <Input id='x' placeholder="X Profile URL" prefix={<XOutlined />} />
            <Button type="primary">Add Team Member</Button>
          </div>
        </div>
      </div>
    </>
  )
}
