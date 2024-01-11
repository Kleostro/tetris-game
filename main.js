/* eslint-disable no-continue */
import { Tetris } from './src/js/Tetris';
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, convertPositionIndex } from './src/js/utilitis';
import './style.scss';

const tetris = new Tetris();
const cells = document.querySelectorAll('[data-grid="grid__cell"]');

let requestID;
let timeOutID;

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

const gameOver = () => {
  stopLoop();
  document.removeEventListener('keydown', onKeyDown);
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

initKeyDown();
moveDown();
