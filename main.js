import Tetris from './src/js/Tetris';
import { convertPositionIndex } from './src/js/utilitis';
import './style.scss';

const tetris = new Tetris();
const cells = document.querySelectorAll('[data-grid="grid__cell"]');

const drawTetromino = () => {
  const name = tetris.tetromino.name;
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row += 1) {
    for (let column = 0; column < tetrominoMatrixSize; column += 1) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.row + row < 0) continue;
      const cellIndex = convertPositionIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
      cells[cellIndex].classList.add(name);
    }
  }
};

const draw = () => {
  cells.forEach((cell) => cell.removeAttribute('class'));
  drawTetromino();
};
draw();
