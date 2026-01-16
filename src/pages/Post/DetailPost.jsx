import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
    Layout, Typography, Avatar, Space, Button, Divider, Spin,
    Card, Row, Col, Statistic, message, List, Tooltip, Input
} from "antd";
import {
    UserOutlined, CalendarOutlined, EyeOutlined, ShareAltOutlined,
    HeartOutlined, HeartFilled, MessageOutlined, MoreOutlined
} from "@ant-design/icons";

import { userAPI } from "../../routes/user.api.jsx";
import { userApi } from "../../routes/api.jsx";
import { postAPI } from "@/routes/post.api.jsx";
import AppPagination from "@/components/Pagination";
import { formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from "@/providers/AuthProvider.jsx";
import { commentAPI } from "@/routes/comment.api.jsx";

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
            await commentAPI.createComment(slug, { content: commentContent });
            message.success("Đã gửi bình luận");
            setCommentContent("");
            fetchComments();
        } catch (err) {
            message.error(err.response?.data?.message || "Bạn cần đăng nhập để bình luận");
        } finally {
            setCommentSubmitting(false);
        }
    };

    const formatDistanceToNow = (date) => {
        try {
            return formatDistanceToNowStrict(new Date(date), { addSuffix: false, locale: vi }).replace('trước', '').trim();
        } catch (e) { return "vừa xong"; }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN", { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const calculateReadTime = (content) => {
        if (!content) return 0;
        const wordCount = content.split(/\s+/g).length;
        return Math.ceil(wordCount / 200);
    };

    const handleToggleSave = async () => {
        if (!post) return;
        try {
            setSaving(true);
            const res = await userAPI.savePostApi(post._id);
            const status = res.data?.status || res.status;
            if (status === 'saved' || res.data?.message?.includes("Đã lưu")) {
                setSaved(true);
                message.success("Đã thêm vào danh sách yêu thích!");
            } else {
                setSaved(false);
                message.success("Đã bỏ yêu thích.");
            }
        } catch (error) { message.error("Lỗi thao tác yêu thích."); } finally { setSaving(false); }
    };

    const fetchComments = async () => {
        if (!slug) return;
        try {
            setCommentLoading(true);
            const res = await postAPI.getCommentByPost(slug, { page, limit });
            setComments(res.data || []);
            setCommentTotal(res.pagination?.total || 0);
        } catch (error) { message.error("Lỗi tải bình luận"); } finally { setCommentLoading(false); }
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
        } catch (error) { console.log("Chưa đăng nhập"); }
    };

    useEffect(() => {
        const fetchPostDetail = async () => {
            if (!slug) return;
            try {
                setLoading(true);
                const res = await postAPI.getPostDetail(slug);
                const postData = res.data.data || res.data;
                setPost(postData);
                if (postData && postData._id) checkUserSavedStatus(postData._id);
            } catch (error) { message.error("Lỗi tải bài viết"); } finally { setLoading(false); }
        };
        fetchPostDetail();
    }, [slug]);

    useEffect(() => { fetchComments(); }, [slug, page, limit]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    if (!post) return <div style={{ textAlign: 'center', marginTop: 100 }}><Title level={3}>Không tìm thấy bài viết</Title></div>;

    return (
        <Content style={{ padding: "clamp(15px, 3vw, 40px) 20px", maxWidth: 1200, margin: "0 auto", backgroundColor: "#fff" }}>
            <div style={{ marginBottom: 30 }}>
                <Title level={1} className="post-title-responsive" style={{ margin: "10px 0 25px 0", fontWeight: 700 }}>
                    {post.title}
                </Title>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <Space size={16}>
                        <Avatar size={54} src={post.author?.avatar} icon={<UserOutlined />} />
                        <div>
                            <Text strong style={{ display: 'block', fontSize: 16 }}>{post.author?.username || "Tác giả"}</Text>
                            <Space split={<Divider type="vertical" />} style={{ color: '#8c8c8c', fontSize: 13 }}>
                                <span>{formatDate(post.createdAt)}</span>
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
                            style={{}}
                        >
                            {saved ? "Đã yêu thích" : "Yêu thích"}
                        </Button>
                    </Space>
                </div>
            </div>

            <Row gutter={[48, 24]}>
                <Col xs={24} lg={16}>
                    <div
                        className="article-content"
                        style={{ fontSize: 18, lineHeight: 1.8, color: '#292929', textAlign: 'justify' }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <Divider style={{ margin: "40px 0" }} />

                    <div id="comments">
                        <Title level={4}><MessageOutlined style={{ marginRight: 8 }} />Bình luận ({commentTotal})</Title>

                        <Card style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #f0f0f0' }} bodyStyle={{ padding: '12px' }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                <Avatar src={user.avatar} icon={<UserOutlined />} style={{ flexShrink: 0 }} />
                                <div style={{ flex: 1, backgroundColor: "#f0f2f5", borderRadius: "20px", padding: "4px 12px" }}>
                                    <Input.TextArea
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        placeholder={`Bình luận dưới tên ${user.username || 'người dùng'}`}
                                        autoSize={{ minRows: 1, maxRows: 10 }}
                                        variant="borderless"
                                        style={{
                                            width: "100%", padding: "8px 0", backgroundColor: "transparent",
                                            fontSize: "14px", color: "#000", resize: "none",
                                            overflow: "hidden", scrollbarWidth: "none", msOverflowStyle: "none"
                                        }}
                                    />
                                </div>
                                <Button
                                    type="primary"
                                    onClick={handleSubmitComment}
                                    loading={commentSubmitting}
                                    disabled={!commentContent.trim()}
                                    style={{ borderRadius: '18px', alignSelf: 'center' }}
                                >
                                    Gửi
                                </Button>
                            </div>
                        </Card>

                        <List
                            loading={commentLoading}
                            dataSource={comments}
                            renderItem={(item) => (
                                <div style={{ display: 'flex', marginBottom: 20 }}>
                                    <Avatar src={item.user?.avatar} size={40} style={{ marginRight: 12, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ backgroundColor: '#f0f2f5', padding: '8px 12px', borderRadius: '18px', display: 'inline-block', maxWidth: '100%' }}>
                                            <Text strong style={{ fontSize: '14px' }}>{item.user?.username}</Text>
                                            <div style={{ fontSize: '14px', marginTop: '2px', wordBreak: 'break-word' }}>{item.content}</div>
                                        </div>
                                        <div style={{ marginLeft: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <Text type="secondary" strong style={{ cursor: 'pointer', fontSize: '12px' }}>Thích</Text>
                                            <Text type="secondary" strong style={{ cursor: 'pointer', fontSize: '12px' }}>Trả lời</Text>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>{formatDistanceToNow(item.createdAt)}</Text>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                            <AppPagination total={commentTotal} defaultPageSize={limit} />
                        </div>
                    </div>
                </Col>

                <Col xs={24} lg={8}>
                    <div style={{ position: 'sticky', top: 20 }}>
                        <Card bordered={false} style={{ background: '#fafafa', marginBottom: 20, borderRadius: 12 }}>
                            <div style={{ textAlign: 'center' }}>
                                <Avatar size={80} src={post.author?.avatar} icon={<UserOutlined />} style={{ marginBottom: 15 }} />
                                <Title level={4} style={{ margin: 0 }}>{post.author?.username}</Title>
                                <Paragraph type="secondary" style={{ marginTop: 15 }}>{post.author?.bio || "Người viết lách đầy tâm huyết."}</Paragraph>
                            </div>
                        </Card>
                        <Card title="Thống kê bài viết" size="small" style={{ borderRadius: 12 }}>
                            <Row style={{ textAlign: 'center' }}>
                                <Col span={12}><Statistic title="Lượt xem" value={post.stats?.views || 0} prefix={<EyeOutlined />} valueStyle={{ fontSize: 18 }} /></Col>
                                <Col span={12}><Statistic title="Yêu thích" value={post.stats?.likes || 0} prefix={<HeartOutlined />} valueStyle={{ fontSize: 18 }} /></Col>
                            </Row>
                        </Card>
                    </div>
                </Col>
            </Row>

            <style>{`
                .post-title-responsive { font-size: clamp(1.8rem, 4vw, 2.5rem) !important; }
                textarea::-webkit-scrollbar { display: none; }
                @media (max-width: 768px) {
                    .article-content { font-size: 16px !important; text-align: left !important; line-height: 1.7 !important; }
                    .post-title-responsive { font-size: 1.6rem !important; }
                }
            `}</style>
        </Content>
    );
};

export default PostDetail;