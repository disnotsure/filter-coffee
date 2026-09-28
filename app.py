
import json
import os
import sqlite3
from datetime import datetime

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
MENU_JSON = os.path.join(BASE_DIR, "data", "menu.json")


if os.environ.get("VERCEL"):
    DB_PATH = "/tmp/filter.db"
else:
    DB_PATH = os.path.join(BASE_DIR, "filter.db")

app = Flask(__name__, static_folder=None)
app.json.sort_keys = False  


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables if they don't exist and fill the menu the first time."""
    conn = get_db()
    conn.execute(
        """CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            name TEXT NOT NULL,
            note TEXT,
            price INTEGER NOT NULL
        )"""
    )
    conn.execute(
        """CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            guests INTEGER NOT NULL,
            created_at TEXT NOT NULL
        )"""
    )

    count = conn.execute("SELECT COUNT(*) FROM menu_items").fetchone()[0]
    if count == 0:
        with open(MENU_JSON, encoding="utf-8") as f:
            menu = json.load(f)
        for category, items in menu.items():
            for item in items:
                conn.execute(
                    "INSERT INTO menu_items (category, name, note, price) VALUES (?, ?, ?, ?)",
                    (category, item["name"], item["note"], item["price"]),
                )
    conn.commit()
    conn.close()


init_db()




@app.route("/api/menu")
def get_menu():
    conn = get_db()
    rows = conn.execute("SELECT * FROM menu_items ORDER BY id").fetchall()
    conn.close()

    menu = {}
    for row in rows:
        menu.setdefault(row["category"], []).append(
            {"name": row["name"], "note": row["note"], "price": row["price"]}
        )
    return jsonify(menu)


@app.route("/api/reservations", methods=["GET"])
def list_reservations():
    conn = get_db()
    rows = conn.execute("SELECT * FROM reservations ORDER BY id DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/reservations", methods=["POST"])
def create_reservation():
    data = request.get_json(silent=True) or {}
    required = ["name", "phone", "date", "time", "guests"]

    if not all(data.get(field) for field in required):
        return jsonify({"error": "All fields are required."}), 400

    try:
        guests = int(data["guests"])
    except ValueError:
        return jsonify({"error": "Guests must be a number."}), 400

    conn = get_db()
    cur = conn.execute(
        "INSERT INTO reservations (name, phone, date, time, guests, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (data["name"], data["phone"], data["date"], data["time"], guests,
         datetime.utcnow().isoformat()),
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({"message": "Reservation confirmed.", "id": new_id}), 201




@app.route("/")
def home():
    return send_from_directory(PUBLIC_DIR, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(PUBLIC_DIR, path)


if __name__ == "__main__":
    app.run(debug=True, port=3000)
