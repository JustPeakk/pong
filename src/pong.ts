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
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

let a: number = 6;
let b: string = "hola";
let c: boolean = false;

a = 7;
b = "6";

let numeros: number[] = [1, 2, 3, 4];

let starField: Star[] = [
  {
    color: "yellow",
    position: {
      x: 20,
      y: 20,
    },
    velocity: 5,
    size: 5,
  },
  {
    color: "blue",
    position: {
      x: 20,
      y: 10,
    },
    velocity: 5,
    size: 7,
  },
  {
    color: "red",
    position: {
      x: 10,
      y: 20,
    },
    velocity: 10,
    size: 5,
  },
];

const estrellas = [...Array(1000)];

console.log(numeros);

const arr = [...Array(100)];

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
console.log(estrellas);

// console.log("holamundo");
// constantes de inicialización del juego

let paleta1y = (ALTO_TABLERO - ALTO_PALETA) / 2;
let paleta2y = (ALTO_TABLERO - ALTO_PALETA) / 2;
let pelotay = 0;
let pelotax = 0;
let marcador1 = 0;
let marcador2 = 0;
let direcciony: 1 | -1 = 1;
let direccionx: 1 | -1 = 1;
let contenedorMarcador1: HTMLElement = document.getElementById("marcador1");
let contenedorMarcador2: HTMLElement = document.getElementById("marcador2");

const lienzo = document.getElementById("canvas");
const contexto = lienzo.getContext("2d");
contexto.canvas.width = ANCHO_TABLERO;
contexto.canvas.height = ALTO_TABLERO;

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
  contexto.fillRect(x, y, width, height);
}

function render() {
  dibujarRectangulo(contexto, COLOR_TABLERO, 0, 0, ANCHO_TABLERO, ALTO_TABLERO);
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

  dibujarRectangulo(
    contexto,
    COLOR_PALETA_1,
    SEPARACION_PALETA_PARED,
    paleta1y,
    ANCHO_PALETA,
    ALTO_PALETA
  );
  dibujarRectangulo(
    contexto,
    COLOR_PALETA_2,
    ANCHO_TABLERO - ANCHO_PALETA - SEPARACION_PALETA_PARED,
    paleta2y,
    ANCHO_PALETA,
    ALTO_PALETA
  );
  dibujarRectangulo(
    contexto,
    COLOR_PELOTA,
    pelotax,
    pelotay,
    ANCHO_PELOTA,
    ALTO_PELOTA
  );
}

render();
resetearPelota();

function actualizarPosicionPaletas(teclasPulsadas: Set<string>) {
  // console.log("tecla pulsada", event);
  if (teclasPulsadas.has("a")) {
    // console.log("subir player 1");
    paleta1y = paleta1y - SALTO_PALETA;
    if (paleta1y < 0) {
      paleta1y = 0;
    }
  }

  if (teclasPulsadas.has("z")) {
    // console.log("bajar player 1");
    paleta1y = paleta1y + SALTO_PALETA;
    if (paleta1y > ALTO_TABLERO - ALTO_PALETA) {
      paleta1y = ALTO_TABLERO - ALTO_PALETA;
    }
  }
  if (teclasPulsadas.has("k")) {
    // console.log("subir player 2");
    paleta2y = paleta2y - SALTO_PALETA;
    if (paleta2y < 0) {
      paleta2y = 0;
    }
  }
  if (teclasPulsadas.has("m")) {
    // console.log("bajar player 2");
    paleta2y = paleta2y + SALTO_PALETA;
    if (paleta2y > ALTO_TABLERO - ALTO_PALETA) {
      paleta2y = ALTO_TABLERO - ALTO_PALETA;
    }
  }
  if (teclasPulsadas.has("Escape")) {
    // console.log("salir del juego");
    finJuego = true;
  }
}

