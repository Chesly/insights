"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// A lightweight top-down parking mini-game — canvas-only, no assets, no
// backend. Physics are intentionally simple (arcade feel, not a
// simulation): acceleration/friction on a speed scalar, turning scaled by
// current speed so the car can't pivot in place but can still creep and
// steer into the bay like a real parallel/bay-parking manoeuvre.

const CANVAS_W = 800;
const CANVAS_H = 480;
const CAR_W = 34;
const CAR_H = 18;
const MAX_SPEED = 3.4;
const ACCEL = 0.09;
const REVERSE_ACCEL = 0.06;
const FRICTION = 0.045;
const TURN_RATE = 0.05;
const SETTLE_MS = 500;

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Bay {
  x: number;
  y: number;
  w: number;
  h: number;
}

const LEVELS: { start: { x: number; y: number; angle: number }; bay: Bay; obstacles: Obstacle[] }[] = [
  {
    start: { x: 90, y: 400, angle: 0 },
    bay: { x: 640, y: 190, w: 100, h: 60 },
    obstacles: [
      { x: 300, y: 100, w: 140, h: 30 },
      { x: 300, y: 350, w: 140, h: 30 },
      { x: 560, y: 60, w: 30, h: 120 },
      { x: 560, y: 300, w: 30, h: 120 },
    ],
  },
  {
    start: { x: 700, y: 60, angle: Math.PI },
    bay: { x: 60, y: 380, w: 110, h: 60 },
    obstacles: [
      { x: 250, y: 150, w: 30, h: 220 },
      { x: 400, y: 40, w: 200, h: 30 },
      { x: 450, y: 220, w: 160, h: 30 },
    ],
  },
];

