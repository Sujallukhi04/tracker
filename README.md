# CausalFunnel Analytics Platform

A complete, lightweight, and modern full-stack analytics application that tracks user interactions (page views and clicks) on websites, stores them in MongoDB, and presents a premium real-time visualization dashboard containing session timelines and page heatmaps.

This application is built in accordance with the **CausalFunnel Full Stack Engineer Assignment** requirements.

---

## 🚀 Live Demo & Deployed URLs
* **Backend API**: [https://tracker-kiga.onrender.com](https://tracker-kiga.onrender.com)
* **Frontend Dashboard**: *(Add your Vercel frontend URL here)*
* **HTML Sandbox / Demo Storefront**: `https://causalfunnel-lemon.vercel.app/demo.html`

---

## 🛠️ Tech Stack

### 1. Client-Side Tracking Script (`/tracker`)
* **TypeScript & JavaScript**: Lightweight, dependency-free tracker script compiling down to vanilla JS.
* **Storage**: `localStorage` used for tracking persistent user sessions.

### 2. Backend API (`/server`)
* **Node.js & Express**: High-performance, lightweight API framework.
* **Mongoose & MongoDB**: Object modeling for schema-based event storage.
* **CORS Middleware**: Granular access control (public for event ingestion, restricted for analytics dashboard).

### 3. Analytics Dashboard (`/client`)
* **React & TypeScript**: Single Page Application (SPA) architecture.
* **Vite**: Ultra-fast frontend build tool.
* **Tailwind CSS**: Modern typography, custom glassmorphic styling, and visual indicators.
* **Lucide Icons**: Crisp, responsive icons.

---

## 📂 Project Structure

```text
├── client/          # React + Vite Dashboard Application (Dashboard UI & Heatmaps)
│   ├── public/      # Static assets (including copy of demo.html and compiled tracker.js)
│   └── src/         # React components, pages, hooks, and configuration
├── server/          # Express API Backend (Receives events, queries sessions & heatmaps)
│   └── src/         # Express controllers, routes, middleware, and database schemas
└── tracker/         # Standalone Event Tracking SDK (TypeScript source + test sandbox)
    ├── tracker.ts   # Core tracker script source code
    └── demo.html    # Mock e-commerce storefront for interactive tracking tests
```

---

## ⚙️ Setup & Local Installation

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (Local instance or MongoDB Atlas cluster connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/Sujallukhi04/tracker.git
cd tracker
```

### 2. Configure Environment Variables

* **In `/server/.env`**:
  ```env
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.rnq4j.mongodb.net/analytics?retryWrites=true&w=majority
  PORT=5000
  CORS_ORIGIN=http://localhost:5173
  ```

* **In `/client/.env`**:
  ```env
  VITE_API_URL=http://localhost:5000/api
  VITE_DEMO_URL=/demo.html
  ```

### 3. Run the Backend Server
```bash
cd server
npm install
npm run build
npm start
```

### 4. Build and Run the Client Dashboard
```bash
cd ../client
npm install
npm run dev
```
*(The React dashboard will be running at `http://localhost:5173`)*

### 5. Compile and Test the Tracker
To edit and re-compile the tracker:
```bash
cd ../tracker
npm install
npm run build
```
Once compiled, copy the output script into the client's public folder so it can be served:
```bash
cp dist/tracker.js ../client/public/dist/tracker.js
cp demo.html ../client/public/demo.html
```
Open **`http://localhost:5173/demo.html`** in your browser to click and interact with the sandbox storefront.

---

## 🧠 Assumptions & Trade-offs

1. **Session Persistence**: 
   * *Assumption*: We chose `localStorage` to persist the `session_id` over cookies for simpler client-side implementation. The session ID persists across tab closures and page refreshes.
2. **CORS Isolation**:
   * *Trade-off*: The `/api/events` endpoint uses `cors({ origin: "*" })` to allow events to be received from any domain where the tracker script is installed. However, dashboard endpoints `/api/sessions` and `/api/heatmap` are strictly locked down to the origin(s) defined in the `CORS_ORIGIN` environment variable for security.
3. **Viewport Coordinates for Clicks**:
   * *Assumption*: Click coordinates `(x, y)` are captured relative to the viewport (`clientX`/`clientY`). In production environments with varying viewport dimensions, coordinates are mapped to a visual scaling canvas.
4. **Vite Public Distribution**:
   * *Trade-off*: We serve the static sandbox storefront `demo.html` and the compiled `tracker.js` from the Vite `public` folder. This allows the demo environment to be fully accessible directly via the main client domain (e.g., `client-domain.vercel.app/demo.html`) without requiring a separate web hosting server for the tracker.
