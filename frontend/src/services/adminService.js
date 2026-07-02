import api from "./api";

const getDashboard = async () => {
    try {
        const response = await api.get(
            "/admin/dashboard"
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to fetch dashboard data" }
        );
    }
};

const getAllUsers = async () => {
    try {
        const response = await api.get(
            "/admin/users"
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to fetch users" }
        );
    }
};

const getOwners = async () => {

    try {

        const response = await api.get(
            "/admin/owners"
        );

        return response.data;

    } catch (error) {

        throw (
            error.response?.data ||
            {
                message: "Failed to fetch owners."
            }
        );

    }

};

const getUserById = async (id) => {
    try {
        const response = await api.get(
            `/admin/users/${id}`
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to fetch user" }
        );
    }
};

const createUser = async (userData) => {
    try {
        const response = await api.post(
            "/admin/users",
            userData
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to create user" }
        );
    }
};

const createStore = async (storeData) => {
    try {
        const response = await api.post(
            "/admin/stores",
            storeData
        );

        return response.data;

    } catch (error) {

        console.log(error.response?.data);

        throw (
            error.response?.data ||
            {
                message:"Failed to create store"
            }
        );

    }
};

const searchUsers = async (keyword) => {

    const response = await api.get(

        `/admin/users/search?keyword=${keyword}`

    );

    return response.data;

};

const searchStores = async (keyword) => {

    const response = await api.get(

        `/admin/stores/search?keyword=${keyword}`

    );

    return response.data;

};

const updateUser = async (id, userData) => {
    try {
        const response = await api.put(
            `/admin/users/${id}`,
            userData
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to update user" }
        );
    }
};

const deleteUser = async (id) => {
    try {
        const response = await api.delete(
            `/admin/users/${id}`
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to delete user" }
        );
    }
};

const getAllStores = async () => {
    try {
        const response = await api.get(
            "/admin/stores"
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to fetch stores" }
        );
    }
};

export default {
    getDashboard,
    getAllUsers,
    getUserById,
    getOwners,
    createUser,
    createStore,
    updateUser,
    deleteUser,
    getAllStores,
    searchStores,
    searchUsers
};
