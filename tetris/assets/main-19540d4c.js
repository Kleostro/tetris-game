(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const TETROMINOES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1],
    [0, 0]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ]
};
const PLAYFIELD_ROWS = 20;
const PLAYFIELD_COLUMNS = 10;
const TETROMINO_NAMES = ["I", "J", "L", "O", "S", "Z", "T"];
const getRandomElement = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
const convertPositionIndex = (row, column) => row * PLAYFIELD_COLUMNS + column;
function rotateMatrix(matrix) {
  const matrixLen = matrix.length;
  const rotatedMatrix = [];
  for (let i = 0; i < matrixLen; i += 1) {
    rotatedMatrix[i] = [];
    for (let j = 0; j < matrixLen; j += 1) {
      rotatedMatrix[i][j] = matrix[matrixLen - j - 1][i];
    }
  }
  return rotatedMatrix;
}
const SAD = [
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0]
];
class Tetris {
  constructor() {
    this.playField = void 0;
    this.tetromino = void 0;
    this.isGameOver = false;
    this.init();
  }
  init() {
    this.generatePlayField();
    this.generateTetromino();
  }
  generatePlayField() {
    this.playField = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
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
      ghostRow: row,
      ghostColumn: column
    };
    this.calculateGhostPosition();
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
    if (!this.isValid())
      this.tetromino.column += 1;
    else {
      this.calculateGhostPosition();
    }
  }
  moveTetrominoRight() {
    this.tetromino.column += 1;
    if (!this.isValid())
      this.tetromino.column -= 1;
    else {
      this.calculateGhostPosition();
    }
  }
  rotateTetrominoMatrix() {
    const oldMatrix = this.tetromino.matrix;
    const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
    this.tetromino.matrix = rotatedMatrix;
    if (!this.isValid())
      this.tetromino.matrix = oldMatrix;
    else {
      this.calculateGhostPosition();
    }
  }
  dropTetrominoDown() {
    this.tetromino.row = this.tetromino.ghostRow;
    this.placeTetromino();
  }
  isValid() {
    const matrixSize = this.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row += 1) {
      for (let column = 0; column < matrixSize; column += 1) {
        if (!this.tetromino.matrix[row][column])
          continue;
        if (this.isOutsideGameBoard(row, column))
          return false;
        if (this.isCollides(row, column))
          return false;
      }
    }
    return true;
  }
  isOutsideGameBoard(row, column) {
    return this.tetromino.column + column < 0 || this.tetromino.column + column >= PLAYFIELD_COLUMNS || this.tetromino.row + row >= this.playField.length;
  }
  isCollides(row, column) {
    var _a;
    return (_a = this.playField[this.tetromino.row + row]) == null ? void 0 : _a[this.tetromino.column + column];
  }
  placeTetromino() {
    const matrixSize = this.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row += 1) {
      for (let column = 0; column < matrixSize; column += 1) {
        if (!this.tetromino.matrix[row][column])
          continue;
        if (this.isOutsideTopBoard(row))
          return this.isGameOver = true;
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
    });
  }
  dropRowsAbove(rowToDelete) {
    for (let row = rowToDelete; row > 0; row -= 1) {
      this.playField[row] = this.playField[row - 1];
    }
    this.playField[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
  }
  calculateGhostPosition() {
    const tetrominoRow = this.tetromino.row;
    this.tetromino.row += 1;
    while (this.isValid())
      this.tetromino.row += 1;
    this.tetromino.ghostRow = this.tetromino.row - 1;
    this.tetromino.ghostColumn = this.tetromino.column;
    this.tetromino.row = tetrominoRow;
  }
}
const style = "";
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
      if (!tetris.tetromino.matrix[row][column])
        continue;
      if (tetris.tetromino.row + row < 0)
        continue;
      const cellIndex = convertPositionIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
      cells[cellIndex].classList.add(name);
    }
  }
};
const drawPlayField = () => {
  for (let row = 0; row < PLAYFIELD_ROWS; row += 1) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column += 1) {
      if (!tetris.playField[row][column])
        continue;
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
      if (!tetris.tetromino.matrix[row][column])
        continue;
      if (tetris.tetromino.ghostRow + row < 0)
        continue;
      const cellIndex = convertPositionIndex(tetris.tetromino.ghostRow + row, tetris.tetromino.ghostColumn + column);
      cells[cellIndex].classList.add("ghost");
    }
  }
};
const draw = () => {
  cells.forEach((cell) => cell.removeAttribute("class"));
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
      if (!SAD[row][column])
        continue;
      const cellIndex = convertPositionIndex(TOP_OFFSET + row, column);
      cells[cellIndex].classList.add("sad");
    }
  }
};
const gameOverAnimation = () => {
  const filledCells = [...cells].filter((cell) => cell.classList.length > 0);
  filledCells.forEach((filledCell, i) => {
    setTimeout(() => filledCell.classList.add("hide"), i * 10);
    setTimeout(() => filledCell.removeAttribute("class"), i * 10 + 500);
    setTimeout(drawSad, filledCells.length * 10 + 1e3);
  });
};
const gameOver = () => {
  stopLoop();
  document.removeEventListener("keydown", onKeyDown);
  hammer.off("panstart panleft panright pandown swipedown tap");
  gameOverAnimation();
  setTimeout(() => {
    tetris = new Tetris();
    initKeyDown();
    initTouch();
    startLoop();
  }, 5e3);
};
const moveDown = () => {
  tetris.moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();
  if (tetris.isGameOver)
    gameOver();
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
    case "ArrowUp":
      rotate();
      break;
    case "w":
      rotate();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "s":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "a":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "d":
      moveRight();
      break;
    case " ":
      dropDown();
      break;
  }
};
const initKeyDown = () => {
  document.addEventListener("keydown", onKeyDown);
};
const initTouch = () => {
  document.addEventListener("dblclick", (event) => {
    event.preventDefault();
  });
  hammer = new Hammer(document.querySelector("body"));
  hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
  hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
  const threshold = 30;
  let deltaX = 0;
  let deltaY = 0;
  hammer.on("panstart", () => {
    deltaX = 0;
    deltaY = 0;
  });
  hammer.on("panleft", (event) => {
    if (Math.abs(event.deltaX - deltaX) > threshold) {
      moveLeft();
      deltaX = event.deltaX;
      deltaY = event.deltaY;
    }
  });
  hammer.on("panright", (event) => {
    if (Math.abs(event.deltaX - deltaX) > threshold) {
      moveRight();
      deltaX = event.deltaX;
      deltaY = event.deltaY;
    }
  });
  hammer.on("pandown", (event) => {
    if (Math.abs(event.deltaY - deltaY) > threshold) {
      moveDown();
      deltaX = event.deltaX;
      deltaY = event.deltaY;
    }
  });
  hammer.on("swipedown", () => {
    dropDown();
  });
  hammer.on("tap", () => {
    rotate();
  });
};
initKeyDown();
initTouch();
moveDown();
//# sourceMappingURL=main-19540d4c.js.map
