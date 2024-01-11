import TETROMINOES from './figures';
import {
  PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, TETROMINO_NAMES, getRandomElement, rotateMatrix,
} from './utilitis';

class Tetris {
  constructor() {
    this.playField = undefined;
    this.tetromino = undefined;
    this.init();
  }

  init() {
    this.generatePlayField();
    this.generateTetromino();
  }

  generatePlayField() {
    this.playField = new Array(PLAYFIELD_ROWS).fill()
      .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
  }

  generateTetromino() {
    const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];

    const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
    const row = 3;

    this.tetromino = {
      name,
      matrix,
      row,
      column,
    };
  }

  moveTetrominoDown() {
    this.tetromino.row += 1;
  }

  moveTetrominoLeft() {
    this.tetromino.column -= 1;
  }

  moveTetrominoRight() {
    this.tetromino.column += 1;
  }

  rotateTetrominoMatrix() {
    const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
    this.tetromino.matrix = rotatedMatrix;
  }
}

export default Tetris;
