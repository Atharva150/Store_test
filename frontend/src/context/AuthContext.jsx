import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load authentication from localStorage on app startup
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } else {
                // Clean up incomplete authentication data
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        } catch (error) {
            console.error("Failed to load authentication data:", error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Login
    const login = (jwtToken, userData) => {
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(jwtToken);
        setUser(userData);
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,

        login,
        logout,

        isAuthenticated: Boolean(token && user),

        role: user?.role || null,

        isAdmin: user?.role === "ADMIN",
        isOwner: user?.role === "OWNER",
        isUser: user?.role === "USER",

        setUser,
        setToken,
    };

    // Prevent rendering until auth has been restored
    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }

    return context;
};