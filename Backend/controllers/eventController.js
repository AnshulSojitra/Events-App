const Event = require("../models/Event");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

/* CREATE */
exports.createEvent = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;

    if (!name || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      name,
      description,
      startDate,
      endDate,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

/* READ (pagination + search) */
exports.getEvents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder || "DESC";

    const allowedSortColumns = ["id", "name", "startDate", "endDate"];

    const orderColumn = allowedSortColumns.includes(sortBy) ? sortBy : "id";

    const { rows, count } = await Event.findAndCountAll({
      where: {
        name: { [Op.like]: `%${search}%` },
      },
      limit,
      offset,
      order: [[orderColumn, sortOrder]],
    });

    res.json({
      data: rows,
      pagination: {
        totalPages: Math.ceil(count / limit),
        totalRecords: count,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

/* READ ONE */
exports.getEventById = async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

/* UPDATE */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.file && event.imageUrl) {
      const oldPath = path.join(__dirname, "..", event.imageUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await event.update({
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : event.imageUrl,
    });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update event" });
  }
};

/* DELETE */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.imageUrl) {
      const imgPath = path.join(__dirname, "..", event.imageUrl);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await event.destroy();
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
