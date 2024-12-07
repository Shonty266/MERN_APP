const AdminModel = require('../Models/Admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user with email already exists
        const user = await AdminModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User with this email is already exist.', success: false });
        }

        // Get total number of existing users
        const totalUsers = await AdminModel.countDocuments();
        if (totalUsers >= 3) {
            return res.status(403)
                .json({ message: 'Maximum number of users (3) has been reached.', success: false });
        }

        const userModel = new AdminModel({ name, email, password });
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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        const user = await AdminModel.findOne({ email });

        const errorMsg = "Auth failed: email or password is wrong";
        if (!user) {
            return res.status(403).json({
                message: errorMsg,
                success: false
            });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);

        if (!isPassEqual) {
            return res.status(403).json({
                message: errorMsg,
                success: false
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("Missing JWT_SECRET in environment");
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};






module.exports = { 
    signup,
    login,


}