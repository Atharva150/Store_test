import api from "./api";

const getDashboard = async () => {
    try {
        const response = await api.get(
            "/owner/dashboard"
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to fetch owner dashboard" }
        );
    }
};

// const getMyStore = async () => {
//     try {
//         const response = await api.get(
//             "/owner/store"
//         );
//         return response.data;
//     } catch (error) {
//         throw (
//             error.response?.data ||
//             { message: "Failed to fetch store details" }
//         );
//     }
// };

const getStoreRatings = async () => {
    try {
        const response = await api.get(
            "/owner/ratings"
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to fetch ratings" }
        );
    }
};

const getRatingUsers = async () => {
    try {
        const response = await api.get(
            "/owner/ratings/users"
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to fetch rating users" }
        );
    }
};

const getAverageRating = async () => {
    try {
        const response = await api.get(
            "/owner/average-rating"
        );
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||
            { message: "Failed to fetch average rating" }
        );
    }
};

export default {
    getDashboard,
    // getMyStore,
    getStoreRatings,
    getRatingUsers,
    getAverageRating,
};
