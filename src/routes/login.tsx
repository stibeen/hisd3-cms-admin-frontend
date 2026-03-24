import { createFileRoute } from "@tanstack/react-router";
import { Button, Checkbox, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@apollo/client/react";
import { SIGN_IN_MUTATION } from "../graphql/mutations";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [signin, { loading }] = useMutation(SIGN_IN_MUTATION);
  const [messageApi, contextHolder] = message.useMessage();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onFinish = async (values: { username: string; password: string }) => {
    // Guard: require the CAPTCHA to be completed
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      messageApi.error("Please complete the CAPTCHA verification.");
      return;
    }
    try {
      const { data } = await signin({
        variables: {
          signInInput: {
            username: values.username,
            password: values.password,
            captchaToken,
          },
        },
      });
      if (data?.signin?.isSignedIn) {
        // localStorage.setItem('accessToken', data.signin.accessToken);
        // localStorage.setItem('refreshToken', data.signin.refreshToken);
        messageApi.success("Signed in successfully!");
        navigate({ to: "/" });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      messageApi.error(error.message || "An error occurred during sign in.");
      // Always reset CAPTCHA after a failed attempt to prevent token reuse
      recaptchaRef.current?.reset();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {contextHolder}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-100">
        <div className="flex justify-center items-center mb-8 bg-white rounded-lg p-2">
          <img src="/hisd3-logo.svg" alt="HISD3 Logo" className="h-12 w-auto" />
          <div className="ml-2 flex items-center overflow-hidden whitespace-nowrap">
            <p className="text-center">
              <span className="text-black font-bold text-3xl">HIS</span>
              <span className="text-[#F54936] font-bold text-3xl">D3</span>{" "}
              <span className="text-black font-bold text-3xl">CMS</span>
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome Back, Admin!
        </h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          {/* Username */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={
                <UserOutlined className="site-form-item-icon text-gray-400" />
              }
              placeholder="Username"
              size="large"
            />
          </Form.Item>
          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={
                <LockOutlined className="site-form-item-icon text-gray-400" />
              }
              type="password"
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          {/* Remember me and Forgot password */}
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="float-right text-[#1280ED]" href="">
              Forgot password
            </a>
          </Form.Item>
          {/* ReCAPTCHA */}
          <Form.Item>
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              />
            </div>
          </Form.Item>
          {/* Login button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#1280ED]"
              size="large"
              loading={loading}
              disabled={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
