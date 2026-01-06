import { Pagination } from "antd";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const AppPagination = ({
    total = 0,
    defaultPageSize = 10,
}) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const currentPage = Number(searchParams.get("page")) || 1;
    const pageSize =
        Number(searchParams.get("limit")) || defaultPageSize;

    const handleChange = (page, limit) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        params.set("limit", limit);
        navigate(`${location.pathname}?${params.toString()}`);
    };

    // if (total <= pageSize) return null;

    return (
        <div style={{ marginTop: 32, textAlign: "center" }}>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handleChange}
            />
        </div>
    );
};

export default AppPagination;
