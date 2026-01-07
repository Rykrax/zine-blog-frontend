import { Layout, Menu, Dropdown, Avatar, Button, Space, Typography } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    LoginOutlined,
    LockOutlined,
    CaretDownOutlined,
    DashboardOutlined,
    KeyOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const { user, loading, logout } = useAuth();

    const guestMenu = {
        items: [
            {
                key: "login",
                label: "Đăng nhập",
                icon: <LoginOutlined />,
                onClick: () => navigate("/login")
            },
            {
                key: "register",
                label: "Đăng ký",
                onClick: () => navigate("/register")
            }
        ]
    };

    const userMenu = {
        items: [
            {
                key: "profile",
                label: "Thông tin cá nhân",
                icon: <UserOutlined />,
                onClick: () => navigate("/profile")
            },
            ...(user?.role === 'admin'
                ? [
                    {
                        key: "admin",
                        label: "Trang quản trị",
                        icon: <LockOutlined />,
                        onClick: () => navigate("/admin")
                    }
                ]
                : []),
            {
                key: "changePassword",
                label: "Đổi mật khẩu",
                icon: <KeyOutlined />,
                onClick: () => navigate("/change-password")
            },
            {
                type: "divider"
            },
            {
                key: "logout",
                label: "Đăng xuất",
                icon: <LogoutOutlined />,
                danger: true,
                onClick: logout
            }
        ]
    };

    return (
        <Header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
                height: 64,
                borderBottom: "1px solid #eee",
                padding: "0 50px",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img
                            // src="/img/logo.png"
                            src="/vite.svg"
                            alt="logo"
                            style={{ height: 36, display: "block" }}
                        />
                        <Typography.Text strong style={{ fontSize: 18 }}>
                            Zine Blog
                        </Typography.Text>
                    </div>
                </Link>
            </div>

            <div>
                {!loading && (
                    !user ? (
                        <Dropdown menu={guestMenu} trigger={["click"]}>
                            <Button type="text" icon={<UserOutlined />}>
                                Tài khoản <CaretDownOutlined />
                            </Button>
                        </Dropdown>
                    ) : (
                        <Dropdown menu={userMenu} trigger={["click"]} placement="bottomRight">
                            <Space
                                style={{
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                }}
                            >
                                <Avatar src={user?.avatar} icon={<UserOutlined />} />
                                <Typography.Text>{user?.username}</Typography.Text>
                                <CaretDownOutlined style={{ fontSize: 12, color: "#8c8c8c" }} />
                            </Space>
                        </Dropdown>
                    )
                )}
            </div>
        </Header>
    );
};

export default AppHeader;
