import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "../../utils/authorizedAxios";
import {
    Layout,
    Card,
    Avatar,
    Row,
    Col,
    Typography,
    Tag,
    List,
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
    LikeOutlined,
    MessageOutlined,
    SaveOutlined,
    HeartOutlined,
    FileTextOutlined,
    PlusOutlined,
    EditOutlined
} from "@ant-design/icons";
import { useAuth } from "../../providers/AuthProvider";
import { userAPI } from "../../routes/user.api";
import AppPagination from "../../components/Pagination";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
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
                const userRes = await userAPI.getUser(user._id);
                setProfile(userRes.data);
            } catch (error) {
                console.error("Fetch user profile error:", error);
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
                const postRes = await instance.get(import.meta.env.VITE_BASE_API + `/post/posts`, {
                    params: {
                        author: user._id,
                        page: page,
                        limit: limit
                    }
                });

                setPosts(postRes.data || []);
                setTotal(postRes.pagination?.total || 0);

            } catch (error) {
                console.error("Fetch posts error:", error);
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
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Content style={{ padding: 24 }}>
                    <Text type="danger">Không thể tải thông tin người dùng</Text>
                </Content>
            </Layout>
        );
    }

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
                <Card hoverable>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <Avatar
                            size={150}
                            src={profile.avatar}
                            icon={<UserOutlined />}
                            style={{ marginBottom: 16, border: "2px solid #1890ff" }}
                        />
                        <Title level={3} style={{ marginBottom: 0 }}>{profile.username}</Title>
                        <Tag color={profile.role === "admin" ? "red" : "blue"} style={{ marginTop: 8 }}>
                            {profile.role?.toUpperCase()}
                        </Tag>
                    </div>
                    <Paragraph type="secondary" style={{ textAlign: "center" }}>
                        {profile.bio || "Chưa có mô tả"}
                    </Paragraph>
                    <Divider />
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Space>
                            <MailOutlined style={{ color: "#1890ff" }} />
                            <Text>{profile.email}</Text>
                        </Space>

                        <Space>
                            <CalendarOutlined style={{ color: "#1890ff" }} />
                            <Text>Tham gia: {formatDate(profile.createdAt)}</Text>
                        </Space>

                        <div style={{ textAlign: "center", marginTop: 12 }}>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => navigate("/profile/edit")}
                            >
                                Cập nhật thông tin
                            </Button>
                        </div>
                    </Space>

                    <Divider />
                    <Row gutter={16} style={{ textAlign: "center" }}>
                        <Col span={12}><Statistic title="Bài viết" value={total} prefix={<FileTextOutlined />} /></Col>
                        <Col span={12}><Statistic title="Yêu thích" value={profile.saved_posts?.length || 0} prefix={<HeartOutlined />} /></Col>
                    </Row>
                </Card>
            </Col>

            <Col xs={24} md={16}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>

                    <Card
                        title={
                            <Title level={4} style={{ margin: 0 }}>
                                <FileTextOutlined /> Bài viết của tôi
                            </Title>
                        }
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
                        <List
                            loading={loadingPosts}
                            itemLayout="vertical"
                            size="large"
                            dataSource={posts}
                            locale={{ emptyText: "Bạn chưa có bài viết nào" }}
                            renderItem={(item) => (
                                <List.Item
                                    key={item._id}
                                    actions={[
                                        <IconText icon={EyeOutlined} text={item.stats?.views || 0} key="views" />,
                                        <IconText icon={LikeOutlined} text={item.stats?.likes || 0} key="likes" />,
                                        <IconText icon={MessageOutlined} text={item.stats?.comment_count || 0} key="comments" />,
                                    ]}
                                    extra={item.thumbnail && <img width={150} alt="thumbnail" src={item.thumbnail} style={{ borderRadius: 8, objectFit: "cover" }} />}
                                >
                                    <List.Item.Meta
                                        title={<a href={`/post/${item.slug}`}>{item.title}</a>}
                                        description={<Text type="secondary">Đăng ngày: {formatDate(item.createdAt)}</Text>}
                                    />
                                    <Paragraph ellipsis={{ rows: 2 }}>{item.content}</Paragraph>
                                </List.Item>
                            )}
                        />

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <AppPagination
                                total={total}
                                defaultPageSize={limit}
                            />
                        </div>
                    </Card>

                    <Card
                        title={
                            <Title level={4} style={{ margin: 0 }}>
                                <HeartOutlined /> Bài viết yêu thích
                            </Title>
                        }
                    >
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={profile.saved_posts || []}
                            locale={{ emptyText: "Chưa lưu bài viết nào" }}
                            renderItem={(item) => (
                                <List.Item
                                    key={item._id}
                                    actions={typeof item === 'object' ? [
                                        <IconText icon={EyeOutlined} text={item.stats?.views || 0} key="views" />,
                                        <IconText icon={LikeOutlined} text={item.stats?.likes || 0} key="likes" />,
                                        <IconText icon={MessageOutlined} text={item.stats?.comment_count || 0} key="comments" />,
                                    ] : []}
                                    extra={item.thumbnail && <img width={150} alt="thumbnail" src={item.thumbnail} style={{ borderRadius: 8, objectFit: "cover" }} />}
                                >
                                    <List.Item.Meta
                                        title={<a href={`/post/${item.slug}`}>{item.title || "Bài viết không tồn tại"}</a>}
                                        description={<Text type="secondary">Đăng ngày: {item.createdAt ? formatDate(item.createdAt) : "N/A"}</Text>}
                                    />
                                    <Paragraph ellipsis={{ rows: 2 }}>{item.content}</Paragraph>
                                </List.Item>
                            )}
                        />
                    </Card>

                </Space>
            </Col>
        </Row>
    );
}

export default Profile;