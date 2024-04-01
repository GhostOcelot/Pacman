import kaboom from 'https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs';
import { width, height, tileSize, winningCondition, layout } from './const.js';
import { newGameBtn, pointsContainer } from './dom.js';

let points = 0;
let seeds = 0;

kaboom({
  width: width * tileSize,
  height: height * tileSize,
  background: 255,
  canvas: document.querySelector('#myCanvas'),
});

const createGrid = () => {
  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < layout[i].length; j++) {
      if (layout[i][j] === 0) {
        add([
          rect(tileSize, tileSize),
          pos(j * tileSize, i * tileSize),
          area(),
          body({ isStatic: true }),
          color(0, 0, 255),
          'wall',
        ]);
      } else if (layout[i][j] === 1) {
        add([
          rect(tileSize / 4, tileSize / 4),
          pos(j * tileSize + tileSize / 2 - 2, i * tileSize + tileSize / 2 - 2),
          color(255, 200, 150),
          area(),
          'seed',
        ]);
        seeds++;
      } else if (layout[i][j] === 2) {
        add([
          circle(tileSize / 3, tileSize / 3),
          pos(j * tileSize + tileSize / 2, i * tileSize + tileSize / 2),
          color(255, 0, 150),
          'cherry',
        ]);
      }
    }
  }
};

const createPacman = () => {
  const pacman = add([
    circle(tileSize / 2),
    pos(tileSize * 14, tileSize * 24),
    area(),
    body(),
    color(255, 255, 0),
    'pacman',
  ]);

  onKeyDown('left', () => {
    if (pacman.pos.x <= 0) {
      pacman.pos.x = width * tileSize;
    }
    pacman.move(-100, 0);
  });

  onKeyDown('right', () => {
    if (pacman.pos.x >= width * tileSize) {
      pacman.pos.x = 0;
    }
    pacman.move(100, 0);
  });

  onKeyDown('up', () => {
    pacman.move(0, -100);
  });

  onKeyDown('down', () => {
    pacman.move(0, 100);
  });

  pacman.onCollide('seed', (seed) => {
    destroy(seed);
    points++;
    seeds--;
    pointsContainer.textContent = `points: ${points}`;

    if (seeds === winningCondition) {
      win();
    }
  });

  return pacman;
};

const reset = () => {
  destroyAll('wall');
  destroyAll('seed');
  destroyAll('cherry');
  destroyAll('pacman');
  destroyAll('win screen');
  destroyAll('win message');
  points = 0;
  seeds = 0;
  pointsContainer.textContent = `points: ${points}`;
};

const win = () => {
  add([rect(tileSize * width, tileSize * height), pos(0, 0), color(255, 255, 255), 'win screen']);
  add([
    text('Congratulations!\nYou won!'),
    pos(130, 270),
    { color: (255, 255, 255), align: 'center' },
    'win message',
  ]);
};

const newGame = () => {
  reset();
  createGrid();
  createPacman();
};

newGameBtn.addEventListener('click', newGame);

newGame();
