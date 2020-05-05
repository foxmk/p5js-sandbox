const cellSize = 2;
const colCount = 250;
const rowCount = 250;

const canvasWidth = cellSize * colCount;
const canvasHeight = cellSize * rowCount;

let cells = [];

function setup() {
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('sketch');

  for (let i = 0; i < rowCount; i++) {
    cells.push([]);
    for (let j = 0; j < colCount; j++) {
      cells[i].push(0);
    }
  }

  cells[0][colCount / 2] = 1;

  frameRate(60);
}

let currentRow = 1;

// let currentCol = 1;

function draw() {
  clear();

  let prevRow = cells[(currentRow === 0 ? rowCount - 1 : currentRow - 1)];

  for (let currentCol = 0; currentCol < colCount; currentCol++) {

    let left = prevRow[(currentCol === 0 ? colCount : currentCol - 1)];
    let central = prevRow[currentCol];
    let right = prevRow[(currentCol === colCount ? 0 : currentCol + 1)];

    // let currentPattern = left << 2 + central << 1 + right;
    // console.log(currentPattern.toString(2));

    // cells[currentRow][currentCol] = random() >= 0.5;
    cells[currentRow][currentCol] = left ^ (central || right);
  }

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      let y = row * cellSize;
      let x = col * cellSize;

      if (cells[row][col] === 1) {
        fill(color(0));
      } else {
        if (row === currentRow /*&& col === currentCol*/) {
          fill(color(255, 0, 0));
        } else {
          fill(color(255));
        }
      }
      noStroke();
      rect(x, y, cellSize, cellSize);
    }
  }

  // currentCol = currentCol === colCount - 1 ? 0 : currentCol + 1;
  //
  // if (currentCol === 0) {
  currentRow = currentRow === rowCount - 1 ? 0 : currentRow + 1;
  // }
}
