// FILTER Coffeehouse — simple Express backend
// Serves the static frontend and two small JSON APIs:
//   GET  /api/menu        -> returns the menu (read from data/menu.json)
//   POST /api/reservations -> saves a table reservation (appends to data/reservations.json)
//   GET  /api/reservations -> lists saved reservations (handy for demoing to a professor)

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const MENU_PATH = path.join(__dirname, "data", "menu.json");
const RESERVATIONS_PATH = path.join(__dirname, "data", "reservations.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Helpers
function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// GET the menu
app.get("/api/menu", (req, res) => {
  try {
    const menu = readJSON(MENU_PATH);
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: "Could not load menu." });
  }
});

// GET all reservations (for the professor / demo)
app.get("/api/reservations", (req, res) => {
  try {
    const reservations = readJSON(RESERVATIONS_PATH);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Could not load reservations." });
  }
});

// POST a new reservation
app.post("/api/reservations", (req, res) => {
  const { name, phone, date, time, guests } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const reservations = readJSON(RESERVATIONS_PATH);
    const newReservation = {
      id: Date.now(),
      name,
      phone,
      date,
      time,
      guests,
      createdAt: new Date().toISOString(),
    };
    reservations.push(newReservation);
    writeJSON(RESERVATIONS_PATH, reservations);
    res.status(201).json({ message: "Reservation confirmed.", reservation: newReservation });
  } catch (err) {
    res.status(500).json({ error: "Could not save reservation." });
  }
});

app.listen(PORT, () => {
  console.log(`FILTER Coffeehouse running at http://localhost:${PORT}`);
});
