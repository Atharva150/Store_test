const authService = require("../services/authService");

const signup = async (req, res) => {

    try {
        const user = await authService.signup(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token: result.token,
            user: result.user,
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await authService.updatePassword(
            req.user.id,
            oldPassword,
            newPassword
        );
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    signup,
    login,
    updatePassword,
};

