import ImagePreviewModal from "@/components/ImagePreviewModal";
import { CREATE_GALLERY_MUTATION } from "@/graphql/mutations";
import { GALLERIES_PAGE_QUERY } from "@/graphql/queries";
import {
  PictureTwoTone,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Typography,
  Card,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Divider,
  Modal,
} from "antd";
import { useState } from "react";
import uploadImage from "@/utils/uploadImage";

const { Title } = Typography;

export const Route = createFileRoute("/_layout/galleries/create-new-gallery")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  useQuery(GALLERIES_PAGE_QUERY);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, contextHolderModal] = Modal.useModal();
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false);

  const [createGallery, { loading: createGalleryLoading }] = useMutation(
    CREATE_GALLERY_MUTATION,
    {
      refetchQueries: [GALLERIES_PAGE_QUERY],
      onCompleted: () => {
        messageApi.success("Gallery created successfully");
        navigate({ to: "/galleries" });
      },
      onError: (error) => {
        messageApi.error(error.message);
      },
    },
  );

  const showConfirmCreate = () => {
    modal.confirm({
      title: "Confirm Create Gallery",
      content: "Are you sure you want to create this gallery?",
      onOk() {
        handleCreateGallery(form.getFieldsValue());
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleCreateGallery = async (values: any) => {
    try {
      let uploadedMediaId = null;
      if (selectedFile) {
        messageApi.loading("Uploading image...", 0);
        const uploadResult = await uploadImage(selectedFile);
        uploadedMediaId = uploadResult.id;
        messageApi.destroy();
      }

      await createGallery({
        variables: {
          payload: {
            title: values.title.toUpperCase(),
            status: values.status,
            mediaIds: uploadedMediaId ? [uploadedMediaId] : [],
          },
        },
      });
    } catch (error) {
      messageApi.destroy();
      messageApi.error("Failed to create gallery");
    }
  };

  return (
    <>
      <ImagePreviewModal
        title="Gallery Image Preview"
        open={imagePreviewModalOpen}
        onOk={() => setImagePreviewModalOpen(false)}
        onCancel={() => setImagePreviewModalOpen(false)}
        previewUrl={previewUrl}
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={showConfirmCreate}
        initialValues={{ status: "DRAFT" }}
      >
        {contextHolder}
        {contextHolderModal}

        {/* Header, Cancel, Create Gallery */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <Title level={2} style={{ margin: 0 }}>
              Create New Gallery
            </Title>
            <p className="text-gray-500">
              Create a new gallery and upload image.
            </p>
          </div>

          <div className="flex justify-end gap-3 px-6 py-2">
            <Button onClick={() => navigate({ to: "/galleries" })}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              htmlType="submit"
              loading={createGalleryLoading}
            >
              Create Gallery
            </Button>
          </div>
        </div>

        <Divider />

        <Card className="shadow-sm border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Gallery Title
                  </span>
                }
                name="title"
                rules={[
                  { required: true, message: "Please enter gallery title" },
                ]}
              >
                <Input placeholder="Enter gallery title" size="large" />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-gray-700">Status</span>
                }
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select
                  placeholder="Select status"
                  size="large"
                  options={[
                    { value: "PUBLISHED", label: "Published" },
                    { value: "DRAFT", label: "Draft" },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="flex flex-col gap-2">
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Gallery Image
                  </span>
                }
                name="image"
                rules={[
                  {
                    validator: () => {
                      if (!selectedFile && !previewUrl) {
                        return Promise.reject(
                          new Error("Please upload gallery image"),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <div className="flex flex-col items-center gap-4">
                  {/* Preview */}
                  <div className="w-full aspect-video rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 shadow-inner">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={() => setImagePreviewModalOpen(true)}
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <PictureTwoTone className="text-5xl mb-2" />
                        <p>No Image Uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex gap-2 w-full">
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
                      <Button icon={<UploadOutlined />} className="w-full">
                        {previewUrl ? "Change Image" : "Upload Image"}
                      </Button>
                    </Upload>
                    {previewUrl && (
                      <Button
                        danger
                        className="flex-1"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </Form.Item>
            </div>
          </div>
        </Card>
      </Form>
    </>
  );
}
