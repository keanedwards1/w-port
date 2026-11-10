import { useEffect, useRef } from 'react';

/*
 * A topographic map, like the hills around Lagunitas: contour lines traced from a slow noise field.
 * Every fifth line is an index contour, drawn a little stronger, the way trail maps do it.
 */

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (t: number) => t * t * (3 - 2 * t);
const noise = (x: number, y: number) => {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const u = smooth(fx), v = smooth(fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const field = (x: number, y: number, t: number) =>
  noise(x + t, y) * 0.6 + noise(x * 2.1 - t * 0.7, y * 2.1 + 3.7) * 0.28 + noise(x * 4.3 + 9.1, y * 4.3 - t * 0.4) * 0.12;

export function Topo({ milk = false }: { milk?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const milkRef = useRef(milk);
  milkRef.current = milk;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cell = 10;
    const levels = 22;
    let raf = 0;
    const t0 = performance.now();

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const t = still ? 0 : (performance.now() - t0) / 1000 * 0.025;
      const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1;
      const g = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) g[j * cols + i] = field(i * cell / 260, j * cell / 260, t);

      const ink = milkRef.current ? '18, 18, 74' : '170, 192, 255';
      for (let k = 1; k < levels; k++) {
        const L = k / levels;
        const index = k % 5 === 0;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = g[j * cols + i], b = g[j * cols + i + 1], c = g[(j + 1) * cols + i + 1], d = g[(j + 1) * cols + i];
            const code = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
            if (code === 0 || code === 15) continue;
            const x = i * cell, y = j * cell;
            const top = [x + cell * (L - a) / (b - a), y];
            const right = [x + cell, y + cell * (L - b) / (c - b)];
            const bottom = [x + cell * (L - d) / (c - d), y + cell];
            const left = [x, y + cell * (L - a) / (d - a)];
            const seg = (p: number[], q: number[]) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
            switch (code) {
              case 1: case 14: seg(left, bottom); break;
              case 2: case 13: seg(bottom, right); break;
              case 3: case 12: seg(left, right); break;
              case 4: case 11: seg(top, right); break;
              case 6: case 9: seg(top, bottom); break;
              case 7: case 8: seg(left, top); break;
              case 5: seg(left, top); seg(bottom, right); break;
              case 10: seg(top, right); seg(left, bottom); break;
            }
          }
        }
        ctx.strokeStyle = `rgba(${ink}, ${index ? 0.34 : 0.15})`;
        ctx.lineWidth = index ? 1.25 : 0.8;
        ctx.stroke();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="topo" aria-hidden="true" />;
}
