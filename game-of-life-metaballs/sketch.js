const cellSize = 20;
const colCount = 10;
const rowCount = 10;

const canvasWidth = cellSize * colCount;
const canvasHeight = cellSize * rowCount;

let density;

let prev = [];
let next = [];

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch');

    density = pixelDensity();

    initializeGrids();
    frameRate(1);
}

function draw() {
    // clear();
    updateCells();
    // drawCells();
    drawMetaballs();
    swapGrids();
}

function setPixel(x, y, c) {
    for (let i = 0; i < density; i++) {
        for (let j = 0; j < density; j++) {
            let index = 4 * ((y * density + j) * width * density + (x * density + i));
            pixels[index] = red(c);
            pixels[index + 1] = green(c);
            pixels[index + 2] = blue(c);
            pixels[index + 3] = alpha(c);
        }
    }
}

function getSqDistanceToCellCenter(row, col, x, y) {
    let cellCenterX = row * cellSize + cellSize / 2;
    let cellCenterY = col * cellSize + cellSize / 2;

    stroke(255, 0, 0);
    strokeWeight(3);
    point(cellCenterX, cellCenterY);

    let dx = x - cellCenterX;
    let dy = y - cellCenterY;

    return sq(dx) + sq(dy);
}

function getFalloff(x, y, row, col) {
    let sqDist = getSqDistanceToCellCenter(row, col, x, y);
    return 1 / sqDist;
}

function drawMetaballs() {
    loadPixels();

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            let thisRow = Math.floor(x / cellSize);
            let thisCol = Math.floor(y / cellSize);

            let prevRow = thisRow === 0 ? rowCount - 1 : thisRow - 1;
            let nextRow = thisRow === rowCount - 1 ? 0 : thisRow + 1;
            let prevCol = thisCol === 0 ? colCount - 1 : thisCol - 1;
            let nextCol = thisCol === colCount - 1 ? 0 : thisCol + 1;

            let sumFalloff = 0;

            if (next[prevRow][prevCol]) sumFalloff += getFalloff(x, y, prevRow, prevCol);
            if (next[prevRow][thisCol]) sumFalloff += getFalloff(x, y, prevRow, thisCol);
            if (next[prevRow][nextCol]) sumFalloff += getFalloff(x, y, prevRow, nextCol);

            if (next[thisRow][prevCol]) sumFalloff += getFalloff(x, y, thisRow, prevCol);
            if (next[thisRow][thisCol]) sumFalloff += getFalloff(x, y, thisRow, thisCol);
            if (next[thisRow][nextCol]) sumFalloff += getFalloff(x, y, thisRow, nextCol);

            if (next[nextRow][prevCol]) sumFalloff += getFalloff(x, y, nextRow, prevCol);
            if (next[nextRow][thisCol]) sumFalloff += getFalloff(x, y, nextRow, thisCol);
            if (next[nextRow][nextCol]) sumFalloff += getFalloff(x, y, nextRow, nextCol);

            // console.log(sumFalloff);

            let c;
            if (sumFalloff <= 0.008) {
                c = color(255);
            } else if (sumFalloff > 0.008 && sumFalloff < 0.012) {
                c = color(map(sumFalloff, 0.008, 0.012, 255, 0));
            } else {
                c = color(0);
            }

            setPixel(x, y, c);
        }
    }

    updatePixels();
}

function drawCells() {
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
            noStroke();
            rect(x, y, cellSize, cellSize);
        }
    }
}

function swapGrids() {
    let temp = prev;
    prev = next;
    next = temp;
}

function updateCells() {
    for (let i = 0; i < colCount; i++) {
        for (let j = 0; j < rowCount; j++) {
            let liveNeighbourCnt = 0;

            let prevRow = i === 0 ? rowCount - 1 : i - 1;
            let nextRow = i === rowCount - 1 ? 0 : i + 1;
            let prevCol = j === 0 ? colCount - 1 : j - 1;
            let nextCol = j === colCount - 1 ? 0 : j + 1;

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

function initializeGrids() {
    for (let i = 0; i < colCount; i++) {
        prev.push([]);
        next.push([]);
        for (let j = 0; j < rowCount; j++) {
            prev[i].push(random() <= 0.5);
            next[i].push(false);
        }
    }

    // prev[Math.floor(rowCount / 2)][Math.floor(colCount / 2)] = true;
    // prev[Math.floor(rowCount / 2) + 1][Math.floor(colCount / 2)] = true;
}
