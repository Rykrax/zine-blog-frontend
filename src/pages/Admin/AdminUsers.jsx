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
    Form
} from "antd";
import {
    StopOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import instance from "../../utils/authorizedAxios.jsx";
import { adminAPI } from "../../routes/admin.api.jsx";
import { Regex } from "../../utils/regex.jsx";

const { Option } = Select;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

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
        console.log(user);
        setSelectedUser({ ...user });
        setModalVisible(true);
        form.setFieldsValue({
            username: user.username,
            bio: user.bio
        });
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            setUpdateLoading(true);

            await adminAPI.updateUserProfile(selectedUser._id, {
                username: values.username,
                bio: values.bio,
                // avatar: avatarPreview
            })
            message.success("Cập nhật thông tin user thành công");
            setModalVisible(false);
            fetchUsers();
        } catch (err) {
            if (err.errorFields) {
                return;
            }
            console.log(err);
            message.error("Cập nhật user thất bại");
        } finally {
            setUpdateLoading(false);
        }
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
                        <div style={{ alignSelf: "center" }}>
                            <Button
                                type="primary"
                                onClick={() => showDetail(record)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px', padding: '0 12px', fontSize: '13px' }}
                            >
                                Xem chi tiết
                            </Button>
                        </div>

                        <div style={{ alignSelf: "center" }}>
                            <Tooltip title={isActive ? "Nhấn để Khóa" : "Nhấn để Mở khóa"}>
                                <Button
                                    onClick={() => handleToggleBan(record)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px', padding: '0 12px', fontSize: '13px',
                                        borderColor: isActive ? "#52c41a" : "#ff4d4f",
                                        color: isActive ? "#52c41a" : "#ff4d4f",
                                        backgroundColor: isActive ? "#f6ffed" : "#fff1f0",
                                    }}
                                >
                                    <Space size={4}>
                                        {isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                                    </Space>
                                </Button>
                            </Tooltip>
                        </div>

                        <div style={{ alignSelf: "center" }}>
                            <Popconfirm title="Bạn có chắc chắn muốn xóa user này?" onConfirm={() => handleDelete(record._id)} okText="Có" cancelText="Không">
                                <Button type="primary" danger style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px', padding: '0 12px', fontSize: '13px' }}>
                                    Xóa
                                </Button>
                            </Popconfirm>
                        </div>
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
                onCancel={() => setModalVisible(false)}
                onOk={handleUpdate}
                okText="Lưu thay đổi"
                cancelText="Hủy bỏ"
                confirmLoading={updateLoading}
                width={600}
            >
                {selectedUser && (
                    <Form form={form} layout="vertical">
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="ID Người dùng">{selectedUser._id}</Descriptions.Item>

                            <Descriptions.Item label="Tên tài khoản">
                                <Form.Item
                                    name="username"
                                    noStyle
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

                            </Descriptions.Item>

                            <Descriptions.Item label="Email">
                                <span>{selectedUser.email}</span>
                            </Descriptions.Item>

                            <Descriptions.Item label="Giới thiệu (Bio)">
                                <Form.Item name="bio" noStyle>
                                    <Input.TextArea
                                        rows={3}
                                        maxLength={500}
                                        showCount
                                        placeholder="Viết đôi dòng về user..."
                                    />
                                </Form.Item>
                            </Descriptions.Item>

                            <Descriptions.Item label="Quyền hạn">
                                <span style={{ color: selectedUser.role === "admin" ? "#ff4d4f" : "#31ccf7" }}>
                                    {selectedUser.role === "admin" ? "Admin" : "User"}
                                </span>
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                {selectedUser.status === "active" ? (
                                    <Tag color="success" icon={<CheckCircleOutlined />}>Đang hoạt động</Tag>
                                ) : (
                                    <Tag color="error" icon={<StopOutlined />}>Đang khóa</Tag>
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