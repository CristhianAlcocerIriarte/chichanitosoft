"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  driftX: number;
  driftY: number;
  amplitudeX: number;
  amplitudeY: number;
  speed: number;
  phase: number;
  radius: number;
};

type Link = {
  a: number;
  b: number;
};

function createParticles(width: number, height: number): Particle[] {
  const area = width * height;
  const count = Math.max(32, Math.min(56, Math.floor(area / 18000)));

  return Array.from({ length: count }, () => {
    const originX = width * (0.08 + Math.random() * 0.84);
    const originY = height * (0.1 + Math.random() * 0.8);

    return {
      x: originX,
      y: originY,
      originX,
      originY,
      driftX: (Math.random() - 0.5) * 0.12,
      driftY: (Math.random() - 0.5) * 0.12,
      amplitudeX: 8 + Math.random() * 14,
      amplitudeY: 6 + Math.random() * 12,
      speed: 0.35 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      radius: 1.4 + Math.random() * 1.1,
    };
  });
}

function createLinks(particles: Particle[]): Link[] {
  const links: Link[] = [];
  const used = new Set<string>();
  const maxDistance = 180;
  const linksPerParticle = 2;

  for (let i = 0; i < particles.length; i++) {
    const nearest = particles
      .map((particle, index) => ({
        index,
        distance: Math.hypot(
          particles[i].originX - particle.originX,
          particles[i].originY - particle.originY,
        ),
      }))
      .filter((item) => item.index !== i && item.distance < maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, linksPerParticle);

    for (const item of nearest) {
      const key = i < item.index ? `${i}:${item.index}` : `${item.index}:${i}`;
      if (used.has(key)) continue;
      used.add(key);
      links.push({ a: i, b: item.index });
    }
  }

  return links;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let particles: Particle[] = [];
    let links: Link[] = [];

    const setup = () => {
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;

      if (nextWidth < 2 || nextHeight < 2) return;

      width = nextWidth;
      height = nextHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = createParticles(width, height);
      links = createLinks(particles);
    };

    const draw = () => {
      if (width < 2 || height < 2) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      time += 0.016;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.originX += particle.driftX;
        particle.originY += particle.driftY;

        if (particle.originX < width * 0.06 || particle.originX > width * 0.94) {
          particle.driftX *= -1;
        }
        if (particle.originY < height * 0.08 || particle.originY > height * 0.92) {
          particle.driftY *= -1;
        }

        particle.x =
          particle.originX +
          Math.sin(time * particle.speed + particle.phase) * particle.amplitudeX;
        particle.y =
          particle.originY +
          Math.cos(time * particle.speed * 0.85 + particle.phase) *
            particle.amplitudeY;
      }

      for (const link of links) {
        const from = particles[link.a];
        const to = particles[link.b];
        const distance = Math.hypot(from.x - to.x, from.y - to.y);
        const alpha = Math.max(0.08, 0.22 - distance / 1400);

        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.strokeStyle = `rgba(28, 39, 56, ${alpha})`;
        context.lineWidth = 1;
        context.stroke();
      }

      for (const particle of particles) {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(15, 157, 138, 0.85)";
        context.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    setup();
    animationId = requestAnimationFrame(draw);

    const observer = new ResizeObserver(() => {
      setup();
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
