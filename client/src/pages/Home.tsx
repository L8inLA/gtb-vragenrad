// GTB Vragenrad – Home Page
// Design: Playful Professional – Bold Dutch Design
// Split layout: wheel left, question + stats right on desktop; stacked on mobile
// GTB brand colors: purple (#3a2268), red (#e01a22)

import { useState, useCallback, useEffect } from "react";
import { SpinWheel } from "@/components/SpinWheel";
import { QuestionCard } from "@/components/QuestionCard";
import { SessionSummary } from "@/components/SessionSummary";
import {
  Question,
  Difficulty,
  easyQuestions,
  mediumQuestions,
  hardQuestions,
} from "@/lib/questions";

import { Zap } from "lucide-react";

// Deck management: shuffle and draw without repeats
function shuffledCopy<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface SessionStats {
  easy: number;
  medium: number;
  hard: number;
  total: number;
  skipped: number;
}

const STORAGE_KEY = "gtb-rad-session";

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveSession(data: object) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionDone, setSessionDone] = useState<string[]>([]); // IDs of marked-done questions
  const [discussedQuestions, setDiscussedQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0,
    skipped: 0,
  });

  // Question decks
  const [easyDeck, setEasyDeck] = useState<Question[]>(() => shuffledCopy(easyQuestions));
  const [mediumDeck, setMediumDeck] = useState<Question[]>(() => shuffledCopy(mediumQuestions));
  const [hardDeck, setHardDeck] = useState<Question[]>(() => shuffledCopy(hardQuestions));



  // Restore session from localStorage
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      if (saved.stats) setStats(saved.stats);
      if (saved.sessionDone) setSessionDone(saved.sessionDone);
      if (saved.discussedQuestions) setDiscussedQuestions(saved.discussedQuestions);
    }
  }, []);

  // Save session to localStorage on change
  useEffect(() => {
    saveSession({ stats, sessionDone, discussedQuestions });
  }, [stats, sessionDone, discussedQuestions]);

  const drawQuestion = useCallback(
    (difficulty: Difficulty): Question => {
      let deck: Question[];
      let setDeck: (d: Question[]) => void;
      let allQ: Question[];

      if (difficulty === "easy") {
        deck = easyDeck;
        setDeck = setEasyDeck;
        allQ = easyQuestions;
      } else if (difficulty === "medium") {
        deck = mediumDeck;
        setDeck = setMediumDeck;
        allQ = mediumQuestions;
      } else {
        deck = hardDeck;
        setDeck = setHardDeck;
        allQ = hardQuestions;
      }

      let activeDeck = deck.length > 0 ? deck : shuffledCopy(allQ);
      const question = activeDeck[activeDeck.length - 1];
      setDeck(activeDeck.slice(0, -1));
      return question;
    },
    [easyDeck, mediumDeck, hardDeck]
  );

  const handleSpinComplete = useCallback(
    (difficulty: Difficulty) => {
      const question = drawQuestion(difficulty);
      setCurrentQuestion(question);
      setStats((prev) => ({
        ...prev,
        [difficulty]: prev[difficulty] + 1,
        total: prev.total + 1,
      }));

    },
    [drawQuestion]
  );

  const handleSkip = useCallback(() => {
    if (!currentQuestion) return;
    setStats((prev) => ({ ...prev, skipped: prev.skipped + 1 }));
    // Draw a new question of the same difficulty
    const question = drawQuestion(currentQuestion.difficulty);
    setCurrentQuestion(question);
    setStats((prev) => ({
      ...prev,
      [question.difficulty]: prev[question.difficulty] + 1,
      total: prev.total + 1,
    }));
  }, [currentQuestion, drawQuestion]);

  const handleMarkDone = useCallback(() => {
    if (!currentQuestion) return;
    if (!sessionDone.includes(currentQuestion.id)) {
      setSessionDone((prev) => [...prev, currentQuestion.id]);
      setDiscussedQuestions((prev) => [...prev, currentQuestion]);
    }
  }, [currentQuestion, sessionDone]);

  const handleReset = useCallback(() => {
    setStats({ easy: 0, medium: 0, hard: 0, total: 0, skipped: 0 });
    setSessionDone([]);
    setDiscussedQuestions([]);
    setCurrentQuestion(null);
    setEasyDeck(shuffledCopy(easyQuestions));
    setMediumDeck(shuffledCopy(mediumQuestions));
    setHardDeck(shuffledCopy(hardQuestions));
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f4f3fa 0%, #ede9f8 100%)" }}>
      {/* Header */}
      <header
        className="w-full relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2a1850 0%, #3a2268 60%, #4a2a80 100%)",
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663390407354/MKzueBV2TXjs2DcbehnkbV/gtb-header-bg-WVMrfe5y6KWE5PejoqnrsU.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(42,24,80,0.92) 0%, rgba(58,34,104,0.85) 100%)" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ background: "rgba(255,255,255,0.95)", padding: "6px 10px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
            >
              <img
                src="https://gtbrad.pages.dev/image_f7935e.png"
                alt="GTB Logo"
                className="h-8 w-auto"
              />
            </div>
            <div>
              <h1
                className="text-white font-bold text-xl sm:text-2xl leading-tight tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
              >
                GTB Vragenrad
              </h1>
              <p className="text-purple-200 text-xs sm:text-sm font-medium">
                Gespecialiseerde Trajectbegeleiding
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="hidden sm:flex items-center gap-2">
            <LegendBadge color="#10b981" label="Makkelijk" />
            <LegendBadge color="#f59e0b" label="Gemiddeld" />
            <LegendBadge color="#ef4444" label="Moeilijk" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mobile legend */}
        <div className="flex sm:hidden items-center justify-center gap-2 mb-5 flex-wrap">
          <LegendBadge color="#10b981" label="Makkelijk" />
          <LegendBadge color="#f59e0b" label="Gemiddeld" />
          <LegendBadge color="#ef4444" label="Moeilijk" />
        </div>

        {/* Context bar */}
        <div
          className="hidden lg:flex items-center gap-3 mb-6 px-4 py-3 rounded-2xl text-sm"
          style={{ background: "rgba(58,34,104,0.06)", border: "1px solid rgba(58,34,104,0.1)" }}
        >
          <span className="text-lg">💡</span>
          <p className="text-gray-600">
            <span className="font-semibold" style={{ color: "#3a2268" }}>Hoe werkt het?</span>{" "}
            Draai het rad om een willekeurige vraag te selecteren. Groen = makkelijk (ijsbrekers), oranje = gemiddeld (zelfreflectie), rood = moeilijk (dilemma's). Gebruik de timer en markeer besproken vragen.
          </p>
        </div>

        {/* Split layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* Left: Wheel */}
          <div className="w-full lg:w-auto flex flex-col items-center gap-4 sm:gap-5 lg:sticky lg:top-6 lg:pt-2">
            <SpinWheel
              onSpinComplete={handleSpinComplete}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />

            {/* Spin button */}
            <button
              onClick={() => {
                if (!isSpinning) {
                  const hiddenBtn = document.querySelector<HTMLButtonElement>('[aria-label="Draai het wiel"]');
                  hiddenBtn?.click();
                }
              }}
              disabled={isSpinning}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 hover:scale-105 w-full sm:w-auto"
              style={{
                background: isSpinning
                  ? "#64748b"
                  : "linear-gradient(135deg, #3a2268 0%, #5a3a9a 100%)",
                boxShadow: isSpinning ? "none" : "0 8px 24px rgba(58,34,104,0.4), 0 2px 8px rgba(58,34,104,0.2)",
                letterSpacing: "0.06em",
                fontSize: "1rem",
                minWidth: "140px",
              }}
            >
              <Zap size={16} fill="currentColor" />
              <span className="hidden sm:inline">{isSpinning ? "Draaien..." : "DRAAIEN"}</span>
              <span className="inline sm:hidden">{isSpinning ? "Draai..." : "DRAAI"}</span>
            </button>

            <p className="text-xs text-gray-400 text-center max-w-[240px]">
              <span className="hidden sm:inline">Of klik rechtstreeks op het rad</span>
              <span className="inline sm:hidden">Of tik op het rad</span>
            </p>
          </div>

          {/* Right: Question + Stats */}
          <div className="flex-1 w-full flex flex-col gap-4 min-w-0">
            <QuestionCard
              question={currentQuestion}
              onSkip={handleSkip}
              onMarkDone={handleMarkDone}
              isSpinning={isSpinning}
              sessionDone={sessionDone}
            />

            <SessionSummary
              stats={stats}
              discussedQuestions={discussedQuestions}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-xs text-gray-500 border-t border-gray-100 mt-8">
        <p className="mb-2">
          <span className="font-semibold text-gray-600">Concept & Idee:</span>{" "}
          <a
            href="https://www.gtb.be"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#3a2268] hover:underline transition-colors"
          >
            Inge De Grom
          </a>
        </p>
        <p>
          <a
            href="https://www.gtb.be"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3a2268] transition-colors"
          >
            GTB – Gespecialiseerde Trajectbegeleiding
          </a>
        </p>
      </footer>
    </div>
  );
}

function LegendBadge({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
    >
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}
