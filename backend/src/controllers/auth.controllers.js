const bcrypt = require("bcryptjs");
const db = require("../config/db");

const register = async (req, res) => {
    try {
        const { name , email , password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const [existingUser] = await db.query(
            "Select id From users WHERE email = ?", [email]
        )

        if (existingUser.length > 0) {
            return res.status(400).json({
                message : "Email Already Exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "Insert Into users (name, email, password_hash) values (?,?,?)", [name, email, hashedPassword]
        );

        return res.status(200).json({
            message : "User Registered Successfully",
            user : {
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

module.exports = {
    register,
}