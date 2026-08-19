const authService = require("../service/auth.service");

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        const user = await authService.registerUser({
            name, email, password
        });

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const result = await authService.loginUser({
            email,
            password,
        });

        return res.status(200).json({
            message: "Login successful",
            ...result,
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message,
        });
    }
};



const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const accessToken =
            await authService.refreshAccessToken(refreshToken);

        return res.status(200).json({
            accessToken,
        });
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }
};

module.exports = {
    register,
    login,
    refreshToken,
};