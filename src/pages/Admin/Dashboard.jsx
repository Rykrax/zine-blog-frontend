import React from "react";
import { Row, Col, Card, Statistic, List, Avatar, Typography } from "antd";
import {
    UserOutlined,
    FileTextOutlined,
    CommentOutlined,
    EyeOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export const Dashboard = () => {
    const stats = {
        users: 128,
        posts: 56,
        comments: 342,
        views: 12540
    };

    const topPosts = [
        { id: 1, title: "Học React từ cơ bản", views: 3200, comments: 45 },
        { id: 2, title: "NodeJS & Express Best Practice", views: 2700, comments: 32 },
        { id: 3, title: "RESTful API là gì?", views: 1900, comments: 21 }
    ];

    const recentUsers = [
        { id: 1, username: "rykrax", email: "rykrax@gmail.com" },
        { id: 2, username: "admin01", email: "admin01@gmail.com" },
        { id: 3, username: "user_test", email: "user@gmail.com" }
    ];

    const recentComments = [
        { id: 1, content: "Bài viết rất hay", user: "rykrax" },
        { id: 2, content: "Mình chưa hiểu phần slug", user: "user_test" },
        { id: 3, content: "Cảm ơn tác giả!", user: "admin01" }
    ];

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
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.title}
                                        description={
                                            <Text type="secondary">
                                                👁 {item.views} views · 💬 {item.comments} comments
                                            </Text>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="👤 New Users">
                        <List
                            dataSource={recentUsers}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
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
                                <List.Item>
                                    <Text strong>{item.user}:</Text>
                                    <Text style={{ marginLeft: 8 }}>
                                        {item.content}
                                    </Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
