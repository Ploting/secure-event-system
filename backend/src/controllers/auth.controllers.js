const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const [existingUser] = await db.query(
            "Select id From users WHERE name = ?", [name]
        )

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: "Name Already Exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "Insert Into users (name, email, password_hash) values (?,?,?)", [name, email, hashedPassword]
        );

        return res.status(200).json({
            message: "User Registered Successfully",
            user: {
                id: result.insertId,
                name,
                email,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Register failed",
            error: error.message,
        });
    }
};

const getUser = async (req, res) => {
    try {
        const [result] = await db.query(
            "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id"
        );

        return res.status(200).json({
            users: result
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Get users failed",
            error: error.message,
        });
    }
}

const login = async (req, res) => {
    try {
        const { userNameOrEmail, password } = req.body;

        if (!userNameOrEmail || !password) {
            return res.status(401).json({
                message: "Email and password are required",
            });
        }

        const [userList] = await db.query(
            "Select * from users WHERE email = ? or name = ?", [userNameOrEmail, userNameOrEmail]
        );

        const user = userList[0];

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid || !user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                name : user.name,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        return res.status(200).json({
            message: "Login Successful",
            users: {
                user: user.name,
                email: user.email
            },
            token: token
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Login Api failed",
            error: error.message,
        });
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.query(
            "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
            [userId]
        );

        const user = rows[0];

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Profile loaded successfully",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Invalid or expired token",
        });
    }
}

module.exports = {
    register,
    getUser,
    login,
    getProfile,
}