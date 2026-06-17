const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

//req.user.role

const getAllUsers = async (req,res) => {
    try {
        const [query] = await db.query(
            "select name, email, role, created_at, updated_at from users"
        )

        return res.status(200).json({
            message : "Get Users List Successfully",
            user : query,
        })
    }
    catch (e) {
        return res.status(500).json({
            message : "Failed To get Users List",
            error : e,
        })
    }
};

module.exports = {
    getAllUsers,
}