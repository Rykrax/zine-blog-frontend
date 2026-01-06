import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";

const { Content } = Layout;

const MainLayout = () => {
    return (
        <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
            <AppHeader />
            <Content style={{ padding: "24px 50px" }}>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default MainLayout;
