/* eslint-disable no-continue */
import Tetris from './src/js/Tetris';
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, convertPositionIndex } from './src/js/utilitis';
import './style.scss';

const tetris = new Tetris();
const cells = document.querySelectorAll('[data-grid="grid__cell"]');

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

const draw = () => {
  cells.forEach((cell) => cell.removeAttribute('class'));
  drawPlayField();
  drawTetromino();
};

const rotate = () => {
  tetris.rotateTetrominoMatrix();
  draw();
};

const moveDown = () => {
  tetris.moveTetrominoDown();
  draw();
};

const moveLeft = () => {
  tetris.moveTetrominoLeft();
  draw();
};

const moveRight = () => {
  tetris.moveTetrominoRight();
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
    case ' ':
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
    default:
      break;
  }
};

const initKeyDown = () => {
  document.addEventListener('keydown', onKeyDown);
};

initKeyDown();
draw();
