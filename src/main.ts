import './style.css'

const canvas = document.getElementById("miCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const elPos = document.getElementById("pos") as HTMLParagraphElement
const elVel = document.getElementById("vel") as HTMLParagraphElement
const elIntro = document.getElementById("intro") as HTMLParagraphElement
const elFren = document.getElementById("freno") as HTMLParagraphElement
const resBtn = document.getElementById("btn") as HTMLButtonElement


// Constantes físicas y de simulación
const g = 9.81;       // gravedad [m/s^2]
const m = 3000;       // masa [kg]
const B = 3.5058e+03;       // constante de frenado [kg/s]
const y0 = 60;        // altura inicial [m]
const y_freno = 16;   // altura donde empieza el frenado [m]
const v0 = 0;         // velocidad inicial [m/s]
const t_caida_libre = 2.9951
const v_entrada_freno = 29.3816

elIntro.textContent = "Empieza a frenar en: t = " + t_caida_libre.toFixed(2) + "s; v = " + v_entrada_freno + " m/s"

const pxPorMetro = 10;               // Escala de simulación
const alturaCanvas = y0 * pxPorMetro + 60;
canvas.height = alturaCanvas;
canvas.width = 400;

// Movimiento en caída libre
const y_ca = (y0: number, v0: number, t: number) => y0 + v0 * t + 0.5 * g * t ** 2;

// Movimiento durante frenado (posición)
function y_frenado(t: number, y0: number, v0: number, m: number, B: number, g: number): number {
  const beta = B / m;
  const A = (g * m) / B;
  const Bterm = (v0 - A) * (m / B) * (1 - Math.exp(-beta * t));
  return (y0 + A * t + Bterm);
}

// Velocidad durante caída libre
function v_caida(t: number, v0: number): number {
  return v0 - g * t;
}

// Velocidad durante frenado magnético
function v_frenado(t: number): number {
  return -(g * m / B) + (v_entrada_freno + (g * m / B)) * Math.exp(-B * t / m);
}


let tiempoInicio: number = 0;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function animar(timestamp: number) {

  if (!tiempoInicio) tiempoInicio = timestamp;
  const t = (timestamp - tiempoInicio) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(180, 20, 40, alturaCanvas - 20)

  let y_metros: number;
  let v_ms: number = 0;


  if (t < t_caida_libre) {
    y_metros = 10 +  y_ca(y0, v0, t) - 60;
    v_ms = v_caida(t, v0)
  } else {
    const t_freno = t - t_caida_libre;
    y_metros = 10 + (y_frenado(t_freno, y_freno, v_entrada_freno, m, B, g) - y_freno) + (y0-y_freno);
    v_ms = v_frenado(t_freno, )
    elFren.textContent = "FRENANDO"
  }

  // Dibujo
  const y_px = y_metros * pxPorMetro;
  ctx.fillStyle = t < t_caida_libre ? "blue" : "red";
  drawRoundedRect(ctx, 100, y_px, 200, 40, 20)
  ctx.fill();

  const m_display = y0-y_metros > 0 ? y0-y_metros : 0
  const vel_display = v_ms

  elPos.textContent = `Posición y = ${m_display.toFixed(2)} m`
  elVel.textContent = `Velocidad v = ${vel_display.toFixed(2)} m/s`


  if (y_metros < y0 + 1) {
    requestAnimationFrame(animar);
  } else {
    elPos.textContent = `Posición y = ${0} m`
    elVel.textContent = `Velocidad v = ${0} m/s`
  }
}

resBtn.onclick = () => {
  tiempoInicio = 0
  requestAnimationFrame(animar)
}

requestAnimationFrame(animar);
