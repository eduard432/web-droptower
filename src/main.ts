const canvas = document.getElementById("miCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const g = 9.81;
const m = 2000;
const B = 3924;
const y0 = 60;
const y_freno = 16;
const v0 = 0;

const y_ca = (y0: number, v0:number, t:number) => y0 + v0 * t + 0.5 * g * t ** 2;


let tiempoInicio: number;

function animar(timestamp) {
  if (!tiempoInicio) tiempoInicio = timestamp;
  const t = (timestamp - tiempoInicio) / 1000;

  const y = y_ca(y0, v0, t);

  console.log({y: canvas.height-y,t})

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(200, y, 15, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();

  if (y < canvas.height - y_freno) {
    // detener cuando toca el suelo
    requestAnimationFrame(animar);
  }
}

requestAnimationFrame(animar);
