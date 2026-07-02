import api from "./api";

const login = async (credentials) => {
    try {
        const response = await api.post(
            "/auth/login",
            credentials
        );

        if (!response.data?.token || !response.data?.user) {
            throw new Error("Invalid login response from server.");
        }

        return response.data;

    } catch (error) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Login failed."
        );

    }
};

const signup = async (userData) => {
    try {
        const response = await api.post(
            "/auth/signup",
            userData
        );

        return response.data;

    } catch (error) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Signup failed."
        );

    }
};

const updatePassword = async (passwordData) => {
    try {
        const response = await api.patch(
            "/auth/password",
            passwordData
        );

        return response.data;

    } catch (error) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Password update failed."
        );
    }
};

export default {
    login,
    signup,
    updatePassword,
};