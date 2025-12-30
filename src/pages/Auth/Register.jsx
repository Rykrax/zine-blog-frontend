import { Form, Input, Button, Card, message, Typography } from 'antd';
import { registerApi } from '../../routes/api';
import { Link, useNavigate } from 'react-router-dom';
import { Regex } from '../../utils/regex';

const { Title } = Typography;

const Register = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const { username, email, password } = values;
            const res = await registerApi(username, email, password);
            message.success('Đăng ký thành công');
            navigate('/login');
        } catch (error) {
            message.error(error?.response?.data?.message || "Đăng ký thất bại");
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
                    <Title level={3} style={{ margin: 0 }}>Đăng Ký</Title>
                </div>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    size="large"
                    validateTrigger="onChange"
                >
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        normalize={(value) => (value || '').trim()}
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                            { pattern: Regex.USERNAME_REGEX, message: "Tên đăng nhập không hợp lệ!" },
                        ]}
                    >
                        <Input placeholder="Nhập tên đăng nhập" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        normalize={(value) => (value || '').replace(/\s+/g, '')}
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { pattern: Regex.EMAIL_REGEX, message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input placeholder="example@gmail.com" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { pattern: Regex.PASSWORD_REGEX, message: "Mật khẩu phải từ 6 kí tự bao gồm chữ thường, chữ hoa và số!" }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Nhập lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu" />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 30 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{ height: '45px', fontWeight: '500' }}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <span>Bạn đã có tài khoản? </span>
                        <Link to="/login" style={{ fontWeight: 'bold', textDecoration: 'none' }}>
                            Đăng nhập ngay
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;