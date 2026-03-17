import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GET_TESTIMONY_BY_ID, TESTIMONIES_PAGE_QUERY } from "@/graphql/queries";
import { useMutation, useReadQuery } from "@apollo/client/react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Switch,
  Typography,
  Upload,
} from "antd";
import { CameraTwoTone, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { UPDATE_TESTIMONY_BY_ID_MUTATION } from "@/graphql/mutations";
import { useEffect, useState } from "react";
const { Title } = Typography;
const { TextArea } = Input;

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

export const Route = createFileRoute("/_layout/testimonies/$testimonyId")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery }, params }) => {
    const queryRef = preloadQuery(GET_TESTIMONY_BY_ID, {
      variables: {
        adminTestimonyId: params.testimonyId,
      },
    });
    const testimoniesQueryRef = preloadQuery(TESTIMONIES_PAGE_QUERY);
    return { queryRef, testimoniesQueryRef };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const params = Route.useParams();
  const { queryRef, testimoniesQueryRef } = Route.useLoaderData();
  const { data: testimoniesData } = useReadQuery(queryRef);
  useReadQuery(testimoniesQueryRef);
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const [form] = Form.useForm();
  // const isActive = Form.useWatch("isActive", form);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [updateTestimony, { loading: updateTestimonyLoading }] = useMutation(
    UPDATE_TESTIMONY_BY_ID_MUTATION,
    {
      refetchQueries: [TESTIMONIES_PAGE_QUERY],
      onCompleted: () => {
        messageApi.success("Testimony updated successfully");
        navigate({ to: "/testimonies" });
      },
      onError: (error) => {
        console.error(error);
        messageApi.error(
          "Failed to update testimony. Check console for more details.",
        );
      },
    },
  );

  const showConfirmChanges = () => {
    modal.confirm({
      title: "Confirm Changes",
      content: "Are you sure you want to save changes?",
      okText: "Yes",
      cancelText: "No",
      onOk: handleUpdateTestimony,
    });
  };

  const handleUpdateTestimony = async () => {
    let imageURL = previewUrl;
    if (selectedFile) {
      messageApi.loading("Uploading new profile image...", 0);
      const uploadResult = await uploadImage(selectedFile);
      imageURL = `${import.meta.env.VITE_API_URL}${uploadResult.url}`;
      messageApi.destroy();
    }

    await updateTestimony({
      variables: {
        updateTestimonyId: params.testimonyId,
        payload: {
          ...form.getFieldsValue(),
          avatarUrl: imageURL,
        },
      },
    });
  };

  useEffect(() => {
    if (testimoniesData?.adminTestimony) {
      form.setFieldsValue({
        name: testimoniesData.adminTestimony.name,
        company: testimoniesData.adminTestimony.company,
        position: testimoniesData.adminTestimony.position,
        isActive: testimoniesData.adminTestimony.isActive,
        avatarUrl: testimoniesData.adminTestimony.avatarUrl,
        content: testimoniesData.adminTestimony.content,
      });
      setPreviewUrl(testimoniesData?.adminTestimony?.avatarUrl || null);
    }
  }, [testimoniesData]);

  return (
    <>
      {contextHolder}
      {modalContextHolder}

      <Form
        form={form}
        layout="vertical"
        onFinish={showConfirmChanges}
        className="flex flex-col gap-6"
        classNames="m-0!"
      >
        {/* Header */}
        <div className="flex justify-between items-end mb-3">
          <div className="flex flex-col gap-1">
            <Title level={2} className="m-0!">
              Edit Testimony
            </Title>
            <span className="text-gray-500 m-0">
              Edit and upload testimony to the website.
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              type="default"
              onClick={() => navigate({ to: "/testimonies" })}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              htmlType="submit"
              loading={updateTestimonyLoading}
              disabled={updateTestimonyLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border-gray-200">
          <div className="flex flex-col gap-8">
            {/* Top section: Avatar and Basic Info */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Column */}
              <div className="flex flex-col items-center gap-4">
                <Form.Item
                  name="avatarUrl"
                  label={
                    <span className="font-medium text-gray-700">
                      Client's Avatar
                    </span>
                  }
                  className="mb-0! flex flex-col items-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 shadow-inner">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CameraTwoTone className="text-5xl" />
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
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
                          loading={updateTestimonyLoading}
                          className="w-full bg-[#1280ED]"
                        >
                          {previewUrl ? "Change Photo" : "Upload Photo"}
                        </Button>
                      </Upload>

                      {previewUrl && (
                        <Button
                          type="default"
                          danger
                          className="w-full"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </div>
                  </div>
                </Form.Item>
              </div>

              {/* Basic Info Column */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Client Name */}
                <Form.Item
                  name="name"
                  label={
                    <span className="font-medium text-gray-700">
                      Client Name
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter client name" },
                  ]}
                  className="mb-0! md:col-span-2"
                >
                  <Input placeholder="Enter client name..." size="large" />
                </Form.Item>

                {/* Client's Company */}
                <Form.Item
                  name="company"
                  label={
                    <span className="font-medium text-gray-700">
                      Client's Company
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter client's company",
                    },
                  ]}
                  className="mb-0!"
                >
                  <Input placeholder="Enter client's company..." size="large" />
                </Form.Item>

                {/* Client's Position */}
                <Form.Item
                  name="position"
                  label={
                    <span className="font-medium text-gray-700">
                      Client's Position
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter client's position",
                    },
                  ]}
                  className="mb-0!"
                >
                  <Input
                    placeholder="Enter client's position..."
                    size="large"
                  />
                </Form.Item>

                {/* isActive Status */}
                <Form.Item
                  name="isActive"
                  label={
                    <span className="font-medium text-gray-700">Status</span>
                  }
                  rules={[{ required: true, message: "Please select status" }]}
                  className="mb-0!"
                >
                  <div className="flex justify-between items-center gap-2 border border-gray-300 rounded-md p-2">
                    <span className="text-gray-500 m-0">
                      {isActive
                        ? "Visible to the public"
                        : "Hidden from the public"}
                    </span>
                    <Switch
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                      defaultChecked={testimoniesData?.adminTestimony?.isActive}
                      onChange={(checked) => {
                        setIsActive(checked);
                        form.setFieldsValue({
                          isActive: checked,
                        });
                      }}
                    />
                  </div>
                </Form.Item>
              </div>
            </div>

            <Divider className="m-0!" />

            {/* Client's Feedback */}
            <Form.Item
              name="content"
              label={
                <span className="font-medium text-gray-700 text-lg">
                  Client's Feedback
                </span>
              }
              rules={[
                { required: true, message: "Please enter client's feedback" },
              ]}
              className="mb-0!"
            >
              <TextArea
                placeholder="Enter client's feedback..."
                rows={6}
                className="text-base p-4"
              />
            </Form.Item>
          </div>
        </Card>
      </Form>
    </>
  );
}
