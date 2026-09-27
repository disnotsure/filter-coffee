# FILTER Coffeehouse

## About the project

FILTER is a full-stack website built for a fictional coffeehouse based in
Indiranagar, Bangalore. The goal of the project was to design and build a
complete website with both a working frontend and a working backend,
rather than a static page — the site actually loads its menu from a
server and lets visitors submit table reservations that get saved.

The project covers the core layers of a modern web application:

- A responsive, custom-designed frontend built with plain HTML, CSS, and
  JavaScript (no frameworks or templates used).
- A backend server built with Node.js and Express that serves the
  website and exposes a small API.
- A simple data storage layer using JSON files, so data (the menu and
  reservations) is separate from the code and can be updated without
  touching it.

## Features

- **Home page** with a hero section, the restaurant's story, a menu
  section, location and hours, and a reservation form.
- **Dynamic menu:** the menu shown on the page is not hardcoded into the
  HTML. It is fetched from the backend using JavaScript's `fetch()` API
  when the page loads, and rendered into the page dynamically.
- **Reservation system:** visitors can fill out a form (name, phone,
  date, time, number of guests) to book a table. Submitting the form
  sends the data to the backend, which validates it and saves it.
- **Responsive design:** the layout adapts to mobile, tablet, and
  desktop screen sizes.

## Tech stack

| Layer         | Technology                          |
|---------------|--------------------------------------|
| Frontend      | HTML5, CSS3, vanilla JavaScript      |
| Backend       | Node.js, Express.js                  |
| Data storage  | JSON files                           |
| Deployment    | Vercel                               |

## How the frontend and backend communicate

The frontend and backend communicate over HTTP using a small REST API:

| Method | Route                | Description                            |
|--------|------------------------|------------------------------------------|
| GET    | `/api/menu`            | Returns the full menu as JSON            |
| GET    | `/api/reservations`    | Returns all saved reservations           |
| POST   | `/api/reservations`    | Accepts and saves a new table reservation|

When the page loads, the frontend calls `GET /api/menu` and builds the
menu section from the response. When the reservation form is submitted,
the frontend calls `POST /api/reservations` with the form data, and the
backend appends it to `data/reservations.json`.

## Project structure
filter-coffee/
├── server.js # Express backend and API routes (used when running locally)
├── api/index.js # Serverless version of the backend (used on Vercel)
├── vercel.json # Deployment configuration for Vercel
├── package.json
├── data/
│ ├── menu.json # Menu content
│ └── reservations.json # Reservations saved by the backend
└── public/ # Frontend files served to the browser
├── index.html
├── css/style.css
└── js/main.js

## How to run it locally

Requires [Node.js](https://nodejs.org) (v16 or later).

```bash
cd filter-coffee
npm install
npm start
```

Then open **http://localhost:3000** in a browser.

## Deployment

The project is deployed on Vercel. Since Vercel runs backend code as
serverless functions rather than a continuously running server, a
separate backend file (`api/index.js`) is used for the deployed version,
while `server.js` is used for running it locally. Note that on the
deployed version, reservations are stored temporarily rather than
permanently, since serverless functions do not have persistent file
storage — locally, they are saved permanently.
