import { Image, Modal, Space } from "antd";

export default function ImagePreviewModal({
  open,
  onOk,
  onCancel,
  previewUrl,
  title,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  previewUrl: string | null;
  title: string;
}) {
  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={onCancel}>
      <div className="flex items-center justify-center">
        <Image
          src={previewUrl!}
          alt={title}
          className="max-w-full"
          preview={{
            open: false,
            cover: (
              <Space vertical align="center">
                {title}
              </Space>
            ),
          }}
        />
      </div>
    </Modal>
  );
}
