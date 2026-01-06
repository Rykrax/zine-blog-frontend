import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Layout,
    Typography,
    Avatar,
    Space,
    Button,
    Divider,
    Spin,
    Card,
    Row,
    Col,
    Statistic,
    message
} from "antd";
import {
    UserOutlined,
    CalendarOutlined,
    EyeOutlined,
    ShareAltOutlined,
    HeartOutlined,
    HeartFilled,
    MessageOutlined
} from "@ant-design/icons";

import { userAPI } from "../../routes/user.api.jsx";
import { userApi } from "../../routes/api.jsx";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const calculateReadTime = (content) => {
        if (!content) return 0;
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/g).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    const handleToggleSave = async () => {
        if (!post) return;
        try {
            setSaving(true);
            const res = await userAPI.savePostApi(post._id);

            const status = res.data?.status || res.status;

            if (status === 'saved' || res.data?.message?.includes("Đã lưu")) {
                setSaved(true);
                message.success("Đã lưu bài viết vào mục yêu thích!");
            } else {
                setSaved(false);
                message.success("Đã bỏ lưu bài viết.");
            }
        } catch (error) {
            console.error("Lỗi lưu bài viết:", error);
            message.error(error.response?.data?.message || "Thao tác thất bại, vui lòng thử lại sau.");
        } finally {
            setSaving(false);
        }
    };

    const checkUserSavedStatus = async (currentPostId) => {
        try {
            const res = await userApi();
            const userData = res.user || res.data;

            if (userData && userData.saved_posts) {
                const isSaved = userData.saved_posts.some(savedItem => {
                    const savedId = typeof savedItem === 'object' ? savedItem._id : savedItem;
                    return savedId.toString() === currentPostId.toString();
                });
                setSaved(isSaved);
            }
        } catch (error) {
            console.log("Chưa đăng nhập hoặc lỗi lấy user info");
        }
    };

    useEffect(() => {
        const fetchPostDetail = async () => {
            if (!slug) return;
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:8080/api/v1/post/posts/${slug}`);

                const postData = res.data.data || res.data;
                setPost(postData);

                if (postData && postData._id) {
                    checkUserSavedStatus(postData._id);
                }

            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
                message.error("Không thể tải bài viết!");
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [slug]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Đang tải bài viết..." />
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Title level={3}>Không tìm thấy bài viết</Title>
                <Button type="primary" href="/">Quay về trang chủ</Button>
            </div>
        );
    }

    return (
        <Content style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto", backgroundColor: "#fff" }}>
            <div style={{ marginBottom: 30 }}>
                <Title level={1} style={{ margin: "15px 0 25px 0", fontSize: '2.5rem' }}>
                    {post.title}
                </Title>

                <Space size="large" align="center" style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Space size={16}>
                        <Avatar
                            size={54}
                            src={post.author?.avatar}
                            icon={<UserOutlined />}
                            style={{ border: '1px solid #f0f0f0' }}
                        />
                        <div>
                            <Text strong style={{ display: 'block', fontSize: 16 }}>
                                {post.author?.username || "Tác giả ẩn danh"}
                            </Text>
                            <Space size="small" style={{ color: '#8c8c8c', fontSize: 13 }}>
                                <CalendarOutlined />
                                {formatDate(post.createdAt)}
                                <Divider type="vertical" />
                                <span>{calculateReadTime(post.content)} phút đọc</span>
                            </Space>
                        </div>
                    </Space>

                    <Space>
                        <Button type="text" icon={<ShareAltOutlined />}>Chia sẻ</Button>
                        <Button
                            type="text"
                            icon={saved ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                            onClick={handleToggleSave}
                            loading={saving}
                            danger={saved}
                        >
                            {saved ? "Đã yêu thích" : "Yêu thích"}
                        </Button>
                    </Space>
                </Space>
            </div>

            <Row gutter={[48, 24]}>
                <Col xs={24} lg={16}>
                    <div
                        className="post-content"
                        style={{ fontSize: 18, lineHeight: 1.8, color: '#292929', textAlign: 'justify' }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <Divider style={{ margin: "40px 0" }} />

                    <div style={{ marginTop: 25 }}>
                        <Title level={4}>
                            <MessageOutlined style={{ marginRight: 8 }} />
                            Bình luận ({post.stats?.comment_count || 0})
                        </Title>
                        <Card style={{ background: '#f5f5f5', textAlign: 'center', padding: 30, border: 'none' }}>
                            <Text type="secondary">Chức năng bình luận đang được phát triển...</Text>
                        </Card>
                    </div>
                </Col>

                <Col xs={24} lg={8}>
                    <div style={{ position: 'sticky', top: 20 }}>
                        <Card bordered={false} style={{ background: '#fafafa', marginBottom: 20, borderRadius: 8 }}>
                            <div style={{ textAlign: 'center' }}>
                                <Avatar size={80} src={post.author?.avatar} icon={<UserOutlined />} style={{ marginBottom: 15 }} />
                                <Title level={4} style={{ margin: 0 }}>{post.author?.username}</Title>

                                <Paragraph type="secondary" style={{ marginTop: 15 }}>
                                    {post.author?.bio || "Thành viên tích cực của cộng đồng viết lách."}
                                </Paragraph>
                            </div>
                        </Card>

                        <Card title="Thống kê bài viết" size="small" style={{ borderRadius: 8 }}>
                            <Row gutter={16} style={{ textAlign: 'center' }}>
                                <Col span={12}>
                                    <Statistic
                                        title="Lượt xem"
                                        value={post.stats?.views || 0}
                                        prefix={<EyeOutlined />}
                                        formatter={(value) => value.toLocaleString()}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Bình luận"
                                        value={post.stats?.comment_count || 0}
                                        prefix={<MessageOutlined />}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Content>
    );
};

export default PostDetail;