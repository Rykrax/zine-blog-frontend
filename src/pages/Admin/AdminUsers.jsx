import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Popconfirm,
    message,
    Select,
    Spin,
    Modal,
    Descriptions,
    Input,
    Space,
    Tooltip,
    Tag,
    Form,
    Upload,
    Progress
} from "antd";
import {
    StopOutlined,
    CheckCircleOutlined,
    UploadOutlined
} from "@ant-design/icons";
import { adminAPI } from "../../routes/admin.api.jsx";
import { Regex } from "../../utils/regex.jsx";
import axiosPublic from "../../utils/axiosPublic.jsx";
import { getCloudinarySignApi } from "../../routes/auth.api.jsx";

const { Option } = Select;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [avatarUrl, setAvatarUrl] = useState(null);

    const [form] = Form.useForm();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getUser();
            setUsers(res.data);
        } catch (err) {
            message.error("Lấy danh sách user thất bại");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const uploadToCloudinary = async (file) => {
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
                        const percent = Math.round((e.loaded * 100) / e.total);
                        setUploadPercent(percent);
                    }
                }
            );
            setAvatarUrl(res.data.secure_url);
            message.success("Upload ảnh thành công");
        } catch (err) {
            message.error("Upload ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await adminAPI.deleteUser(id);
            message.success("Xóa user thành công");
            fetchUsers();
        } catch (err) {
            message.error("Xóa user thất bại");
        }
    };

    const handleToggleBan = async (user) => {
        try {
            const newStatus = user.status === "active" ? "banned" : "active";
            await adminAPI.updateUserStatus(user._id, newStatus);
            message.success(`${newStatus === "banned" ? "Đã khóa" : "Đã mở khóa"} tài khoản`);
            fetchUsers();
            if (selectedUser && selectedUser._id === user._id) {
                setSelectedUser(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Thao tác thất bại";
            message.error(errorMessage);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await adminAPI.updateUserRole(id, newRole);
            message.success("Cập nhật role thành công");
            fetchUsers();
        } catch (err) {
            message.error("Cập nhật role thất bại");
        }
    };

    const showDetail = (user) => {
        setSelectedUser({ ...user });
        setAvatarUrl(user.avatar || null);
        setModalVisible(true);
        form.setFieldsValue({
            username: user.username,
            bio: user.bio
        });
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();

            if (uploading) {
                message.warning("Ảnh chưa upload xong, vui lòng đợi");
                return;
            }

            setUpdateLoading(true);

            await adminAPI.updateUserProfile(selectedUser._id, {
                username: values.username,
                bio: values.bio,
                avatar: avatarUrl
            })
            message.success("Cập nhật thông tin user thành công");
            handleModalCancel();
            fetchUsers();
        } catch (err) {
            if (err.errorFields) return;
            message.error("Cập nhật user thất bại");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setAvatarUrl(null);
        setUploadPercent(0);
        form.resetFields();
    };

    const columns = [
        { title: "ID", dataIndex: "_id", key: "_id", align: "center" },
        { title: "Username", dataIndex: "username", key: "username", align: "center" },
        { title: "Email", dataIndex: "email", key: "email", align: "center" },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            align: "center",
            render: (role, record) => (
                <Select
                    value={role}
                    onChange={(value) => handleRoleChange(record._id, value)}
                    style={{ minWidth: 90 }}
                >
                    <Option value="user">User</Option>
                    <Option value="admin">Admin</Option>
                </Select>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => {
                const isActive = record.status === "active";
                return (
                    <Space size="small">
                        <Button type="primary" onClick={() => showDetail(record)}>
                            Xem chi tiết
                        </Button>
                        <Tooltip title={isActive ? "Nhấn để Khóa" : "Nhấn để Mở khóa"}>
                            <Button
                                onClick={() => handleToggleBan(record)}
                                style={{
                                    borderColor: isActive ? "#52c41a" : "#ff4d4f",
                                    color: isActive ? "#52c41a" : "#ff4d4f",
                                    backgroundColor: isActive ? "#f6ffed" : "#fff1f0",
                                }}
                            >
                                {isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                            </Button>
                        </Tooltip>
                        <Popconfirm title="Xóa user này?" onConfirm={() => handleDelete(record._id)}>
                            <Button type="primary" danger>Xóa</Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: 30 }}>QUẢN LÝ NGƯỜI DÙNG</h2>
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : (
                <Table columns={columns} dataSource={users} rowKey="_id" bordered pagination={{ pageSize: 10, position: ["bottomCenter"] }} />
            )}

            <Modal
                open={modalVisible}
                title="CẬP NHẬT THÔNG TIN"
                onCancel={handleModalCancel}
                onOk={handleUpdate}
                okText="Lưu thay đổi"
                confirmLoading={updateLoading}
                width={650}
            >
                {selectedUser && (
                    <Form form={form} layout="vertical">
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Avatar">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {avatarUrl && (
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '1px solid #d9d9d9' }}
                                        />
                                    )}
                                    <Form.Item
                                        name="avatar"
                                        noStyle
                                        getValueFromEvent={(e) => {
                                            const file = e?.fileList?.[0]?.originFileObj;
                                            if (file) uploadToCloudinary(file);
                                            return e?.fileList;
                                        }}
                                    >
                                        <Upload listType="picture" maxCount={1} beforeUpload={() => false} showUploadList={false}>
                                            <Button icon={<UploadOutlined />}>Đổi ảnh đại diện</Button>
                                        </Upload>
                                    </Form.Item>
                                    {uploading && <Progress percent={uploadPercent} size="small" />}
                                </div>
                            </Descriptions.Item>

                            <Descriptions.Item label="Tên tài khoản">
                                <Form.Item
                                    name="username"
                                    noStyle
                                    normalize={(v) => (v || "").trim()}
                                    rules={[{ required: true, message: "Vui lòng nhập tên!" }, { pattern: Regex.USERNAME_REGEX, message: "Tên không hợp lệ!" }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Descriptions.Item>

                            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>

                            <Descriptions.Item label="Giới thiệu (Bio)">
                                <Form.Item name="bio" noStyle>
                                    <Input.TextArea rows={3} maxLength={500} showCount />
                                </Form.Item>
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                {selectedUser.status === "active" ? (
                                    <Tag color="success">Đang hoạt động</Tag>
                                ) : (
                                    <Tag color="error">Đang khóa</Tag>
                                )}
                            </Descriptions.Item>
                        </Descriptions>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default AdminUsers;