// Living background for the hero canvas — enhanced, in the soul of SerotonForge
const canvas = document.getElementById('sparkDemo');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const DPR = Math.max(1, window.devicePixelRatio || 1);

  // state
  let W = 0, H = 0;
  let t = 0;
  let last = performance.now();

  // mouse
  const mouse = {x: -9999, y: -9999, down: false};
  window.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) * DPR;
    mouse.y = (e.clientY - r.top) * DPR;
  });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('mousedown', () => { mouse.down = true; });
  window.addEventListener('mouseup', () => { mouse.down = false; });

  // stars layers for parallax + twinkle
  const STAR_COUNT = 160;
  const stars = []; 

  // soft particles (floating motes / embers)
  const MOTES = 28;
  const motes = [];

  // orbiting micro-sparks
  const SPARK_COUNT = 12;
  const sparks = [];

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function init() {
    // create stars
    stars.length = 0;
    for (let i=0;i<STAR_COUNT;i++){
      const layer = Math.random() < 0.6 ? 0 : (Math.random() < 0.5 ? 1 : 2); // 0: far,1: mid,2:near
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: (layer === 0 ? rand(0.2,0.8) : layer === 1 ? rand(0.6,1.6) : rand(1.2,2.6)),
        layer,
        phase: Math.random() * Math.PI * 2
      });
    }

    motes.length = 0;
    for (let i=0;i<MOTES;i++){
      motes.push({
        x: Math.random(),
        y: Math.random(),
        vx: rand(-0.02,0.02),
        vy: rand(-0.01,0.01),
        size: rand(4,14),
        alpha: rand(0.06,0.18),
        hue: rand(190,210)
      });
    }

    sparks.length = 0;
    for (let i=0;i<SPARK_COUNT;i++){
      const a = (i / SPARK_COUNT) * Math.PI * 2;
      sparks.push({
        angle: a,
        dist: rand(60, 180),
        speed: rand(0.2, 0.7),
        size: rand(2,5),
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function resize(){
    const rect = canvas.getBoundingClientRect();
    // fallback defaults
    if (rect.width === 0 || rect.height === 0) {
      canvas.style.width = canvas.style.width || '100%';
      canvas.style.height = canvas.style.height || '360px';
    }
    const newRect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(newRect.width * DPR);
    canvas.height = Math.floor(newRect.height * DPR);
    W = canvas.width; H = canvas.height;
    init();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
  resize();

  // helper draws
  function drawRoundedRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  function drawStar(cx, cy, arms, outer, inner, rotation, color){
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let k=0;k<arms*2;k++){
      const ang = Math.PI * k / arms;
      const r = (k % 2 === 0) ? outer : inner;
      const x = r * Math.cos(ang);
      const y = r * Math.sin(ang);
      if (k===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function drawHex(cx, cy, r, rotation, color){
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i=0;i<6;i++){
      const ang = (Math.PI/3)*i - Math.PI/2;
      const x = r*Math.cos(ang);
      const y = r*Math.sin(ang);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  // main loop
  function loop(now){
    const dt = Math.min(40, now - last) / 1000; // seconds, clamp
    last = now;
    t += dt;

    // background
    ctx.clearRect(0,0,W,H);

    // subtle vignette
    const grd = ctx.createLinearGradient(0,0,0,H);
    grd.addColorStop(0, '#07090c');
    grd.addColorStop(1, '#050608');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,W,H);

    // far background subtle noise of tiny stars
    for (let i=0;i<stars.length;i++){
      const s = stars[i];
      // parallax movement depending on layer
      const speed = (s.layer===0? 0.01 : s.layer===1 ? 0.03 : 0.08);
      const x = ((s.x * W) + t * 20 * speed) % W;
      const y = ((s.y * H) + Math.sin(t*0.1 + s.phase)*6 * (s.layer+1)) % H;
      const twinkle = 0.5 + 0.5 * Math.sin(t*1.2 + s.phase);
      const alpha = (s.layer===0? 0.08: s.layer===1? 0.14: 0.28) * (0.5 + 0.5*twinkle);
      ctx.fillStyle = 'rgba(138,162,196,'+alpha.toFixed(3)+')';
      ctx.fillRect(x, y, s.size * DPR, s.size * DPR);
    }

    // motes floating with soft blur (drawn as glow circles)
    for (let m of motes){
      m.x += m.vx * W * dt;
      m.y += m.vy * H * dt;
      // wrap
      if (m.x < -0.1) m.x = 1.1; if (m.x > 1.1) m.x = -0.1;
      if (m.y < -0.1) m.y = 1.1; if (m.y > 1.1) m.y = -0.1;

      const px = m.x * W;
      const py = m.y * H;

      // gentle attraction to mouse when close
      const mx = mouse.x / DPR, my = mouse.y / DPR;
      if (mouse.x > -9999){
        const dx = mx - px, dy = my - py;
        const d2 = dx*dx + dy*dy;
        if (d2 < 90000){
          // pull slightly
          m.vx += (dx / W) * dt * 0.06;
          m.vy += (dy / H) * dt * 0.06;
        }
      }

      const radius = m.size * DPR;
      const alpha = m.alpha * (0.7 + 0.3 * Math.sin(t*0.8 + m.size));
      ctx.beginPath();
      const g = ctx.createRadialGradient(px,py,0,px,py,radius*2);
      g.addColorStop(0, `rgba(${Math.floor(m.hue)},${Math.floor(m.hue+20)},255,${(alpha*0.95).toFixed(3)})`);
      g.addColorStop(1, 'rgba(10,14,20,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px-radius*2, py-radius*2, radius*4, radius*4);
    }

    // center composition
    const cx = W/2, cy = H*0.45;

    // orbiting sparks
    for (let s of sparks){
      s.angle += s.speed * dt * 0.6;
      const sx = cx + Math.cos(s.angle + s.phase) * (s.dist * DPR);
      const sy = cy + Math.sin(s.angle + s.phase) * (s.dist * DPR * 0.45);
      const size = s.size * DPR * (1 + 0.3 * Math.sin(t*3 + s.phase));
      ctx.fillStyle = `rgba(122,198,255,${(0.6 + 0.4*Math.sin(t*4+s.phase)).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI*2); ctx.fill();
    }

    // central rotating starburst (bigger)
    const pulse = 1 + 0.04 * Math.sin(t*3.2);
    const starOuter = 120 * DPR * pulse;
    const starInner = 40 * DPR * (0.9 + 0.05*Math.sin(t*2.2));
    const rotation = t * 0.6;
    drawStar(cx, cy - 20*DPR, 6, starOuter, starInner, rotation, '#7AC6FF');

    // sweeping arc with glow
    ctx.save();
    ctx.lineWidth = 6 * DPR;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(122,198,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(cx - 260*DPR, cy + 120*DPR);
    ctx.quadraticCurveTo(cx, cy + 100*DPR - Math.sin(t*1.2)*8*DPR, cx + 260*DPR, cy + 120*DPR);
    ctx.stroke();
    ctx.restore();

    // subtle underline shimmer
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = `rgba(122,198,255,${0.08 + 0.06*Math.sin(t*4)})`;
    ctx.lineWidth = 4 * DPR;
    ctx.beginPath();
    ctx.moveTo(cx - 240*DPR, cy + 130*DPR);
    ctx.quadraticCurveTo(cx, cy + 110*DPR, cx + 240*DPR, cy + 130*DPR);
    ctx.stroke();
    ctx.restore();

    // central hex bobbing
    const hexR = 76 * DPR * (1 + 0.03 * Math.sin(t*2.3));
    const hexRotation = -0.02 * Math.sin(t*1.7);
    drawHex(cx, cy + 180*DPR, hexR, hexRotation, '#FFD166');

    // subtle foreground micro-sparks (particle trail following mouse)
    if (mouse.x > -9999){
      for (let i=0;i<2;i++){ 
        const pxm = mouse.x + rand(-10,10);
        const pym = mouse.y + rand(-10,10);
        ctx.fillStyle = `rgba(122,198,255,${0.06 + Math.random()*0.14})`;
        ctx.beginPath(); ctx.arc(pxm, pym, rand(0.6,2.4)*DPR, 0, Math.PI*2); ctx.fill();
      }
    }

    // soft vignette overlay
    ctx.fillStyle = 'rgba(6,8,10,0.18)';
    ctx.fillRect(0,0,W,H);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);