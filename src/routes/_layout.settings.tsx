import {
  CameraTwoTone,
  DeleteOutlined,
  FacebookFilled,
  // GithubFilled,
  HomeOutlined,
  LinkedinFilled,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
  // XOutlined,
} from "@ant-design/icons";
import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Typography,
  Upload,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { useMutation, useReadQuery } from "@apollo/client/react";
import { SETTINGS_PAGE_QUERY, ME_QUERY } from "@/graphql/queries";
import {
  UPDATE_PASSWORD_MUTATION,
  UPDATE_COMPANY_PROFILE_MUTATION,
  UPDATE_USER_PROFILE_MUTATION,
} from "@/graphql/mutations";
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

export const Route = createFileRoute("/_layout/settings")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery } }) => {
    const queryRef = preloadQuery(SETTINGS_PAGE_QUERY);
    const meQueryRef = preloadQuery(ME_QUERY);
    return { queryRef, meQueryRef };
  },
});

const ProfileSettingsTitle = (
  <div className="m-3">
    <Title level={3} className="m-0!">
      Profile Settings
    </Title>
    <span className="text-gray-500 m-0 font-normal">
      How your information appears across the system
    </span>
  </div>
);

const AccountSettingsTitle = (
  <div className="m-3">
    <Title level={3} className="m-0!">
      Account Security
    </Title>
    <span className="text-gray-500 m-0 font-normal">
      Secure your account with strong password.
    </span>
  </div>
);

const CompanyProfileSettingsTitle = (
  <div className="m-3">
    <Title level={3} className="m-0!">
      Company Profile Settings
    </Title>
    <span className="text-gray-500 m-0 font-normal">
      How the company information appears across the system.
    </span>
  </div>
);

