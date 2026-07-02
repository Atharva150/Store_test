const adminService = require("../services/adminService");


const getDashboardStats = async (req, res) => {
    try {

        const stats = await adminService.getDashboardStats();

        return res.status(200).json({
            success: true,
            data: stats,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const createUser = async (req, res) => {
    try {

        const user = await adminService.createUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: user,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

const createStore = async (req, res) => {

    try {
        console.log("BODY:", req.body);
        const store = await adminService.createStore(req.body);

        return res.status(201).json({
            success: true,
            message: "Store created successfully.",
            data: store
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {

        const users = await adminService.getAllUsers();

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


const getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await adminService.getUserById(id);

        return res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message,
        });

    }
};

const getAllStores = async (req, res) => {
    try {

        const stores = await adminService.getAllStores();

        return res.status(200).json({
            success: true,
            count: stores.length,
            data: stores,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getOwners = async (req, res) => {

    try {

        const owners = await adminService.getOwners();

        return res.status(200).json({
            success: true,
            data: owners
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const searchUsers = async (req, res) => {
    try {

        const { keyword } = req.query;

        const users = await adminService.searchUsers(keyword || "");

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const searchStores = async (req, res) => {
    try {

        const { keyword } = req.query;

        const stores = await adminService.searchStores(keyword || "");

        return res.status(200).json({
            success: true,
            count: stores.length,
            data: stores,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const deleteUser = async (req, res) => {

    try {

        await adminService.deleteUser(req.params.id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getDashboardStats,
    createUser,
    createStore,
    getAllUsers,
    getUserById,
    getAllStores,
    getOwners,
    searchUsers,
    searchStores,
    deleteUser
};

