// Simple spark animation demo for the hero canvas
const canvas = document.getElementById('sparkDemo');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const DPR = Math.max(1, window.devicePixelRatio || 1);

  function resize(){
    // If computed height is zero (no CSS set), give a reasonable fallback.
    let rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      canvas.style.width = canvas.style.width || '100%';
      canvas.style.height = canvas.style.height || '360px';
      rect = canvas.getBoundingClientRect();
    }
    canvas.width = Math.floor(rect.width * DPR);
    canvas.height = Math.floor(rect.height * DPR);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
  resize();

  let t = 0;
  function loop(){
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);

    // bg
    ctx.fillStyle = '#0b0d13';
    ctx.fillRect(0,0,W,H);

    // subtle stars
    ctx.fillStyle = '#1a2745';
    for (let i=0;i<80;i++){
      const x = (i * 73 + (t*20) ) % W;
      const y = (i * 131 + (t*10)) % H;
      ctx.fillRect(x, y, 2, 2);
    }

    const cx = W/2, cy = H*0.42;
    // starburst
    const arms = 6, outer = 120 * (1 + 0.02*Math.sin(t*2)), inner = 48;
    ctx.fillStyle = '#7AC6FF';
    ctx.beginPath();
    for (let k=0;k<arms*2;k++){
      const ang = Math.PI * k / arms;
      const r = (k % 2 === 0) ? outer : inner;
      const x = cx + r * Math.cos(ang);
      const y = cy + r * Math.sin(ang);
      if (k===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath(); ctx.fill();

    // arc
    ctx.strokeStyle = '#7AC6FF'; ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 220, cy + 90);
    ctx.quadraticCurveTo(cx, cy + 70, cx + 220, cy + 90);
    ctx.stroke();

    // hex
    ctx.fillStyle = '#FFD166';
    const r = 76;
    ctx.beginPath();
    for (let i=0;i<6;i++){
      const ang = (Math.PI/3)*i - Math.PI/2;
      const x = cx + r*Math.cos(ang);
      const y = cy + 160 + r*Math.sin(ang);
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath(); ctx.fill();

    t += 0.016;
    requestAnimationFrame(loop);
  }
  loop();
}