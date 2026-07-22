"use client";

/* Vendored from 21st.dev "icey-night-shards" (Shader Builder recipe) — WebGL1,
   zero dependencies. Recolored via props for our palette. Pointer input drives
   cursorEffect 4: a noise-wobbled circular "mono lens" that re-renders the
   field as black/white (bright crests → white, dark troughs → black) without
   displacing the pattern itself. */

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  float k = 2.0 + u_intensity * 6.0;
  float v = sin(p.x * k + t) + sin(p.y * k * 0.8 - t * 0.7)
    + sin((p.x + p.y) * k * 0.6 + t * 0.5)
    + sin(length(p) * k * 1.2 - t);
  return palette(0.5 + 0.5 * sin(v + u_seed));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      } else {
        /* 4: mono lens — recompute the mask with an fbm-wobbled boundary so
           the circle reads organic, plus a slight inward refraction. */
        float wobble = (fbm(cursorDelta * 5.5 + u_time * 0.5) - 0.5)
          * u_cursorRadius;
        float wobbled = cursorDistance + wobble * 0.45;
        cursorMask = u_cursorPresence
          * (1.0 - smoothstep(u_cursorRadius * 0.82, u_cursorRadius, wobbled));
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.1;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  /* Raw palette luminance, captured before brightness/vignette crush the
     range — the mono lens keys off this so it stays legible everywhere. */
  float monoSrc = dot(col, vec3(0.299, 0.587, 0.114));
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5 && cursorMask > 0.001) {
    /* Mono lens fill: same field, remapped to B/W. Window sits between the
       dark-navy troughs (~0.05) and the blue/violet/teal crests (~0.4+), so
       light blues land white, dark blues land black, with a short gradient
       between so the pattern stays visible (never flat). */
    vec3 mono = vec3(smoothstep(0.09, 0.36, monoSrc));
    col = mix(col, mono, cursorMask);
  }
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export interface ShaderParams {
  colors: string[]; // 1..8 hex colors, blended in order
  scale: number;
  intensity: number;
  warp: number;
  detail: number;
  contrast: number;
  brightness: number;
  saturation: number;
  hue: number;
  vignette: number;
  blur: number;
  grain: number;
  seed: number;
  rotate: number;
  drift: number;
  oklab: number;
  timeScale: number;
  /* mono-lens refraction amount (cursorEffect 4) */
  cursorStrength: number;
}

/* Icy night on ink: dark base flowing through blue → violet → teal.
   Hue rotation zeroed (the source preset's 3.0369rad was tuned for oranges);
   brightness re-tuned for our darker mid-tones. */
export const DEFAULT_SHADER_PARAMS: ShaderParams = {
  /* ink-heavy ramp: half the field stays near-black, color lives in the crests */
  colors: ["#0a0a0a", "#0c1026", "#3b5bff", "#9b5cff", "#00d9c7"],
  scale: 1.8,
  intensity: 0.55,
  warp: 0.42,
  detail: 2.4,
  contrast: 1.06,
  brightness: -0.48,
  saturation: 0.92,
  hue: 0,
  vignette: 0.72,
  blur: 0.016,
  grain: 0.3,
  seed: 7,
  rotate: 0,
  drift: 0.156,
  oklab: 0,
  timeScale: 0.86,
  cursorStrength: 0.5,
};

const pendingCleanup = new WeakMap<HTMLCanvasElement, number>();

