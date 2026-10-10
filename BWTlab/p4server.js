const fs = require("fs");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// Read SQL file
const sql = fs.readFileSync("./schema.sql", "utf8");

// Create/Open Database
const db = new sqlite3.Database("users.db", (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Execute schema.sql
db.exec(sql, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Database initialized successfully.");
    }
});

// Read Users with Pagination
app.get("/read", (req, res) => {

    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;

    const paginationQuery = `
        SELECT *
        FROM users
        LIMIT ?
        OFFSET ?;
    `;

    db.all(paginationQuery, [limit, offset], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.status(200).json(rows);
    });
});

// Start Server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});