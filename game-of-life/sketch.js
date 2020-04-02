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

    for (let i = 0; i <= colCount; i++) {
        prev.push([]);
        next.push([]);
        for (let j = 0; j <= rowCount; j++) {
            prev[i].push(random() <= 0.1);
            next[i].push(false);
        }
    }

    frameRate(10);
}

function draw() {
    clear();

    for (let i = 0; i <= colCount; i++) {
        for (let j = 0; j <= rowCount; j++) {
            let liveNeighbourCnt = 0;

            let prevCol = i === 0 ? colCount : i - 1;
            let nextCol = i === colCount ? 0 : i + 1;
            let prevRow = j === 0 ? rowCount : j - 1;
            let nextRow = j === rowCount ? 0 : j + 1;

            if (prev[prevCol][prevRow]) liveNeighbourCnt++;
            if (prev[prevCol][j]) liveNeighbourCnt++;
            if (prev[prevCol][nextRow]) liveNeighbourCnt++;
            if (prev[i][prevRow]) liveNeighbourCnt++;
            if (prev[i][nextRow]) liveNeighbourCnt++;
            if (prev[nextCol][prevRow]) liveNeighbourCnt++;
            if (prev[nextCol][j]) liveNeighbourCnt++;
            if (prev[nextCol][nextRow]) liveNeighbourCnt++;


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


    for (let col = 0; col <= colCount; col++) {
        for (let row = 0; row <= rowCount; row++) {
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

    let temp = prev;
    prev = next;
    next = temp;
}