function update(deltaTime: number) {
  for (let index = 0; index < estrellas.length; index++) {
    const estrellaActual: Star = estrellas[index];
    // estrellaActual.position.x = estrellaActual.position.x+estrellaActual.velocity*deltaTime;
    // if (estrellaActual.position.x > ANCHO_TABLERO){
    //   estrellaActual.position.x = ANCHO_TABLERO - estrellaActual.position.x;
    // }

    estrellaActual.position.y =
      estrellaActual.position.y + estrellaActual.velocity * deltaTime;
    if (estrellaActual.position.y > ALTO_TABLERO) {
      estrellaActual.position.y = ALTO_TABLERO - estrellaActual.position.y;
    }
  }

  actualizarPosicionPaletas(teclasPulsadas);

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

  // console.log("pelotax", pelotax);
  // console.log("pelotay", pelotay);

  // console.log("direccion x", direccionx);
  // console.log("direccion y", direcciony);
}

let finJuego = false;
let teclaPulsada = "";
let teclasPulsadas = new Set<string>();

window.addEventListener("keydown", function (event: KeyboardEvent) {
  // console.log("tecla pulsada", event);
  if (event.key === "a" || event.key === "A") {
    teclasPulsadas.add("a");
    // console.log("subir player 1");
    paleta1y = paleta1y - SALTO_PALETA;
    if (paleta1y < 0) {
      paleta1y = 0;
    }
  } else if (event.key === "z" || event.key === "Z") {
    teclasPulsadas.add("z");
    // console.log("bajar player 1");
    paleta1y = paleta1y + SALTO_PALETA;
    if (paleta1y > ALTO_TABLERO - ALTO_PALETA) {
      paleta1y = ALTO_TABLERO - ALTO_PALETA;
    }
  } else if (event.key === "k") {
    teclasPulsadas.add("k");
    // console.log("subir player 2");
    paleta2y = paleta2y - SALTO_PALETA;
    if (paleta2y < 0) {
      paleta2y = 0;
    }
  } else if (event.key === "m") {
    teclasPulsadas.add("m");
    // console.log("bajar player 2");
    paleta2y = paleta2y + SALTO_PALETA;
    if (paleta2y > ALTO_TABLERO - ALTO_PALETA) {
      paleta2y = ALTO_TABLERO - ALTO_PALETA;
    }
  } else if (event.key === "Escape") {
    teclasPulsadas.add("Escape");
    // console.log("salir del juego");
    finJuego = true;
  }

  console.log(teclasPulsadas);
});

window.addEventListener("keyup", function (event: KeyboardEvent) {
  // console.log("tecla pulsada", event);
  if (event.key === "a" || event.key === "A") {
    teclasPulsadas.delete("a");
    // console.log("subir player 1");
    paleta1y = paleta1y - SALTO_PALETA;
    if (paleta1y < 0) {
      paleta1y = 0;
    }
  } else if (event.key === "z" || event.key === "Z") {
    teclasPulsadas.delete("z");
    // console.log("bajar player 1");
    paleta1y = paleta1y + SALTO_PALETA;
    if (paleta1y > ALTO_TABLERO - ALTO_PALETA) {
      paleta1y = ALTO_TABLERO - ALTO_PALETA;
    }
  } else if (event.key === "k" || event.key === "K") {
    teclasPulsadas.delete("k");
    // console.log("subir player 2");
    paleta2y = paleta2y - SALTO_PALETA;
    if (paleta2y < 0) {
      paleta2y = 0;
    }
  } else if (event.key === "m" || event.key === "M") {
    teclasPulsadas.delete("m");
    // console.log("bajar player 2");
    paleta2y = paleta2y + SALTO_PALETA;
    if (paleta2y > ALTO_TABLERO - ALTO_PALETA) {
      paleta2y = ALTO_TABLERO - ALTO_PALETA;
    }
  } else if (event.key === "Escape") {
    teclasPulsadas.delete("Escape");
    // console.log("salir del juego");
    finJuego = true;
  }

  console.log(teclasPulsadas);
});

let lastTime = 0;
function gameLoop(timestamp: number) {
  if (finJuego) return;
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(deltaTime);

  render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
