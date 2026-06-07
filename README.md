# Lead Management CRM

A modern full-stack Lead Management CRM built for small businesses to manage customers, track lead progress, and organize sales pipelines efficiently.

## Features

### Lead Management

* Add new leads/customers
* View all leads in a centralized dashboard
* Edit lead information
* Delete leads
* Update lead status

### Lead Status Tracking

Supported statuses:

* New
* Contacted
* Qualified
* Converted
* Lost

### Search & Filtering

* Search by Name
* Search by Email
* Search by Company Name
* Filter by Lead Status
* Sort by Name and Creation Date

### Dashboard Analytics

* Total Leads
* New Leads
* Contacted Leads
* Qualified Leads
* Converted Leads
* Lost Leads

### Additional Features

* Pagination
* Responsive Design
* Modern User Interface
* RESTful API Architecture
* MongoDB Database Integration

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* Framer Motion
* React Icons

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

---

## Project Structure

client/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── App.jsx

server/
├── controllers/
├── models/
├── routes/
├── config/
└── server.js

---

## API Endpoints

### Create Lead

POST /api/leads

### Get All Leads

GET /api/leads

### Get Single Lead

GET /api/leads/:id

### Update Lead

PUT /api/leads/:id

### Delete Lead

DELETE /api/leads/:id

### Lead Statistics

GET /api/leads/stats

---

## Environment Variables

### Backend (.env)

PORT=5000

MONGO_URI=your_mongodb_connection_string

---

## Installation

### Clone Repository

git clone <repository-url>

### Install Backend Dependencies

cd server

npm install

### Start Backend

npm run dev

### Install Frontend Dependencies

cd client

npm install

### Start Frontend

npm run dev

---

## Deployment

Frontend deployed on Vercel

Backend deployed on Render

MongoDB hosted on MongoDB Atlas

---

## Author

Rajeev Valechha

Bachelor of Computer Applications

Sandip University

Nashik, Maharashtra

---

This project was developed as part of a Full Stack Developer Internship Assessment.
