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
} from "antd";
import instance from "../../utils/authorizedAxios.jsx";
import { adminAPI } from "../../routes/admin.api.jsx";

const { Option } = Select;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getUser();
            setUsers(res.data);
        } catch (err) {
            console.log(err);
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
            console.log(err);
            message.error("Xóa user thất bại");
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await instance.put(`/admin/users/${id}`, { role: newRole });
            message.success("Cập nhật role thành công");
            fetchUsers();
        } catch (err) {
            console.log(err);
            message.error("Cập nhật role thất bại");
        }
    };

    const showDetail = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await instance.put(`/admin/users/${selectedUser._id}`, {
                username: selectedUser.username,
                email: selectedUser.email,
                bio: selectedUser.bio,
                role: selectedUser.role,
            });
            message.success("Cập nhật user thành công");
            setModalVisible(false);
            fetchUsers();
        } catch (err) {
            console.log(err);
            message.error("Cập nhật user thất bại");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "_id", key: "_id" },
        { title: "Username", dataIndex: "username", key: "username" },
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role, record) => (
                <Select
                    value={role}
                    onChange={(value) => handleRoleChange(record._id, value)}
                    style={{ width: 120 }}
                >
                    <Option value="user">User</Option>
                    <Option value="admin">Admin</Option>
                </Select>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => showDetail(record)}>
                        Xem chi tiết
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa user này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger style={{ marginLeft: 8 }}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>Quản lý User</h2>
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="_id"
                    pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                />
            )}

            <Modal
                open={modalVisible}
                title="Chi tiết User"
                onCancel={() => setModalVisible(false)}
                onOk={handleUpdate}
                okText="Cập nhật"
            >
                {selectedUser && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="ID">{selectedUser._id}</Descriptions.Item>
                        <Descriptions.Item label="Username">
                            <Input
                                value={selectedUser.username}
                                onChange={(e) =>
                                    setSelectedUser({ ...selectedUser, username: e.target.value })
                                }
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            <Input
                                value={selectedUser.email}
                                onChange={(e) =>
                                    setSelectedUser({ ...selectedUser, email: e.target.value })
                                }
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Bio">
                            <Input
                                value={selectedUser.bio}
                                onChange={(e) =>
                                    setSelectedUser({ ...selectedUser, bio: e.target.value })
                                }
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Role">
                            <Select
                                value={selectedUser.role}
                                onChange={(value) =>
                                    setSelectedUser({ ...selectedUser, role: value })
                                }
                                style={{ width: 120 }}
                            >
                                <Option value="user">User</Option>
                                <Option value="admin">Admin</Option>
                            </Select>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default AdminUsers;
