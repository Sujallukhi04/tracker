# CausalFunnel Analytics - Backend API Server

This is the Express.js API backend for the CausalFunnel User Analytics Application. It receives, stores, and exposes queries for tracked session events.

## 🛠️ Tech Stack
* **Node.js & Express**: High-performance RESTful API endpoints.
* **MongoDB & Mongoose**: Object Data Modeling (ODM) for schema validation and database connection.
* **CORS**: Selective cross-origin handling (public access for tracker event submission, restricted access for dashboards).

## ⚙️ Environment Variables
Create a `.env` file in the root of this folder:
```env
MONGO_URI=your-mongodb-connection-string
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

## 🔌 API Endpoints

### 1. Events Ingestion
* **`POST /api/events`**: Receives page views and click coordinates from the tracker.
  * *Origin Allowed*: Any (`*`)

### 2. Dashboard Analytics
* **`GET /api/sessions`**: List all tracked sessions with event counts and timestamps.
* **`GET /api/sessions/:id`**: Fetch chronological list of events for a specific session.
* **`GET /api/heatmap/urls`**: Fetch distinct page URLs that have tracked events.
* **`GET /api/heatmap?url=<url>&sessionId=<id>`**: Fetch click coordinates `(x, y)` filtered by page URL and optionally by session.
  * *Origin Allowed*: Configured origins in `CORS_ORIGIN`

## 🚀 Scripts
* `npm install`: Install dependencies.
* `npm run build`: Compile TypeScript files into `dist/`.
* `npm start`: Start the production server.
* `npm run dev`: Start development server with hot-reloading (nodemon).
