import { createContext, useContext, useEffect, useState } from "react";
import { logoutApi, userApi } from "../routes/api";

const AuthContext = createContext({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await userApi();
                setUser(res.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, []);

    const login = async () => {
        const res = await userApi();
        setUser(res.user);
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
