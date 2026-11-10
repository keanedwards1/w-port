import { useRef } from 'react';
import { compile, useCanvasLoop } from './useCanvasLoop';

/*
 * The site background: a slow blue field seen through water, turning to milk as the page scrolls.
 * A ripple simulation runs on a height map. Moving the pointer leaves a wake,
 * and the field is refracted and lit through the moving surface.
 */
const QUAD = `#version 300 es
in vec2 p; out vec2 uv; void main() { uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

// Wave equation step. r = height now, g = height a step ago.
const STEP = `#version 300 es
precision highp float;
uniform sampler2D s; uniform vec2 px; uniform vec2 a; uniform vec2 b; uniform float drop; uniform float radius;
in vec2 uv; out vec4 o;
float seg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0); return length(pa - ba * h); }
void main() {
  vec2 c = texture(s, uv).rg;
  float n = texture(s, uv + vec2(px.x, 0)).r + texture(s, uv - vec2(px.x, 0)).r + texture(s, uv + vec2(0, px.y)).r + texture(s, uv - vec2(0, px.y)).r;
  float h = (n * 0.5 - c.g) * 0.976;
  float aspect = px.y / px.x;
  float d = seg(uv * vec2(aspect, 1.0), a * vec2(aspect, 1.0), b * vec2(aspect, 1.0));
  h += drop * smoothstep(radius, 0.0, d);
  o = vec4(h, c.r, 0.0, 1.0);
}`;

// The scene: a slow domain-warped cobalt field, refracted and lit by the water surface.
const SHADE = `#version 300 es
precision highp float;
uniform sampler2D s; uniform vec2 r; uniform vec2 px; uniform float t; uniform float off; uniform float dim; uniform float warm;
in vec2 uv; out vec4 o;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f); return mix(mix(h(i), h(i + vec2(1, 0)), u.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; mat2 R = mat2(0.8, 0.6, -0.6, 0.8); for (int i = 0; i < 5; i++) { v += a * n(p); p = R * p * 2.03; a *= 0.5; } return v; }
vec3 field(vec2 q) {
  vec2 p = vec2(q.x * r.x / r.y, q.y + off) * 1.4;
  vec2 w1 = vec2(fbm(p + t * 0.012), fbm(p + vec2(5.2, 1.3) - t * 0.01));
  vec2 w2 = vec2(fbm(p + 3.0 * w1 + vec2(1.7, 9.2) + t * 0.016), fbm(p + 3.0 * w1 + vec2(8.3, 2.8) - t * 0.013));
  float f = fbm(p + 3.0 * w2);
  float body = smoothstep(0.15, 0.55, f), glint = smoothstep(0.6, 0.88, f);
  // Blue water at the top of the page. It darkens past the first screen so cream text reads.
  vec3 deepB = vec3(0.04, 0.07, 0.42);
  vec3 blue = mix(mix(deepB, vec3(0.1, 0.24, 1.0), body), vec3(0.5, 0.74, 1.0), glint * 0.6 * (1.0 - dim * 0.7));
  float calm = smoothstep(0.75, 0.0, length((q - vec2(0.5, 0.5)) * vec2(1.1, 1.6)));
  blue = mix(mix(blue, deepB, calm * 0.42), deepB, dim);
  // Milk further down: soft cream with a little movement in it, so navy text reads.
  vec3 milk = mix(mix(vec3(0.76, 0.69, 0.56), vec3(0.95, 0.93, 0.87), body), vec3(1.0, 0.99, 0.97), glint * 0.85);
  vec3 cream = vec3(0.94, 0.92, 0.86);
  return mix(mix(blue, cream, smoothstep(0.0, 0.5, warm)), milk, smoothstep(0.5, 1.0, warm));
}
void main() {
  float hl = texture(s, uv - vec2(px.x, 0)).r, hr = texture(s, uv + vec2(px.x, 0)).r;
  float hd = texture(s, uv - vec2(0, px.y)).r, hu = texture(s, uv + vec2(0, px.y)).r;
  vec2 g = vec2(hr - hl, hu - hd);
  vec3 normal = normalize(vec3(-g * 70.0, 1.0));
  vec3 col = field(uv + g * 9.0);
  vec3 light = normalize(vec3(-0.4, 0.6, 1.0));
  float spec = pow(max(dot(reflect(-light, normal), vec3(0, 0, 1)), 0.0), 40.0);
  float edge = clamp(length(g) * 40.0, 0.0, 1.0);
  col += spec * 0.6 * edge + max(dot(normal, light) - light.z, 0.0) * 0.35;
  col += (h(gl_FragCoord.xy + fract(t)) - 0.5) * 0.03;
  o = vec4(col, 1.0);
}`;

/**
 * The site's water. By default it fills the window behind every page and follows the scroll.
 * With inPanel it fills its container instead (the Hire me panel), stays dark, and turns to milk when milk is set.
 */
export function Water({ inPanel = false, milk = false }: { inPanel?: boolean; milk?: boolean }) {
  const opts = useRef({ inPanel, milk });
  opts.current = { inPanel, milk };
  const ref = useCanvasLoop((canvas, still) => {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) return null;
    const floatOk = !!gl.getExtension('EXT_color_buffer_float');
    let step: WebGLProgram | null = null, shade: WebGLProgram;
    try {
      shade = compile(gl, QUAD, SHADE);
      if (floatOk) step = compile(gl, QUAD, STEP);
    } catch { return null; }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const bindQuad = (prog: WebGLProgram) => {
      const loc = gl.getAttribLocation(prog, 'p');
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    // The ripple map runs at a lower resolution than the screen. Ripples are smooth, so it holds up.
    const scale = () => Math.min(window.devicePixelRatio, 2) * 0.6;
    let simW = 0, simH = 0;
    let targets: { tex: WebGLTexture; fb: WebGLFramebuffer }[] = [];
    const makeTargets = (w: number, h: number) => {
      targets.forEach((x) => { gl.deleteTexture(x.tex); gl.deleteFramebuffer(x.fb); });
      targets = [0, 1].map(() => {
        const tex = gl.createTexture() as WebGLTexture;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, w, h, 0, gl.RG, gl.HALF_FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const fb = gl.createFramebuffer() as WebGLFramebuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return { tex, fb };
      });
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    const U = (p: WebGLProgram, k: string) => gl.getUniformLocation(p, k);
    const us = step && { s: U(step, 's'), px: U(step, 'px'), a: U(step, 'a'), b: U(step, 'b'), drop: U(step, 'drop'), radius: U(step, 'radius') };
    const ush = { s: U(shade, 's'), r: U(shade, 'r'), px: U(shade, 'px'), t: U(shade, 't'), off: U(shade, 'off'), dim: U(shade, 'dim'), warm: U(shade, 'warm') };
    // The canvas fills the window, so the pointer is tracked across the whole page.
    const pointer = { x: 0, y: 0, seen: false };
    window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.seen = true; }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { pointer.seen = false; });
    let last: [number, number] | null = null;
    // Scrolling moves the water and stirs it.
    let lastScroll = window.scrollY;
    let flow = 0;
    let dimEased = 0;
    let warmEased = 0;
    let tint = '';
    let read = 0;

    return (t) => {
      const w = Math.round(canvas.clientWidth * scale());
      const h = Math.round(canvas.clientHeight * scale());
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        simW = Math.max(2, Math.round(w * 0.5)); simH = Math.max(2, Math.round(h * 0.5));
        if (step) makeTargets(simW, simH);
      }

      const panel = opts.current.inPanel;
      const sy = panel ? 0 : window.scrollY;
      const speed = sy - lastScroll;
      lastScroll = sy;
      flow += (sy * 0.00035 - flow) * 0.08;
      // Past the first screen, the water darkens so text on top of it stays easy to read.
      // The water turns to milk as the marked section (Selected work) reaches the top of the screen (or partway down a page without one).
      const shift = document.querySelector('[data-tone-shift]');
      const vh = window.innerHeight;
      // Pages marked data-tone-hold (like Privacy) stay blue the whole way down.
      const hold = !panel && !!document.querySelector('[data-tone-hold]');
      const warmTarget = opts.current.milk ? 1 : panel || hold ? 0 : shift
        ? Math.min(Math.max((vh * 1.0 - shift.getBoundingClientRect().top) / (vh * 3.5), 0), 1)
        : Math.min(Math.max((sy / Math.max(document.documentElement.scrollHeight - vh, 1) - 0.25) / 0.3, 0), 1);
      if (!panel && opts.current.milk) warmEased = 1;
      else warmEased += (warmTarget - warmEased) * 0.08;
      const dimTarget = panel ? 0.5 : Math.min(sy / (vh * 0.8), 1) * 0.55;
      dimEased += (dimTarget - dimEased) * 0.08;
      // Text turns navy once the water is light, and the header and phone bar take on the water's color.
      if (!panel) {
        const light = warmEased > 0.3;
        if ((document.documentElement.dataset.tone === 'light') !== light) {
          if (light) document.documentElement.dataset.tone = 'light'; else delete document.documentElement.dataset.tone;
        }
        const k = warmEased, d = [6 + 236 * k, 11 + 226 * k, 64 + 161 * k].map(Math.round).join(' ');
        if (d !== tint) { tint = d; document.documentElement.style.setProperty('--tint', d); }
      }

      if (step && us) {
        // Where the pointer is now and where it was, in 0..1 with y up.
        const rect = canvas.getBoundingClientRect();
        const inside = pointer.seen && pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
        const now: [number, number] | null = inside ? [(pointer.x - rect.left) / rect.width, 1 - (pointer.y - rect.top) / rect.height] : null;
        const from = last ?? now;
        const moved = now && from ? Math.hypot(now[0] - from[0], now[1] - from[1]) : 0;
        last = now;
        gl.useProgram(step);
        bindQuad(step);
        gl.viewport(0, 0, simW, simH);
        // Two small steps a frame make the waves travel at a pleasant speed.
        for (let i = 0; i < 2; i++) {
          const src = targets[read], dst = targets[1 - read];
          gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, src.tex);
          gl.uniform1i(us.s, 0);
          gl.uniform2f(us.px, 1 / simW, 1 / simH);
          gl.uniform2f(us.a, ...(from ?? [-1, -1]));
          gl.uniform2f(us.b, ...(now ?? [-1, -1]));
          if (i === 1 && !still && Math.abs(speed) > 2) {
            // A scroll drops a little rain somewhere on the surface.
            const rx = Math.random(), ry = Math.random();
            gl.uniform2f(us.a, rx, ry);
            gl.uniform2f(us.b, rx, ry);
            gl.uniform1f(us.drop, Math.min(Math.abs(speed) * 0.003, 0.07));
            gl.uniform1f(us.radius, 0.014);
          } else {
            gl.uniform1f(us.drop, i === 0 && now && !still && moved > 0.0008 ? Math.min(0.04 + moved * 1.6, 0.11) : 0);
            gl.uniform1f(us.radius, 0.018);
          }
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          read = 1 - read;
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }

      gl.viewport(0, 0, w, h);
      gl.useProgram(shade);
      bindQuad(shade);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, step ? targets[read].tex : null);
      gl.uniform1i(ush.s, 0);
      gl.uniform2f(ush.r, w, h);
      gl.uniform2f(ush.px, 1 / Math.max(simW, 2), 1 / Math.max(simH, 2));
      gl.uniform1f(ush.t, still ? 20 : t + 20);
      gl.uniform1f(ush.off, flow);
      gl.uniform1f(ush.dim, dimEased);
      gl.uniform1f(ush.warm, warmEased);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
  });
  return <canvas ref={ref} className={inPanel ? 'water water-panel' : 'water'} aria-hidden="true" />;
}
