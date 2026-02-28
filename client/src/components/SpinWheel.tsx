// GTB Vragenrad – SpinWheel Component
// Design: Playful Professional – Bold Dutch Design
// Canvas-based spinning wheel with GTB brand colors and smooth animations

import { useEffect, useRef, useCallback } from "react";
import { Difficulty } from "@/lib/questions";

const SEGMENTS_TOTAL = 60;
const COLORS: Record<Difficulty, string> = {
  easy: "#10b981",
  medium: "#f59e0b",
  hard: "#ef4444",
};

// Pattern: hard, easy, medium repeating
const segmentLevels: Difficulty[] = Array.from({ length: SEGMENTS_TOTAL }, (_, i) => {
  const mod = i % 3;
  if (mod === 0) return "hard";
  if (mod === 1) return "easy";
  return "medium";
});

function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

interface SpinWheelProps {
  onSpinComplete: (difficulty: Difficulty) => void;
  isSpinning: boolean;
  setIsSpinning: (v: boolean) => void;
}

export function SpinWheel({ onSpinComplete, isSpinning, setIsSpinning }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRotationRef = useRef(0);
  const logoRef = useRef<HTMLImageElement | null>(null);

  // Preload GTB logo
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://gtbrad.pages.dev/image_f7935e.png";
    img.onload = () => {
      logoRef.current = img;
      drawWheel(currentRotationRef.current);
    };
    img.onerror = () => {
      // Fallback: draw without logo
      drawWheel(currentRotationRef.current);
    };
  }, []);

  const drawWheel = useCallback((rotationDeg: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 8;

    ctx.clearRect(0, 0, w, h);

    // Save state and rotate entire wheel
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotationDeg * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    const arc = (Math.PI * 2) / SEGMENTS_TOTAL;
    let startAngle = -Math.PI / 2;

    for (let i = 0; i < SEGMENTS_TOTAL; i++) {
      const level = segmentLevels[i];
      const endAngle = startAngle + arc;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[level];
      ctx.fill();

      // White divider lines
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      startAngle = endAngle;
    }

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    // Center circle (drawn without rotation)
    const centerR = radius * 0.22;
    ctx.beginPath();
    ctx.arc(cx, cy, centerR + 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw logo in center
    if (logoRef.current) {
      const logoSize = centerR * 1.4;
      ctx.drawImage(logoRef.current, cx - logoSize / 2, cy - logoSize / 2, logoSize, logoSize);
    } else {
      // Fallback text
      ctx.fillStyle = "#3a2268";
      ctx.font = `bold ${centerR * 0.5}px Space Grotesk, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("GTB", cx, cy);
    }
  }, []);

  useEffect(() => {
    drawWheel(0);
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const fullTurns = 7 + Math.floor(Math.random() * 4); // 7-10 full turns
    const extraDeg = Math.random() * 360;
    const targetRotation = currentRotationRef.current + fullTurns * 360 + extraDeg;
    const durationMs = 5000 + Math.random() * 1500;

    const startRotation = currentRotationRef.current;
    const startTime = performance.now();

    // Custom easing: fast start, slow end
    function easeOut(t: number): number {
      return 1 - Math.pow(1 - t, 4);
    }

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOut(progress);
      const currentDeg = startRotation + (targetRotation - startRotation) * easedProgress;

      currentRotationRef.current = currentDeg;
      drawWheel(currentDeg);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentRotationRef.current = targetRotation;
        drawWheel(targetRotation);

        // Determine winner
        const arcDeg = 360 / SEGMENTS_TOTAL;
        const wheelAngle = normalizeDeg(360 - normalizeDeg(targetRotation));
        let idx = Math.floor(wheelAngle / arcDeg);
        if (idx < 0) idx = 0;
        if (idx >= SEGMENTS_TOTAL) idx = SEGMENTS_TOTAL - 1;
        const winnerLevel = segmentLevels[idx];

        setTimeout(() => {
          setIsSpinning(false);
          onSpinComplete(winnerLevel);
        }, 200);
      }
    }

    requestAnimationFrame(animate);
  }, [isSpinning, setIsSpinning, onSpinComplete, drawWheel]);

  return (
    <div className="relative" style={{ width: "min(380px, 85vw)", height: "min(380px, 85vw)" }}>
      {/* Outer decorative ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(135deg, #3a2268 0%, #5a3a9a 50%, #e01a22 100%)",
          padding: "6px",
        }}
      >
        <div className="w-full h-full rounded-full bg-white p-2 shadow-inner">
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            className="w-full h-full rounded-full"
            style={{ display: "block" }}
          />
        </div>
      </div>

      {/* Pointer */}
      <div
        className="absolute left-1/2 -top-3 z-20"
        style={{ transform: "translateX(-50%)" }}
        aria-hidden="true"
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "28px solid #3a2268",
            filter: "drop-shadow(0 4px 8px rgba(58,34,104,0.5))",
          }}
        />
        <div
          className="absolute -top-1 left-1/2"
          style={{
            transform: "translateX(-50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#3a2268",
          }}
        />
      </div>

      {/* Spin overlay button (invisible, covers canvas) */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className="absolute inset-0 rounded-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Draai het wiel"
      />
    </div>
  );
}

export { segmentLevels };
