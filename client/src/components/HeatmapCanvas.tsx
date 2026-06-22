import { useState } from "react";
import { Eye, Settings, Compass, Sliders } from "lucide-react";
import { getDemoUrl } from "../lib/config";

interface Click {
  x: number;
  y: number;
}

export default function HeatmapCanvas({ clicks }: { clicks: Click[] }) {
  const [viewMode, setViewMode] = useState<"points" | "heat">("heat");
  const [opacity, setOpacity] = useState<number>(0.7);
  const [radius, setRadius] = useState<number>(20);
  const demoUrl = getDemoUrl();

  return (
    <div className="w-full space-y-4">
      {/* Visual controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 w-full max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4">
          {/* View toggle */}
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Render Style:</span>
          <div className="flex rounded-lg bg-gray-950 p-1 border border-gray-800">
            <button
              onClick={() => setViewMode("heat")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "heat"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Heat Spots
            </button>
            <button
              onClick={() => setViewMode("points")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "points"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Points Map
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="flex items-center gap-6">
          {/* Opacity Slider */}
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-400">Opacity:</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer h-1 bg-gray-800 rounded-lg appearance-none"
            />
            <span className="text-xs font-mono text-gray-500 w-6">{Math.round(opacity * 100)}%</span>
          </div>

          {/* Size/Radius Slider */}
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-400">Spot Size:</span>
            <input
              type="range"
              min="8"
              max="48"
              step="2"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer h-1 bg-gray-800 rounded-lg appearance-none"
            />
            <span className="text-xs font-mono text-gray-500 w-8">{radius}px</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport Mockup */}
      <div className="w-full max-w-[1200px] mx-auto rounded-xl border border-gray-800 overflow-hidden shadow-2xl bg-gray-950 flex flex-col">
        {/* Mock Browser Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-850 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex-1 max-w-lg mx-auto bg-gray-950/80 border border-gray-800/80 rounded-lg py-1 px-3 text-center text-xs text-gray-500 font-mono truncate">
            {demoUrl}
          </div>
          <Settings className="h-4 w-4 text-gray-650" />
        </div>

        {/* Viewport Canvas Body */}
        <div className="relative w-full h-[580px] bg-slate-900/35 overflow-auto border-t border-transparent select-none">
          {/* Grid Mockup background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {clicks.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Eye className="h-10 w-10 text-gray-700 mb-2.5 animate-pulse" />
              <p className="text-sm font-medium text-gray-400">No interaction data available</p>
              <p className="text-xs text-gray-500 mt-0.5">Generate clicks on the demo page and reload.</p>
            </div>
          ) : (
            clicks.map((c, i) => {
              if (viewMode === "heat") {
                return (
                  <div
                    key={i}
                    className="absolute rounded-full pointer-events-none heat-spot-pulse"
                    style={{
                      left: `${c.x}px`,
                      top: `${c.y}px`,
                      width: `${radius * 2}px`,
                      height: `${radius * 2}px`,
                      transform: "translate(-50%, -50%)",
                      background: "radial-gradient(circle, rgba(239, 68, 68, 0.45) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 100%)",
                      filter: "blur(4px)",
                      opacity: opacity,
                    }}
                  />
                );
              } else {
                return (
                  <div
                    key={i}
                    className="absolute rounded-full pointer-events-none ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-500/20"
                    style={{
                      left: `${c.x}px`,
                      top: `${c.y}px`,
                      width: `${radius / 2}px`,
                      height: `${radius / 2}px`,
                      transform: "translate(-50%, -50%)",
                      background: "#6366f1",
                      opacity: opacity,
                    }}
                  />
                );
              }
            })
          )}
        </div>
      </div>
    </div>
  );
}

