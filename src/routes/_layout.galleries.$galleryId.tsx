import { GET_GALLERY_BY_ID } from "@/graphql/queries";
import { UPDATE_GALLERY_BY_ID_MUTATION } from "@/graphql/mutations";
import {
  PictureTwoTone,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useReadQuery, useMutation } from "@apollo/client/react";
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
} from "antd";
import { useState, useEffect } from "react";

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
  return await response.json();
};

export const Route = createFileRoute("/_layout/galleries/$galleryId")({
  component: RouteComponent,
  loader: ({ context: { preloadQuery }, params }) => {
    const queryRef = preloadQuery(GET_GALLERY_BY_ID, {
      variables: { id: params.galleryId },
    });
    return { queryRef };
  },
});

function RouteComponent() {
  const { queryRef } = Route.useLoaderData();
  const { data } = useReadQuery(queryRef);
  const { galleryId } = Route.useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [updateGallery, { loading: updateLoading }] = useMutation(
    UPDATE_GALLERY_BY_ID_MUTATION,
    {
      refetchQueries: [GET_GALLERY_BY_ID],
      onCompleted: () => {
        messageApi.success("Gallery updated successfully");
        navigate({ to: "/galleries" });
      },
      onError: (error) => {
        messageApi.error(error.message);
      },
    },
  );

  useEffect(() => {
    if (data?.adminGallery) {
      form.setFieldsValue({
        title: data.adminGallery.title,
        status: data.adminGallery.status,
      });
      if (data.adminGallery.media?.[0]?.url) {
        setPreviewUrl(data.adminGallery.media[0].url);
      }
    }
  }, [data, form]);

  const onFinish = async (values: any) => {
    try {
      let uploadedMediaId = data?.adminGallery?.media?.[0]?.id;

      if (selectedFile) {
        messageApi.loading("Uploading new image...", 0);
        const uploadResult = await uploadImage(selectedFile);
        uploadedMediaId = uploadResult.id;
        messageApi.destroy();
      }

      await updateGallery({
        variables: {
          updateGalleryId: galleryId,
          payload: {
            title: values.title.toUpperCase(),
            status: values.status,
            mediaIds: uploadedMediaId ? [uploadedMediaId] : [],
          },
        },
      });
    } catch (error) {
      messageApi.destroy();
      messageApi.error("Failed to update gallery");
    }
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {contextHolder}

        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-1">
            <Title level={2} className="m-0!">
              Edit Gallery
            </Title>
            <span className="text-gray-500 m-0">
              Edit and publish gallery to the website.
            </span>
          </div>

          <div className="flex justify-end gap-3 px-6 py-2">
            <Button onClick={() => navigate({ to: "/galleries" })}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={updateLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>

        <Divider />

        <Card className="shadow-sm border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <Form.Item
                label="Gallery Title"
                name="title"
                rules={[
                  { required: true, message: "Please enter gallery title" },
                ]}
              >
                <Input placeholder="Enter gallery title" size="large" />
              </Form.Item>

              <Form.Item
                label="Status"
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
                label="Gallery Image"
                extra="Leave empty to keep current image."
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full aspect-video rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 shadow-inner">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <PictureTwoTone className="text-5xl mb-2" />
                        <p>No Image Uploaded</p>
                      </div>
                    )}
                  </div>

                  <Upload
                    beforeUpload={(file) => {
                      setSelectedFile(file);
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                      return false;
                    }}
                    onRemove={() => {
                      setSelectedFile(null);
                      // Restore original if available
                      if (data?.adminGallery?.media?.[0]?.url) {
                        setPreviewUrl(data.adminGallery.media[0].url);
                      } else {
                        setPreviewUrl(null);
                      }
                    }}
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />} className="w-full">
                      Change Image
                    </Button>
                  </Upload>
                </div>
              </Form.Item>
            </div>
          </div>
        </Card>
      </Form>
    </>
  );
}
