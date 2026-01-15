import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
    message,
    List,
    Tooltip
} from "antd";
import {
    UserOutlined,
    CalendarOutlined,
    EyeOutlined,
    ShareAltOutlined,
    HeartOutlined,
    HeartFilled,
    MessageOutlined,
    MoreOutlined
} from "@ant-design/icons";

import { userAPI } from "../../routes/user.api.jsx";
import { userApi } from "../../routes/api.jsx";
import { postAPI } from "@/routes/post.api.jsx";
import AppPagination from "@/components/Pagination";
import { formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from "@/providers/AuthProvider.jsx";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PostDetail = () => {
    const { user } = useAuth();
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const [commentTotal, setCommentTotal] = useState(0);

    const [comments, setComments] = useState([]);
    const [commentLoading, setCommentLoading] = useState(false);

    const [commentContent, setCommentContent] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    const handleSubmitComment = async () => {
        if (!commentContent.trim()) {
            message.warning("Vui lòng nhập nội dung bình luận");
            return;
        }

        try {
            setCommentSubmitting(true);

            await postAPI.createComment(slug, {
                content: commentContent
            });

            message.success("Đã gửi bình luận");

            setCommentContent("");

            // reload lại comment trang hiện tại
            fetchComments();

        } catch (error) {
            message.error(
                error.response?.data?.message || "Bạn cần đăng nhập để bình luận"
            );
        } finally {
            setCommentSubmitting(false);
        }
    };


    const formatDistanceToNow = (date) => {
        try {
            return formatDistanceToNowStrict(new Date(date), {
                addSuffix: false,
                locale: vi
            }).replace('trước', '').trim();
        } catch (e) {
            return "vừa xong";
        }
    };

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

    const fetchComments = async () => {
        if (!slug) return;

        try {
            setCommentLoading(true);

            const res = await postAPI.getCommentByPost(slug, { page, limit });

            setComments(res.data || []);
            setCommentTotal(res.pagination?.total || 0);
        } catch (error) {
            message.error("Không thể tải bình luận");
        } finally {
            setCommentLoading(false);
        }
    };

    useEffect(() => {
        const fetchPostDetail = async () => {
            if (!slug) return;
            try {
                setLoading(true);
                const res = await postAPI.getPostDetail(slug);

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

    useEffect(() => {
        fetchComments();
    }, [slug, page, limit]);

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
                        <div style={{ marginTop: 25 }}>
                            <Title level={4}>
                                <MessageOutlined style={{ marginRight: 8 }} />
                                Bình luận ({post.stats?.comment_count})
                            </Title>
                            <Card
                                style={{
                                    marginBottom: 24,
                                    borderRadius: 12,
                                    border: '1px solid #f0f0f0',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                                bodyStyle={{ padding: '12px' }}
                            >
                                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                    <Avatar src={user.avatar} icon={<UserOutlined />} style={{ flexShrink: 0 }} />

                                    <div style={{
                                        flex: 1,
                                        backgroundColor: "#f0f2f5",
                                        borderRadius: "20px",
                                        padding: "4px 12px",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}>
                                        <textarea
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            placeholder={`Bình luận dưới tên ${user.username || 'người dùng'}`}
                                            rows={1}
                                            style={{
                                                width: "100%",
                                                resize: "none",
                                                padding: "8px 0",
                                                backgroundColor: "transparent",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "14px",
                                                lineHeight: "20px",
                                                color: "#000"
                                            }}
                                        />

                                    </div>

                                    <div style={{ alignSelf: "center" }}>
                                        <Button
                                            type="primary"
                                            onClick={handleSubmitComment}
                                            loading={commentSubmitting}
                                            disabled={!commentContent.trim()}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '4px 16px'
                                            }}
                                        >
                                            Gửi
                                        </Button>
                                    </div>

                                </div>
                            </Card>

                            <List
                                className="comment-list"
                                loading={commentLoading}
                                itemLayout="horizontal"
                                dataSource={comments}
                                renderItem={(item) => (
                                    <div style={{ display: 'flex', marginBottom: 20 }}>
                                        <Avatar src={item.user?.avatar} size={40} style={{ marginRight: 12, flexShrink: 0 }} />

                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                backgroundColor: '#f0f2f5',
                                                padding: '8px 12px',
                                                borderRadius: '18px',
                                                display: 'inline-block',
                                                maxWidth: '100%',
                                                position: 'relative'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Text strong style={{ fontSize: '14px' }}>{item.user?.username}</Text>
                                                </div>
                                                <div style={{ fontSize: '14px', marginTop: '2px', wordBreak: 'break-word' }}>
                                                    {item.content}
                                                </div>
                                            </div>

                                            <div style={{ marginLeft: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <Text type="secondary" strong style={{ cursor: 'pointer', fontSize: '12px' }}>Thích</Text>
                                                <Text type="secondary" strong style={{ cursor: 'pointer', fontSize: '12px' }}>Trả lời</Text>
                                                <Tooltip title={new Date(item.createdAt).toLocaleString()}>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {formatDistanceToNow(item.createdAt)}
                                                    </Text>
                                                </Tooltip>

                                                <Button type="text" size="small" icon={<MoreOutlined />} style={{ height: '20px', width: '20px' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />

                            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                                <AppPagination total={commentTotal} />
                            </div>
                        </div>
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