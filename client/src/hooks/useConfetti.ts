// GTB Vragenrad – Confetti Hook
// Triggers a confetti burst when the wheel lands on a question

import { useCallback } from "react";

const COLORS = ["#3a2268", "#e01a22", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#f97316"];

export function useConfetti() {
  const triggerConfetti = useCallback((count = 60) => {
    const container = document.body;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const left = Math.random() * 100;
      const duration = 1.5 + Math.random() * 2;
      const delay = Math.random() * 0.5;
      const size = 6 + Math.random() * 8;
      const rotation = Math.random() * 360;
      const isCircle = Math.random() > 0.5;

      piece.style.cssText = `
        left: ${left}vw;
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: ${isCircle ? "50%" : "2px"};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        transform: rotate(${rotation}deg);
      `;

      container.appendChild(piece);

      setTimeout(() => {
        piece.remove();
      }, (duration + delay) * 1000 + 100);
    }
  }, []);

  return { triggerConfetti };
}
