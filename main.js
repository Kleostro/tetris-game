/* eslint-disable no-continue */
import { Tetris } from './src/js/Tetris';
import {
  PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, SAD, convertPositionIndex,
} from './src/js/utilitis';
import './style.scss';

let tetris = new Tetris();
const cells = document.querySelectorAll('[data-grid="grid__cell"]');

let requestID;
let timeOutID;
let hammer;

const drawTetromino = () => {
  const { name } = tetris.tetromino;
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row += 1) {
    for (let column = 0; column < tetrominoMatrixSize; column += 1) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.row + row < 0) continue;
      const cellIndex = convertPositionIndex(tetris.tetromino.row
        + row, tetris.tetromino.column + column);
      cells[cellIndex].classList.add(name);
    }
  }
};

const drawPlayField = () => {
  for (let row = 0; row < PLAYFIELD_ROWS; row += 1) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column += 1) {
      if (!tetris.playField[row][column]) continue;
      const name = tetris.playField[row][column];
      const cellIndex = convertPositionIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
};

const drawGhostTetromino = () => {
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row += 1) {
    for (let column = 0; column < tetrominoMatrixSize; column += 1) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.ghostRow + row < 0) continue;
      const cellIndex = convertPositionIndex(tetris.tetromino.ghostRow
        + row, tetris.tetromino.ghostColumn + column);
      cells[cellIndex].classList.add('ghost');
    }
  }
};

const draw = () => {
  cells.forEach((cell) => cell.removeAttribute('class'));
  drawPlayField();
  drawTetromino();
  drawGhostTetromino();
};

const startLoop = () => {
  timeOutID = setTimeout(() => requestID = requestAnimationFrame(moveDown), 500);
};

const stopLoop = () => {
  cancelAnimationFrame(requestID);
  clearTimeout(timeOutID);
};

const rotate = () => {
  tetris.rotateTetrominoMatrix();
  draw();
};

const drawSad = () => {
  const TOP_OFFSET = 5;
  for (let row = 0; row < SAD.length; row += 1) {
    for (let column = 0; column < SAD[0].length; column += 1) {
      if (!SAD[row][column]) continue;
      const cellIndex = convertPositionIndex(TOP_OFFSET + row, column);
      cells[cellIndex].classList.add('sad');
    }
  }
};

const gameOverAnimation = () => {
  const filledCells = [...cells].filter((cell) => cell.classList.length > 0);
  filledCells.forEach((filledCell, i) => {
    setTimeout(() => filledCell.classList.add('hide'), i * 10);
    setTimeout(() => filledCell.removeAttribute('class'), i * 10 + 500);
    setTimeout(drawSad, filledCells.length * 10 + 1000);
  });
};

const gameOver = () => {
  stopLoop();
  document.removeEventListener('keydown', onKeyDown);
  hammer.off('panstart panleft panright pandown swipedown tap');
  gameOverAnimation();

  setTimeout(() => {
    tetris = new Tetris();
    initKeyDown();
    initTouch();
    startLoop();
  }, 5000);
};

const moveDown = () => {
  tetris.moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();

  if (tetris.isGameOver) gameOver();
};

const moveLeft = () => {
  tetris.moveTetrominoLeft();
  draw();
};

const moveRight = () => {
  tetris.moveTetrominoRight();
  draw();
};

const dropDown = () => {
  tetris.dropTetrominoDown();
  draw();
  stopLoop();
  startLoop();

  if (tetris.isGameOver) {
    gameOver();
  }
};

const onKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      rotate();
      break;
    case 'w':
      rotate();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 's':
      moveDown();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'a':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'd':
      moveRight();
      break;
    case ' ':
      dropDown();
      break;
    default:
      break;
  }
};

const initKeyDown = () => {
  document.addEventListener('keydown', onKeyDown);
};

const initTouch = () => {
  document.addEventListener('dblclick', (event) => {
    event.preventDefault();
  });

  hammer = new Hammer(document.querySelector('body'));
  hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

  const threshold = 30;
  let deltaX = 0;
  let deltaY = 0;

  hammer.on('panstart', () => {
    deltaX = 0;
    deltaY = 0;
  });

  hammer.on('panleft', (event) => {
    if (Math.abs(event.deltaX - deltaX) > threshold) {
      moveLeft();
      deltaX = event.deltaX;
      deltaY = event.deltaY;
    }
  });

  hammer.on('panright', (event) => {
    if (Math.abs(event.deltaX - deltaX) > threshold) {
      moveRight();
      deltaX = event.deltaX;
      deltaY = event.deltaY;
    }
  });

  hammer.on('pandown', (event) => {
    if (Math.abs(event.deltaY - deltaY) > threshold) {
      moveDown();
      deltaX = event.deltaX;
      deltaY = event.deltaY;
    }
  });

  hammer.on('swipedown', () => {
    dropDown();
  });

  hammer.on('tap', () => {
    rotate();
  });
};

initKeyDown();
initTouch();
moveDown();
