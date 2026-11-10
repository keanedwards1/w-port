import { useEffect, useRef } from 'react';

/** Runs a draw loop only while the canvas is on screen and motion is allowed. */
export function useCanvasLoop(start: (canvas: HTMLCanvasElement, still: boolean) => ((t: number) => void) | null) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frame = start(canvas, still);
    if (!frame) return;
    canvas.dataset.ready = 'true';
    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const tick = () => { frame((performance.now() - t0) / 1000); if (!still && visible) raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  return ref;
}

export function compile(gl: WebGL2RenderingContext, vs: string, fs: string, feedback?: string[]) {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type) as WebGLShader;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  const p = gl.createProgram() as WebGLProgram;
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs));
  if (feedback) gl.transformFeedbackVaryings(p, feedback, gl.SEPARATE_ATTRIBS);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'link');
  return p;
}

/** Tracks the pointer over an element, in canvas pixels, with eased velocity. */
export function trackPointer(el: HTMLElement, scale: () => number) {
  const state = { x: -9999, y: -9999, vx: 0, vy: 0, active: 0, lastX: 0, lastY: 0, seen: false };
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const s = scale();
    const x = (e.clientX - r.left) * s;
    const y = (e.clientY - r.top) * s;
    if (!state.seen) { state.lastX = x; state.lastY = y; state.seen = true; }
    state.x = x; state.y = y;
    state.active = 1;
  };
  const leave = () => { state.seen = false; };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return state;
}
