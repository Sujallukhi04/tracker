import { useEffect, useState } from "react";
import axios from "axios";
import { MousePointer, RefreshCw, Layers, ExternalLink } from "lucide-react";
import HeatmapCanvas from "../components/HeatmapCanvas";
import { getApiBaseUrl } from "../lib/config";

interface Click {
  x: number;
  y: number;
}

const API = getApiBaseUrl();

export default function Heatmap() {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [trackedUrls, setTrackedUrls] = useState<string[]>([]);
  const [sessions, setSessions] = useState<{ _id: string }[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [loadingClicks, setLoadingClicks] = useState(false);

  // Fetch all distinct URLs and all sessions tracked
  useEffect(() => {
    setLoadingUrls(true);
    axios
      .get(`${API}/heatmap/urls`)
      .then((res) => {
        setTrackedUrls(res.data);
        if (res.data.length > 0) {
          setSelectedUrl(res.data[0]);
        }
      })
      .catch((err) => console.error("Error fetching tracked URLs:", err))
      .finally(() => setLoadingUrls(false));

    axios
      .get(`${API}/sessions`)
      .then((res) => setSessions(res.data))
      .catch((err) => console.error("Error fetching sessions:", err));
  }, []);

  // Fetch click data for selected URL
  const fetchClicks = (url: string, sessionId: string) => {
    if (!url) return;
    setLoadingClicks(true);
    const sessionParam = sessionId
      ? `&sessionId=${encodeURIComponent(sessionId)}`
      : "";
    axios
      .get(`${API}/heatmap?url=${encodeURIComponent(url)}${sessionParam}`)
      .then((res) => setClicks(res.data))
      .catch((err) => console.error("Error fetching heatmap clicks:", err))
      .finally(() => setLoadingClicks(false));
  };

  useEffect(() => {
    if (selectedUrl) {
      fetchClicks(selectedUrl, selectedSession);
    }
  }, [selectedUrl, selectedSession]);

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          {/* Select inputs wrapper */}
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            {/* URL Select */}
            <div className="flex-[2] space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Select Page URL to Analyze
              </label>
              {loadingUrls ? (
                <div className="h-10 w-full animate-pulse bg-gray-900 rounded-xl border border-gray-800" />
              ) : (
                <div className="relative">
                  {trackedUrls.length === 0 ? (
                    <div className="w-full bg-gray-900 text-gray-400 px-4 py-2.5 rounded-xl border border-gray-800 text-sm">
                      No tracked URLs found in database.
                    </div>
                  ) : (
                    <select
                      value={selectedUrl}
                      onChange={(e) => setSelectedUrl(e.target.value)}
                      className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/55 focus:border-indigo-500/80 transition-all text-sm appearance-none cursor-pointer"
                    >
                      {trackedUrls.map((url) => (
                        <option key={url} value={url}>
                          {url}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Session Select Filter */}
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Filter by Session
              </label>
              <div className="relative">
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/55 focus:border-indigo-500/80 transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="">All Sessions Combined</option>
                  {sessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      Session: {s._id.slice(0, 8)}...
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-3 self-end lg:self-auto shrink-0 pt-2 lg:pt-0">
            {selectedUrl && (
              <a
                href={selectedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-800 hover:border-gray-700 bg-gray-900/30 hover:bg-gray-900/60 text-gray-300 transition-colors shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Visit Page</span>
              </a>
            )}
            <button
              onClick={() => fetchClicks(selectedUrl, selectedSession)}
              disabled={loadingClicks || !selectedUrl}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/30 disabled:text-gray-500 text-white shadow-lg shadow-indigo-600/20 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              <RefreshCw
                className={`h-4 w-4 ${loadingClicks ? "animate-spin" : ""}`}
              />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Small Metrics Row */}
        {selectedUrl && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                <MousePointer className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs text-gray-500 font-semibold uppercase tracking-wider">
                  Total Recorded Clicks
                </p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {clicks.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs text-gray-500 font-semibold uppercase tracking-wider">
                  Target Page
                </p>
                <p
                  className="text-xs font-mono text-emerald-400 truncate max-w-[280px] mt-1"
                  title={selectedUrl}
                >
                  {selectedUrl}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual Canvas Card */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 shadow-xl flex flex-col items-center">
        <HeatmapCanvas clicks={clicks} />
      </div>
    </div>
  );
}
