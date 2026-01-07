import { Divider, Layout, Menu } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    FileTextOutlined,
    SettingOutlined,
    HomeOutlined
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider width={220} theme="dark">
                <div className="logo" style={{ color: "#fff", padding: 16, fontWeight: "bold", fontSize: 20 }}>
                    Admin Dashboard
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={({ key }) => navigate(key)}
                    items={[
                        {
                            key: "/admin",
                            icon: <DashboardOutlined />,
                            label: "Dashboard"
                        },
                        {
                            key: "/admin/users",
                            icon: <UserOutlined />,
                            label: "Users"
                        },
                        {
                            key: "/admin/posts",
                            icon: <FileTextOutlined />,
                            label: "Posts"
                        },
                        {
                            key: "/admin/settings",
                            icon: <SettingOutlined />,
                            label: "Settings"
                        }
                    ]}
                />

                <div style={{ marginTop: "auto" }}>
                    <Divider style={{ background: "#434343", margin: "8px 0" }} />

                    <Menu
                        theme="dark"
                        mode="inline"
                        selectable={false}
                        onClick={() => navigate("/")}
                        items={[
                            {
                                key: "home",
                                icon: <HomeOutlined />,
                                label: "Trang chủ"
                            }
                        ]}
                    />
                </div>
            </Sider>

            <Layout>
                <Content style={{ padding: 24, background: "#f5f5f5" }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
