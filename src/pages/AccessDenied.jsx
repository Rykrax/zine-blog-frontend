import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0f172a"
            }}
        >
            <Result
                status="403"
                title={<span style={{ color: "#fff", fontWeight: "bold" }}>403</span>}
                subTitle={
                    <span style={{ color: "#cbd5e1" }}>
                        Bạn không có quyền truy cập vào trang này.
                    </span>
                }
                extra={[
                    <Button type="primary" key="home" onClick={() => navigate("/")}>
                        Về trang chủ
                    </Button>,
                    <Button key="back" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                ]}
            />
        </div>
    );
};

export default AccessDenied;
