import app from "./src/app.js";
import pool from "./config/db.js";

pool.query("SELECT NOW()")
    .then((result) => {
        console.log("Database Connected");
        console.log(result.rows[0]);
    })
    .catch((err) => {
        console.error("❌ Database Error:", err.message);
    });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})