/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

// import {
//   ALTO_PALETA,
//   ALTO_PELOTA,
//   ALTO_TABLERO,
//   ANCHO_PALETA,
//   ANCHO_PELOTA,
//   ANCHO_TABLERO,
//   COLOR_PALETA_1,
//   COLOR_PALETA_2,
//   COLOR_PELOTA,
//   COLOR_TABLERO,
//   SALTO_PALETA,
//   SALTO_PELOTA,
//   SEPARACION_PALETA_PARED,
// } from "./config";

const ANCHO_TABLERO = 640;
const ALTO_TABLERO = 480;
const ANCHO_PALETA = 10;
const ALTO_PALETA = 80;
const ANCHO_PELOTA = 20;
const ALTO_PELOTA = 20;
const COLOR_TABLERO = "black";
const COLOR_PALETA_1 = "red";
const COLOR_PALETA_2 = "blue";
const COLOR_PELOTA = "white";
const SEPARACION_PALETA_PARED = 30;
const SALTO_PALETA = 5;
const SALTO_PELOTA = 7;

type Point = {
  x: number;
  y: number;
};

type Star = {
  color: string;
  position: Point;
  velocity: number;
  size: number;
};

let finJuego: boolean;
let teclasPulsadas = new Set<string>();
let paleta1y: number;
let paleta2y: number;
let pelotay: number;
let pelotax: number;
let marcador1: number;
let marcador2: number;
let direcciony: 1 | -1;
let direccionx: 1 | -1;
let contenedorMarcador1: HTMLElement | null;
let contenedorMarcador2: HTMLElement | null;
let lienzo: HTMLCanvasElement | null;
let contexto: CanvasRenderingContext2D | null;
let estrellas: Star[];

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function actualizarPosicionPelota() {
  pelotay = pelotay + SALTO_PELOTA * direcciony;
  pelotax = pelotax + SALTO_PELOTA * direccionx;

  if (pelotay <= 0) {
    direcciony = direcciony * -1;
  } else if (pelotay >= ALTO_TABLERO - ALTO_PELOTA) {
    direcciony = direcciony * -1;
  } else if (pelotax <= 0) {
    direccionx = direccionx * -1;
    marcador2 = marcador2 + 1;
    // console.log("gol del jugador 2 número:", marcador2);
    resetearPelota();
    contenedorMarcador1.innerText = marcador2.toString();
  } else if (pelotax >= ANCHO_TABLERO - ANCHO_PELOTA) {
    direccionx = direccionx * -1;
    marcador1 = marcador1 + 1;
    // console.log("gol del jugador 1 número:", marcador1);
    resetearPelota();
    contenedorMarcador2.innerText = marcador2.toString();
  }
  //si la pelota choca con la paleta1, entonces cambiar dirección
  if (
    pelotax < SEPARACION_PALETA_PARED + ANCHO_PALETA &&
    pelotay + ALTO_PELOTA > paleta1y &&
    pelotay < paleta1y + ALTO_PALETA
  ) {
    direccionx = direccionx * -1;
  }
  if (
    pelotax + ANCHO_PALETA >
      ANCHO_TABLERO - SEPARACION_PALETA_PARED - ANCHO_PALETA &&
    pelotay + ALTO_PELOTA > paleta2y &&
    pelotay < paleta2y + ALTO_PALETA
  ) {
    direccionx = direccionx * -1;
  }
}

function actualizarPosicionEstrellas(deltaTime: number) {
  for (let index = 0; index < estrellas.length; index++) {
    const estrellaActual: Star = estrellas[index];

    estrellaActual.position.y =
      estrellaActual.position.y + estrellaActual.velocity * deltaTime;
    if (estrellaActual.position.y > ALTO_TABLERO) {
      estrellaActual.position.y = ALTO_TABLERO - estrellaActual.position.y;
    }
  }
}

function actualizarFinJuego() {
  if (teclasPulsadas.has("Escape")) {
    finJuego = true;
  }
}

function crearEstrellas() {
  for (let index = 0; index < estrellas.length; index++) {
    const nuevaEstrella: Star = {
      color: "yellow",
      position: {
        x: getRandomArbitrary(0, ANCHO_TABLERO),
        y: getRandomArbitrary(0, ALTO_TABLERO),
      },
      velocity: getRandomArbitrary(100, 300),
      size: getRandomArbitrary(1, 3),
    };
    estrellas[index] = nuevaEstrella;
  }
}

function inicializarJuego() {
  paleta1y = (ALTO_TABLERO - ALTO_PALETA) / 2;
  paleta2y = (ALTO_TABLERO - ALTO_PALETA) / 2;
  pelotay = 0;
  pelotax = 0;
  marcador1 = 0;
  marcador2 = 0;
  direcciony = 1;
  direccionx = 1;
  contenedorMarcador1 = document.getElementById("marcador1");
  contenedorMarcador2 = document.getElementById("marcador2");

  estrellas = [...Array(1000)];

  lienzo = document.getElementById("canvas") as HTMLCanvasElement;
  contexto = lienzo.getContext("2d");
  if (contexto) {
    contexto.canvas.width = ANCHO_TABLERO;
    contexto.canvas.height = ALTO_TABLERO;
  }

  resetearPelota();
  crearEstrellas();

  if (contexto) {
    render(contexto);
  }
}