export function ShaderBackground({
  className,
  params = DEFAULT_SHADER_PARAMS,
}: {
  className?: string;
  params?: ShaderParams;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const P = paramsRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timeScale = reduceMotion ? 0 : P.timeScale;

    const pending = pendingCleanup.get(canvas);
    if (pending !== undefined) window.clearTimeout(pending);
    pendingCleanup.delete(canvas);

    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      colors: gl.getUniformLocation(program, "u_colors"),
      scene: gl.getUniformLocation(program, "u_scene"),
      shape: gl.getUniformLocation(program, "u_shape"),
      surface: gl.getUniformLocation(program, "u_surface"),
      finish: gl.getUniformLocation(program, "u_finish"),
      transform: gl.getUniformLocation(program, "u_transform"),
      space: gl.getUniformLocation(program, "u_space"),
      cursor: gl.getUniformLocation(program, "u_cursor"),
    };

    const colorCount = Math.min(P.colors.length, 8);
    const rgb = P.colors.slice(0, 8).map(hexToRgb);
    while (rgb.length < 8) rgb.push(rgb[rgb.length - 1]);
    gl.uniform3fv(u.colors, new Float32Array(rgb.flat()));
    gl.uniform4f(u.shape, P.scale, P.intensity, 0.5, P.warp);
    gl.uniform4f(u.surface, P.detail, P.contrast, P.brightness, P.saturation);
    gl.uniform4f(u.finish, P.hue, P.vignette, P.blur, P.grain);
    gl.uniform4f(u.transform, P.seed, P.rotate, P.drift, P.oklab);
    gl.uniform4f(u.cursor, 0, 4, P.cursorStrength, 0.297);

    /* Pointer push: targets fed by pointermove, smoothed in the render loop.
       z = presence (0..1), eased in/out on enter/leave. */
    let targetX = 0,
      targetY = 0,
      targetZ = 0;
    let smoothX = 0,
      smoothY = 0,
      smoothZ = 0;
    let rect = canvas.getBoundingClientRect();
    let rafId = 0;
    let lastTime: number | null = null;
    let tabVisible = document.visibilityState === "visible";
    let intersecting = true;
    let destroyed = false;
    const startTime = performance.now();
    const alwaysAnimating = Math.abs(timeScale) > 1e-4;

    const onPointerMove = (e: PointerEvent) => {
      targetX = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      targetY = -(((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
      targetZ = 1;
      requestRender();
    };
    const onPointerLeave = () => {
      targetZ = 0;
      requestRender();
    };
    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.round(rect.width * dpr));
      const cssH = Math.max(1, Math.round(rect.height * dpr));
      const scale = Math.min(1, Math.sqrt(2_000_000 / Math.max(1, cssW * cssH)));
      const w = Math.max(1, Math.round(cssW * scale));
      const h = Math.max(1, Math.round(cssH * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    function requestRender() {
      if (!destroyed && tabVisible && intersecting && rafId === 0) {
        rafId = requestAnimationFrame(render);
      }
    }

    const updateLayout = () => {
      rect = canvas.getBoundingClientRect();
      resizeCanvas();
      requestRender();
    };
    window.addEventListener("resize", updateLayout);

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry?.isIntersecting ?? true;
      if (intersecting) requestRender();
      else if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        lastTime = null;
      }
    });
    intersectionObserver.observe(canvas);

    const onVisibilityChange = () => {
      tabVisible = document.visibilityState === "visible";
      if (tabVisible) requestRender();
      else if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        lastTime = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function render(now: number) {
      rafId = 0;
      if (destroyed || !tabVisible || !intersecting || !gl) return;
      const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const lerp = 1 - Math.exp(-12 * dt);
      smoothX += (targetX - smoothX) * lerp;
      smoothY += (targetY - smoothY) * lerp;
      smoothZ += (targetZ - smoothZ) * lerp;
      resizeCanvas();
      const w = canvas!.width,
        h = canvas!.height;
      gl.uniform4f(
        u.scene,
        w,
        h,
        ((now - startTime) / 1000) * timeScale,
        colorCount,
      );
      gl.uniform4f(u.space, 0, 0, smoothX, smoothY);
      gl.uniform4f(u.cursor, smoothZ, 4, paramsRef.current.cursorStrength, 0.297);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const stillLerping =
        Math.abs(targetX - smoothX) > 0.001 ||
        Math.abs(targetY - smoothY) > 0.001 ||
        Math.abs(targetZ - smoothZ) > 0.001;
      if (alwaysAnimating || stillLerping) requestRender();
      else lastTime = null;
    }
    requestRender();

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      const timeoutId = window.setTimeout(() => {
        if (pendingCleanup.get(canvas) === timeoutId) {
          pendingCleanup.delete(canvas);
          gl.getExtension("WEBGL_lose_context")?.loseContext();
          canvas.width = 1;
          canvas.height = 1;
        }
      }, 0);
      pendingCleanup.set(canvas, timeoutId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