function rectsOverlap(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export default function ParkingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef({ up: false, down: false, left: false, right: false });
  const [levelIndex, setLevelIndex] = useState(0);
  const [status, setStatus] = useState<"playing" | "won">("playing");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [bestMs, setBestMs] = useState<number | null>(null);
  const [bumpFlash, setBumpFlash] = useState(false);

  const level = LEVELS[levelIndex];

  const stateRef = useRef({
    x: level.start.x,
    y: level.start.y,
    angle: level.start.angle,
    speed: 0,
    startTime: Date.now(),
    settleStart: null as number | null,
    won: false,
  });

  const resetLevel = useCallback((idx: number) => {
    const lvl = LEVELS[idx];
    stateRef.current = {
      x: lvl.start.x,
      y: lvl.start.y,
      angle: lvl.start.angle,
      speed: 0,
      startTime: Date.now(),
      settleStart: null,
      won: false,
    };
    setStatus("playing");
    setElapsedMs(0);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowUp" || e.key === "w") keys.current.up = true;
      if (e.key === "ArrowDown" || e.key === "s") keys.current.down = true;
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = true;
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowUp" || e.key === "w") keys.current.up = false;
      if (e.key === "ArrowDown" || e.key === "s") keys.current.down = false;
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = false;
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;
    const ctx: CanvasRenderingContext2D = canvasCtx;

    let raf: number;

    function step() {
      const s = stateRef.current;
      const lvl = LEVELS[levelIndex];

      if (!s.won) {
        if (keys.current.up) s.speed = Math.min(MAX_SPEED, s.speed + ACCEL);
        else if (keys.current.down) s.speed = Math.max(-MAX_SPEED * 0.6, s.speed - REVERSE_ACCEL);
        else s.speed *= 1 - FRICTION;

        if (Math.abs(s.speed) < 0.02) s.speed = 0;

        const turnFactor = Math.max(0.35, Math.abs(s.speed) / MAX_SPEED) * Math.sign(s.speed || 1);
        if (keys.current.left) s.angle -= TURN_RATE * turnFactor;
        if (keys.current.right) s.angle += TURN_RATE * turnFactor;

        const nx = s.x + Math.cos(s.angle) * s.speed;
        const ny = s.y + Math.sin(s.angle) * s.speed;

        const half = Math.max(CAR_W, CAR_H) / 2;
        const clampedX = Math.min(CANVAS_W - half, Math.max(half, nx));
        const clampedY = Math.min(CANVAS_H - half, Math.max(half, ny));
        if (clampedX !== nx || clampedY !== ny) s.speed = 0;

        const carBox = { x: clampedX - CAR_W / 2, y: clampedY - CAR_H / 2, w: CAR_W, h: CAR_H };
        const hitObstacle = lvl.obstacles.some((o) => rectsOverlap(carBox, o));
        if (hitObstacle) {
          s.speed = 0;
          setBumpFlash(true);
          setTimeout(() => setBumpFlash(false), 150);
        } else {
          s.x = clampedX;
          s.y = clampedY;
        }

        const inBay =
          s.x > lvl.bay.x && s.x < lvl.bay.x + lvl.bay.w && s.y > lvl.bay.y && s.y < lvl.bay.y + lvl.bay.h;
        if (inBay && Math.abs(s.speed) < 0.15) {
          if (s.settleStart === null) s.settleStart = Date.now();
          else if (Date.now() - s.settleStart > SETTLE_MS) {
            s.won = true;
            const time = Date.now() - s.startTime;
            setStatus("won");
            setBestMs((prev) => (prev === null || time < prev ? time : prev));
          }
        } else {
          s.settleStart = null;
        }

        setElapsedMs(Date.now() - s.startTime);
      }

      // ---- render ----
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = "#2b2b2b";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // lane markings for texture
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let gx = 40; gx < CANVAS_W; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, CANVAS_H);
        ctx.stroke();
      }

      // bay
      ctx.save();
      ctx.strokeStyle = status === "won" ? "#4ADE80" : "#FAF6EC";
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 3;
      ctx.strokeRect(lvl.bay.x, lvl.bay.y, lvl.bay.w, lvl.bay.h);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(184,134,11,0.12)";
      ctx.fillRect(lvl.bay.x, lvl.bay.y, lvl.bay.w, lvl.bay.h);
      ctx.restore();

      // obstacles
      ctx.fillStyle = "#8B6E46";
      lvl.obstacles.forEach((o) => {
        ctx.fillRect(o.x, o.y, o.w, o.h);
      });

      // car
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.fillStyle = bumpFlash ? "#EF4444" : "#B8860B";
      ctx.beginPath();
      ctx.roundRect(-CAR_W / 2, -CAR_H / 2, CAR_W, CAR_H, 4);
      ctx.fill();
      ctx.fillStyle = "#1A1A1A";
      ctx.fillRect(CAR_W / 2 - 10, -CAR_H / 2 + 3, 6, CAR_H - 6);
      ctx.fillStyle = "#FAF6EC";
      ctx.beginPath();
      ctx.arc(CAR_W / 2 - 2, -CAR_H / 2 + 2, 1.6, 0, Math.PI * 2);
      ctx.arc(CAR_W / 2 - 2, CAR_H / 2 - 2, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [levelIndex, status, bumpFlash]);

  function press(key: keyof typeof keys.current, value: boolean) {
    keys.current[key] = value;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-[800px] items-center justify-between text-sm text-[#1A1A1A]/70">
        <span className="mono-label uppercase tracking-wide">
          Level {levelIndex + 1} of {LEVELS.length}
        </span>
        <span className="mono-label uppercase tracking-wide">
          Time: {(elapsedMs / 1000).toFixed(1)}s
          {bestMs !== null && <> · Best: {(bestMs / 1000).toFixed(1)}s</>}
        </span>
      </div>

      <div className="relative w-full max-w-[800px] overflow-hidden border-2 border-[#B8860B]/30">
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="block h-auto w-full" />

        {status === "won" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#1A1A1A]/85 text-center text-white">
            <p className="eyebrow text-xs font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">Parked!</p>
            <h3 className="text-2xl font-bold">Nailed it in {(elapsedMs / 1000).toFixed(1)}s</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => resetLevel(levelIndex)}
                className="border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:border-white hover:bg-white/20"
              >
                Try Again
              </button>
              {levelIndex + 1 < LEVELS.length && (
                <button
                  type="button"
                  onClick={() => {
                    setLevelIndex((i) => i + 1);
                    resetLevel(levelIndex + 1);
                  }}
                  className="bg-[#B8860B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8B6E46]"
                >
                  Next Level →
                </button>
              )}
              <a
                href="/lcdkhaya/booking"
                className="bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#1A1A1A] hover:bg-white"
              >
                Ready for the Real Thing? Book a Lesson
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Touch controls */}
      <div className="grid w-full max-w-[280px] grid-cols-3 gap-2 sm:hidden">
        <div />
        <button
          type="button"
          onTouchStart={() => press("up", true)}
          onTouchEnd={() => press("up", false)}
          onMouseDown={() => press("up", true)}
          onMouseUp={() => press("up", false)}
          onMouseLeave={() => press("up", false)}
          className="flex h-14 items-center justify-center border border-[#B8860B]/30 bg-white text-lg font-bold text-[#1A1A1A] active:bg-[#B8860B]/10"
        >
          ↑
        </button>
        <div />
        <button
          type="button"
          onTouchStart={() => press("left", true)}
          onTouchEnd={() => press("left", false)}
          onMouseDown={() => press("left", true)}
          onMouseUp={() => press("left", false)}
          onMouseLeave={() => press("left", false)}
          className="flex h-14 items-center justify-center border border-[#B8860B]/30 bg-white text-lg font-bold text-[#1A1A1A] active:bg-[#B8860B]/10"
        >
          ←
        </button>
        <button
          type="button"
          onTouchStart={() => press("down", true)}
          onTouchEnd={() => press("down", false)}
          onMouseDown={() => press("down", true)}
          onMouseUp={() => press("down", false)}
          onMouseLeave={() => press("down", false)}
          className="flex h-14 items-center justify-center border border-[#B8860B]/30 bg-white text-lg font-bold text-[#1A1A1A] active:bg-[#B8860B]/10"
        >
          ↓
        </button>
        <button
          type="button"
          onTouchStart={() => press("right", true)}
          onTouchEnd={() => press("right", false)}
          onMouseDown={() => press("right", true)}
          onMouseUp={() => press("right", false)}
          onMouseLeave={() => press("right", false)}
          className="flex h-14 items-center justify-center border border-[#B8860B]/30 bg-white text-lg font-bold text-[#1A1A1A] active:bg-[#B8860B]/10"
        >
          →
        </button>
      </div>

      <button
        type="button"
        onClick={() => resetLevel(levelIndex)}
        className="text-sm font-semibold text-[#B8860B] hover:underline"
      >
        Restart Level
      </button>
    </div>
  );
}
