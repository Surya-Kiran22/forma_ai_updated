/**
 * Procedural, scroll-driven hero scene for the Forma AI landing page.
 *
 * Instead of pre-rendered image frames, the scene is drawn directly on a
 * canvas from a single scroll progress value `p` (0 -> 1):
 *
 *   0.00 - 0.20  an unstructured narrative: tokens float freely (anti-gravity)
 *   0.16 - 0.50  tokens are pulled into the LLM structured-extraction core
 *   0.50 - 0.80  the core releases tokens into structured form-field cards
 *   0.80 - 0.92  3-level dynamic branching connects the cards
 *   0.88 - 1.00  the dynamic validation tracker completes
 *
 * Because it is a pure function of (p, time, lift) the animation is fully
 * bi-directional: scrolling up plays it in reverse.
 */

const TAU = Math.PI * 2;

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);
const seg = (p, a, b) => smooth(clamp((p - a) / (b - a)));
const lerp = (a, b, t) => a + (b - a) * t;

function mulberry32(seed) {
  let a = seed;
  return function rnd() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIELD_LABELS = [
  'Incident Date',
  'Vehicle Make',
  'Loss Type',
  'Location',
  'Damage Detail',
  'Police Report',
  'Policy Holder',
  'Injuries',
  'Claim Status',
];
const FIELD_VALUES = [
  'Yesterday',
  'Honda',
  'Animal Collision',
  'I-95',
  'Windshield',
  'Not Filed',
  'Verified',
  'None Reported',
  'Ready',
];
const CONFIDENCE = [96, 98, 91, 94, 89, 97, 93, 95, 99];

// Dynamic-branching connections (three levels deep: 0 -> 1 -> 4 -> 7)
const EDGES = [
  [0, 1],
  [1, 2],
  [1, 4],
  [4, 7],
];
const BRANCH_TARGETS = new Set([2, 4, 7]);

// colours
const EMERALD = '52, 211, 153';
const EMERALD_LIGHT = '110, 231, 183';
const GOLD = '217, 183, 126';
const CREAM = '239, 234, 221';

export function createParticles(count = 140) {
  const rnd = mulberry32(20241125);
  return Array.from({ length: count }, () => ({
    sx: rnd(),
    sy: rnd(),
    phase: rnd() * TAU,
    drift: 6 + rnd() * 16,
    orbA: rnd() * TAU,
    orbR: 0.6 + rnd() * 0.9,
    orbSpeed: (0.12 + rnd() * 0.3) * (rnd() < 0.5 ? -1 : 1),
    slotX: rnd(),
    slotY: rnd(),
    w: 5 + rnd() * 13,
    h: 3 + rnd() * 2,
    depth: 0.4 + rnd() * 0.9,
    gold: rnd() < 0.16,
    delay: rnd() * 0.1,
    swirl: (rnd() - 0.5) * 2,
  }));
}

export function getLayout(w, h) {
  const stacked = w < 1024;
  const cols = w < 640 ? 2 : 3;
  const rows = cols === 2 ? 4 : 3;
  const count = cols * rows;
  const gridW = stacked ? Math.min(w * 0.92, 760) : Math.min(w * 0.44, 620);
  const gap = gridW * 0.04;
  const cw = (gridW - gap * (cols - 1)) / cols;
  let ch = cw * 0.5;
  if (stacked) ch = Math.min(ch, (h * 0.44 - gap * (rows - 1)) / rows);
  const gridH = rows * ch + (rows - 1) * gap;
  const cx = stacked ? w / 2 : w * 0.7;
  const cy = stacked ? h * 0.66 : h * 0.5;
  const gx0 = cx - gridW / 2;
  const gy0 = cy - gridH / 2 - 12;
  const R = Math.max(30, Math.min(h * 0.11, gridW * 0.17));
  return { stacked, cols, rows, count, gridW, gap, cw, ch, gridH, cx, cy, gx0, gy0, R };
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function cardRect(L, k) {
  const col = k % L.cols;
  const row = Math.floor(k / L.cols);
  return { x: L.gx0 + col * (L.cw + L.gap), y: L.gy0 + row * (L.ch + L.gap) };
}

/** Draw a pre-rendered image frame (optional: /public/frames/frame_N.webp) */
export function drawFrame(ctx, w, h, img) {
  ctx.clearRect(0, 0, w, h);
  if (!img) return;
  const scale = Math.min(w / img.width, h / img.height);
  const x = (w - img.width * scale) / 2;
  const y = (h - img.height * scale) / 2;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

export function drawScene(ctx, w, h, p, t, lift, particles) {
  const L = getLayout(w, h);
  const { cx, cy, R } = L;

  ctx.clearRect(0, 0, w, h);

  // ---- Background: espresso-black-green glow that blends into the page ----
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.75);
  bg.addColorStop(0, 'rgba(16, 60, 44, 0.55)');
  bg.addColorStop(0.45, 'rgba(8, 22, 16, 0.5)');
  bg.addColorStop(1, 'rgba(5, 8, 6, 0)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Faint dotted grid with scroll parallax
  ctx.fillStyle = `rgba(${EMERALD}, 0.07)`;
  const step = 44;
  const off = (p * 90) % step;
  for (let gx = 0; gx < w + step; gx += step) {
    for (let gy = -step; gy < h + step; gy += step) {
      ctx.fillRect(gx, gy + off, 1.5, 1.5);
    }
  }

  // ---- Stage values ----
  const orbIn = seg(p, 0.1, 0.3);
  const orbOut = 1 - seg(p, 0.78, 0.9);
  const orbA = orbIn * orbOut;
  const orbScale = lerp(0.45, 1, seg(p, 0.12, 0.5)) * (1 + Math.sin(t * 2) * 0.03);
  const t3 = seg(p, 0.8, 0.92);
  const t4 = seg(p, 0.88, 1);

  // Global anti-gravity float (scroll velocity driven)
  ctx.save();
  ctx.translate(0, lift * 0.35);

  // ---- Orb (LLM structured extraction core) ----
  if (orbA > 0.01) {
    const glowR = R * orbScale * 2.6;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
    glow.addColorStop(0, `rgba(${EMERALD}, ${0.55 * orbA})`);
    glow.addColorStop(0.5, `rgba(${EMERALD}, ${0.14 * orbA})`);
    glow.addColorStop(1, `rgba(${EMERALD}, 0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, TAU);
    ctx.fill();

    // rotating rings
    for (let i = 0; i < 3; i += 1) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.3 * (i + 1) * (i % 2 ? -1 : 1) + p * TAU * (i + 1) * 0.5);
      ctx.scale(1, 0.32 + 0.18 * i);
      ctx.strokeStyle = `rgba(${EMERALD_LIGHT}, ${0.5 * orbA})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, R * orbScale * (1 + i * 0.35), 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    // bright core
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * orbScale * 0.6);
    core.addColorStop(0, `rgba(${CREAM}, ${0.95 * orbA})`);
    core.addColorStop(0.55, `rgba(${EMERALD_LIGHT}, ${0.8 * orbA})`);
    core.addColorStop(1, `rgba(${EMERALD}, 0)`);
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, R * orbScale * 0.6, 0, TAU);
    ctx.fill();

    const labelA = seg(p, 0.3, 0.42) * orbOut;
    if (labelA > 0.02) {
      ctx.fillStyle = `rgba(${CREAM}, ${0.75 * labelA})`;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LANGCHAIN  ·  STRUCTURED OUTPUT', cx, cy + R * orbScale * 2.1);
    }
  }

  // ---- Connectors (3-level branching) drawn behind the cards ----
  if (t3 > 0.001) {
    ctx.save();
    ctx.lineWidth = 1.6;
    ctx.setLineDash([6, 6]);
    ctx.lineDashOffset = -t * 18;
    EDGES.forEach(([a, b], idx) => {
      if (a >= L.count || b >= L.count) return;
      const ra = cardRect(L, a);
      const rb = cardRect(L, b);
      const ax = ra.x + L.cw / 2;
      const ay = ra.y + L.ch / 2;
      const bx = rb.x + L.cw / 2;
      const by = rb.y + L.ch / 2;
      const local = clamp(t3 * 1.4 - idx * 0.12);
      ctx.strokeStyle = `rgba(${GOLD}, ${0.85 * local})`;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(lerp(ax, bx, local), lerp(ay, by, local));
      ctx.stroke();
    });
    ctx.restore();
  }

  // ---- Cards ----
  const fs = clamp(L.cw * 0.075, 9, 13);
  for (let k = 0; k < L.count; k += 1) {
    const ca = seg(p, 0.6 + k * 0.01, 0.76 + k * 0.01);
    if (ca < 0.01) continue;
    const { x, y: y0 } = cardRect(L, k);
    const y = y0 + (1 - ca) * 14;
    const pad = L.cw * 0.07;
    const isBranch = BRANCH_TARGETS.has(k) && t3 > 0.6;

    ctx.save();
    ctx.globalAlpha = ca;
    roundRect(ctx, x, y, L.cw, L.ch, 10);
    ctx.fillStyle = 'rgba(15, 24, 19, 0.94)';
    ctx.fill();
    ctx.strokeStyle = isBranch ? `rgba(${GOLD}, 0.9)` : `rgba(${EMERALD}, 0.45)`;
    ctx.lineWidth = isBranch ? 1.6 : 1;
    ctx.stroke();

    // label
    ctx.textAlign = 'left';
    ctx.fillStyle = `rgba(${CREAM}, 0.95)`;
    ctx.font = `600 ${fs}px Inter, sans-serif`;
    ctx.fillText(FIELD_LABELS[k % FIELD_LABELS.length], x + pad, y + L.ch * 0.3, L.cw * 0.6);

    // confidence badge
    const badge = `AI ${CONFIDENCE[k % CONFIDENCE.length]}%`;
    ctx.font = `600 ${fs * 0.8}px ui-monospace, monospace`;
    const bw = ctx.measureText(badge).width + 10;
    const bh = fs * 1.35;
    roundRect(ctx, x + L.cw - pad - bw, y + L.ch * 0.3 - bh * 0.72, bw, bh, bh / 2);
    ctx.fillStyle = `rgba(${EMERALD}, 0.18)`;
    ctx.fill();
    ctx.fillStyle = `rgba(${EMERALD_LIGHT}, 1)`;
    ctx.fillText(badge, x + L.cw - pad - bw + 5, y + L.ch * 0.3 + fs * 0.05);

    // value text appears once tokens have landed
    const va = seg(p, 0.7 + k * 0.008, 0.82 + k * 0.008);
    if (va > 0.01) {
      ctx.globalAlpha = ca * va;
      ctx.fillStyle = `rgba(${CREAM}, 0.75)`;
      ctx.font = `500 ${fs}px Inter, sans-serif`;
      ctx.fillText(FIELD_VALUES[k % FIELD_VALUES.length], x + pad, y + L.ch * 0.66, L.cw * 0.84);
      // fill bar
      ctx.globalAlpha = ca;
      roundRect(ctx, x + pad, y + L.ch * 0.8, L.cw - pad * 2, 3, 1.5);
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fill();
      roundRect(ctx, x + pad, y + L.ch * 0.8, (L.cw - pad * 2) * va, 3, 1.5);
      ctx.fillStyle = isBranch ? `rgba(${GOLD}, 0.9)` : `rgba(${EMERALD}, 0.9)`;
      ctx.fill();
    }
    ctx.restore();
  }

  // Branch pulse dots + tag
  if (t3 > 0.95) {
    EDGES.forEach(([a, b], idx) => {
      if (a >= L.count || b >= L.count) return;
      const ra = cardRect(L, a);
      const rb = cardRect(L, b);
      const f = (t * 0.35 + idx * 0.25) % 1;
      const px = lerp(ra.x + L.cw / 2, rb.x + L.cw / 2, f);
      const py = lerp(ra.y + L.ch / 2, rb.y + L.ch / 2, f);
      ctx.fillStyle = `rgba(${GOLD}, 1)`;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, TAU);
      ctx.fill();
    });
  }
  if (t3 > 0.05) {
    ctx.textAlign = 'right';
    ctx.font = '700 10px Inter, sans-serif';
    ctx.fillStyle = `rgba(${GOLD}, ${t3})`;
    ctx.fillText('3-LEVEL BRANCH ACTIVE', L.gx0 + L.gridW, L.gy0 - 10);
  }

  // ---- Tokens (the unstructured narrative) ----
  const n = particles.length;
  for (let i = 0; i < n; i += 1) {
    const pt = particles[i];
    const t1 = seg(p, 0.16 + pt.delay, 0.46 + pt.delay);
    const t2 = seg(p, 0.5 + pt.delay * 0.8, 0.76 + pt.delay * 0.8);

    // scattered, floating state (anti-gravity: lift moves tokens by depth)
    const sx = pt.sx * w + Math.sin(t * 0.5 + pt.phase) * pt.drift;
    const sy = pt.sy * h + Math.cos(t * 0.4 + pt.phase) * pt.drift - lift * pt.depth * 2.2;

    // orbiting the core
    const ang = pt.orbA + t * pt.orbSpeed + p * TAU * 0.5;
    const r = R * (1.1 + pt.orbR * 0.9) * (1 + 0.05 * Math.sin(t * 2 + pt.phase));
    const ox = cx + Math.cos(ang) * r;
    const oy = cy + Math.sin(ang) * r * 0.62;

    // landing slot inside a form card
    const k = i % L.count;
    const rect = cardRect(L, k);
    const tx = rect.x + L.cw * 0.07 + pt.slotX * L.cw * 0.86;
    const ty = rect.y + L.ch * 0.64 + (pt.slotY - 0.5) * L.ch * 0.1;

    let x = lerp(sx, ox, t1);
    let y = lerp(sy, oy, t1);
    x += Math.sin(t1 * Math.PI) * pt.swirl * 36;
    y += Math.cos(t1 * Math.PI) * pt.swirl * 20;
    x = lerp(x, tx, t2);
    y = lerp(y, ty, t2);
    x += Math.sin(t2 * Math.PI) * pt.swirl * 24;

    const alpha = (0.3 + 0.5 * pt.depth) * (1 - seg(p, 0.74, 0.83));
    if (alpha < 0.02) continue;
    const width = lerp(pt.w, pt.w * 0.7, t1);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = pt.gold ? `rgb(${GOLD})` : `rgb(${t1 > 0.5 ? EMERALD_LIGHT : CREAM})`;
    roundRect(ctx, x - width / 2, y - pt.h / 2, width, pt.h, pt.h / 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ---- Dynamic validation tracker ----
  if (t4 > 0.01) {
    const by = L.gy0 + L.gridH + 30;
    ctx.textAlign = 'left';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.fillStyle = `rgba(${CREAM}, ${0.85 * t4})`;
    ctx.fillText(`Dynamic Validation Tracker: ${Math.round(t4 * 100)}% Form Completion`, L.gx0, by - 9, L.gridW * 0.75);
    if (t4 > 0.98 && L.gridW > 520) {
      ctx.textAlign = 'right';
      ctx.fillStyle = `rgba(${EMERALD_LIGHT}, 1)`;
      ctx.fillText('100% Fully Validated', L.gx0 + L.gridW, by - 9);
    }
    roundRect(ctx, L.gx0, by, L.gridW, 6, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
    const grad = ctx.createLinearGradient(L.gx0, 0, L.gx0 + L.gridW, 0);
    grad.addColorStop(0, `rgb(${GOLD})`);
    grad.addColorStop(1, `rgb(${EMERALD})`);
    roundRect(ctx, L.gx0, by, Math.max(6, L.gridW * t4), 6, 3);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  ctx.restore();
}
