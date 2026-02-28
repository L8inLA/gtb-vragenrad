// GTB Vragenrad – SessionSummary Component
// Design: Playful Professional – Bold Dutch Design
// Shows a summary of the current session with stats and discussed questions

import { useState } from "react";
import { Question, DIFFICULTY_LABELS, DIFFICULTY_COLORS, DIFFICULTY_BG } from "@/lib/questions";
import { BarChart3, ChevronDown, ChevronUp, RotateCcw, Trophy } from "lucide-react";

interface SessionStats {
  easy: number;
  medium: number;
  hard: number;
  total: number;
  skipped: number;
}

interface SessionSummaryProps {
  stats: SessionStats;
  discussedQuestions: Question[];
  onReset: () => void;
}

export function SessionSummary({ stats, discussedQuestions, onReset }: SessionSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  const completionRate = stats.total > 0 ? Math.round((discussedQuestions.length / stats.total) * 100) : 0;

  return (
    <div className="w-full rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 cursor-pointer select-none gap-2 flex-wrap"
        onClick={() => setExpanded((v) => !v)}
        style={{ background: "linear-gradient(135deg, #f8f7ff 0%, #fff 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#3a2268" }}
          >
            <BarChart3 size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">Sessie statistieken</p>
            <p className="text-xs text-gray-400">
              {stats.total} vragen gedraaid · {discussedQuestions.length} besproken
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {stats.total > 0 && (
            <div className="hidden sm:flex items-center gap-4 text-center">
              <StatPill label="Makkelijk" value={stats.easy} color="#10b981" bg="#d1fae5" />
              <StatPill label="Gemiddeld" value={stats.medium} color="#f59e0b" bg="#fef3c7" />
              <StatPill label="Moeilijk" value={stats.hard} color="#ef4444" bg="#fee2e2" />
            </div>
          )}
          {expanded ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-50">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <StatCard label="Totaal gedraaid" value={stats.total} icon="🎯" />
            <StatCard label="Besproken" value={discussedQuestions.length} icon="✅" />
            <StatCard label="Overgeslagen" value={stats.skipped} icon="⏭️" />
            <StatCard label="Voltooiingsgraad" value={`${completionRate}%`} icon="📊" />
          </div>

          {/* Mobile stats */}
          <div className="flex sm:hidden items-center gap-3 mt-4">
            <StatPill label="Makkelijk" value={stats.easy} color="#10b981" bg="#d1fae5" />
            <StatPill label="Gemiddeld" value={stats.medium} color="#f59e0b" bg="#fef3c7" />
            <StatPill label="Moeilijk" value={stats.hard} color="#ef4444" bg="#fee2e2" />
          </div>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Voortgang sessie</span>
                <span>{discussedQuestions.length} / {stats.total}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${completionRate}%`,
                    background: "linear-gradient(90deg, #3a2268, #5a3a9a)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Discussed questions list */}
          {discussedQuestions.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={15} className="text-amber-500" />
                <p className="text-sm font-semibold text-gray-700">Besproken vragen</p>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {discussedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl text-sm"
                    style={{ background: DIFFICULTY_BG[q.difficulty] }}
                  >
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                      style={{
                        background: "white",
                        color: DIFFICULTY_COLORS[q.difficulty],
                        border: `1px solid ${DIFFICULTY_COLORS[q.difficulty]}30`,
                      }}
                    >
                      {DIFFICULTY_LABELS[q.difficulty].charAt(0)}
                    </span>
                    <span className="text-gray-700 leading-snug">{q.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset button */}
          <div className="mt-4 sm:mt-5 flex justify-end">
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-all"
            >
              <RotateCcw size={14} />
              Reset sessie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatPill({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: bg, color }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: color }}
      />
      <span>{label}: {value}</span>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
