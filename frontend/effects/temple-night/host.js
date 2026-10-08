// Vanilla-JS host for the verified Temple Night renderer.
// This project has no React, so this mirrors the lifecycle of
// TempleNightScene.tsx: sized canvas, resize/intersection observers,
// pointer parallax, tab-visibility handling, and full disposal.

import { createTempleNightRenderer } from './temple-night/templeNightRenderer.js';

// Starts the renderer on a canvas. Returns a dispose function (or null
// when WebGL is unavailable).
export function startTempleNight(canvas) {
  let renderer;
  try {
    renderer = createTempleNightRenderer(canvas);
  } catch (err) {
    console.error('Temple Night failed to start:', err);
    return null;
  }
  if (!renderer) return null;

  const host = canvas.parentElement;
  let frame = 0;
  let visible = true;
  let disposed = false;
  let firstFrame = false;

  const schedule = () => {
    if (!disposed && visible && !document.hidden && !frame) {
      frame = requestAnimationFrame(render);
    }
  };
  const render = (time) => {
    frame = 0;
    renderer.render(time);
    if (!firstFrame) {
      firstFrame = true;
      canvas.classList.add('is-ready');
    }
    if (!renderer.reducedMotion) schedule();
  };
  const resize = () => {
    renderer.resize();
    schedule();
  };
  const setPointer = (event) => {
    const bounds = canvas.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1;
    const y = 1 - ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2;
    renderer.setPointer(x, y, true);
    schedule();
  };
  const clearPointer = () => {
    renderer.setPointer(0, 0, false);
    schedule();
  };
  const onVisibility = () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      schedule();
    }
  };

  const resizeObserver = new ResizeObserver(resize);
  if (host) resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    visible = entry ? entry.isIntersecting : true;
    if (!visible && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      schedule();
    }
  });
  if (host) intersectionObserver.observe(host);

  canvas.addEventListener('pointermove', setPointer, { passive: true });
  canvas.addEventListener('pointerleave', clearPointer, { passive: true });
  window.addEventListener('blur', clearPointer);
  document.addEventListener('visibilitychange', onVisibility);
  resize();

  return function dispose() {
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    canvas.removeEventListener('pointermove', setPointer);
    canvas.removeEventListener('pointerleave', clearPointer);
    window.removeEventListener('blur', clearPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    renderer.dispose();
  };
}
