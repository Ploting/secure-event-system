const db = require("../config/db");

const getEventList = async (req, res) => {

};

const getEventId = async (req, res) => {

};

const createEvent = async (req, res) => {
    try {
        const userId = req.user.id;

        const { title, description, location, event_date } = req.body;

        const [rows] = await db.query( //ดึงข้อมูลผู้ใช้จาก token
            "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
            [userId]
        );

        const createBy = req.user.id;

        const user = rows[0];

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!title || !event_date) {
            return res.status(400).json({
                message: "Require Title and Event date"
            })
        }

        const [result] = await db.query(
            "Insert INTO events (title, description, location, event_date, created_by) VALUES (?,?,?,?,?)",
            [title, description, location, event_date, createBy]
        );

        const [eventRows] = await db.query(
            "SELECT * from events WHERE id = ?", [result.insertId]
        );

        const response = eventRows[0];

        return res.status(200).json({
            message: "Create Event Successfully",
            response,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Create event failed",
            error: error.message,
        });
    };
};

const updateEvent = async (req, res) => {

};

const deleteEvent = async (req, res) => {

};

module.exports = {
    getEventList,
    getEventId,
    createEvent,
    updateEvent,
    deleteEvent
}