import { Pagination } from "antd";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const AppPagination = ({
    total = 0,
    defaultPageSize = 10,
    showSizeChanger = false
}) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const currentPage = Number(searchParams.get("page")) || 1;

    const pageSize =
        Number(searchParams.get("limit")) || defaultPageSize;

    const handleChange = (page) => {
        const params = new URLSearchParams(searchParams);

        params.set("page", page);
        params.set("limit", pageSize);

        navigate(`${location.pathname}?${params.toString()}`);
    };

    if (total <= pageSize) return null;

    return (
        <div style={{ marginTop: 32, textAlign: "center" }}>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handleChange}
                showSizeChanger={showSizeChanger}
            />
        </div>
    );
};

export default AppPagination;
