const cellSize = 10;
const colCount = 50;
const rowCount = 50;

const canvasWidth = cellSize * colCount;
const canvasHeight = cellSize * rowCount;

let prev = [];
let next = [];

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch');
    initGrids();
    frameRate(10);
}

function draw() {
    clear();
    updateCells();
    drawCells();
    swapGrids();
}

function initGrids() {
    for (let row = 0; row < rowCount; row++) {
        prev.push([]);
        next.push([]);
        for (let col = 0; col < colCount; col++) {
            prev[row].push(random() <= 0.1);
            next[row].push(false);
        }
    }
}

function swapGrids() {
    let temp = prev;
    prev = next;
    next = temp;
}

function drawCells() {
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            let x = col * cellSize;
            let y = row * cellSize;

            let c;
            if (next[col][row] === true) {
                c = color(0);
            } else {
                c = color(255);
            }
            fill(c);
            rect(x, y, cellSize, cellSize);
        }
    }
}

function updateCells() {
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            let liveNeighbourCnt = 0;

            let prevCol = j === 0 ? colCount - 1 : j - 1;
            let nextCol = j === colCount - 1 ? 0 : j + 1;
            let prevRow = i === 0 ? rowCount - 1 : i - 1;
            let nextRow = i === rowCount - 1 ? 0 : i + 1;

            if (prev[prevRow][prevCol]) liveNeighbourCnt++;
            if (prev[prevRow][j]) liveNeighbourCnt++;
            if (prev[prevRow][nextCol]) liveNeighbourCnt++;

            if (prev[i][prevCol]) liveNeighbourCnt++;
            if (prev[i][nextCol]) liveNeighbourCnt++;

            if (prev[nextRow][prevCol]) liveNeighbourCnt++;
            if (prev[nextRow][j]) liveNeighbourCnt++;
            if (prev[nextRow][nextCol]) liveNeighbourCnt++;


            if (prev[i][j] && (liveNeighbourCnt === 3 || liveNeighbourCnt === 2)) {
                // Any live cell with two or three neighbors survives.
                next[i][j] = true;
            } else if (!prev[i][j] && liveNeighbourCnt === 3) {
                // Any dead cell with three live neighbors becomes a live cell.
                next[i][j] = true;
            } else {
                // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                next[i][j] = false;
            }
        }
    }
}
