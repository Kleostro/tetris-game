export const PLAYFIELD_ROWS = 20;
export const PLAYFIELD_COLUMNS = 10;
export const TETROMINO_NAMES = ['I', 'J', 'L', 'O', 'S', 'Z', 'T'];

export const getRandomElement = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const convertPositionIndex = (row, column) => row * PLAYFIELD_COLUMNS + column;

export function rotateMatrix(matrix) {
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
