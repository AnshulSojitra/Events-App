require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const sequelize = require("./config/database");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/events", eventRoutes);

(async () => {
  try {
    await connectDB();
    await sequelize.sync();
    console.log(" Models synced");
    app.get("/", (req, res) => {
      res.send(
        `<marquee direction="right" scrollamount="20"><h1>🗿Welcome to Event API 🗿</h1></marquee>`
      );
    });
    app.listen(PORT, () =>
      console.log(` Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Server startup failed:", err);
  }
})();
// 🧑‍🏭🧑‍🏭👾👾🤖🤖🧙‍♂️🧙‍♂️
