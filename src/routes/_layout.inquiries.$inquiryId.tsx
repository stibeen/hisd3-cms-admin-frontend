import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useReadQuery, useMutation } from '@apollo/client/react';
import { Typography, Divider, Button, Card, Tag, Descriptions, Space, message, Modal } from 'antd';
import { MailOutlined, PhoneOutlined, CalendarOutlined, CheckCircleFilled, EyeOutlined, FieldTimeOutlined, FileZipOutlined } from '@ant-design/icons';
import { GET_INQUIRY_BY_ID } from '@/graphql/queries';
import { UPDATE_INQUIRY_STATUS_MUTATION, REMOVE_INQUIRY_MUTATION } from '@/graphql/mutations';
import { format } from 'date-fns';
import { InquiryStatus } from '@/graphql/generated/graphql';

const { Title, Text, Paragraph } = Typography;

export const Route = createFileRoute('/_layout/inquiries/$inquiryId')({
    component: RouteComponent,
    loader: ({ context: { preloadQuery }, params }) => {
        const getInquiryByIdQueryRef = preloadQuery(GET_INQUIRY_BY_ID, {
            variables: { inquiryId: params.inquiryId }
        })
        return { getInquiryByIdQueryRef }
    }
})

function RouteComponent() {
    const { getInquiryByIdQueryRef } = Route.useLoaderData()
    const { data: inquiryData, error: inquiryError } = useReadQuery(getInquiryByIdQueryRef)
    const [updateInquiryStatus, { loading: updateInquiryStatusLoading }] = useMutation(UPDATE_INQUIRY_STATUS_MUTATION);
    const [removeInquiry, { loading: removeInquiryLoading }] = useMutation(REMOVE_INQUIRY_MUTATION);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [modal, contextHolder] = Modal.useModal();
    const navigate = useNavigate();

    if (inquiryError) return <div className="p-10 text-center text-red-500">Error: {inquiryError.message}</div>;

    const inquiry = inquiryData?.inquiry;

    const handleArchiveButton = async (id: string) => {
        try {
            await updateInquiryStatus({
                variables: {
                    updateInquiryId: id,
                    updateInquiryInput: {
                        status: 'ARCHIVED' as InquiryStatus
                    }
                }
            })
            messageApi.success('Inquiry archived successfully');
            navigate({ to: '/inquiries' });
        } catch (error) {
            messageApi.error('Failed to archive inquiry');
        }
    }

    const showConfirmRemove = () => {
        modal.confirm({
            title: 'Confirm',
            content: 'Are you sure you want to remove this inquiry?',
            onOk() {
                handleRemoveButton(inquiry?.id || '');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleRemoveButton = async (id: string) => {
        try {
            await removeInquiry({
                variables: {
                    removeInquiryId: id
                }
            })
            messageApi.success('Inquiry removed successfully');
            navigate({ to: '/inquiries' });
        } catch (error) {
            messageApi.error('Failed to remove inquiry');
        }
    }

    const handleMarkAsReadButton = async (id: string) => {
        try {
            await updateInquiryStatus({
                variables: {
                    updateInquiryId: id,
                    updateInquiryInput: {
                        status: 'READ' as InquiryStatus
                    }
                }
            })
            messageApi.success('Inquiry marked as read successfully');
            navigate({ to: '/inquiries' });
        } catch (error) {
            messageApi.error('Failed to mark inquiry as read');
        }
    }

    const getStatusConfig = (status: string) => {
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
        return config;
    };

    const statusConfig = getStatusConfig(inquiry?.status || 'PENDING');

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {messageContextHolder}
            {contextHolder}
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <Title level={2} className="m-0!">Inquiry from {inquiry?.name}</Title>
                        <Tag
                            color={statusConfig.color as any}
                            variant='solid'
                            icon={statusConfig.icon}
                            style={{
                                padding: '4px 16px',
                                borderRadius: '20px',
                                backgroundColor: statusConfig.bgColor,
                                color: statusConfig.textColor,
                                border: 'none',
                                textTransform: 'capitalize',
                                fontWeight: 600,
                                fontSize: '13px'
                            }}
                        >
                            {statusConfig.label}
                        </Tag>
                    </div>
                </div>
                <Space>
                    {/* <Button icon={<MailOutlined />} type="primary" size="large">
                        Reply via Email
                    </Button> */}
                    {inquiry?.status !== 'ARCHIVED' && (
                        <Button icon={<FileZipOutlined />} size="large" disabled={updateInquiryStatusLoading} onClick={() => handleArchiveButton(inquiry?.id || '')}>
                            Archive
                        </Button>
                    )}
                </Space>
            </div>

            <Divider />

            <div className="flex gap-8 mt-8">
                {/* Left Column: Message Content */}
                <div className="flex-1">
                    <Card
                        title={<span className="text-lg font-bold">Message Content</span>}
                        className="shadow-sm rounded-xl border-gray-100"
                        styles={{ body: { padding: '24px' } }}
                    >
                        <div className="bg-gray-50 p-6 rounded-lg min-h-[300px]">
                            <Paragraph className="text-lg whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {inquiry?.message}
                            </Paragraph>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Contact & Metadata */}
                <div className="w-1/3 flex flex-col gap-6">
                    <Card
                        title={<span className="text-lg font-bold">Contact Details</span>}
                        className="shadow-sm rounded-xl border-gray-100"
                    >
                        <Descriptions column={1} layout="vertical">
                            <Descriptions.Item label={<Space><MailOutlined className="text-[#1280ED]" /> <Text strong>Email Address</Text></Space>}>
                                <Text copyable className="text-blue-600">{inquiry?.email}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><PhoneOutlined className="text-[#1280ED]" /> <Text strong>Phone Number</Text></Space>}>
                                <Text>{inquiry?.phone || 'Not provided'}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><CalendarOutlined className="text-[#1280ED]" /> <Text strong>Date Received</Text></Space>}>
                                <Text>{inquiry?.createdAt ? format(new Date(inquiry.createdAt), "MMMM dd, yyyy 'at' hh:mm a") : 'N/A'}</Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card
                        className="bg-blue-50 border-blue-100 rounded-xl"
                    >
                        <Title level={5} className="mt-0! mb-2!">Quick Actions</Title>
                        <Text className="text-gray-500 block mb-4">Manage this inquiry directly.</Text>
                        <div className="flex flex-col gap-2">
                            {inquiry?.status !== 'READ' && (
                                <Button block ghost type="primary" disabled={updateInquiryStatusLoading} onClick={() => handleMarkAsReadButton(inquiry?.id || '')}>
                                    Mark as Read
                                </Button>
                            )}
                            <Button block danger ghost disabled={removeInquiryLoading} onClick={showConfirmRemove}>Delete Permanently</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
