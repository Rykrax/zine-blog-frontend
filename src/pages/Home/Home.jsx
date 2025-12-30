import { Button, Flex } from "antd";
import { useAuth } from '../../providers/AuthProvider.jsx';


const HomePage = () => {
    const { logout } = useAuth();
    const handleLogout = async () => {
        await logout();
    }

    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: "100vh" }}
        >
            <Button onClick={handleLogout} danger type="primary">
                Đăng xuất
            </Button>
        </Flex>
    );
};

export default HomePage;
