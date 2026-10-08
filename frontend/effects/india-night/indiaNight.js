// Original artwork for this app: an Indian temple gopuram on a starry night.
// Procedural Three.js r149. No external assets, no copied code.
//
// startIndiaNight(canvas) starts the scene and returns a dispose function.
// It exposes the same lifecycle shape as the temple-night host
// (resize, pointer parallax, visibility handling, reduced-motion support).

import * as THREE from 'three';

export function startIndiaNight(canvas) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060a17);
  scene.fog = new THREE.Fog(0x060a17, 55, 170);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
  const camBase = new THREE.Vector3(0, 8, 46);
  camera.position.copy(camBase);
  camera.lookAt(0, 11, 0);

  scene.add(new THREE.AmbientLight(0x33406e, 0.55));
  const moonLight = new THREE.DirectionalLight(0xa9bfff, 0.6);
  moonLight.position.set(-35, 42, -25);
  scene.add(moonLight);

  const rand = (a, b) => a + Math.random() * (b - a);

  // Soft radial sprite texture used for glows and mist.
  function radialTexture(stops) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 64, 2, 64, 64, 64);
    stops.forEach(([offset, color]) => g.addColorStop(offset, color));
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const glowTex = radialTexture([
    [0, 'rgba(255,255,255,1)'],
    [0.35, 'rgba(255,255,255,0.35)'],
    [1, 'rgba(255,255,255,0)'],
  ]);

  // Stars: two layers drifting slowly in opposite directions.
  function makeStars(count, rMin, rMax, size, opacity) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = rand(rMin, rMax);
      pos[i * 3] = Math.cos(t) * r;
      pos[i * 3 + 1] = rand(8, 95);
      pos[i * 3 + 2] = Math.sin(t) * r - 40;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xd6e0ff, size, transparent: true, opacity, depthWrite: false,
    }));
    scene.add(pts);
    return pts;
  }
  const starsA = makeStars(650, 90, 170, 1.5, 0.9);
  const starsB = makeStars(280, 80, 150, 2.4, 0.55);

  // Moon and its halo.
  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(6.5, 48),
    new THREE.MeshBasicMaterial({ color: 0xe9efff, fog: false })
  );
  moon.position.set(-40, 38, -110);
  moon.lookAt(camera.position);
  scene.add(moon);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xbccbff, transparent: true, opacity: 0.5, fog: false, depthWrite: false,
  }));
  halo.scale.set(36, 36, 1);
  halo.position.copy(moon.position);
  scene.add(halo);

  // Materials.
  const stone = new THREE.MeshStandardMaterial({ color: 0x51463c, roughness: 0.92 });
  const stoneDark = new THREE.MeshStandardMaterial({ color: 0x3a3129, roughness: 0.95 });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xd9a441, roughness: 0.35, metalness: 0.85, emissive: 0x3a2405,
  });
  const windowMat = new THREE.MeshBasicMaterial({ color: 0xffb84d });

  // Tiered gopuram tower with lit niches and a gold finial.
  function buildGopuram(tiers, baseW, tierH) {
    const g = new THREE.Group();
    let y = 0;
    for (let i = 0; i < tiers; i++) {
      const w = baseW * (1 - i * 0.105);
      const d = baseW * 0.72 * (1 - i * 0.105);
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, tierH, d), i % 2 ? stoneDark : stone);
      body.position.y = y + tierH / 2;
      g.add(body);
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w * 1.1, tierH * 0.16, d * 1.1), stoneDark);
      slab.position.y = y + tierH * 1.02;
      g.add(slab);
      const n = Math.max(3, 8 - i);
      for (let k = 0; k < n; k++) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.085, tierH * 0.38), windowMat);
        win.position.set((k - (n - 1) / 2) * w * 0.15, y + tierH * 0.46, d / 2 + 0.07);
        g.add(win);
      }
      y += tierH * 1.18;
    }
    const finial = new THREE.Mesh(new THREE.ConeGeometry(baseW * 0.085, tierH * 1.35, 14), gold);
    finial.position.y = y + tierH * 0.65;
    g.add(finial);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(baseW * 0.05, 12, 10), gold);
    orb.position.y = y + tierH * 1.35;
    g.add(orb);
    return g;
  }

  const main = buildGopuram(7, 16, 3.4);
  main.position.set(0, 0, -14);
  scene.add(main);

  const left = buildGopuram(4, 8, 2.6);
  left.position.set(-20, 0, -10);
  scene.add(left);
  const right = buildGopuram(4, 8, 2.6);
  right.position.set(20, 0, -10);
  scene.add(right);

  // Pillared hall in front with lamps.
  const hall = new THREE.Group();
  const hallBody = new THREE.Mesh(new THREE.BoxGeometry(26, 5, 12), stoneDark);
  hallBody.position.y = 2.5;
  hall.add(hallBody);
  const hallRoof = new THREE.Mesh(new THREE.BoxGeometry(28, 1, 14), stone);
  hallRoof.position.y = 5.5;
  hall.add(hallRoof);
  for (let k = -2; k <= 2; k++) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 5, 10), stone);
    pillar.position.set(k * 5, 2.5, 6.2);
    hall.add(pillar);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffc46b }));
    lamp.position.set(k * 5, 5.1, 6.2);
    hall.add(lamp);
  }
  hall.position.set(0, 0, 2);
  scene.add(hall);

  // Stone plaza.
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ color: 0x1b1f2b, roughness: 0.45, metalness: 0.35 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Diyas: two glowing rows leading to the temple, with flickering lights.
  const diyas = [];
  const diyaLights = [];
  const diyaGeo = new THREE.SphereGeometry(0.32, 10, 8);
  const diyaMat = new THREE.MeshBasicMaterial({ color: 0xffb254 });
  for (let k = 0; k < 12; k++) {
    [-1, 1].forEach((s) => {
      const d = new THREE.Mesh(diyaGeo, diyaMat);
      d.position.set(s * 7, 0.35, 14 - k * 2.4);
      d.userData.phase = Math.random() * Math.PI * 2;
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, color: 0xff9a3c, transparent: true, opacity: 0.5, depthWrite: false,
      }));
      glow.scale.set(2.6, 2.6, 1);
      glow.position.copy(d.position);
      d.userData.glow = glow;
      scene.add(d);
      scene.add(glow);
      diyas.push(d);
    });
    if (k % 3 === 0) {
      const pl = new THREE.PointLight(0xff9a3c, 2.4, 30, 2);
      pl.position.set(0, 2.2, 14 - k * 2.4);
      pl.userData.phase = k * 2.1;
      scene.add(pl);
      diyaLights.push(pl);
    }
  }

  // Rising embers.
  const EMBERS = 140;
  const emberPos = new Float32Array(EMBERS * 3);
  const emberSpeed = new Float32Array(EMBERS);
  for (let i = 0; i < EMBERS; i++) {
    emberPos[i * 3] = rand(-24, 24);
    emberPos[i * 3 + 1] = rand(0.5, 14);
    emberPos[i * 3 + 2] = rand(-16, 18);
    emberSpeed[i] = rand(0.6, 2.2);
  }
  const emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
  const embers = new THREE.Points(emberGeo, new THREE.PointsMaterial({
    color: 0xffa050, size: 0.55, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false, map: glowTex,
  }));
  scene.add(embers);

  // Low drifting mist banks.
  const mists = [];
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(rand(40, 70), rand(8, 14)),
      new THREE.MeshBasicMaterial({
        map: glowTex, color: 0x8fa3cc, transparent: true,
        opacity: rand(0.05, 0.1), depthWrite: false,
      })
    );
    m.position.set(rand(-40, 40), rand(2, 6), rand(-30, 10));
    m.userData.speed = rand(0.2, 0.7) * (i % 2 ? 1 : -1);
    scene.add(m);
    mists.push(m);
  }

  // Pointer parallax (damped).
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  function onPointerMove(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = 1 - (e.clientY / window.innerHeight) * 2;
  }
  function onPointerLeave() {
    pointer.tx = 0;
    pointer.ty = 0;
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('blur', onPointerLeave);

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  let frame = 0;
  let disposed = false;

  function tick() {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-3 * dt));
    pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-3 * dt));

    camera.position.x = camBase.x + Math.sin(t * 0.07) * 2.2 + pointer.x * 3.2;
    camera.position.y = camBase.y + Math.cos(t * 0.05) * 0.9 + pointer.y * 1.6;
    camera.lookAt(0, 11, 0);

    starsA.rotation.y = t * 0.004;
    starsB.rotation.y = -t * 0.0025;

    diyas.forEach((d) => {
      const s = 1 + Math.sin(t * 11 + d.userData.phase) * 0.18
        + Math.sin(t * 23 + d.userData.phase * 2) * 0.08;
      d.scale.setScalar(s);
      d.userData.glow.material.opacity = 0.35 + 0.2 * s;
    });
    diyaLights.forEach((pl) => {
      pl.intensity = 2.4 + Math.sin(t * 9 + pl.userData.phase) * 0.5;
    });

    const p = emberGeo.attributes.position.array;
    for (let i = 0; i < EMBERS; i++) {
      p[i * 3 + 1] += emberSpeed[i] * dt;
      p[i * 3] += Math.sin(t * 0.8 + i) * dt * 0.6;
      if (p[i * 3 + 1] > 16) {
        p[i * 3 + 1] = 0.5;
        p[i * 3] = rand(-24, 24);
      }
    }
    emberGeo.attributes.position.needsUpdate = true;

    mists.forEach((m) => {
      m.position.x += m.userData.speed * dt;
      if (m.position.x > 55) m.position.x = -55;
      if (m.position.x < -55) m.position.x = 55;
    });

    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    renderer.render(scene, camera);
    canvas.classList.add('is-ready');
  } else {
    tick();
    requestAnimationFrame(() => canvas.classList.add('is-ready'));
  }

  return function dispose() {
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('blur', onPointerLeave);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      }
    });
    renderer.dispose();
  };
}