function resetearPelota() {
  pelotay = ALTO_TABLERO / 2 - ANCHO_PELOTA / 2;
  pelotax = ANCHO_TABLERO / 2 - SEPARACION_PALETA_PARED;
}

function dibujarRectangulo(
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function dibujarPelota(contexto: CanvasRenderingContext2D) {
  dibujarRectangulo(
    contexto,
    COLOR_PELOTA,
    pelotax,
    pelotay,
    ANCHO_PELOTA,
    ALTO_PELOTA
  );

  dibujarRectangulo(
    contexto,
    "green",
    pelotax,
    pelotay,
    ANCHO_PELOTA - 3,
    ALTO_PELOTA - 3
  );
}

function dibujarPaleta1(contexto: CanvasRenderingContext2D) {
  dibujarRectangulo(
    contexto,
    COLOR_PALETA_1,
    SEPARACION_PALETA_PARED,
    paleta1y,
    ANCHO_PALETA,
    ALTO_PALETA
  );
}

function dibujarPaleta2(contexto: CanvasRenderingContext2D) {
  dibujarRectangulo(
    contexto,
    COLOR_PALETA_2,
    ANCHO_TABLERO - ANCHO_PALETA - SEPARACION_PALETA_PARED,
    paleta2y,
    ANCHO_PALETA,
    ALTO_PALETA
  );
}

function dibujarTablero(contexto: CanvasRenderingContext2D) {
  dibujarRectangulo(contexto, COLOR_TABLERO, 0, 0, ANCHO_TABLERO, ALTO_TABLERO);
}

function dibujarEstrellas(contexto: CanvasRenderingContext2D) {
  for (let index = 0; index < estrellas.length; index++) {
    const estrella: Star = estrellas[index];

    dibujarRectangulo(
      contexto,
      estrella.color,
      estrella.position.x,
      estrella.position.y,
      estrella.size,
      estrella.size
    );
  }
}

function actualizarPosicionPaletas(teclasPulsadas: Set<string>) {
  if (teclasPulsadas.has("a")) {
    paleta1y = paleta1y - SALTO_PALETA;
    if (paleta1y < 0) {
      paleta1y = 0;
    }
  }

  if (teclasPulsadas.has("z")) {
    paleta1y = paleta1y + SALTO_PALETA;
    if (paleta1y > ALTO_TABLERO - ALTO_PALETA) {
      paleta1y = ALTO_TABLERO - ALTO_PALETA;
    }
  }

  if (teclasPulsadas.has("k")) {
    paleta2y = paleta2y - SALTO_PALETA;
    if (paleta2y < 0) {
      paleta2y = 0;
    }
  }

  if (teclasPulsadas.has("m")) {
    paleta2y = paleta2y + SALTO_PALETA;
    if (paleta2y > ALTO_TABLERO - ALTO_PALETA) {
      paleta2y = ALTO_TABLERO - ALTO_PALETA;
    }
  }
}

function update(deltaTime: number) {
  actualizarPosicionEstrellas(deltaTime);
  actualizarPosicionPaletas(teclasPulsadas);
  actualizarPosicionPelota();
  actualizarFinJuego();
}

function render(contexto: CanvasRenderingContext2D) {
  dibujarTablero(contexto);
  dibujarEstrellas(contexto);
  dibujarPaleta1(contexto);
  dibujarPaleta2(contexto);
  dibujarPelota(contexto);
}

inicializarJuego();
let lastTime = 0;
function gameLoop(timestamp: number) {
  if (finJuego) return;
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(deltaTime);
  if (contexto) {
    render(contexto);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keydown", function (event: KeyboardEvent) {
  if (event.key === "a" || event.key === "A") {
    teclasPulsadas.add("a");
  } else if (event.key === "z" || event.key === "Z") {
    teclasPulsadas.add("z");
  } else if (event.key === "k") {
    teclasPulsadas.add("k");
  } else if (event.key === "m") {
    teclasPulsadas.add("m");
  } else if (event.key === "Escape") {
    teclasPulsadas.add("Escape");

    finJuego = true;
  }

  console.log(teclasPulsadas);
});

window.addEventListener("keyup", function (event: KeyboardEvent) {
  if (event.key === "a" || event.key === "A") {
    teclasPulsadas.delete("a");
  } else if (event.key === "z" || event.key === "Z") {
    teclasPulsadas.delete("z");
  } else if (event.key === "k" || event.key === "K") {
    teclasPulsadas.delete("k");
  } else if (event.key === "m" || event.key === "M") {
    teclasPulsadas.delete("m");
  } else if (event.key === "Escape") {
    teclasPulsadas.delete("Escape");
  }

  console.log(teclasPulsadas);
});

let hola: number | undefined = 7;

function imprimir(numero: number | undefined) {
  if (numero) {
    console.log(numero);
  } else {
    console.log("no hay numero");
  }
}

imprimir(hola);
