# Roof Estimator

A configuration-driven roofing cost estimator built with **React, Node.js, Express, and MongoDB**.

The application has two parts:

* **Public Estimator** – Homeowners enter roof details and receive a cost estimate.
* **Admin Panel** – Admin can manage pricing, questions, configuration, and view leads.

## Live URLs

### Public Estimator

https://roof-estimator-dun.vercel.app/

### Admin Panel

https://roof-estimator-dun.vercel.app/admin

### Admin Login

```text
Username: admin
Password: roofing2026!
```

## Features

* Dynamic estimator questions
* Configuration stored in MongoDB
* Server-side estimate calculation
* Lead/contact capture
* Admin authentication
* Admin dashboard
* Edit pricing and multipliers
* Enable/disable estimator questions
* View captured leads
* Responsive design

## Tech Stack

### Frontend

* React
* JavaScript
* CSS
* Fetch API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT

## Running Locally

### Backend

```bash
cd server
npm install
npm run dev
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### Frontend

```bash
cd client
npm install
npm start
```

The frontend does not require any environment variables.

## How It Works

1. The frontend requests the estimator configuration from the backend.
2. Questions and options are loaded from MongoDB.
3. The homeowner completes the estimator.
4. Answers are sent to the backend.
5. The backend validates the answers and calculates the estimate.
6. The lead and estimate are stored in MongoDB.
7. The admin can view leads and update the estimator configuration.

## Important

Pricing and estimator configuration are **not hardcoded in the frontend**.

The backend/database is the source of truth for questions, options, rates, and calculation values.

The estimate is calculated on the server.

## Project Structure

```text
roof-estimator/
├── client/
├── server/
├── README.md
├── DECISIONS.md
└── AI_LOG.md
```

## Assignment Documents

* `README.md` – Project setup and usage
* `DECISIONS.md` – Design decisions, assumptions, formula, and scope
* `AI_LOG.md` – AI tools and development process

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
