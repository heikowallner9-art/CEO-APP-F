import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Keep track of resize using a safe resize listener
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create gold particles
    interface DustParticle {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      alpha: number;
      fadeRatio: number;
    }

    const particles: DustParticle[] = [];
    const count = 45; // balanced density so it doesn't cause browser lag

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -Math.random() * 0.4 - 0.1, // Float upwards
        alpha: Math.random() * 0.55 + 0.15,
        fadeRatio: Math.random() * 0.005 + 0.001,
      });
    }

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial background sweep for extreme high-end ambient gold depth
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      gradient.addColorStop(0, "#080705"); // Extreme dark gold tint
      gradient.addColorStop(0.5, "#020202"); // Sleek black
      gradient.addColorStop(1, "#000000"); // Matte black
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw faint luxury grid lines (Tesla/Bloomberg feel)
      ctx.strokeStyle = "rgba(212, 175, 55, 0.02)";
      ctx.lineWidth = 1;

      // Draw vertical lines
      const colStep = width / 12;
      for (let x = 0; x < width; x += colStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal lines
      const rowStep = height / 8;
      for (let y = 0; y < height; y += rowStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render gold stars & dust
      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;

        // If off screen, reset to bottom
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }

        // Draw particle with luxury gold glow
        ctx.shadowBlur = p.radius * 3;
        ctx.shadowColor = "#D4AF37"; // Metallic Gold Hex
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      id="executive-starfield-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
