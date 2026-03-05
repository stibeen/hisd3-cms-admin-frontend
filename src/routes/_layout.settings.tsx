import { CameraTwoTone, FacebookFilled, GithubFilled, HomeOutlined, LinkedinFilled, MailOutlined, PhoneOutlined, UploadOutlined, XOutlined } from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router'
import { Button, Card, Divider, Input, Typography, Upload, type UploadProps, message } from 'antd'
import { useState } from 'react';
const { Title } = Typography;

// Helper function to convert file to base64 for preview
const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const Route = createFileRoute('/_layout/settings')({
  component: RouteComponent,
})

const ProfileSettingsTitle = (
  <div className='m-3'>
    <Title level={3} className="m-0!">Profile Settings</Title>
    <span className='text-gray-500 m-0 font-normal'>How your information appears across the system</span>
  </div>
)

const AccountSettingsTitle = (
  <div className='m-3'>
    <Title level={3} className="m-0!">Account Security</Title>
    <span className='text-gray-500 m-0 font-normal'>Secure your account with strong password.</span>
  </div>
)

const CompanyProfileSettingsTitle = (
  <div className='m-3'>
    <Title level={3} className="m-0!">Company Profile Settings</Title>
    <span className='text-gray-500 m-0 font-normal'>How the company information appears across the system.</span>
  </div>
)

function RouteComponent() {
  const user = {
    name: 'John Doe',
    email: `john_doe@live.com`,
    phone: '1234567890',
    address: '123 Main St, Anytown, USA',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    password: 'password',
  }

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>()

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
          <Title level={2} className="m-0!">Settings</Title>
          <span className='text-gray-500 m-0'>Manage and organize your settings.</span>
        </div>
      </div>
      <Divider />
      <div className='flex flex-col gap-5'>
        {/* Profile Settings */}
        <Card title={ProfileSettingsTitle} actions={[
          <Button key="save" type="primary" className="bg-[#1280ED] text-white">Save Profile Changes</Button>
        ]} className='border! border-[#1280ED]! rounded-lg!'>
          <div className='flex flex-col gap-4'>
            {/* Profile Picture */}
            <div className='flex gap-2'>
              <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300'>
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <CameraTwoTone className='text-4xl' />
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <Title level={5} className="m-0!">Profile Photo</Title>
                <span className='text-gray-500 m-0 font-normal'>JPG, PNG or GIF (max. 800x400px)</span>
                <div className='flex gap-2'>
                  <Upload {...props} showUploadList={false}>
                    <Button type='primary' className='bg-[#1280ED] text-white' icon={<UploadOutlined />} loading={loading}>{imageUrl ? 'Change Profile Picture' : 'Upload Profile Picture'}</Button>
                  </Upload>
                  {imageUrl && <Button type='default' className='bg-[#1280ED] text-white' onClick={() => setImageUrl('')}>Remove</Button>}
                </div>
              </div>
            </div>
            {/* Personal Information */}
            <div className='flex justify-between gap-2'>
              <div className='w-1/2'>
                <Title level={5}>Full name</Title>
                <Input id='fullName' value={user.name} autoComplete='name' />
              </div>
              <div className='w-1/2'>
                <Title level={5}>Email</Title>
                <Input id='email' value={user.email} autoComplete='email' />
              </div>
            </div>
          </div>
        </Card>

        {/* Account Security */}
        <Card title={AccountSettingsTitle} actions={[
          <Button key="save" type="primary" className="bg-[#1280ED] text-white">Update Password</Button>
        ]} className='border! border-[#1280ED] rounded-lg!'>
          <div className='flex-col flex justify-center gap-2'>
            <div>
              <Title level={5}>Current Password</Title>
              <Input.Password id='currentPassword' value={user.password} />
            </div>
            <div>
              <Title level={5}>New Password</Title>
              <Input.Password id='newPassword' placeholder='Enter new password...' />
            </div>
            <div>
              <Title level={5}>Confirm New Password</Title>
              <Input.Password id='confirmNewPassword' placeholder='Confirm new password...' />
            </div>
          </div>
        </Card>

        {/* Company Profile Settings */}
        <Card title={CompanyProfileSettingsTitle} actions={[
          <Button key="save" type="primary" className="bg-[#1280ED] text-white">Save Changes</Button>
        ]} className='border! border-[#1280ED] rounded-lg!'>
          <div className='flex gap-2'>
            <div className='w-1/2 border border-[#1280ED] rounded-lg p-4'>
              <div>
                <Title level={5}>Company Contact Number</Title>
                <Input id='companyContactNumber' placeholder='+1 (555) 000-0000' prefix={<PhoneOutlined />} />
              </div>
              <div>
                <Title level={5}>Company Email</Title>
                <Input id='companyEmail' placeholder='[EMAIL_ADDRESS]' prefix={<MailOutlined />} />
              </div>
              <div>
                <Title level={5}>Company Address</Title>
                <Input id='companyAddress' placeholder='123 Main St, Anytown, USA' prefix={<HomeOutlined />} />
              </div>
            </div>
            <div className='w-1/2 border border-[#1280ED] rounded-lg p-4'>
              <div className='flex flex-col gap-2'>
                <Title level={5}>Company Social Media Links</Title>
                <Input id='companyLinkedIn' placeholder='LinkedIn Profile URL' prefix={<LinkedinFilled />} />
                <Input id='companyGithub' placeholder='Github Profile URL' prefix={<GithubFilled />} />
                <Input id='companyX' placeholder='X Profile URL' prefix={<XOutlined />} />
                <Input id='companyFacebook' placeholder='Facebook Profile URL' prefix={<FacebookFilled />} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
