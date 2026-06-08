const db = require("../config/db");

// req.body       = ข้อมูลจาก body เช่น POST/PUT
// req.params     = ค่าจาก URL เช่น /events/:id
// req.query      = ค่าหลัง ? เช่น /events?page=1
// req.user       = ข้อมูลจาก token ที่ middleware ใส่ให้

const getEventList = async (req, res) => {
    try {
        const userId = req.user.id

        if (!userId) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const [selectRows] = await db.query(
            "SELECT * from events WHERE is_deleted = '0'"
        );

        return res.status(200).json({
            message: "Get Event List Successfully",
            events: selectRows,
        });

    }
    catch (error) {
        return res.status(500).json({
            message: "Get event failed",
            error: error.message,
        });
    }
};

const getEventId = async (req, res) => {
    try {
        const userId = req.user.id

        if (!userId) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const eventId = req.params.id;

        const [selectedRow] = await db.query(
            "Select * from events where id = ?", [eventId]
        );

        if (!selectedRow[0]) {
            return res.status(404).json({
                message: `Event Id ${eventId} not found`
            })
        }

        return res.status(200).json({
            message: `Get Event Id ${eventId} Successfully`,
            event: selectedRow,
        });
    }
    catch (error) {
        const eventId = req.params.id;

        return res.status(500).json({
            message: `Failed to Get Event Id ${eventId}`,
            error: error.message
        })
    }

};

const createEvent = async (req, res) => {
    try {
        const userId = req.user.id;

        const { title, description, location, event_date } = req.body;

        const [rows] = await db.query( //ดึงข้อมูลผู้ใช้จาก token
            "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?",
            [userId]
        );

        const createBy = rows[0].name;

        if (!createBy) {
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
    const userId = req.user.id

    if (!userId) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    const eventId = req.params.id;

    try {
        const { title, description, location, event_date } = req.body;

        const [selectedEvent] = await db.query(
            "SELECT * FROM events WHERE id = ?",
            [eventId]
        );

        const event = selectedEvent[0];

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        if (event.created_by !== req.user.name) {
            return res.status(403).json({
                message: "You are not allowed to update this event",
            });
        }

        if (!title || !event_date) {
            return res.status(400).json({
                message: "Title and event date are required",
            });
        }

        const [updateRow] = await db.query(
            "UPDATE events SET title = ?, description = ?, location = ?, event_date = ?",
            [title, description, location, event_date]
        )

        const [selectedUpdate] = await db.query(
            "SELECT * FROM events WHERE id = ?",
            [eventId]
        );

        const updatedEvent = selectedUpdate[0];

        return res.status(200).json({
            message: "Event updated successfully",
            event: updatedEvent,
        });


    }
    catch (error) {
        return res.status(500).json({
            message: `Failed to Update Event Id ${eventId}`
        })
    }

};

const deleteEvent = async (req, res) => {
    const userId = req.user.id

    if (!userId) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    const eventId = req.params.id;
    try {
        const [selectedEvent] = await db.query(
            "SELECT * FROM events WHERE id = ?",
            [eventId]
        );

        if (!selectedEvent[0]) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        const [deleteEvent] = await db.query(
            "UPDATE events SET is_deleted = ? WHERE id = ?", [eventId, true]
        );

        const [selectDeleteEvent] = await db.query(
            "Select * From events Where id = ?", [eventId]
        )

        const eventResponse = selectDeleteEvent[0];

        return res.status(200).json({
            message : `Delete Event Id ${eventId} Successfully`,
            event : eventResponse,
        });
    }
    catch (error){
        return res.status(500).json({
            message : `Falied to Delete Event Id ${eventId}`,
            error : error.message,
        });
    }
};

module.exports = {
    getEventList,
    getEventId,
    createEvent,
    updateEvent,
    deleteEvent
}