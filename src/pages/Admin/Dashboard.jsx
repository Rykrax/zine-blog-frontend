import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, List, Avatar, Typography, Spin } from "antd";
import {
    UserOutlined,
    FileTextOutlined,
    CommentOutlined,
    EyeOutlined
} from "@ant-design/icons";
import { adminAPI } from "../../routes/admin.api";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        users: 0,
        posts: 0,
        comments: 0,
        views: 0
    });
    const [topPosts, setTopPosts] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentComments, setRecentComments] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getStats();
            const data = res.data;
            setStats(data.stats);
            setTopPosts(data.topPosts);
            setRecentUsers(data.recentUsers);
            setRecentComments(data.recentComments);
        } catch (err) {
            console.error("Error fetching stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: 24, textAlign: "center" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Dashboard</Title>

            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Users"
                            value={stats.users}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Posts"
                            value={stats.posts}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Comments"
                            value={stats.comments}
                            prefix={<CommentOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Views"
                            value={stats.views}
                            prefix={<EyeOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={12}>
                    <Card title="Top Posts">
                        <List
                            dataSource={topPosts}
                            renderItem={(item) => (
                                <List.Item
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/post/${item.fullSlug}`)}
                                >
                                    <List.Item.Meta
                                        title={item.title}
                                        description={
                                            <Text type="secondary">
                                                <EyeOutlined /> {item.views} views · <CommentOutlined /> {item.comments} comments
                                            </Text>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="New Users">
                        <List
                            dataSource={recentUsers}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} icon={<UserOutlined />} />}
                                        title={item.username}
                                        description={item.email}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="💬 Recent Comments">
                        <List
                            dataSource={recentComments}
                            renderItem={(item) => (
                                <List.Item
                                    style={{ cursor: item.postSlug ? 'pointer' : 'default' }}
                                    onClick={() => item.postSlug && navigate(`/post/${item.postSlug}`)}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.userAvatar} icon={<UserOutlined />} />}
                                        title={<Text><Text strong>{item.user}</Text> · {item.post}</Text>}
                                        description={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
