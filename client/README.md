# CausalFunnel Analytics - Client Dashboard

This is the React + TypeScript frontend dashboard for the CausalFunnel User Analytics Application. It visualizes user sessions, timelines, and interaction heatmaps.

## 🛠️ Tech Stack
* **Vite + React**: High-performance dev server and bundling.
* **TypeScript**: Type safety for state and API responses.
* **Tailwind CSS**: Modern utility classes and premium custom UI layout.
* **Lucide Icons**: Responsive SVG icons.
* **Axios**: HTTP client for requesting data from the server.
* **React Router**: Client-side routing.

## ⚙️ Environment Variables
Create a `.env` file in the root of this folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_DEMO_URL=/demo.html
```

## 🚀 Scripts
* `npm run dev`: Start the local development server.
* `npm run build`: Compile and build production assets into `dist/`.
* `npm run lint`: Lint source files.
* `npm run preview`: Serve the compiled production build locally.

## 📁 Public Assets
The `/public` directory hosts:
* `demo.html`: The mock e-commerce storefront used to generate test events.
* `dist/tracker.js`: The compiled version of the tracker script.
