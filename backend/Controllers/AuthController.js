const UserModel = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User with this email is already exist.', success: false });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

const login = async (req, res) => {
    try {
        // Destructure email and password from the request body
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });

        // If user not found or password incorrect, return same error message
        if (!user) {
            return res.status(403).json({
                message: "Authentication failed: email or password is wrong",
                success: false
            });
        }

        // Compare password with hashed password
        const isPassEqual = await bcrypt.compare(password, user.password);

        if (!isPassEqual) {
            return res.status(403).json({
                message: "Authentication failed: email or password is wrong", 
                success: false
            });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET || "fallback-secret-key", // Add fallback secret
            { expiresIn: "24h" }
        );

        // Set CORS headers
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Respond with success
        return res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message // Include error message for debugging
        });
    }
};



module.exports = { 
    signup,
    login


}