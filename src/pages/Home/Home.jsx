import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Card,
    Row,
    Col,
    Typography,
    Spin,
    Avatar,
    Space
} from "antd";
import {
    EyeOutlined,
    HeartFilled,
    HeartOutlined,
    MessageOutlined,
    UserOutlined
} from "@ant-design/icons";

import AppPagination from "@/components/Pagination";
import { displayPage } from "@/utils/pageDetail";
import { postAPI } from "@/routes/post.api";

const { Title, Text } = Typography;

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    useEffect(() => {
        fetchPosts();
    }, [page, limit]);

    const handleCardClick = (fullSlug) => {
        navigate(`/post/${fullSlug}`);
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await postAPI.getPosts({ page, limit });
            setPosts(res.data || []);
            setTotal(res.pagination?.total || 0);
        } catch (error) {
            console.error("Lỗi khi lấy bài viết:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <Title level={2} style={{ marginBottom: 24, marginTop: 0 }}>
                Danh sách bài viết
            </Title>

            <Row gutter={[24, 24]}>
                {posts.map((post) => (
                    <Col span={24} key={post._id}>
                        <Card
                            hoverable
                            onClick={() => handleCardClick(post.fullSlug)}
                            style={{ borderRadius: 8, cursor: "pointer" }}
                            styles={{
                                body: {
                                    padding: 20
                                }
                            }}
                        >
                            <Row gutter={[24, 16]} align="middle">
                                {/* ẢNH PC */}
                                <Col xs={0} sm={8} md={6} lg={5} xl={4}>
                                    <div
                                        style={{
                                            height: 140,
                                            borderRadius: 6,
                                            overflow: "hidden",
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #f0f0f0"
                                        }}
                                    >
                                        {post.thumbnail ? (
                                            <img
                                                src={post.thumbnail}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    height: "100%",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "#ccc"
                                                }}
                                            >
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                {/* NỘI DUNG */}
                                <Col xs={24} sm={16} md={18} lg={19} xl={20}>
                                    {/* AVATAR */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 8,
                                            flexWrap: "wrap"
                                        }}
                                    >
                                        <Avatar
                                            src={post.author?.avatar}
                                            icon={<UserOutlined />}
                                            size="small"
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text strong style={{ marginRight: 8 }}>
                                            {post.author?.username || "Người dùng"}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 13 }}>
                                            {displayPage.getRelativeTime(post.createdAt)}
                                            <span style={{ margin: "0 6px" }}>•</span>
                                            {displayPage.getReadingTime(post.content)}
                                        </Text>
                                    </div>

                                    {/* ẢNH MOBILE */}
                                    <Col xs={24} sm={0} style={{ padding: 0, marginBottom: 12 }}>
                                        <div
                                            style={{
                                                height: 180,
                                                borderRadius: 6,
                                                overflow: "hidden",
                                                backgroundColor: "#f5f5f5"
                                            }}
                                        >
                                            {post.thumbnail && (
                                                <img
                                                    src={post.thumbnail}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </Col>

                                    {/* TIÊU ĐỀ */}
                                    <Title
                                        level={4}
                                        style={{
                                            marginTop: 0,
                                            marginBottom: 12,
                                            lineHeight: 1.4
                                        }}
                                    >
                                        {post.title}
                                    </Title>

                                    {/* STATS */}
                                    <Space size="middle" style={{ color: "#8c8c8c" }}>
                                        <span>
                                            <EyeOutlined /> {post.stats?.views || 0}
                                        </span>
                                        <span>
                                            {(post.stats?.likes || 0) > 0 ? (
                                                <HeartFilled style={{ color: "red" }} />
                                            ) : (
                                                <HeartOutlined />
                                            )}{" "}
                                            {post.stats?.likes || 0}
                                        </span>
                                        <span>
                                            <MessageOutlined /> {post.stats?.comment_count || 0}
                                        </span>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                <AppPagination total={total} />
            </div>
        </div>
    );
};

export default HomePage;
