import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
    Layout, Typography, Avatar, Space, Button, Divider, Spin,
    Card, Row, Col, Statistic, message, Tooltip, Input, Dropdown
} from "antd";
import {
    UserOutlined, CalendarOutlined, EyeOutlined, ShareAltOutlined,
    HeartOutlined, HeartFilled, MessageOutlined, MoreOutlined,
    BookOutlined, ClockCircleOutlined
} from "@ant-design/icons";

import { userAPI } from "../../routes/user.api.jsx";
import { userApi } from "../../routes/auth.api.jsx";
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
            console.log("save post:", res);
            const status = res.data?.status || res.status;
            if (status === 'saved' || res.data?.message?.includes("Đã lưu")) {
                setSaved(true);
                setPost(prev => ({
                    ...prev,
                    stats: {
                        ...prev.stats,
                        likes: (prev.stats?.likes || 0) + 1
                    }
                }));
                message.success("Đã thêm vào danh sách yêu thích!");
            } else {
                setSaved(false);
                setPost(prev => ({
                    ...prev,
                    stats: {
                        ...prev.stats,
                        likes: Math.max(0, (prev.stats?.likes || 0) - 1)
                    }
                }));
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

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Spin size="large" />
        </div>
    );

    if (!post) return (
        <div style={{ textAlign: 'center', marginTop: 100, background: '#f0f2f5', minHeight: '100vh', paddingTop: 60 }}>
            <Title level={3}>Không tìm thấy bài viết</Title>
        </div>
    );

    const shareItems = [
        { key: '1', label: 'Chia sẻ lên Facebook' },
        { key: '2', label: 'Chia sẻ lên Twitter' },
        { key: '3', label: 'Sao chép liên kết' }
    ];

    return (
        <Content style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px 0' }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: '0 16px' }}>
                <Row gutter={[24, 24]}>
                    {/* Main Content */}
                    <Col xs={24} lg={17}>
                        {/* Post Card */}
                        <Card
                            style={{
                                borderRadius: 12,
                                marginBottom: 16,
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
                                border: 'none'
                            }}
                        >
                            {/* Author Info */}
                            <div style={{ marginBottom: 24 }}>
                                <Space size={12} align="start">
                                    <Avatar
                                        size={48}
                                        src={post.author?.avatar}
                                        icon={<UserOutlined />}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div>
                                            <Text strong style={{ fontSize: 15, cursor: 'pointer' }}>
                                                {post.author?.username || "Tác giả"}
                                            </Text>
                                        </div>
                                        <Space size={8} style={{ fontSize: 13, color: '#65676b' }}>
                                            <span>{formatDistanceToNow(post.createdAt)} trước</span>
                                            {/* <span>•</span> */}
                                            {/* <ClockCircleOutlined style={{ fontSize: 12 }} /> */}
                                            {/* <span>{calculateReadTime(post.content)} phút đọc</span> */}
                                        </Space>
                                    </div>
                                    {/* <Button
                                        type="text"
                                        icon={<MoreOutlined />}
                                        style={{ color: '#65676b' }}
                                    /> */}
                                </Space>
                            </div>

                            {/* Post Title */}
                            <Title
                                level={1}
                                className="post-title-responsive"
                                style={{
                                    marginTop: 0,
                                    marginBottom: 20,
                                    fontWeight: 700,
                                    lineHeight: 1.3,
                                    color: '#050505'
                                }}
                            >
                                {post.title}
                            </Title>

                            <Divider style={{ margin: '20px 0' }} />

                            {/* Post Content */}
                            <div
                                className="article-content"
                                style={{
                                    fontSize: 17,
                                    lineHeight: 1.8,
                                    color: '#1c1e21',
                                    marginBottom: 24
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            <Divider style={{ margin: '24px 0' }} />

                            {/* ActionButtons */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Button
                                    type="text"
                                    icon={saved ? <HeartFilled style={{ color: '#e4405f' }} /> : <HeartOutlined />}
                                    onClick={handleToggleSave}
                                    loading={saving}
                                    style={{
                                        flex: 1,
                                        color: saved ? '#e4405f' : '#65676b',
                                        fontWeight: 600,
                                        height: 40,
                                        borderRadius: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    className="hover-button"
                                >
                                    {saved ? "Bỏ yêu thích" : "Yêu thích"}
                                </Button>
                                <Button
                                    type="text"
                                    icon={<MessageOutlined />}
                                    style={{
                                        flex: 1,
                                        color: '#65676b',
                                        fontWeight: 600,
                                        height: 40,
                                        borderRadius: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    className="hover-button"
                                    onClick={() => document.getElementById('comment-input')?.focus()}
                                >
                                    Bình luận
                                </Button>
                                <Dropdown menu={{ items: shareItems }} trigger={['click']}>
                                    <Button
                                        type="text"
                                        icon={<ShareAltOutlined />}
                                        style={{
                                            flex: 1,
                                            color: '#65676b',
                                            fontWeight: 600,
                                            height: 40,
                                            borderRadius: 8,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        className="hover-button"
                                    >
                                        Chia sẻ
                                    </Button>
                                </Dropdown>
                            </div>
                        </Card>

                        {/* Comments Section */}
                        <Card
                            style={{
                                borderRadius: 12,
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
                                border: 'none'
                            }}
                        >
                            <Title level={5} style={{ marginBottom: 20, fontSize: 17, fontWeight: 700 }}>
                                Tất cả bình luận ({commentTotal})
                            </Title>

                            {/* Comment Input */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <Avatar
                                        src={user.avatar}
                                        icon={<UserOutlined />}
                                        size={40}
                                        style={{ flexShrink: 0 }}
                                    />
                                    <div style={{
                                        flex: 1,
                                        backgroundColor: "#f0f2f5",
                                        borderRadius: "20px",
                                        border: '1px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                        className="comment-input-wrapper"
                                    >
                                        <Input.TextArea
                                            id="comment-input"
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            placeholder={`Viết bình luận với tư cách ${user.username || 'người dùng'}...`}
                                            autoSize={{ minRows: 1, maxRows: 10 }}
                                            variant="borderless"
                                            style={{
                                                width: "100%",
                                                padding: "10px 16px",
                                                backgroundColor: "transparent",
                                                fontSize: "15px",
                                                color: "#050505",
                                                resize: "none"
                                            }}
                                            styles={{
                                                textarea: {
                                                    scrollbarWidth: "none",
                                                    msOverflowStyle: "none"
                                                }
                                            }}
                                            onPressEnter={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSubmitComment();
                                                }
                                            }}
                                        />
                                    </div>
                                    {commentContent.trim() && (
                                        <Button
                                            type="primary"
                                            onClick={handleSubmitComment}
                                            loading={commentSubmitting}
                                            style={{
                                                borderRadius: '20px',
                                                fontWeight: 600,
                                                height: 40,
                                                padding: '0 24px'
                                            }}
                                        >
                                            Gửi
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Comments List */}
                            <div style={{ opacity: commentLoading ? 0.5 : 1 }}>
                                {commentLoading && (
                                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                        <Spin />
                                    </div>
                                )}
                                {comments.map((item) => (
                                    <div key={item._id} style={{ display: 'flex', marginBottom: 20 }}>
                                        <Avatar
                                            src={item.user?.avatar}
                                            size={40}
                                            style={{ marginRight: 12, flexShrink: 0, cursor: 'pointer' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                backgroundColor: '#f0f2f5',
                                                padding: '10px 14px',
                                                borderRadius: '18px',
                                                display: 'inline-block',
                                                maxWidth: '100%',
                                                wordBreak: 'break-word'
                                            }}>
                                                <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: 2 }}>
                                                    {item.user?.username}
                                                </Text>
                                                <div style={{ fontSize: '15px', lineHeight: 1.4 }}>
                                                    {item.content}
                                                </div>
                                            </div>
                                            <div style={{
                                                marginLeft: 14,
                                                marginTop: 6,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px'
                                            }}>
                                                <Text
                                                    strong
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                        color: '#65676b',
                                                        fontWeight: 600
                                                    }}
                                                    className="action-text"
                                                >
                                                    Thích
                                                </Text>
                                                {/* <Text
                                                    strong
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                        color: '#65676b',
                                                        fontWeight: 600
                                                    }}
                                                    className="action-text"
                                                >
                                                    Trả lời
                                                </Text> */}
                                                <Text style={{ fontSize: '13px', color: '#65676b' }}>
                                                    {formatDistanceToNow(item.createdAt)}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {commentTotal > limit && (
                                <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                                    <AppPagination total={commentTotal} defaultPageSize={limit} />
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* Sidebar */}
                    <Col xs={24} lg={7}>
                        <div style={{ position: 'sticky', top: 20 }}>
                            {/* Author Card */}
                            <Card
                                title={
                                    <span style={{ fontSize: 17, fontWeight: 700, display: 'block', textAlign: 'center' }}>
                                        Thông tin tác giả
                                    </span>
                                }
                                style={{
                                    borderRadius: 12,
                                    marginBottom: 16,
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
                                    border: 'none'
                                }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <Avatar
                                        size={80}
                                        src={post.author?.avatar}
                                        icon={<UserOutlined />}
                                        style={{ marginBottom: 16, cursor: 'pointer' }}
                                    />
                                    <Title level={5} style={{ margin: 0, marginBottom: 8, fontSize: 17 }}>
                                        {post.author?.username}
                                    </Title>
                                    <Paragraph
                                        type="secondary"
                                        style={{
                                            marginBottom: 0,
                                            fontSize: 14,
                                            color: '#65676b'
                                        }}
                                    >
                                        {post.author?.bio || "Người viết lách đầy tâm huyết."}
                                    </Paragraph>
                                </div>
                            </Card>

                            {/* Stats Card */}
                            <Card
                                title={
                                    <span style={{ fontSize: 17, fontWeight: 700 }}>
                                        Thống kê
                                    </span>
                                }
                                style={{
                                    borderRadius: 12,
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
                                    border: 'none'
                                }}
                            >
                                <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        background: '#f0f2f5',
                                        borderRadius: 8
                                    }}>
                                        <Space>
                                            <EyeOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                                            <Text strong style={{ fontSize: 15 }}>Lượt xem</Text>
                                        </Space>
                                        <Text strong style={{ fontSize: 18 }}>
                                            {post.stats?.views || 0}
                                        </Text>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        background: '#f0f2f5',
                                        borderRadius: 8
                                    }}>
                                        <Space>
                                            <HeartFilled style={{ fontSize: 20, color: '#e4405f' }} />
                                            <Text strong style={{ fontSize: 15 }}>Yêu thích</Text>
                                        </Space>
                                        <Text strong style={{ fontSize: 18 }}>
                                            {post.stats?.likes || 0}
                                        </Text>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        background: '#f0f2f5',
                                        borderRadius: 8
                                    }}>
                                        <Space>
                                            <MessageOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                                            <Text strong style={{ fontSize: 15 }}>Bình luận</Text>
                                        </Space>
                                        <Text strong style={{ fontSize: 18 }}>
                                            {commentTotal}
                                        </Text>
                                    </div>
                                </Space>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>

            <style>{`
                .post-title-responsive { 
                    font-size: clamp(1.8rem, 4vw, 2.5rem) !important; 
                }
                
                textarea::-webkit-scrollbar { 
                    display: none; 
                }
                
                .hover-button:hover {
                    background-color: #f0f2f5 !important;
                }
                
                .action-text:hover {
                    text-decoration: underline;
                }
                
                .comment-input-wrapper:focus-within {
                    border-color: #1890ff !important;
                    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
                }
                
                .article-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 16px 0;
                }
                
                .article-content p {
                    margin-bottom: 16px;
                }
                
                .article-content h1,
                .article-content h2,
                .article-content h3 {
                    margin-top: 24px;
                    margin-bottom: 16px;
                    font-weight: 700;
                }
                
                @media (max-width: 768px) {
                    .article-content { 
                        font-size: 16px !important; 
                        line-height: 1.7 !important; 
                    }
                    .post-title-responsive { 
                        font-size: 1.6rem !important; 
                    }
                }
            `}</style>
        </Content>
    );
};

export default PostDetail;