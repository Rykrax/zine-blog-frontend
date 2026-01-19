import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Popconfirm,
    message,
    Spin,
    Modal,
    Descriptions,
    Input,
    Space,
    Form,
    Upload,
    Progress,
    Switch
} from "antd";
import {
    UploadOutlined
} from "@ant-design/icons";
import { adminAPI } from "../../routes/admin.api.jsx";
import axiosPublic from "../../utils/axiosPublic.jsx";
import { getCloudinarySignApi } from "../../routes/auth.api.jsx";

const { TextArea } = Input;

export const AdminPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);
    const [imageUrl, setImageUrl] = useState(null);

    const [form] = Form.useForm();

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getPost();
            console.log(res);
            setPosts(res.data);
        } catch (err) {
            message.error("Lấy danh sách bài viết thất bại");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (record) => {
        try {
            const fullSlug = `${record.slug}-${record._id}`;
            await adminAPI.deletePost(fullSlug);
            message.success("Xóa bài viết thành công");
            fetchPosts();
        } catch (err) {
            message.error("Xóa bài viết thất bại");
        }
    };

    // const handleToggleStatus = async (post) => {
    //     try {
    //         const newStatus = post.status === "published" ? "deleted" : "published";
    //         await adminAPI.updatePostStatus(post._id, newStatus);
    //         message.success(`${newStatus === "deleted" ? "Đã xóa" : "Đã khôi phục"} bài viết`);
    //         fetchPosts();
    //         if (selectedPost && selectedPost._id === post._id) {
    //             setSelectedPost(prev => ({ ...prev, status: newStatus }));
    //         }
    //     } catch (err) {
    //         const errorMessage = err.response?.data?.message || err.message || "Thao tác thất bại";
    //         message.error(errorMessage);
    //     }
    // };

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
            setImageUrl(res.data.secure_url);
            setUploading(false);
        } catch (err) {
            message.error("Upload ảnh thất bại");
            setUploading(false);
        }
    };

    const showDetail = (post) => {
        // console.log(post);
        setSelectedPost({ ...post });
        setModalVisible(true);
        setImageUrl(post.thumbnail || null);
        form.setFieldsValue({
            title: post.title,
            content: post.content,
            is_published: post.is_published
        });
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();

            if (!imageUrl) {
                message.warning("Ảnh chưa upload xong");
                return;
            }

            setUpdateLoading(true);

            const fullSlug = `${selectedPost.slug}-${selectedPost._id}`;

            await adminAPI.updatePostDetail(fullSlug, {
                title: values.title,
                content: values.content,
                thumbnail: imageUrl,
                is_published: values.is_published
            })
            message.success("Cập nhật thông tin bài viết thành công");
            setModalVisible(false);
            fetchPosts();
            setImageUrl(null);
        } catch (err) {
            if (err.errorFields) {
                return;
            }
            console.log(err);
            message.error("Cập nhật bài viết thất bại");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setImageUrl(null);
        setUploadPercent(0);
        form.resetFields();
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("vi-VN");
    };

    const columns = [
        { title: "ID", dataIndex: "_id", key: "_id", align: "center" },
        { title: "Tiêu đề", dataIndex: "title", key: "title", align: "center" },
        {
            title: "Tác giả",
            dataIndex: ["author", "username"],
            key: "author",
            align: "center",
            render: (text) => text || "Ẩn danh"
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            render: (date) => formatDate(date)
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => {
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

                        {/* <div style={{ alignSelf: "center" }}>
                            <Tooltip title={isPublished ? "Nhấn để Xóa" : "Nhấn để Khôi phục"}>
                                <Button
                                    onClick={() => handleToggleStatus(record)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px', padding: '0 12px', fontSize: '13px',
                                        borderColor: isPublished ? "#52c41a" : "#ff4d4f",
                                        color: isPublished ? "#52c41a" : "#ff4d4f",
                                        backgroundColor: isPublished ? "#f6ffed" : "#fff1f0",
                                    }}
                                >
                                    <Space size={4}>
                                        {isPublished ? <CheckCircleOutlined /> : <StopOutlined />}
                                    </Space>
                                </Button>
                            </Tooltip>
                        </div> */}

                        <div style={{ alignSelf: "center" }}>
                            <Popconfirm title="Bạn có chắc chắn muốn xóa bài viết này?" onConfirm={() => handleDelete(record)} okText="Có" cancelText="Không">
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
            <h2 style={{ textAlign: "center", marginBottom: 30 }}>QUẢN LÝ BÀI VIẾT</h2>
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : (
                <Table columns={columns} dataSource={posts} rowKey="_id" bordered pagination={{ pageSize: 10, position: ["bottomCenter"] }} />
            )}

            <Modal
                open={modalVisible}
                title="CẬP NHẬT BÀI VIẾT"
                onCancel={handleModalCancel}
                onOk={handleUpdate}
                okText="Lưu thay đổi"
                cancelText="Hủy bỏ"
                confirmLoading={updateLoading}
                width={800}
            >
                {selectedPost && (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Tiêu đề"
                            name="title"
                            rules={[{ required: true, message: "Nhập tiêu đề" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Thumbnail"
                            name="thumbnail"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                const file = e?.fileList?.[0]?.originFileObj;
                                if (file) uploadToCloudinary(file);
                                return e?.fileList;
                            }}
                        >
                            <Upload
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>

                        {imageUrl && (
                            <div style={{ marginBottom: 16 }}>
                                <img src={imageUrl} alt="Thumbnail" style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }} />
                            </div>
                        )}

                        {uploading && <Progress percent={uploadPercent} style={{ marginBottom: 16 }} />}

                        <Form.Item
                            label="Nội dung"
                            name="content"
                            rules={[{ required: true, message: "Nhập nội dung" }]}
                        >
                            <TextArea rows={6} />
                        </Form.Item>

                        <Form.Item
                            label="Công khai"
                            name="is_published"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Descriptions column={1} bordered size="small" style={{ marginTop: 20 }}>
                            <Descriptions.Item label="ID Bài viết">{selectedPost._id}</Descriptions.Item>
                            <Descriptions.Item label="Tác giả">
                                <span>{selectedPost.author?.username || "Ẩn danh"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">
                                <span>{formatDate(selectedPost.createdAt)}</span>
                            </Descriptions.Item>
                            {/* <Descriptions.Item label="Trạng thái hiện tại">
                                {selectedPost.status === "published" ? (
                                    <Tag color="success" icon={<CheckCircleOutlined />}>Đã xuất bản</Tag>
                                ) : (
                                    <Tag color="error" icon={<StopOutlined />}>Đã xóa</Tag>
                                )}
                            </Descriptions.Item> */}
                        </Descriptions>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default AdminPosts;