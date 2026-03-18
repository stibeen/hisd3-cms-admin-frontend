import { useMutation, useQuery } from "@apollo/client/react";
import { Button, Input, Modal, Spin, message, Tooltip, Divider } from "antd";
import {
  CREATE_CATEGORY_MUTATION,
  REMOVE_CATEGORY_MUTATION,
} from "@/graphql/mutations";
import { GET_ALL_CATEGORIES } from "@/graphql/queries";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function CategoryModal({
  open,
  onOk,
  onCancel,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}) {
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [categoryDescriptionInput, setCategoryDescriptionInput] = useState("");
  const { data: categoriesData, loading: categoriesLoading } =
    useQuery(GET_ALL_CATEGORIES);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [createCategory, { loading: createCategoryLoading }] = useMutation(
    CREATE_CATEGORY_MUTATION,
    {
      refetchQueries: [GET_ALL_CATEGORIES],
      onCompleted: () => {
        messageApi.success("Category added successfully");
      },
      onError: (error) => {
        console.error(error);
        messageApi.error(
          "Failed to add category. Check console for more details.",
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

  const handleAddCategory = () => {
    createCategory({
      variables: {
        createCategoryInput: {
          name: categoryNameInput,
          description: categoryDescriptionInput,
          slug: categoryNameInput.toLowerCase().replace(/\s+/g, "-"),
        },
      },
    });
    setCategoryNameInput("");
    setCategoryDescriptionInput("");
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
      <Modal
        title="Manage Categories"
        open={open}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Spin spinning={categoriesLoading}>
          <div className="flex flex-col gap-2 mb-4">
            <Input
              placeholder="Category Name"
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
            />
            <Input
              placeholder="Category Description"
              value={categoryDescriptionInput}
              onChange={(e) => setCategoryDescriptionInput(e.target.value)}
            />
            <Tooltip title="Add Category" placement="top">
              <Button
                icon={<PlusOutlined />}
                onClick={handleAddCategory}
                disabled={createCategoryLoading}
                loading={createCategoryLoading}
              >
                Add Category
              </Button>
            </Tooltip>
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            {categoriesData?.categoriesAdmin.map((category) => (
              <div
                key={category.id}
                className="flex justify-between items-center mb-2 border border-gray-200 p-2 rounded-md"
              >
                <p className="font-semibold">{category.name}</p>
                <span className="text-sm text-gray-500">
                  {category.description}
                </span>
                <Tooltip title="Delete Category" placement="top">
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveCategory(category.id)}
                    disabled={removeCategoryLoading}
                    loading={removeCategoryLoading}
                  />
                </Tooltip>
              </div>
            ))}
          </div>
        </Spin>
      </Modal>
    </>
  );
}
