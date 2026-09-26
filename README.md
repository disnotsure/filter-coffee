# FILTER Coffeehouse — College Project

A small full-stack website for a fictional Bangalore coffeehouse called
**FILTER**. Built with plain HTML/CSS/JS on the frontend and a small
Node.js + Express backend.

## What it demonstrates

- **Frontend:** semantic HTML, custom CSS (no framework), a responsive
  layout, and JavaScript that talks to a real backend.
- **Backend:** an Express server with two small JSON APIs:
  - `GET /api/menu` — reads `data/menu.json` and returns the menu. The
    homepage fetches this on load and builds the menu section from it.
  - `GET /api/reservations` — lists saved reservations.
  - `POST /api/reservations` — saves a new table reservation to
    `data/reservations.json`.
- **Data persistence:** reservations are written to a JSON file on disk,
  so they survive a server restart (no database needed for a class
  project, but easy to swap in one later).

## How to run it

You need [Node.js](https://nodejs.org) installed (v16 or later is fine).

```bash
cd filter-coffee
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

## Project structure

```
filter-coffee/
├── server.js              # Express backend + API routes
├── package.json
├── data/
│   ├── menu.json           # menu content, editable without touching code
│   └── reservations.json   # reservations get appended here at runtime
└── public/                 # everything the browser loads
    ├── index.html
    ├── css/style.css
    └── js/main.js
```

## Ideas for extending it (good talking points if asked in a viva)

- Swap `data/*.json` for a real database (SQLite is a light next step).
- Add basic auth to `/api/reservations` (GET) so only staff can view bookings.
- Add form validation messages per field instead of one status line.
- Add an admin page that reads `GET /api/reservations` and renders a table.
