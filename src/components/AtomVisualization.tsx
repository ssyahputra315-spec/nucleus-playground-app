import { useCallback, useEffect, useRef } from "react";
import { distributeElectrons, isStable } from "@/lib/elements";

interface AtomVisualizationProps {
  protons: number;
  neutrons: number;
  electrons: number;
}

export function AtomVisualization({ protons, neutrons, electrons }: AtomVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const unstable = !isStable(protons, neutrons, electrons);
  const shells = distributeElectrons(electrons);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const nucleusRadius = Math.min(12 + (protons + neutrons) * 1.2, 40);

    // Nucleus glow
    const glowAlpha = 0.3 + 0.15 * Math.sin(time * 0.002);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, nucleusRadius * 3);
    glow.addColorStop(0, `rgba(239, 68, 68, ${glowAlpha})`);
    glow.addColorStop(1, "rgba(239, 68, 68, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, nucleusRadius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Shell rings
    const shellRadii = shells.map((_, i) => nucleusRadius + 30 + i * 35);
    shellRadii.forEach(r => {
      ctx.strokeStyle = "rgba(96, 165, 250, 0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Nucleus shake offset
    let shakeX = 0, shakeY = 0;
    if (unstable && (protons > 0 || neutrons > 0)) {
      shakeX = (Math.random() - 0.5) * 3;
      shakeY = (Math.random() - 0.5) * 3;
    }

    // Draw nucleus particles
    const total = protons + neutrons;
    if (total > 0) {
      for (let i = 0; i < total; i++) {
        const angle = (i / total) * Math.PI * 2 + time * 0.0003;
        const dist = total === 1 ? 0 : Math.min(nucleusRadius * 0.6, 4 + i * 2.5);
        const spiralR = dist * (0.7 + 0.3 * Math.sin(angle * 3));
        const px = cx + shakeX + Math.cos(angle) * spiralR;
        const py = cy + shakeY + Math.sin(angle) * spiralR;
        const isProton = i < protons;
        const particleR = Math.min(6, 4 + total * 0.05);

        // Particle glow
        const pGlow = ctx.createRadialGradient(px, py, 0, px, py, particleR * 2);
        if (isProton) {
          pGlow.addColorStop(0, "rgba(239, 68, 68, 0.6)");
          pGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
        } else {
          pGlow.addColorStop(0, "rgba(148, 163, 184, 0.4)");
          pGlow.addColorStop(1, "rgba(148, 163, 184, 0)");
        }
        ctx.fillStyle = pGlow;
        ctx.beginPath();
        ctx.arc(px, py, particleR * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isProton ? "#ef4444" : "#94a3b8";
        ctx.beginPath();
        ctx.arc(px, py, particleR, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = isProton ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(px - particleR * 0.3, py - particleR * 0.3, particleR * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Electrons
    shells.forEach((count, shellIndex) => {
      const radius = shellRadii[shellIndex];
      if (!radius) return;
      for (let i = 0; i < count; i++) {
        const speed = 0.8 + shellIndex * 0.3;
        const baseAngle = (i / count) * Math.PI * 2;
        const angle = baseAngle + time * 0.001 * speed * (shellIndex % 2 === 0 ? 1 : -1);
        const ex = cx + Math.cos(angle) * radius;
        const ey = cy + Math.sin(angle) * radius;

        // Electron trail
        const trailGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 10);
        trailGrad.addColorStop(0, "rgba(96, 165, 250, 0.5)");
        trailGrad.addColorStop(1, "rgba(96, 165, 250, 0)");
        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.arc(ex, ey, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#60a5fa";
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.arc(ex - 1, ey - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [protons, neutrons, electrons, shells, unstable]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const animate = (ts: number) => {
      timeRef.current = ts;
      draw(ctx, rect.width, rect.height, ts);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-square max-w-[320px] mx-auto"
      style={{ imageRendering: "auto" }}
    />
  );
}
