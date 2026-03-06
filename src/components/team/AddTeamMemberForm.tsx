import { Form, Input, Button } from "antd";
import { LinkedinFilled, GithubFilled, XOutlined } from "@ant-design/icons";

interface Props {
  onSubmit: (values: any) => void;
}

export const AddTeamMemberForm = ({ onSubmit }: Props) => {
  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item
        label="Member Name"
        name="name"
        rules={[{ required: true, message: "Please enter member name" }]}
      >
        <Input size="large" placeholder="Enter member name..." />
      </Form.Item>

      <Form.Item
        label="Designation"
        name="position"
        rules={[{ required: true, message: "Please enter designation" }]}
      >
        <Input size="large" placeholder="Enter designation..." />
      </Form.Item>

      <Form.Item label="LinkedIn" name={["socials", "linkedin"]}>
        <Input prefix={<LinkedinFilled />} size="large" />
      </Form.Item>

      <Form.Item label="GitHub" name={["socials", "github"]}>
        <Input prefix={<GithubFilled />} size="large" />
      </Form.Item>

      <Form.Item label="X" name={["socials", "x"]}>
        <Input prefix={<XOutlined />} size="large" />
      </Form.Item>

      <Button type="primary" htmlType="submit" block size="large">
        Add Team Member
      </Button>
    </Form>
  );
};
