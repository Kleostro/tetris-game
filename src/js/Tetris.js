/* eslint-disable no-continue */
import TETROMINOES from './figures';
import {
  PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, TETROMINO_NAMES, getRandomElement, rotateMatrix,
} from './utilitis';

export class Tetris {
  constructor() {
    this.playField = undefined;
    this.tetromino = undefined;
    this.isGameOver = false;
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
    const row = -2;

    this.tetromino = {
      name,
      matrix,
      row,
      column,
    };
  }

  moveTetrominoDown() {
    this.tetromino.row += 1;
    if (!this.isValid()) {
      this.tetromino.row -= 1;
      this.placeTetromino();
    }
  }

  moveTetrominoLeft() {
    this.tetromino.column -= 1;
    if (!this.isValid()) this.tetromino.column += 1;
  }

  moveTetrominoRight() {
    this.tetromino.column += 1;
    if (!this.isValid()) this.tetromino.column -= 1;
  }

  rotateTetrominoMatrix() {
    const oldMatrix = this.tetromino.matrix;
    const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
    this.tetromino.matrix = rotatedMatrix;
    if (!this.isValid()) this.tetromino.matrix = oldMatrix;
  }

  isValid() {
    const matrixSize = this.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row += 1) {
      for (let column = 0; column < matrixSize; column += 1) {
        if (!this.tetromino.matrix[row][column]) continue;
        if (this.isOutsideGameBoard(row, column)) return false;
        if (this.isCollides(row, column)) return false;
      }
    }
    return true;
  }

  isOutsideGameBoard(row, column) {
    return this.tetromino.column + column < 0
      || this.tetromino.column + column >= PLAYFIELD_COLUMNS
      || this.tetromino.row + row >= this.playField.length;
  }

  isCollides(row, column) {
    return this.playField[this.tetromino.row + row]?.[this.tetromino.column + column];
  }

  placeTetromino() {
    const matrixSize = this.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row += 1) {
      for (let column = 0; column < matrixSize; column += 1) {
        if (!this.tetromino.matrix[row][column]) continue;
        if (this.isOutsideTopBoard(row)) return this.isGameOver = true;

        this.playField[this.tetromino.row + row][this.tetromino.column + column] = this.tetromino.name;
      }
    }
    this.processFilledRows();
    this.generateTetromino();
  }

  isOutsideTopBoard(row) {
    return this.tetromino.row + row < 0;
  }

  processFilledRows() {
    const filledRows = this.findFilledRows();
    this.removeFilledRows(filledRows);
  }

  findFilledRows() {
    const filledRows = [];
    for (let row = 0; row < PLAYFIELD_ROWS; row += 1) {
      if (this.playField[row].every((cell) => Boolean(cell))) {
        filledRows.push(row);
      }
    }
    return filledRows;
  }

  removeFilledRows(filledRows) {
    filledRows.forEach((row) => {
      this.dropRowsAbove(row);
    })
  }

  dropRowsAbove(rowToDelete) {
    for (let row = rowToDelete; row > 0; row -= 1) {
      this.playField[row] = this.playField[row - 1];
    }
    this.playField[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
  }
}
