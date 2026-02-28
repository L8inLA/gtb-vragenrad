// GTB Vragenrad – QuestionCard Component
// Design: Playful Professional – Bold Dutch Design
// Displays the current question with difficulty badge, category, optional tip, and timer

import { useEffect, useRef, useState, useCallback } from "react";
import { Question, Difficulty, DIFFICULTY_LABELS, DIFFICULTY_COLORS, DIFFICULTY_BG } from "@/lib/questions";
import { Clock, Lightbulb, SkipForward, CheckCircle, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface QuestionCardProps {
  question: Question | null;
  onSkip: () => void;
  onMarkDone: () => void;
  isSpinning: boolean;
  sessionDone: string[];
}

const TIMER_SECONDS = 120; // 2 minutes default

const DIFFICULTY_BORDER: Record<Difficulty, string> = {
  easy: "#10b981",
  medium: "#f59e0b",
  hard: "#ef4444",
};

export function QuestionCard({ question, onSkip, onMarkDone, isSpinning, sessionDone }: QuestionCardProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset timer and animation when question changes
  useEffect(() => {
    if (question) {
      setTimeLeft(TIMER_SECONDS);
      setTimerActive(false);
      setShowTip(false);
      setShowGuidance(false);
      setAnimKey((k) => k + 1);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [question?.id]);

  // Timer logic
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setTimerActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive]);

  const toggleTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(TIMER_SECONDS);
      setTimerActive(true);
    } else {
      setTimerActive((v) => !v);
    }
  }, [timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const timerProgress = timeLeft / TIMER_SECONDS;
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference * (1 - timerProgress);

  const isTimerWarning = timeLeft <= 30 && timeLeft > 0;
  const isTimerDone = timeLeft === 0;

  if (!question && !isSpinning) {
    return (
      <div
        className="w-full rounded-2xl p-10 text-center"
        style={{
          background: "linear-gradient(135deg, #f8f7ff 0%, #fff 100%)",
          border: "2px dashed #d8d0f0",
          boxShadow: "0 2px 12px rgba(58,34,104,0.06)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #3a2268, #5a3a9a)" }}
        >
          <span className="text-3xl">🎯</span>
        </div>
        <p
          className="font-bold text-xl mb-2"
          style={{ color: "#3a2268", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Klaar om te starten?
        </p>
        <p className="text-gray-500 text-sm">
          Draai het rad om een vraag te krijgen voor de kandidaat.
        </p>
        <p className="text-gray-400 text-xs mt-1">Klik op DRAAIEN of rechtstreeks op het rad</p>
      </div>
    );
  }

  if (isSpinning) {
    return (
      <div
        className="w-full rounded-2xl p-8 text-center"
        style={{
          background: "linear-gradient(135deg, #f8f7ff 0%, #fff 100%)",
          border: "1px solid #e8e0f8",
          boxShadow: "0 2px 12px rgba(58,34,104,0.06)",
        }}
      >
        <div className="flex items-center justify-center gap-3" style={{ color: "#3a2268" }}>
          <div
            className="w-6 h-6 rounded-full border-3 border-t-transparent animate-spin"
            style={{ borderColor: "#3a2268", borderTopColor: "transparent" }}
          />
          <span className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Het rad draait...
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-2">Welke vraag zal het worden?</p>
      </div>
    );
  }

  if (!question) return null;

  const isDone = sessionDone.includes(question.id);
  const borderColor = DIFFICULTY_BORDER[question.difficulty];
  const bgColor = DIFFICULTY_BG[question.difficulty];
  const labelColor = DIFFICULTY_COLORS[question.difficulty];

  return (
    <div
      key={animKey}
      className="question-appear w-full rounded-2xl bg-white shadow-lg overflow-hidden"
      style={{
        borderLeft: `6px solid ${borderColor}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-4 sm:px-5 pt-3 sm:pt-4 pb-2 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: bgColor, color: labelColor }}
          >
            {DIFFICULTY_LABELS[question.difficulty]}
          </span>
          <span className="text-xs text-gray-400 font-medium">{question.category}</span>
        </div>

        {/* Timer */}
        <button
          onClick={toggleTimer}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
          style={{
            borderColor: isTimerDone ? "#ef4444" : isTimerWarning ? "#f59e0b" : "#e2e8f0",
            background: isTimerDone ? "#fee2e2" : isTimerWarning ? "#fef3c7" : "#f8fafc",
          }}
          title={timerActive ? "Pauzeer timer" : "Start timer"}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" className="-ml-1">
            <circle cx="22" cy="22" r="20" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke={isTimerDone ? "#ef4444" : isTimerWarning ? "#f59e0b" : "#3a2268"}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: isTimerDone ? "#ef4444" : isTimerWarning ? "#d97706" : "#3a2268" }}
          >
            {formatTime(timeLeft)}
          </span>
          <Clock size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Question text */}
      <div className="px-4 sm:px-5 py-3 sm:py-4">
        {isDone && (
          <div className="flex items-center gap-1.5 mb-2 text-green-600 text-sm font-medium">
            <CheckCircle size={15} /> Al besproken in deze sessie
          </div>
        )}
        <p
          className="question-text text-xl font-semibold leading-relaxed"
          style={{ color: "#1e1b4b", fontFamily: "'Lora', Georgia, serif" }}
        >
          {question.text}
        </p>
      </div>

      {/* Guidance section */}
      {question.guidance && (
        <div className="px-4 sm:px-5 pb-2 sm:pb-3">
          <button
            onClick={() => setShowGuidance((v) => !v)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <HelpCircle size={15} />
            Duiding: waarom deze vraag?
            {showGuidance ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showGuidance && (
            <div className="mt-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
              {question.guidance}
            </div>
          )}
        </div>
      )}

      {/* Tip section */}
      {question.tip && (
        <div className="px-4 sm:px-5 pb-2 sm:pb-3">
          <button
            onClick={() => setShowTip((v) => !v)}
            className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <Lightbulb size={15} />
            Tip voor begeleider
            {showTip ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showTip && (
            <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-800">
              {question.tip}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-4 sm:px-5 pb-3 sm:pb-4 pt-1 flex-wrap">
        <button
          onClick={onMarkDone}
          disabled={isDone}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center sm:justify-start"
          style={{
            background: isDone ? "#d1fae5" : "#3a2268",
            color: isDone ? "#059669" : "#ffffff",
          }}
        >
          <CheckCircle size={15} />
          {isDone ? "Besproken" : "Markeer als besproken"}
        </button>
        <button
          onClick={onSkip}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex-1 sm:flex-none justify-center sm:justify-start"
        >
          <SkipForward size={15} />
          Sla over
        </button>
      </div>
    </div>
  );
}
