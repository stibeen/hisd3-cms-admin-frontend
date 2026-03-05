import { Link } from '@tanstack/react-router'
import { Button, Result } from 'antd'

/**
 * NotFound component to be displayed when a route is not found.
 * Moved from __root.tsx for better organization.
 */
export function NotFound() {
    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f0f2f5',
            }}
        >
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link to="/">
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </div>
    )
}

export default NotFound
