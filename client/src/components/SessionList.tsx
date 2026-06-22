import { Calendar, Layers } from "lucide-react";

interface Session {
  _id: string;
  eventCount: number;
  firstSeen: string;
  lastSeen: string;
}

interface Props {
  sessions: Session[];
  onSelect: (id: string) => void;
  selected: string | null;
}

export default function SessionList({ sessions, onSelect, selected }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No active sessions found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sessions.map((s) => {
        const isSelected = selected === s._id;
        const formattedDate = new Date(s.lastSeen).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        const formattedTime = new Date(s.lastSeen).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={s._id}
            onClick={() => onSelect(s._id)}
            className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
              isSelected
                ? "bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-500/5"
                : "bg-gray-900/30 border-gray-800 hover:border-gray-700/50 hover:bg-gray-900/60"
            }`}
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className={`font-mono text-xs font-semibold tracking-wider ${
                isSelected ? "text-indigo-400" : "text-gray-400 group-hover:text-gray-300"
              }`}>
                {s._id.slice(0, 12)}...
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isSelected
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  : "bg-gray-800 text-gray-450 border-gray-700/40"
              }`}>
                <Layers className="h-3 w-3" />
                {s.eventCount} {s.eventCount === 1 ? "action" : "actions"}
              </span>
            </div>

            {/* Time / Seen details */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-600" />
                <span>Last seen: {formattedDate} at {formattedTime}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

