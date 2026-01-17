import { Form, Input, Button, Card, message, Typography } from "antd";
import { Regex } from "../../utils/regex.jsx";
import { userAPI } from "../../routes/user.api.jsx";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ChangePassword = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const data = {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            }
            console.log(data);
            await userAPI.changePasswordApi(data);
            message.success("Đổi mật khẩu thành công");
            navigate("/profile");
        } catch (error) {
            message.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f0f2f5",
            }}
        >
            <Card
                style={{
                    width: 450,
                    maxWidth: "100%",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    borderRadius: "8px"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>
                        Đổi Mật Khẩu
                    </Title>
                </div>

                <Form
                    layout="vertical"
                    name="changePasswordForm"
                    onFinish={onFinish}
                    size="large"
                    validateTrigger="onSubmit"
                >
                    <Form.Item
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        normalize={(value) => (value || "").trim()}
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu cũ!" }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu cũ" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        normalize={(value) => (value || "").trim()}
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                            {
                                pattern: Regex.PASSWORD_REGEX,
                                message:
                                    "Mật khẩu phải từ 6 ký tự gồm chữ hoa, chữ thường và số!"
                            }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        normalize={(value) => (value || "").trim()}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("Mật khẩu xác nhận không khớp!")
                                    );
                                }
                            })
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 30 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{ height: "45px", fontWeight: "500" }}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ChangePassword;
