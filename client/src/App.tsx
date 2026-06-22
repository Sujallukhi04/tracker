import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, MousePointerClick } from "lucide-react";
import Sessions from "./pages/Sessions";
import Heatmap from "./pages/Heatmap";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Premium Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/30">
              <Activity className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-200 via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                CausalFunnel
              </span>
              <span className="ml-1.5 rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-xs font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                Analytics
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-gray-900 text-white border border-gray-800 shadow-inner"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/50"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Sessions
            </Link>
            <Link
              to="/heatmap"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === "/heatmap"
                  ? "bg-gray-900 text-white border border-gray-800 shadow-inner"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/50"
              }`}
            >
              <MousePointerClick className="h-4 w-4" />
              Heatmap
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Sessions />} />
          <Route path="/heatmap" element={<Heatmap />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

