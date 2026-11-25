import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { createParticles, drawFrame, drawScene } from './heroScene';

/**
 * Optional pre-rendered frames:
 * drop frame_0.webp ... frame_{TOTAL_FRAMES-1}.webp into /frontend/public/frames
 * and they replace the procedural scene automatically. With no frames present
 * the code-drawn Forma AI scene is used.
 */
const TOTAL_FRAMES = 120;
const FRAME_PATH = '/frames';

function Overlay({ progress, range, children, className = '', interactive = false, startVisible = false }) {
  const opacity = useTransform(progress, range, startVisible ? [1, 1, 1, 0] : [0, 1, 1, 0]);
  const y = useTransform(progress, range, startVisible ? [0, 0, 0, -28] : [28, 0, 0, -28]);
  const pointerEvents = useTransform(opacity, (v) => (interactive && v > 0.5 ? 'auto' : 'none'));
  return (
    <motion.div
      style={{ opacity, y, pointerEvents }}
      className={`absolute inset-x-0 top-24 lg:top-0 lg:bottom-0 flex lg:items-center px-6 md:px-12 lg:px-20 ${className}`}
    >
      <div className="max-w-xl lg:max-w-[420px] xl:max-w-[520px]">{children}</div>
    </motion.div>
  );
}

export function HeroCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef(null);
  const [frameProgress, setFrameProgress] = useState(null); // null = not loading frames

  // Scroll progress across the whole tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring for buttery, bi-directional scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Anti-gravity: scroll velocity lifts the scene (up when scrolling down)
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 80, damping: 25 });
  const lift = useTransform(smoothVelocity, [-1, 0, 1], [15, 0, -15]);

  // Overlay opacities
  const indicatorOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  // Optionally preload pre-rendered frames, if the user supplied any
  useEffect(() => {
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (cancelled) return;
      setFrameProgress(0);
      let loaded = 0;
      Promise.all(
        Array.from(
          { length: TOTAL_FRAMES },
          (_, i) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                loaded += 1;
                if (!cancelled) setFrameProgress((loaded / TOTAL_FRAMES) * 100);
                resolve(img);
              };
              img.onerror = reject;
              img.src = `${FRAME_PATH}/frame_${i}.webp`;
            })
        )
      )
        .then((imgs) => {
          if (cancelled) return;
          framesRef.current = imgs;
          setFrameProgress(null);
        })
        .catch(() => {
          if (!cancelled) setFrameProgress(null); // fall back to the procedural scene
        });
    };
    probe.onerror = () => {};
    probe.src = `${FRAME_PATH}/frame_0.webp`;
    return () => {
      cancelled = true;
    };
  }, []);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const particles = createParticles(140);
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now) => {
      raf = 0;
      if (!visible) return; // paused while off-screen
      const p = Math.min(1, Math.max(0, smoothProgress.get()));
      if (framesRef.current) {
        const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(p * (TOTAL_FRAMES - 1))));
        drawFrame(ctx, w, h, framesRef.current[idx]);
      } else {
        drawScene(ctx, w, h, p, reduceMotion ? 0 : now / 1000, lift.get(), particles);
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    resize();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(container);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [smoothProgress, lift]);

  return (
    <section ref={containerRef} className="relative h-[500vh]" aria-label="Forma AI scroll experience">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink-950">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

        {/* Edge vignette so the canvas melts into the page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,8,6,0.85)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent"
        />

        {/* Text overlays (scroll-triggered fade in / out) */}
        <div className="absolute inset-0 pointer-events-none">
          <Overlay progress={smoothProgress} range={[0, 0.04, 0.16, 0.22]} startVisible>
            <p className="eyebrow mb-4">Dynamic Form & AI Extraction Engine</p>
            <h1 className="heading-serif text-6xl sm:text-7xl xl:text-8xl font-bold mb-5 leading-[0.95]">
              Forma <span className="text-gradient">AI</span>
            </h1>
            <p className="text-base md:text-lg text-cream-200/85 leading-relaxed">
              LangChain Structured Extraction • MongoDB Schema Store • 3-Level Deep Dynamic Branching
            </p>
          </Overlay>

          <Overlay progress={smoothProgress} range={[0.26, 0.32, 0.46, 0.52]}>
            <p className="eyebrow mb-4">Natural-Language Pre-Fill</p>
            <h2 className="heading-serif text-4xl sm:text-5xl xl:text-6xl font-semibold mb-4">
              Say it in plain words
            </h2>
            <p className="text-base md:text-lg text-cream-200/80 leading-relaxed">
              Enter an unstructured narrative paragraph describing your situation. Backend LLM extracts structured
              fields & reveals dynamic branching questions.
            </p>
          </Overlay>

          <Overlay progress={smoothProgress} range={[0.58, 0.64, 0.8, 0.86]}>
            <p className="eyebrow mb-4">Dynamic Branching</p>
            <h2 className="heading-serif text-4xl sm:text-5xl xl:text-6xl font-semibold mb-4">
              Structured, then branched three levels deep
            </h2>
            <p className="text-base md:text-lg text-cream-200/80 leading-relaxed">
              Only the questions that matter appear, while the Dynamic Validation Tracker keeps live count of form
              completion.
            </p>
          </Overlay>

          <Overlay progress={smoothProgress} range={[0.9, 0.93, 0.99, 1]} interactive>
            <p className="eyebrow mb-4">Ready when you are</p>
            <h2 className="heading-serif text-5xl sm:text-6xl xl:text-7xl font-bold mb-6">
              Launch the <span className="text-gradient">engine</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link to="/app" className="btn-primary px-8 py-4 text-base shadow-glow">
                  Open Forma AI →
                </Link>
              </motion.div>
              <a href="#forms" className="btn-ghost px-6 py-4 text-sm">
                Explore Form Types ↓
              </a>
            </div>
          </Overlay>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p className="text-cream-300/70 text-xs tracking-[0.25em] uppercase">Scroll to Explore</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-cream-200/40 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-3 bg-emerald-400/80 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Frame loading progress (only shown when custom frames are supplied) */}
        {frameProgress !== null && (
          <div className="absolute inset-0 bg-ink-950 flex flex-col items-center justify-center z-20">
            <div className="w-64 h-2 bg-ink-600 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-400 to-emerald-500"
                initial={{ width: '0%' }}
                animate={{ width: `${frameProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-cream-200/70 text-lg">Loading Experience... {Math.round(frameProgress)}%</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroCanvas;
