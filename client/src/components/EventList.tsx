import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, MousePointerClick, Clock, ExternalLink, MapPin } from "lucide-react";
import { getApiBaseUrl } from "../lib/config";

interface Event {
  _id: string;
  type: string;
  url: string;
  timestamp: string;
  x?: number;
  y?: number;
}

const API = getApiBaseUrl();

export default function EventList({ sessionId }: { sessionId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/sessions/${sessionId}`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching session events:", err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        <p className="text-sm text-gray-400">Loading timeline...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No events found for this session.
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-gray-800 ml-3.5 space-y-8 pb-4">
      {events.map((e, i) => {
        const isClick = e.type === "click";
        const eventTime = new Date(e.timestamp).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        // Calculate time gap from chronologically preceding event (which is at index i + 1 when descending)
        const prevEvent = i < events.length - 1 ? events[i + 1] : null;
        let timeGap = "";
        if (prevEvent) {
          const diffMs = new Date(e.timestamp).getTime() - new Date(prevEvent.timestamp).getTime();
          const diffSec = Math.round(diffMs / 1000);
          if (diffSec > 0) {
            timeGap = diffSec < 60 ? `+${diffSec}s` : `+${Math.floor(diffSec / 60)}m`;
          }
        }

        return (
          <div key={e._id} className="relative group">
            {/* Timeline node icon */}
            <div className={`absolute -left-10 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-all duration-300 ${
              isClick
                ? "bg-indigo-950 text-indigo-400 border-indigo-500/50 group-hover:scale-110"
                : "bg-emerald-950 text-emerald-400 border-emerald-500/50 group-hover:scale-110"
            }`}>
              {isClick ? (
                <MousePointerClick className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </div>

            {/* Time Gap Indicator */}
            {timeGap && (
              <div className="absolute -left-[5.5rem] -top-6 flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-950 px-1.5 py-0.5 rounded border border-gray-800/80">
                <Clock className="h-3 w-3 text-gray-600" />
                {timeGap}
              </div>
            )}

            {/* Event Details Card */}
            <div className="glass-card rounded-xl p-4 border border-gray-800/60 shadow-md group-hover:border-gray-700/60 transition-all duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider rounded-md px-2 py-0.5 border ${
                    isClick
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}>
                    {e.type}
                  </span>
                  <span className="font-mono text-[10px] text-gray-550">
                    ID: {e._id.slice(-6)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  <span>{eventTime}</span>
                </div>
              </div>

              {/* Event payload / metadata */}
              <div className="mt-3 space-y-2">
                {/* URL */}
                <div className="flex items-start gap-2 text-xs text-gray-300">
                  <ExternalLink className="h-3.5 w-3.5 text-gray-500 mt-0.5 shrink-0" />
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-indigo-400 break-all"
                  >
                    {e.url}
                  </a>
                </div>

                {/* Coordinate details for Click events */}
                {isClick && e.x !== undefined && e.y !== undefined && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900/60 border border-gray-800/40 px-2.5 py-1 text-xs text-gray-400">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Coordinates:</span>
                    <span className="font-mono text-gray-200 font-semibold">X: {e.x}</span>
                    <span className="text-gray-600">|</span>
                    <span className="font-mono text-gray-200 font-semibold">Y: {e.y}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

