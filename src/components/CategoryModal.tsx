import { useMutation } from "@apollo/client/react";
import {
  Button,
  Input,
  Modal,
  Spin,
  message,
  Tooltip,
  Divider,
  Form,
} from "antd";
import {
  CREATE_CATEGORY_MUTATION,
  REMOVE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
} from "@/graphql/mutations";
import { GET_ALL_CATEGORIES } from "@/graphql/queries";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function CategoryModal({
  open,
  onOk,
  onCancel,
  categories,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  categories: any[];
}) {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [modal, contextHolder] = Modal.useModal();
  const [createCategory, { loading: createCategoryLoading }] = useMutation(
    CREATE_CATEGORY_MUTATION,
    {
      refetchQueries: [GET_ALL_CATEGORIES],
      onCompleted: () => {
        messageApi.success("Category added successfully");
        form.resetFields();
      },
      onError: (error) => {
        console.error(error);
        messageApi.error(
          "Failed to add category. Check console for more details.",
        );
      },
    },
  );
  const [updateCategory, { loading: updateCategoryLoading }] = useMutation(
    UPDATE_CATEGORY_MUTATION,
    {
      refetchQueries: [GET_ALL_CATEGORIES],
      onCompleted: () => {
        messageApi.success("Category updated successfully");
        form.resetFields();
        setIsEditing(false);
        setEditingCategoryId(null);
      },
      onError: (error) => {
        console.error(error);
        messageApi.error(
          "Failed to update category. Check console for more details.",
        );
      },
    },
  );
  const [removeCategory, { loading: removeCategoryLoading }] = useMutation(
    REMOVE_CATEGORY_MUTATION,
    {
      refetchQueries: [GET_ALL_CATEGORIES],
      onCompleted: () => {
        messageApi.success("Category removed successfully");
      },
      onError: (error) => {
        console.error(error);
        messageApi.error(
          "Failed to remove category. Check console for more details.",
        );
      },
    },
  );

  const showConfirmAdd = () => {
    modal.confirm({
      title: "Confirm Add Category",
      content: "Are you sure you want to add this category?",
      onOk: handleAddCategory,
      onCancel: () => {},
    });
  };

  const showConfirmUpdate = (id: string) => {
    modal.confirm({
      title: "Confirm Update Category",
      content: "Are you sure you want to update this category?",
      onOk: () => handleUpdateCategory(id),
      onCancel: () => {},
    });
  };

  const showConfirmRemove = (id: string) => {
    modal.confirm({
      title: "Confirm Remove Category",
      content: "Are you sure you want to remove this category?",
      onOk: () => handleRemoveCategory(id),
      onCancel: () => {},
    });
  };

  const handleAddCategory = () => {
    createCategory({
      variables: {
        createCategoryInput: {
          name: form.getFieldValue("categoryName"),
          description: form.getFieldValue("categoryDescription"),
          slug: form
            .getFieldValue("categoryName")
            .toLowerCase()
            .replace(/\s+/g, "-"),
        },
      },
    });
  };

  const handleUpdateFields = (category: any) => {
    setIsEditing(true);
    setEditingCategoryId(category.id);
    form.setFieldsValue({
      categoryName: category.name,
      categoryDescription: category.description,
    });
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditingCategoryId(null);
    form.resetFields();
  };

  const handleUpdateCategory = (id: string) => {
    updateCategory({
      variables: {
        updateCategoryInput: {
          id,
          name: form.getFieldValue("categoryName"),
          description: form.getFieldValue("categoryDescription"),
          slug: form
            .getFieldValue("categoryName")
            .toLowerCase()
            .replace(/\s+/g, "-"),
        },
      },
    });
  };

  const handleRemoveCategory = (id: string) => {
    removeCategory({
      variables: {
        removeCategoryId: id,
      },
    });
  };

  return (
    <>
      {messageContextHolder}
      {contextHolder}
      <Modal
        title="Manage Categories"
        open={open}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Spin spinning={false}>
          {/* Create Category */}
          <Form form={form} onFinish={showConfirmAdd} layout="vertical">
            <div className="flex flex-col gap-2 mb-4">
              <Form.Item
                name="categoryName"
                rules={[
                  {
                    required: true,
                    message: "Please enter a category name",
                  },
                ]}
                className="mb-0!"
              >
                <Input placeholder="Category Name" />
              </Form.Item>
              <Form.Item
                name="categoryDescription"
                rules={[
                  {
                    required: true,
                    message: "Please enter a category description",
                  },
                ]}
                className="mb-0!"
              >
                <Input placeholder="Category Description" />
              </Form.Item>
              {!isEditing ? (
                <Tooltip title="Add Category" placement="top">
                  <Button
                    icon={<PlusOutlined />}
                    htmlType="submit"
                    disabled={createCategoryLoading}
                    loading={createCategoryLoading}
                  >
                    Add Category
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Update Category" placement="top">
                  <Button
                    icon={<EditOutlined />}
                    htmlType="button"
                    onClick={() => showConfirmUpdate(editingCategoryId!)}
                    disabled={updateCategoryLoading}
                    loading={updateCategoryLoading}
                  >
                    Update Category
                  </Button>
                </Tooltip>
              )}
            </div>
          </Form>
          <Divider />
          {/* Categories List */}
          <div className="flex flex-col gap-2">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="flex justify-between items-center mb-2 border border-gray-200 p-2 rounded-md"
              >
                <Tooltip title={category.description} placement="top">
                  <span className="font-semibold">{category.name}</span>
                </Tooltip>
                <div className="flex gap-2">
                  {!isEditing || editingCategoryId !== category.id ? (
                    <Tooltip title="Edit Category" placement="top">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleUpdateFields(category)}
                        disabled={updateCategoryLoading || isEditing}
                        loading={updateCategoryLoading}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Cancel" placement="top">
                      <Button
                        icon={<CloseOutlined />}
                        onClick={handleCancelEditing}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="Delete Category" placement="top">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showConfirmRemove(category.id)}
                      disabled={removeCategoryLoading || isEditing}
                      loading={removeCategoryLoading}
                    />
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </Spin>
      </Modal>
    </>
  );
}
