# FILTER Coffeehouse

## About the project

FILTER is a full-stack website for a fictional coffeehouse in Indiranagar,
Bangalore. The site loads its menu from a database through a backend API
and lets visitors book tables, which are saved in the database.

## Tech stack

| Layer      | Technology                       |
|------------|-----------------------------------|
| Frontend   | HTML5, CSS3, vanilla JavaScript   |
| Backend    | Python, Flask                     |
| Database   | SQLite (`filter.db`)              |
| Deployment | Vercel                            |

## Database design

Two tables, created automatically on first run:

**menu_items**: id, category, name, note, price
(filled from `data/menu.json` the first time the app starts)

**reservations**: id, name, phone, date, time, guests, created_at

## API routes

| Method | Route                | Description                        |
|--------|------------------------|--------------------------------------|
| GET    | `/api/menu`            | Returns the menu grouped by category |
| GET    | `/api/reservations`    | Returns all reservations             |
| POST   | `/api/reservations`    | Saves a new reservation              |

The frontend calls `GET /api/menu` when the page loads and builds the menu
from the response. The reservation form sends a `POST /api/reservations`
request, and the backend validates the data and inserts a row into the
database using SQL.

## Project structure

```
filter-coffee/
├── app.py              # Flask backend, database setup, API routes
├── requirements.txt    # Python dependencies
├── vercel.json         # Vercel deployment config
├── data/menu.json      # Seed data for the menu table
└── public/             # Frontend files
    ├── index.html
    ├── css/style.css
    └── js/main.js
```

## How to run locally

Requires Python 3.9+.

```bash
cd filter-coffee
pip install -r requirements.txt
python app.py
```

Open **http://localhost:3000** in a browser.

## Deployment

Deployed on Vercel from a GitHub repository. Vercel runs the Flask app as a
serverless function, and its filesystem is temporary, so on the deployed
version the SQLite database is recreated when the function restarts.
Locally, `filter.db` is permanent. A hosted database such as PostgreSQL
would be used for permanent storage in production.
