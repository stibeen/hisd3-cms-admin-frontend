import { Button, Result, Typography, Space } from "antd";
import { ErrorComponentProps, useNavigate } from "@tanstack/react-router";

const { Paragraph, Text } = Typography;

export function ErrorPage({ error, reset }: ErrorComponentProps) {
    const navigate = useNavigate();

    // Determine UI based on error message
    const errorMessage = error?.message || "An unexpected error occurred.";
    const isUnauthenticated =
        errorMessage.toLowerCase().includes("token is expired") ||
        errorMessage.toLowerCase().includes("jwt expired") ||
        errorMessage.toLowerCase().includes("unauthenticated") ||
        errorMessage.toLowerCase().includes("forbidden");

    let status: "403" | "404" | "500" = "500";
    let title = "Something went wrong";
    let subTitle = "An error occurred while loading this page.";

    if (isUnauthenticated) {
        status = "403";
        title = "Session Expired";
        subTitle = "Your session has expired or you are not authorized. Please log in again.";
    } else if (errorMessage.toLowerCase().includes("not found")) {
        status = "404";
        title = "404 Not Found";
        subTitle = "The page or resource you are looking for does not exist.";
    } else {
        // For other 500 errors, we can show the original message if it's safe
        subTitle = errorMessage;
    }

    return (
        <div style={{ padding: '40px 0' }}>
            <Result
                status={status}
                title={title}
                subTitle={subTitle}
                extra={
                    <Space size="middle">
                        <Button type="primary" onClick={() => navigate({ to: '/' })}>
                            Back Home
                        </Button>
                        {isUnauthenticated && (
                            <Button onClick={() => navigate({ to: '/login' })}>
                                Go to Login
                            </Button>
                        )}
                        <Button onClick={() => reset()}>
                            Try Again
                        </Button>
                    </Space>
                }
            >
                {/* Advanced details section */}
                <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                    <Paragraph>
                        <Text strong style={{ fontSize: 16 }}>
                            Technical Details:
                        </Text>
                    </Paragraph>
                    <Paragraph copyable={{ text: errorMessage }}>
                        <code style={{ color: '#ff4d4f' }}>{errorMessage}</code>
                    </Paragraph>
                </div>
            </Result>
        </div>
    )
}