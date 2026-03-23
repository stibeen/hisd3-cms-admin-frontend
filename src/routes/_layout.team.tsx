import { createFileRoute } from "@tanstack/react-router";
import {
  Divider,
  Typography,
  Table,
  Button,
  Tooltip,
  Input,
  Upload,
  Avatar,
  message,
  Form,
  Popconfirm,
  Empty,
  Card,
} from "antd";
import type { TableProps } from "antd";
import {
  LinkedinFilled,
  GithubFilled,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  UserAddOutlined,
  XOutlined,
  CameraTwoTone,
  FacebookFilled,
  CloseOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useReadQuery, useMutation } from "@apollo/client/react";
import { TEAM_PAGE_QUERY } from "@/graphql/queries";
import {
  CREATE_TEAM_MEMBER_MUTATION,
  REMOVE_TEAM_MEMBER_MUTATION,
  UPDATE_TEAM_MEMBER_MUTATION,
} from "@/graphql/mutations";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import uploadImage from "@/utils/uploadImage";

const { Title } = Typography;

export const Route = createFileRoute("/_layout/team")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const queryRef = preloadQuery(TEAM_PAGE_QUERY);
    return { queryRef };
  },
});

function RouteComponent() {
  const { queryRef } = Route.useLoaderData();
  const { data: teamData } = useReadQuery(queryRef);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modalPreviewUrl, setModalPreviewUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createTeamMember, { loading: createTeamMemberLoading }] = useMutation(
    CREATE_TEAM_MEMBER_MUTATION,
    {
      refetchQueries: [TEAM_PAGE_QUERY],
      onCompleted: () => {
        messageApi.success("Team member added successfully");
        form.resetFields();
        setPreviewUrl(null);
      },
      onError: (error) => {
        messageApi.error(error.message || "Failed to add team member");
      },
    },
  );

  const [updateTeamMember, { loading: updateTeamMemberLoading }] = useMutation(
    UPDATE_TEAM_MEMBER_MUTATION,
    {
      refetchQueries: [TEAM_PAGE_QUERY],
      onCompleted: () => {
        messageApi.success("Team member updated successfully");
        handleCancelEdit();
      },
      onError: (error) => {
        messageApi.error(error.message || "Failed to update team member");
      },
    },
  );

  const [removeTeamMember, { loading: removeTeamMemberLoading }] = useMutation(
    REMOVE_TEAM_MEMBER_MUTATION,
    {
      refetchQueries: [TEAM_PAGE_QUERY],
      onCompleted: () => {
        messageApi.success("Team member removed successfully");
        handleCancelEdit();
      },
      onError: (error) => {
        messageApi.error(error.message || "Failed to remove team member");
      },
    },
  );

  const handleSubmit = async (values: any) => {
    if (isEditing) {
      await handleUpdateTeamMember(values);
    } else {
      await handleAddTeamMember(values);
    }
  };

  const handleAddTeamMember = async (values: any) => {
    const payload = {
      name: values.name,
      position: values.position,
      socials: values.socials,
    };

    try {
      let imageURL = "";
      if (selectedFile) {
        messageApi.loading("Uploading profile image...", 0);
        const uploadResult = await uploadImage(selectedFile);
        imageURL = `${uploadResult.url}`;
        messageApi.destroy();
      }

      await createTeamMember({
        variables: {
          createTeamMemberInput: {
            ...payload,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      messageApi.destroy();
      console.error(error);
      messageApi.error("Failed to add team member");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeTeamMember({
        variables: {
          removeTeamMemberId: id,
        },
      });
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  const handleEdit = (id: string) => {
    const member = teamData?.teamMembers?.find((m) => m.id === id);
    if (!member) return;

    setIsEditing(true);
    setEditingMemberId(id);

    form.setFieldsValue({
      name: member.name,
      position: member.position,
      socials: {
        facebook: member.socials?.facebook,
        github: member.socials?.github,
        linkedin: member.socials?.linkedin,
        x: member.socials?.x,
      },
    });
    setPreviewUrl(member.image || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingMemberId(null);
    setSelectedFile(null);
    form.resetFields();
    setPreviewUrl(null);
  };

  const handleUpdateTeamMember = async (values: any) => {
    if (!editingMemberId) return;

    const payload = {
      name: values.name,
      position: values.position,
      socials: values.socials,
    };

    try {
      let imageURL = previewUrl; // Default to current image (either existing URL or old URL)

      if (selectedFile) {
        messageApi.loading("Uploading new profile image...", 0);
        const uploadResult = await uploadImage(selectedFile);
        imageURL = `${uploadResult.url}`;
        messageApi.destroy();
      }

      await updateTeamMember({
        variables: {
          updateTeamMemberId: editingMemberId,
          updateTeamMemberInput: {
            ...payload,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      messageApi.destroy();
      console.error(error);
      messageApi.error("Failed to update team member");
    }
  };

  const modalPreviewAvatar = (id: string) => {
    const member = teamData?.teamMembers?.find((m) => m.id === id);
    if (!member) return;
    const url = member.image || "";
    setIsModalOpen(true);
    setModalPreviewUrl(url);
  };

  const columns: TableProps["columns"] = [
    {
      title: "Profile Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      align: "center",
      render: (_, record: any) => {
        return (
          <div className="flex justify-center gap-2">
            {record.image ? (
              <Tooltip title={`View Profile Image of ${record.name}`}>
                <Avatar
                  src={record.image}
                  onClick={() => modalPreviewAvatar(record.id)}
                  className="cursor-pointer"
                />
              </Tooltip>
            ) : (
              <Avatar
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.name}`}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Member Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => {
        return <span className="text-m font-semibold">{text}</span>;
      },
    },
    {
      title: "Designation",
      dataIndex: "position",
      key: "position",
      width: 150,
      align: "center",
      render: (text: string) => (
        <span className="text-m font-normal">{text}</span>
      ),
    },
    {
      title: "Social Links",
      dataIndex: "socials",
      key: "socials",
      width: 150,
      align: "center",
      render: (socials: {
        facebook?: string;
        github?: string;
        linkedin?: string;
        x?: string;
      }) => (
        <div className="flex gap-2 justify-center">
          {socials?.facebook && (
            <a
              href={socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookFilled className="text-xl text-blue-600" />
            </a>
          )}
          {socials?.github && (
            <a href={socials.github} target="_blank" rel="noopener noreferrer">
              <GithubFilled className="text-xl" />
            </a>
          )}
          {socials?.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinFilled className="text-xl text-blue-600" />
            </a>
          )}
          {socials?.x && (
            <a href={socials.x} target="_blank" rel="noopener noreferrer">
              <XOutlined className="text-xl text-blue-600" />
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record: any) => (
        <div className="flex gap-2 justify-center">
          {isEditing && editingMemberId === record.id ? (
            <Tooltip title="Cancel">
              <Button
                type="text"
                icon={<CloseOutlined />}
                aria-label="Cancel Edit"
                onClick={() => handleCancelEdit()}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                aria-label="Edit Post"
                onClick={() => handleEdit(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete member"
              description="Are you sure you want to delete this team member?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label="Delete Post"
                loading={removeTeamMemberLoading}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <ImagePreviewModal
        title="Profile Image Preview"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        previewUrl={modalPreviewUrl}
      />
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col gap-1">
          <Title level={2} className="m-0!">
            Team Management
          </Title>
          <span className="text-gray-500 m-0">
            Build and manage the professional profiles of your team members.
          </span>
        </div>
      </div>

      <Divider />

      <div className="flex justify-center gap-6">
        {/* Table */}
        <div className="w-2/3">
          <Card className="shadow-sm border-gray-200">
            {(teamData?.teamMembers?.length ?? 0) > 0 ? (
              <Table
                pagination={
                  teamData?.teamMembers?.length > 10
                    ? {
                        pageSize: 10,
                        showTotal: (total) => `${total} team members`,
                      }
                    : false
                }
                columns={columns}
                dataSource={teamData?.teamMembers || []}
                bordered
                // style={{ border: "1px solid #1280ED", borderRadius: "12px" }}
                rowKey="id"
              />
            ) : (
              <Empty description="No team members found" />
            )}
          </Card>
        </div>

        {/* Form */}
        <div className="w-full max-w-md border border-[#E5E7EB] rounded-xl p-6 bg-white shadow-sm">
          {/* Header */}
          <div className="flex justify-center gap-2 mb-3">
            <UserAddOutlined className="text-[#1280ED] text-lg" />
            <Title level={5} className="m-0!">
              {isEditing ? "Edit Team Member" : "Add New Team Member"}
            </Title>
          </div>

          <Divider className="mt-2! mb-4!" />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="flex flex-col gap-5"
          >
            {/* Profile Picture */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Profile Picture
              </p>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 border-dashed hover:border-[#1280ED] transition">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CameraTwoTone className="text-3xl" />
                  )}
                </div>

                <div className="flex flex-col gap-2">
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
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      loading={createTeamMemberLoading}
                      className="bg-[#1280ED]"
                    >
                      {previewUrl ? "Change Photo" : "Upload Photo"}
                    </Button>
                  </Upload>

                  {previewUrl && (
                    <Button
                      type="default"
                      danger
                      onClick={() => setPreviewUrl(null)}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Member Name */}
            <Form.Item
              name="name"
              label={
                <span className="font-medium text-gray-700">Member Name</span>
              }
              rules={[{ required: true, message: "Please enter member name" }]}
              className="mb-0!"
            >
              <Input placeholder="Enter member name..." size="large" />
            </Form.Item>

            {/* Designation */}
            <Form.Item
              name="position"
              label={
                <span className="font-medium text-gray-700">Designation</span>
              }
              rules={[{ required: true, message: "Please enter designation" }]}
              className="mb-0"
            >
              <Input placeholder="Enter designation..." size="large" />
            </Form.Item>

            {/* Social Links */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">
                Social Links
              </label>

              <Form.Item name={["socials", "linkedin"]} className="mb-0!">
                <Input
                  placeholder="LinkedIn Profile URL"
                  prefix={<LinkedinFilled />}
                  size="large"
                />
              </Form.Item>

              <Form.Item name={["socials", "github"]} className="mb-0!">
                <Input
                  placeholder="GitHub Profile URL"
                  prefix={<GithubFilled />}
                  size="large"
                />
              </Form.Item>

              <Form.Item name={["socials", "facebook"]} className="mb-0!">
                <Input
                  placeholder="Facebook Profile URL"
                  prefix={<FacebookFilled />}
                  size="large"
                />
              </Form.Item>

              <Form.Item name={["socials", "x"]} className="mb-0!">
                <Input
                  placeholder="X Profile URL"
                  prefix={<XOutlined />}
                  size="large"
                />
              </Form.Item>
            </div>

            {/* Submit */}
            <Button
              type="primary"
              size="large"
              className="bg-[#1280ED] mt-2"
              block
              htmlType="submit"
              disabled={createTeamMemberLoading || updateTeamMemberLoading}
              loading={createTeamMemberLoading || updateTeamMemberLoading}
            >
              {isEditing ? "Update Team Member" : "Add Team Member"}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
