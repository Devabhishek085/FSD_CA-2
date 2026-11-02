# FSD CA-2 Backend

This project is a Node.js + Express + MongoDB backend for handling student feedback.

## Features
- Submit feedback
- Fetch all feedback with pagination
- Update feedback status
- MongoDB database integration

## Project Structure
- `server.js` - main server entry point
- `routes/feedback.js` - API routes
- `models/feedback.js` - feedback schema
- `images/` - image folders for project assets

## Installation

```bash
npm install
```

## Run the server

```bash
npm start
```

## API Endpoints

### POST /api/feedback
Create a new feedback record.

Example body:

```json
{
  "studentName": "Abhishek Pal",
  "courseName": "FSD",
  "message": "Great experience.",
  "rating": 5
}
```

### GET /api/feedback?page=1&limit=10
Fetch feedback records with pagination.

### PATCH /api/feedback/:id
Update feedback status.

Example body:

```json
{
  "status": "Reviewed"
}
```

## Notes
- The app uses MongoDB Atlas or local MongoDB.
- Ensure your `.env` file contains the correct `MONGO_URI`.
- Port defaults to `3000`.
