const jwt = require("jsonwebtoken");

const adminMiddleware = async (req,res,next) => {
    if (!req.user) {
        res.status(401).json({
            message : "Authentication required"
        })
    }

    if (req.user.role !== "admin") {
        res.status(403).json({
            message : "Admin access required",
        })
    } 

    next()
};

module.exports = {
    adminMiddleware,
}