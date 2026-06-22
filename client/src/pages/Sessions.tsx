import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Activity, Layers, ArrowRight } from "lucide-react";
import SessionList from "../components/SessionList";
import EventList from "../components/EventList";
import { getApiBaseUrl } from "../lib/config";

interface Session {
  _id: string;
  eventCount: number;
  firstSeen: string;
  lastSeen: string;
}

const API = getApiBaseUrl();

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/sessions`)
      .then((res) => {
        setSessions(res.data);
        if (res.data.length > 0 && !selectedSession) {
          setSelectedSession(res.data[0]._id);
        }
      })
      .catch((err) => console.error("Error fetching sessions:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalSessions = sessions.length;
  const totalEvents = sessions.reduce((sum, s) => sum + s.eventCount, 0);
  const avgEvents = totalSessions
    ? (totalEvents / totalSessions).toFixed(1)
    : "0";

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Metric 1 */}
        <div className="glass-panel rounded-2xl p-6 glow-indigo flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Total Sessions</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {totalSessions}
            </p>
          </div>
          <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/20">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel rounded-2xl p-6 glow-indigo flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">
              Total Events Captured
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{totalEvents}</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
            <Activity className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel rounded-2xl p-6 glow-indigo flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">
              Avg Actions / Session
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{avgEvents}</p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400 border border-amber-500/20">
            <Layers className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Split Pane Session Explorer */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        {/* Session List Column */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 border border-gray-800 shadow-xl flex flex-col max-h-[680px]">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">All Sessions</h2>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              {totalSessions} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
                <p className="text-sm text-gray-400">Loading sessions...</p>
              </div>
            ) : (
              <SessionList
                sessions={sessions}
                onSelect={setSelectedSession}
                selected={selectedSession}
              />
            )}
          </div>
        </div>

        {/* Timeline Event Details Column */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-gray-800 shadow-xl min-h-[500px] flex flex-col max-h-[680px]">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-800 mb-6">
            <h2 className="text-lg font-semibold text-white">User Journey</h2>
            {selectedSession && (
              <>
                <ArrowRight className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-xs text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-md border border-indigo-900/60">
                  {selectedSession}
                </span>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {selectedSession ? (
              <EventList sessionId={selectedSession} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Activity className="h-12 w-12 text-gray-600 mb-4 animate-pulse" />
                <p className="text-gray-400 font-medium">No Session Selected</p>
                <p className="text-xs text-gray-500 mt-1">
                  Select a session from the list to preview visitor interaction
                  flow.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
