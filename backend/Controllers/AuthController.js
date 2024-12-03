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
        console.log("Login request received:", req.body); // Log incoming request

        const { email, password } = req.body;

        if (!email || !password) {
            console.warn("Missing email or password"); // Warn about missing fields
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        console.log("User lookup result:", user); // Log user lookup result

        const errorMsg = "Auth failed: email or password is wrong";
        if (!user) {
            console.warn("User not found for email:", email); // Warn if user not found
            return res.status(403).json({
                message: errorMsg,
                success: false
            });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isPassEqual); // Log password check result

        if (!isPassEqual) {
            console.warn("Incorrect password for email:", email); // Warn about incorrect password
            return res.status(403).json({
                message: errorMsg,
                success: false
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables"); // Log missing JWT secret
            throw new Error("Missing JWT_SECRET in environment");
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        console.log("JWT token generated successfully"); // Log JWT generation

        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (err) {
        console.error("Internal server error:", err); // Log the error
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};



module.exports = { 
    signup,
    login


}