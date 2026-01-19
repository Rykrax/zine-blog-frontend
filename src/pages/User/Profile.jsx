import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Layout,
    Card,
    Avatar,
    Row,
    Col,
    Typography,
    Tag,
    Space,
    Divider,
    Statistic,
    Spin,
    Button
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    CalendarOutlined,
    EyeOutlined,
    MessageOutlined,
    HeartOutlined,
    FileTextOutlined,
    PlusOutlined,
    EditOutlined,
    HeartFilled
} from "@ant-design/icons";

import { useAuth } from "../../providers/AuthProvider";
import { userAPI } from "../../routes/user.api";
import AppPagination from "../../components/Pagination";
import { postAPI } from "@/routes/post.api";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

const PostCard = ({ post, onClick }) => (
    <Card
        hoverable
        onClick={onClick}
        styles={{ body: { padding: 16 } }}
    >
        <Row gutter={16}>
            <Col flex="auto">
                <Title level={5} style={{ marginBottom: 4 }}>
                    {post.title}
                </Title>

                <Text type="secondary">
                    Đăng ngày: {formatDate(post.createdAt)}
                </Text>

                <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8 }}>
                    {post.content}
                </Paragraph>

                <Space size="middle" style={{ color: "#8c8c8c" }}>
                    <span><EyeOutlined /> {post.stats?.views || 0}</span>
                    <span>
                        {(post.stats?.likes || 0) > 0
                            ? <HeartFilled style={{ color: "red" }} />
                            : <HeartOutlined />}
                        {" "}{post.stats?.likes || 0}
                    </span>
                    <span><MessageOutlined /> {post.stats?.comment_count || 0}</span>
                </Space>
            </Col>

            {post.thumbnail && (
                <Col>
                    <img
                        src={post.thumbnail}
                        alt="thumbnail"
                        width={120}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                </Col>
            )}
        </Row>
    </Card>
);

function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 3;

    useEffect(() => {
        if (!user?._id) return;

        const fetchProfile = async () => {
            try {
                setLoadingProfile(true);
                const res = await userAPI.getUser(user._id);

                setProfile(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [user]);

    useEffect(() => {
        if (!user?._id) return;

        const fetchPosts = async () => {
            try {
                setLoadingPosts(true);
                const res = await userAPI.getAuthorPosts({
                    page,
                    limit
                });
                // console.log(res);
                setPosts(res.data || []);
                setTotal(res.pagination?.total || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchPosts();
    }, [user, page]);

    if (loadingProfile) {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Spin size="large" />
                </Content>
            </Layout>
        );
    }

    if (!profile) {
        return <Text type="danger">Không thể tải thông tin người dùng</Text>;
    }

    return (
        <Row gutter={[24, 24]}>
            {/* PROFILE INFO */}
            <Col xs={24} md={8}>
                <Card>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <Avatar
                            size={150}
                            src={profile.avatar}
                            icon={<UserOutlined />}
                            style={{ border: "2px solid #1890ff" }}
                        />
                        <Title level={3} style={{ marginTop: 12 }}>
                            {profile.username}
                        </Title>
                        <Tag color={profile.role === "admin" ? "red" : "blue"}>
                            {profile.role?.toUpperCase()}
                        </Tag>
                    </div>

                    <Paragraph type="secondary" style={{ textAlign: "center" }}>
                        {profile.bio || "Chưa có mô tả"}
                    </Paragraph>

                    <Divider />

                    <Space orientation="vertical" style={{ width: "100%" }}>
                        <Space>
                            <MailOutlined />
                            <Text>{profile.email}</Text>
                        </Space>
                        <Space>
                            <CalendarOutlined />
                            <Text>Tham gia: {formatDate(profile.createdAt)}</Text>
                        </Space>

                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => navigate("/update-profile")}
                            style={{ display: "block", margin: "12px auto 0" }}
                        >
                            Cập nhật thông tin
                        </Button>
                    </Space>

                    <Divider />

                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                        <div style={{ flex: 1, textAlign: "center" }}>
                            <Statistic title="Bài viết" value={total} prefix={<FileTextOutlined />} />
                        </div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                            <Statistic
                                title="Yêu thích"
                                value={profile.saved_posts?.length || 0}
                                prefix={<HeartOutlined />}
                            />
                        </div>
                    </div>
                </Card>
            </Col>

            {/* POSTS */}
            <Col xs={24} md={16}>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <Card
                        title={<Title level={4}><FileTextOutlined /> Bài viết của tôi</Title>}
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => navigate("/create-post")}
                            >
                                Đăng bài
                            </Button>
                        }
                    >
                        {loadingPosts ? (
                            <Spin />
                        ) : posts.length === 0 ? (
                            <Text type="secondary">Bạn chưa có bài viết nào</Text>
                        ) : (
                            <Space orientation="vertical" style={{ width: "100%" }}>
                                {posts.map(post => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onClick={() => navigate(`/post/${post.fullSlug}`)}
                                    />
                                ))}
                            </Space>
                        )}

                        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                            <AppPagination total={total} defaultPageSize={limit} />
                        </div>
                    </Card>

                    <Card title={<Title level={4}><HeartOutlined /> Bài viết yêu thích</Title>}>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            {(profile.saved_posts || []).map(post => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onClick={() => navigate(`/post/${post.slug}-${post._id}`)}
                                />
                            ))}
                        </Space>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
}

export default Profile;
