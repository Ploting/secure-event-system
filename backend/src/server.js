require("dotenv").config(); // โหลดค่า Config จาก .env

const app = require("../src/app"); // เรียก module จาก app.js

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});