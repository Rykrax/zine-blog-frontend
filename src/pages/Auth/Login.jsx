import { Form, Input, Button, Card, message, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Regex } from '../../utils/regex.jsx'
import { loginApi } from '../../routes/api.jsx';
import { useAuth } from '../../providers/AuthProvider.jsx';

const { Title } = Typography;

const Login = () => {
    const { login } = useAuth();

    const onFinish = async (values) => {
        try {
            const { email, password } = values;
            await loginApi(email, password);
            await login();
            message.success("Đăng nhập thành công");
        } catch (error) {
            message.error(error.response?.data?.message || "Đăng nhập thất bại");
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5',
            padding: '20px'
        }}>
            <Card
                style={{
                    width: 450,
                    maxWidth: '100%',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    borderRadius: '8px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>Đăng Nhập</Title>
                </div>

                <Form
                    layout="vertical"
                    name="loginForm"
                    onFinish={onFinish}
                    size="large"
                    validateTrigger="onSubmit"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        normalize={(value) => (value || '').replace(/\s+/g, '')}
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { pattern: Regex.EMAIL_REGEX, message: "Email không hợp lệ!" }
                        ]}
                    >
                        <Input placeholder="example@gmail.com" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        normalize={(value) => (value || '').trim()}
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { pattern: Regex.PASSWORD_REGEX, message: "Mật khẩu phải từ 6 kí tự bao gồm chữ thường, chữ hoa và số!" }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 30 }}>
                        <Button type="primary" htmlType="submit" block style={{ height: '45px', fontWeight: '500' }}>
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <span>Bạn chưa có tài khoản? </span>
                        <Link to="/register" style={{ fontWeight: 'bold', textDecoration: 'none' }}>
                            Đăng ký ngay
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;