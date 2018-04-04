var canvas;
var ctx;

var WIDTH = 1000,
    HEIGHT = 1000;
var CELL_DIM = 10;
var BORDER_WIDTH = 2;

var cols, rows;
var cells = [];

// var CELL_VISITED_COLOR = 'rgba(136,197,251,0.8)';
var CELL_VISITED_COLOR = 'rgb(169, 169, 169)';
var CELL_UNVISITED_COLOR = 'rgba(0,0,0,0.5)';
var CELL_CURRENT_COLOR = 'rgba(0, 255,0, 0.8)';
var CELL_CLEAR_COLOR = 'rgba(255,255,255,1)';

var BORDER_COLOR = 'rgba(255,255,255,0.8)';
var TRANSPARENT_COLOR = 'rgba(255,255,255,0)';

var SPEED = 0.005;

function setup() {
    canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    ctx = canvas.getContext('2d');

    document.body.appendChild(canvas);

    cols = WIDTH / CELL_DIM;
    rows = WIDTH / CELL_DIM;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            cells.push(new Cell(i, j));
        }
    }

    for (let cell of cells) {
        cell.draw();
    }
}

function removeWalls(a, b) {
    let x = a.x - b.x;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }

    let y = a.y - b.y;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}


async function recursiveBacktracker() {
    let current = cells[0];
    current.current = true;
    current.draw();
    let neighbors = current.getNeighbors();
    let next;

    let stack = [];
    while (true) {
        if (neighbors.length > 0) {
            next = neighbors[Math.floor((Math.random() * 1000) % neighbors.length)];
            stack.push(current);
            removeWalls(current, next);
            current.current = false;
            current.draw();
            current.visited = true;
            current.draw();
            next.current = true;
            next.visited = true;
            next.draw();
            await waitFor(SPEED);
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
            current.current = true;
            current.draw();
            await waitFor(SPEED);
            current.current = false;
            current.draw();
        } else {
            break;
        }
        neighbors = current.getNeighbors();
        next.current = false;
        next.draw();
    }
    console.log("Me outta here.");
}

async function waitFor(t) {
    return new Promise(r => setTimeout(() => {
        r()
    }, t * 1000));
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.current = false;
        this.walls = [true, true, true, true];
    }

    draw() {
        let x = this.x;
        let y = this.y;

        ctx.fillStyle = CELL_CLEAR_COLOR;
        ctx.strokeStyle = BORDER_COLOR;

        ctx.beginPath();
        ctx.moveTo(x * CELL_DIM, y * CELL_DIM);

        ctx.lineTo(((x + 1) * CELL_DIM), (y * CELL_DIM));
        ctx.lineTo(((x + 1) * CELL_DIM), ((y + 1) * CELL_DIM));
        ctx.lineTo((x * CELL_DIM), ((y + 1) * CELL_DIM));
        ctx.lineTo((x * CELL_DIM), (y * CELL_DIM));

        ctx.fill();

        ctx.fillStyle = (this.visited) ? CELL_VISITED_COLOR : CELL_UNVISITED_COLOR;
        if (this.current) {
            ctx.fillStyle = CELL_CURRENT_COLOR;
        }
        ctx.beginPath();
        ctx.moveTo(x * CELL_DIM, y * CELL_DIM);

        ctx.lineTo(((x + 1) * CELL_DIM), (y * CELL_DIM));
        ctx.lineTo(((x + 1) * CELL_DIM), ((y + 1) * CELL_DIM));
        ctx.lineTo((x * CELL_DIM), ((y + 1) * CELL_DIM));
        ctx.lineTo((x * CELL_DIM), (y * CELL_DIM));

        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x * CELL_DIM, y * CELL_DIM);

        ctx.strokeStyle = BORDER_COLOR;
        ctx.lineWidth = BORDER_WIDTH;

        if (this.walls[0]) {
            ctx.lineTo(((x + 1) * CELL_DIM), (y * CELL_DIM));
        } else {
            ctx.moveTo(((x + 1) * CELL_DIM), (y * CELL_DIM));
        }
        if (this.walls[1]) {
            ctx.lineTo(((x + 1) * CELL_DIM), ((y + 1) * CELL_DIM));
        } else {
            ctx.moveTo(((x + 1) * CELL_DIM), ((y + 1) * CELL_DIM));
        }
        if (this.walls[2]) {
            ctx.lineTo((x * CELL_DIM), ((y + 1) * CELL_DIM));
        } else {
            ctx.moveTo((x * CELL_DIM), ((y + 1) * CELL_DIM));
        }
        if (this.walls[3]) {
            ctx.lineTo((x * CELL_DIM), (y * CELL_DIM));
        } else {
            ctx.moveTo((x * CELL_DIM), (y * CELL_DIM));
        }
        ctx.stroke();
    }

    getNeighbors() {
        let x = this.x;
        let y = this.y;

        let top = cells[index(x, y - 1)];
        let right = cells[index(x + 1, y)];
        let below = cells[index(x, y + 1)];
        let left = cells[index(x - 1, y)];

        return [top, right, below, left].filter(c => c && !c.visited);
    }
}

function index(j, i) {
    if (i < 0 || j < 0 || i >= cols || j >= rows) {
        return -1;
    } else {
        return i + j * cols;
    }
}

setup();
recursiveBacktracker();