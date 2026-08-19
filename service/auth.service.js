const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

       const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
        
    };
};

const loginUser = async ({email , password}) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        accessToken,
        refreshToken,
    };
};


const refreshAccessToken = async (refreshToken) => {
    if(!refreshToken){
        throw new Error("Refresh token required");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if(!user){
        throw new Error("U;ser not found");
    }

    const newAccessToken = generateAccessToken(user);

    return newAccessToken;
};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
};

