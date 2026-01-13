import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Card,
    message,
    Typography,
    Avatar,
    Upload,
    Progress
} from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Regex } from "../../utils/regex.jsx";
import { userAPI } from "../../routes/user.api.jsx";
import { useAuth } from "../../providers/AuthProvider.jsx";
import axiosPublic from "../../utils/axiosPublic.jsx";
import { getCloudinarySignApi } from "../../routes/api.jsx";

const { Title } = Typography;
const { TextArea } = Input;

const UpdateProfile = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [avatarPreview, setAvatarPreview] = useState("");

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                bio: user.bio
            });
            setAvatarPreview(user.avatar);
        }
    }, [user, form]);

    const uploadAvatarToCloudinary = async (file) => {
        setUploading(true);
        setUploadPercent(0);

        try {
            const sign = await getCloudinarySignApi();

            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", sign.apiKey);
            formData.append("timestamp", sign.timestamp);
            formData.append("signature", sign.signature);
            formData.append("folder", "upload-zine-blog");

            const res = await axiosPublic.post(
                `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
                formData,
                {
                    onUploadProgress: (e) => {
                        const percent = Math.round(
                            (e.loaded * 100) / e.total
                        );
                        setUploadPercent(percent);
                    }
                }
            );

            setAvatarPreview(res.data.secure_url);
        } catch (err) {
            message.error("Upload ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    const onFinish = async (values) => {
        if (uploading) {
            message.warning("Ảnh đang upload, vui lòng chờ");
            return;
        }

        setLoading(true);
        try {
            const res = await userAPI.updateProfileApi({
                username: values.username,
                bio: values.bio,
                avatar: avatarPreview
            });
            console.log(res);
            updateUser(res.user);
            message.success("Cập nhật thông tin thành công!");
            navigate(-1);
        } catch (error) {
            message.error(
                error.response?.data?.message || "Cập nhật thất bại"
            );
        } finally {
            setLoading(false);
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
                padding: "20px"
            }}
        >
            <Card
                style={{
                    width: 500,
                    maxWidth: "100%",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    borderRadius: "8px"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>
                        Cập Nhật Thông Tin
                    </Title>

                    <div style={{ marginTop: 20 }}>
                        <Avatar
                            size={100}
                            src={avatarPreview}
                            icon={!avatarPreview && <UserOutlined />}
                        />
                    </div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    size="large"
                >
                    <Form.Item label="Ảnh đại diện">
                        <Upload
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            showUploadList={false}
                            onChange={(e) => {
                                const file =
                                    e?.fileList?.[0]?.originFileObj;
                                if (file) uploadAvatarToCloudinary(file);
                            }}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                loading={uploading}
                            >
                                Chọn ảnh
                            </Button>
                        </Upload>

                        {uploading && (
                            <Progress
                                percent={uploadPercent}
                                style={{ marginTop: 10 }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        normalize={(v) => (v || "").trim()}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên đăng nhập!"
                            },
                            {
                                pattern: Regex.USERNAME_REGEX,
                                message: "Tên đăng nhập không hợp lệ!"
                            }
                        ]}
                    >
                        <Input placeholder="Nhập tên đăng nhập" />
                    </Form.Item>

                    <Form.Item
                        label="Giới thiệu bản thân"
                        name="bio"
                    >
                        <TextArea
                            rows={4}
                            maxLength={500}
                            showCount
                            placeholder="Viết đôi dòng về bạn..."
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 30 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            disabled={uploading}
                            style={{
                                height: 45,
                                fontWeight: 500,
                                marginBottom: 15
                            }}
                        >
                            Lưu thay đổi
                        </Button>

                        <Button
                            block
                            onClick={() => navigate(-1)}
                            style={{ height: 45, fontWeight: 500 }}
                        >
                            Quay lại
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UpdateProfile;
