require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise");

const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");

//uploads folder exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(UPLOAD_DIR));

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

//MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "events_app",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function toSqlDateOnly(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

//delete file if exists
const safeUnlink = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to delete file:", filePath, err.message);
  }
};

/* CREATE*/
app.post("/api/events", upload.single("image"), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const startDate = toSqlDateOnly(req.body.startDate);
    const endDate = toSqlDateOnly(req.body.endDate);
    const { name, description } = req.body;
    if (!name || !description || !startDate || !endDate) {
      if (req.file) safeUnlink(req.file.path);
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await conn.execute(
      `INSERT INTO events (name, description, startDate, endDate, imageUrl) VALUES (?, ?, ?, ?, ?)`,
      [name, description, startDate, endDate, imageUrl]
    );

    const insertedId = result.insertId;
    const [rows] = await conn.execute(`SELECT * FROM events WHERE id = ?`, [
      insertedId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (req.file) safeUnlink(req.file.path);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
});

/* READ ALL */
app.get("/api/events", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(`SELECT * FROM events `);
    const formatted = rows.map((r) => ({
      ...r,
      startDate: toSqlDateOnly(r.startDate),
      endDate: toSqlDateOnly(r.endDate),
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
});

/* READ ONE */
app.get("/api/events/:id", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = Number(req.params.id);
    const [rows] = await conn.execute(`SELECT * FROM events WHERE id = ?`, [
      id,
    ]);
    if (!rows.length)
      return res.status(404).json({ message: "Event not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
});

/* UPDATE */
app.put("/api/events/:id", upload.single("image"), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;

    const startDate = toSqlDateOnly(req.body.startDate);
    const endDate = toSqlDateOnly(req.body.endDate);

    if (!name || !description || !startDate || !endDate) {
      if (req.file) safeUnlink(req.file.path);
      return res
        .status(400)
        .json({ message: "All fields are required or dates invalid" });
    }

    // fetch existing
    const [existingRows] = await conn.execute(
      `SELECT * FROM events WHERE id = ?`,
      [id]
    );
    if (!existingRows.length) {
      if (req.file) safeUnlink(req.file.path);
      return res.status(404).json({ message: "Event not found" });
    }
    const existing = existingRows[0];

    //delete old file
    let imageUrl = existing.imageUrl;
    if (req.file) {
      // delete old
      if (existing.imageUrl) {
        const oldPath = path.join(__dirname, existing.imageUrl);
        safeUnlink(oldPath);
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await conn.execute(
      `UPDATE events SET name = ?, description = ?, startDate = ?, endDate = ?, imageUrl = ? WHERE id = ?`,
      [name, description, startDate, endDate, imageUrl, id]
    );

    const [rows] = await conn.execute(`SELECT * FROM events WHERE id = ?`, [
      id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    if (req.file) safeUnlink(req.file.path);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
});

/* DELETE */
app.delete("/api/events/:id", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = Number(req.params.id);
    const [rows] = await conn.execute(`SELECT * FROM events WHERE id = ?`, [
      id,
    ]);
    if (!rows.length)
      return res.status(404).json({ message: "Event not found" });

    const toDelete = rows[0];
    if (toDelete.imageUrl) {
      const imgPath = path.join(__dirname, toDelete.imageUrl);
      safeUnlink(imgPath);
    }

    await conn.execute(`DELETE FROM events WHERE id = ?`, [id]);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