function RouteComponent() {
  const { queryRef, meQueryRef } = Route.useLoaderData();
  const { data } = useReadQuery(queryRef);
  const { data: userData } = useReadQuery(meQueryRef);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userProfileForm] = Form.useForm();
  const [updatePasswordForm] = Form.useForm();
  const [companyProfileForm] = Form.useForm();

  const [updateProfile, { loading: updateProfileLoading }] = useMutation(
    UPDATE_USER_PROFILE_MUTATION,
    {
      onCompleted: () => {
        messageApi.success("Profile updated successfully");
      },
      onError: (error) => {
        messageApi.error(error.message || "Failed to update profile");
      },
    },
  );
  const [updatePassword, { loading: updatePasswordLoading }] = useMutation(
    UPDATE_PASSWORD_MUTATION,
    {
      onCompleted: () => {
        messageApi.success("Password updated successfully");
        updatePasswordForm.resetFields();
      },
      onError: (error) => {
        messageApi.error(error.message || "Failed to update password");
      },
    },
  );
  const [updateCompanyProfile, { loading: updateCompanyProfileLoading }] =
    useMutation(UPDATE_COMPANY_PROFILE_MUTATION, {
      onCompleted: () => {
        messageApi.success("Company profile updated successfully");
        // companyProfileForm.resetFields();
      },
      onError: (error) => {
        messageApi.error(error.message || "Failed to update company profile");
      },
    });

  const [messageApi, contextHolder] = message.useMessage();
  const handleUpdateProfile = async (values: any) => {
    let profileUrl = null;
    if (selectedFile) {
      messageApi.loading("Uploading current cover image...", 0);
      const uploadResult = await uploadImage(selectedFile);
      profileUrl = `${import.meta.env.VITE_API_URL}${uploadResult.url}`;
      messageApi.destroy();
    }
    await updateProfile({
      variables: {
        input: {
          username: values.username,
          email: values.email,
          avatar: profileUrl,
        },
      },
    });
  };

  const handleUpdatePassword = async (values: any) => {
    await updatePassword({
      variables: {
        input: {
          currentPassword: values.currentPassword,
          newPassword: values.confirmNewPassword,
        },
      },
    });
  };

  const handleUpdateCompanyProfile = async (values: any) => {
    await updateCompanyProfile({
      variables: {
        updateCompanyProfileInput: {
          //needs ID
          id:
            data?.companyProfile?.id || "7c49f313-01d5-45cf-a066-6eedeb471ed1",
          phone: values.companyContactNumber,
          email: values.companyEmail,
          address: values.companyAddress,
          socials: {
            linkedin: values.companyLinkedIn,
            github: values.companyGithub,
            x: values.companyX,
            facebook: values.companyFacebook,
          },
        },
      },
    });
  };

  useEffect(() => {
    if (data?.companyProfile) {
      companyProfileForm.setFieldsValue({
        companyContactNumber: data.companyProfile.phone,
        companyEmail: data.companyProfile.email,
        companyAddress: data.companyProfile.address,
        companyLinkedIn: data.companyProfile.socials?.linkedin,
        // companyGithub: data.companyProfile.socials?.github,
        // companyX: data.companyProfile.socials?.x,
        companyFacebook: data.companyProfile.socials?.facebook,
      });
    }
  }, [data]);

  useEffect(() => {
    if (userData?.meQuery) {
      userProfileForm.setFieldsValue({
        username: userData.meQuery.user.username,
        email: userData.meQuery.user.email,
      });
      setPreviewUrl(
        userData.meQuery.user.profile?.avatar
          ? `${userData.meQuery.user.profile.avatar}`
          : null,
      );
    }
  }, [userData]);

  return (
    <>
      {contextHolder}
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col gap-1">
          <Title level={2} className="m-0!">
            Settings
          </Title>
          <span className="text-gray-500 m-0">
            Manage and organize your settings.
          </span>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-5">
        {/* Profile Settings */}
        <Form
          form={userProfileForm}
          layout="vertical"
          className="flex flex-col gap-5"
          onFinish={handleUpdateProfile}
        >
          <Card
            title={ProfileSettingsTitle}
            actions={[
              <Button
                key="save"
                type="primary"
                className="bg-[#1280ED] text-white"
                htmlType="submit"
                loading={updateProfileLoading}
                disabled={updateProfileLoading}
              >
                Save Profile Changes
              </Button>,
            ]}
            className="shadow-md"
          >
            <div className="flex flex-col gap-4">
              {/* Profile Picture */}
              <div className="flex gap-2">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <CameraTwoTone className="text-4xl" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">
                    Profile Photo
                  </label>
                  <div className="flex gap-2">
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
                        className="bg-[#1280ED] text-white"
                        icon={<UploadOutlined />}
                      >
                        {previewUrl
                          ? "Change Profile Picture"
                          : "Upload Profile Picture"}
                      </Button>
                    </Upload>
                    {previewUrl && (
                      <Button
                        type="default"
                        danger
                        className="bg-[#1280ED] text-white"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Remove Profile Picture
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {/* Username and Email */}
              <div className="flex justify-between gap-2">
                <div className="w-1/2">
                  <Form.Item
                    name="username"
                    className="mb-0!"
                    label={
                      <span className="font-medium text-gray-700">
                        Username
                      </span>
                    }
                  >
                    <Input id="username" placeholder="Please enter username" />
                  </Form.Item>
                </div>
                <div className="w-1/2">
                  <Form.Item
                    name="email"
                    className="mb-0!"
                    label={
                      <span className="font-medium text-gray-700">Email</span>
                    }
                  >
                    <Input id="email" placeholder="Please enter email" />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Card>
        </Form>

        {/* Account Security */}
        <Form
          form={updatePasswordForm}
          layout="vertical"
          onFinish={handleUpdatePassword}
          className="flex flex-col gap-5"
        >
          <Card
            title={AccountSettingsTitle}
            actions={[
              <Button
                key="save"
                type="primary"
                className="bg-[#1280ED] text-white"
                htmlType="submit"
                disabled={updatePasswordLoading}
                loading={updatePasswordLoading}
              >
                Update Password
              </Button>,
            ]}
            className="shadow-md"
          >
            <div className="flex-col flex justify-center gap-2">
              <div>
                <Form.Item
                  name="currentPassword"
                  label={
                    <span className="font-medium text-gray-700">
                      Current Password
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter current password",
                    },
                  ]}
                  className="mb-0!"
                >
                  <Input.Password
                    id="currentPassword"
                    placeholder="Enter current password..."
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="newPassword"
                  label={
                    <span className="font-medium text-gray-700">
                      New Password
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter new password" },
                    // {
                    //   validator: (_, value) => {
                    //     if (!value) {
                    //       return Promise.reject(
                    //         new Error("Please enter new password"),
                    //       );
                    //     }
                    //     if (value.length < 8) {
                    //       return Promise.reject(
                    //         new Error(
                    //           "Password must be at least 8 characters long",
                    //         ),
                    //       );
                    //     }
                    //     return Promise.resolve();
                    //   },
                    // },
                  ]}
                  className="mb-0!"
                >
                  <Input.Password
                    id="newPassword"
                    placeholder="Enter new password..."
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="confirmNewPassword"
                  label={
                    <span className="font-medium text-gray-700">
                      Confirm New Password
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please confirm new password",
                    },
                    {
                      validator: (_, value) => {
                        if (
                          value !==
                          updatePasswordForm.getFieldValue("newPassword")
                        ) {
                          return Promise.reject(
                            new Error(
                              "New password and confirm new password do not match",
                            ),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  className="mb-0!"
                >
                  <Input.Password
                    id="confirmNewPassword"
                    placeholder="Confirm new password..."
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </Form>

        {/* Company Profile Settings */}
        <Form
          form={companyProfileForm}
          layout="vertical"
          onFinish={handleUpdateCompanyProfile}
          className="flex flex-col gap-5"
        >
          <Card
            title={CompanyProfileSettingsTitle}
            actions={[
              <Button
                key="save"
                type="primary"
                className="bg-[#1280ED] text-white"
                htmlType="submit"
                disabled={updateCompanyProfileLoading}
                loading={updateCompanyProfileLoading}
              >
                Save Changes
              </Button>,
            ]}
            className="shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
              {/* General Contact Information */}
              <div className="flex flex-col gap-6">
                <div>
                  <Title level={4} className="mb-4! flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#1280ED] rounded-full inline-block"></span>
                    General Information
                  </Title>
                  <span className="text-gray-500 text-sm block mb-4">
                    Basic contact details for your company presence.
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <Form.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Company Contact Number
                      </span>
                    }
                    name="companyContactNumber"
                    className="mb-0!"
                  >
                    <Input
                      id="companyContactNumber"
                      placeholder="+1 (555) 000-0000"
                      prefix={<PhoneOutlined className="text-[#1280ED]" />}
                      className="rounded-md hover:border-[#1280ED] focus:border-[#1280ED]"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Company Email
                      </span>
                    }
                    name="companyEmail"
                    className="mb-0!"
                  >
                    <Input
                      id="companyEmail"
                      placeholder="company@example.com"
                      prefix={<MailOutlined className="text-[#1280ED]" />}
                      className="rounded-md hover:border-[#1280ED] focus:border-[#1280ED]"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Company Address
                      </span>
                    }
                    name="companyAddress"
                    className="mb-0!"
                  >
                    <Input
                      id="companyAddress"
                      placeholder="123 Main St, Anytown, USA"
                      prefix={<HomeOutlined className="text-[#1280ED]" />}
                      className="rounded-md hover:border-[#1280ED] focus:border-[#1280ED]"
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Social Media Presence */}
              <div className="flex flex-col gap-6">
                <div>
                  <Title level={4} className="mb-4! flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#1280ED] rounded-full inline-block"></span>
                    Social Connectivity
                  </Title>
                  <span className="text-gray-500 text-sm block mb-4">
                    Manage your company's social media profile links.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Form.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        LinkedIn
                      </span>
                    }
                    name="companyLinkedIn"
                    className="mb-0!"
                  >
                    <Input
                      id="companyLinkedIn"
                      placeholder="LinkedIn URL"
                      prefix={<LinkedinFilled className="text-[#0077B5]" />}
                      className="rounded-md"
                    />
                  </Form.Item>

                  {/* <Form.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        GitHub
                      </span>
                    }
                    name="companyGithub"
                    className="mb-0!"
                  >
                    <Input
                      id="companyGithub"
                      placeholder="GitHub URL"
                      prefix={<GithubFilled className="text-[#181717]" />}
                      className="rounded-md"
                    />
                  </Form.Item> */}

                  {/* <Form.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        X (Twitter)
                      </span>
                    }
                    name="companyX"
                    className="mb-0!"
                  >
                    <Input
                      id="companyX"
                      placeholder="X URL"
                      prefix={<XOutlined className="text-black" />}
                      className="rounded-md"
                    />
                  </Form.Item> */}

                  <Form.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Facebook
                      </span>
                    }
                    name="companyFacebook"
                    className="mb-0!"
                  >
                    <Input
                      id="companyFacebook"
                      placeholder="Facebook URL"
                      prefix={<FacebookFilled className="text-[#1877F2]" />}
                      className="rounded-md"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Card>
        </Form>
      </div>
    </>
  );
}
