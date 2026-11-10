import { compile, trackPointer, useCanvasLoop } from './useCanvasLoop';

/*
 * A photo that sheds drifting particles, adapted from Kean's UI Studies (page 13).
 * Each particle takes its color from the photo, drifts on a noise current, and is
 * swept along by the pointer. The photo itself is drawn underneath.
 */
const UPDATE_VERT = `#version 300 es
precision highp float;
layout(location=0) in vec4 a_posvel;
layout(location=1) in vec4 a_lifeseed;
layout(location=2) in vec3 a_color;
out vec4 v_posvel; out vec4 v_lifeseed; out vec3 v_color; out float v_alpha;
uniform vec2 u_resolution; uniform float u_time; uniform vec2 u_mouse; uniform vec2 u_mouse_velocity;
uniform sampler2D u_image; uniform float u_image_aspect;
vec2 coverUv(vec2 uv) {
  float ca = u_resolution.x / u_resolution.y;
  float s = (u_image_aspect > ca) ? ca / u_image_aspect : u_image_aspect / ca;
  vec2 axis = (u_image_aspect > ca) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  return (uv - 0.5) * (axis * s + (1.0 - axis)) + 0.5;
}
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(.1031, .11369, .13787)); p3 += dot(p3, p3.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
}
float snoise(vec3 p) {
  const float K1 = 0.333333333, K2 = 0.166666667;
  vec3 i = floor(p + (p.x + p.y + p.z) * K1); vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
  vec3 e = step(vec3(0.0), d0 - d0.yzx); vec3 i1 = e * (1.0 - e.zxy); vec3 i2 = 1.0 - e.zxy * (1.0 - e);
  vec3 d1 = d0 - (i1 - K2); vec3 d2 = d0 - (i2 - 2.0 * K2); vec3 d3 = d0 - (1.0 - 3.0 * K2);
  vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
  vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
  return dot(vec4(31.316), n);
}
void main() {
  vec2 position = a_posvel.xy; vec2 velocity = a_posvel.zw;
  float life = a_lifeseed.x + 1.0; float maxLife = a_lifeseed.y; vec2 seed = a_lifeseed.zw;
  float angle = snoise(vec3(position * 0.004, u_time * 0.2 + life * 0.05)) * 6.2831;
  vec2 noiseForce = vec2(cos(angle), sin(angle)) * 0.04;
  vec2 toMouse = position - u_mouse;
  float proximity = 1000.0 / (dot(toMouse, toMouse) * 0.25 + 1000.0);
  vec2 mouseForce = u_mouse_velocity * proximity * 0.08;
  velocity = velocity * 0.98 + noiseForce + mouseForce;
  position += velocity;
  v_posvel = vec4(position, velocity); v_lifeseed = vec4(life, maxLife, seed); v_color = a_color;
  bool dead = life >= maxLife || position.x < 0.0 || position.x > u_resolution.x || position.y < 0.0 || position.y > u_resolution.y;
  if (dead) {
    vec3 h = hash33(vec3(seed, u_time + life));
    vec2 uv = fract(h.xy * 0.5 + 0.5);
    v_posvel = vec4(uv * u_resolution, 0.0, 0.0);
    v_lifeseed = vec4(0.0, maxLife, h.xy);
    v_color = texture(u_image, coverUv(uv)).rgb;
  }
  float lr = v_lifeseed.x / maxLife;
  float alpha = smoothstep(0.0, 0.05, lr) * (1.0 - smoothstep(0.85, 1.0, lr));
  gl_PointSize = smoothstep(1.0, 0.5, lr) * 4.0 * alpha * (u_resolution.x > 1400.0 ? 1.2 : 1.0);
  v_alpha = alpha * 0.55;
  vec2 ndc = v_posvel.xy / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
}`;
const POINT_FRAG = `#version 300 es
precision highp float;
in vec3 v_color; in float v_alpha; out vec4 o;
void main() { float d = length(gl_PointCoord - 0.5); o = vec4(v_color, v_alpha * (1.0 - smoothstep(0.3, 0.5, d))); }`;
const BG_VERT = `#version 300 es
in vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
const BG_FRAG = `#version 300 es
precision highp float;
uniform sampler2D u_image; uniform vec2 u_resolution; uniform float u_image_aspect; out vec4 o;
vec2 coverUv(vec2 uv) {
  float ca = u_resolution.x / u_resolution.y;
  float s = (u_image_aspect > ca) ? ca / u_image_aspect : u_image_aspect / ca;
  vec2 axis = (u_image_aspect > ca) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  return (uv - 0.5) * (axis * s + (1.0 - axis)) + 0.5;
}
void main() { vec2 uv = gl_FragCoord.xy / u_resolution; uv.y = 1.0 - uv.y; o = texture(u_image, coverUv(uv)); }`;

export function ParticlePhoto({ src, alt }: { src: string; alt: string }) {
  const ref = useCanvasLoop((canvas, still) => {
    if (still) return null; // The plain photo underneath is enough.
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: false, antialias: false });
    if (!gl) return null;
    let update: WebGLProgram, bg: WebGLProgram;
    try {
      update = compile(gl, UPDATE_VERT, POINT_FRAG, ['v_posvel', 'v_lifeseed', 'v_color']);
      bg = compile(gl, BG_VERT, BG_FRAG);
    } catch { return null; }

    const count = window.innerWidth < 800 ? 40_000 : 120_000;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const size = () => [Math.round(canvas.clientWidth * dpr), Math.round(canvas.clientHeight * dpr)];
    let [w, h] = size();

    // Two copies of every particle's state, swapped each frame.
    const sets = [0, 1].map(() => {
      const posvel = new Float32Array(count * 4);
      const life = new Float32Array(count * 4);
      for (let i = 0; i < count; i++) {
        posvel.set([Math.random() * w, Math.random() * h, 0, 0], i * 4);
        const max = 80 + Math.random() * 260;
        life.set([max - 1 - Math.random() * 40, max, Math.random(), Math.random()], i * 4);
      }
      const make = (data: Float32Array) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_COPY); return b; };
      const bufs = [make(posvel), make(life), make(new Float32Array(count * 3))];
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      [4, 4, 3].forEach((n, i) => { gl.bindBuffer(gl.ARRAY_BUFFER, bufs[i]); gl.enableVertexAttribArray(i); gl.vertexAttribPointer(i, n, gl.FLOAT, false, 0, 0); });
      gl.bindVertexArray(null);
      return { vao, bufs };
    });
    const tf = gl.createTransformFeedback();

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const bgVao = gl.createVertexArray();
    gl.bindVertexArray(bgVao);
    const pLoc = gl.getAttribLocation(bg, 'p');
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const tex = gl.createTexture();
    let aspect = 1;
    let loaded = false;
    const img = new Image();
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      aspect = img.width / img.height;
      loaded = true;
    };
    img.src = src;

    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const uu = { res: U(update, 'u_resolution'), time: U(update, 'u_time'), mouse: U(update, 'u_mouse'), vel: U(update, 'u_mouse_velocity'), img: U(update, 'u_image'), asp: U(update, 'u_image_aspect') };
    const ub = { res: U(bg, 'u_resolution'), img: U(bg, 'u_image'), asp: U(bg, 'u_image_aspect') };
    const pointer = trackPointer(canvas.parentElement as HTMLElement, () => dpr);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    let read = 0;

    return (t) => {
      if (!loaded) return;
      [w, h] = size();
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      const vx = pointer.seen ? pointer.x - pointer.lastX : 0;
      const vy = pointer.seen ? pointer.y - pointer.lastY : 0;
      pointer.lastX = pointer.x; pointer.lastY = pointer.y;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);

      gl.useProgram(bg);
      gl.uniform2f(ub.res, w, h); gl.uniform1i(ub.img, 0); gl.uniform1f(ub.asp, aspect);
      gl.bindVertexArray(bgVao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const from = sets[read];
      const to = sets[1 - read];
      gl.useProgram(update);
      gl.uniform2f(uu.res, w, h); gl.uniform1f(uu.time, t);
      gl.uniform2f(uu.mouse, pointer.x, pointer.y); gl.uniform2f(uu.vel, vx, vy);
      gl.uniform1i(uu.img, 0); gl.uniform1f(uu.asp, aspect);
      gl.bindVertexArray(from.vao);
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
      to.bufs.forEach((b, i) => gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, b));
      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.endTransformFeedback();
      to.bufs.forEach((_, i) => gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, null));
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
      gl.bindVertexArray(null);
      read = 1 - read;
    };
  });
  return (
    <div className="particle-photo">
      <img src={src} alt={alt} loading="lazy" />
      <canvas ref={ref} aria-hidden="true" />
    </div>
  );
}
