const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let w = canvas.width, h = canvas.height;
let snake = [{x:9,y:9}];
let dir = {x:1,y:0};
let apple = {x:5,y:5};
let alive = true;

function tick(){
  if(!alive) return;
  const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
  if(head.x<0||head.x>=w/grid||head.y<0||head.y>=h/grid||snake.some(s=>s.x===head.x&&s.y===head.y)){
    alive=false;return;
  }
  snake.unshift(head);
  if(head.x===apple.x&&head.y===apple.y){
    placeApple();
  } else {
    snake.pop();
  }
}

function placeApple(){
  apple.x = Math.floor(Math.random()*(w/grid));
  apple.y = Math.floor(Math.random()*(h/grid));
  if(snake.some(s=>s.x===apple.x&&s.y===apple.y)) placeApple();
}

function draw(){
  ctx.fillStyle='#071018';ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#FFD166';
  for(const s of snake) ctx.fillRect(s.x*grid+2,s.y*grid+2,grid-4,grid-4);
  ctx.fillStyle='#7AC6FF';ctx.fillRect(apple.x*grid+4,apple.y*grid+4,grid-8,grid-8);
  if(!alive){ctx.fillStyle='rgba(255,255,255,0.9)';ctx.font='20px Inter,Arial';ctx.fillText('Game Over — press Space to restart',10,h/2)}
}

let last = 0;function loop(ts){if(ts-last>120){tick();draw();last=ts}requestAnimationFrame(loop)}
requestAnimationFrame(loop);

window.addEventListener('keydown',e=>{
  if(e.key==='ArrowUp'&&dir.y===0)dir={x:0,y:-1};
  if(e.key==='ArrowDown'&&dir.y===0)dir={x:0,y:1};
  if(e.key==='ArrowLeft'&&dir.x===0)dir={x:-1,y:0};
  if(e.key==='ArrowRight'&&dir.x===0)dir={x:1,y:0};
  if(e.code==='Space'){snake=[{x:9,y:9}];dir={x:1,y:0};alive=true;placeApple();}
});

placeApple();