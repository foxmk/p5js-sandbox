const WRAP = true;

const PARTICLE_COUNT = 300;
const TYPES_COUNT = 3;

let particles = [];
let debug = false;

function detectEdges(p) {
    if (WRAP) {
        if (p.position.x < 0) {
            p.position.x = width;
        }

        if (p.position.x > width) {
            p.position.x = 0;
        }

        if (p.position.y < 0) {
            p.position.y = height;
        }

        if (p.position.y > height) {
            p.position.y = 0;
        }
    } else {
        if (p.position.x < 0 || p.position.x > width) {
            p.velocity.x *= -1;
        }

        if (p.position.y < 0 || p.position.y > height) {
            p.velocity.y *= -1;
        }
    }
}

function setup() {
    createCanvas(500, 500);

    // let particle_types = generateTypes();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        let pos = createVector(random(0, width), random(0, height));
        let vel = p5.Vector.random2D().mult(1);
        // let vel = createVector(0, 0);
        // let type = random(particle_types);
        particles.push(new Particle(pos, vel));
    }
}

function draw() {
    clear();
    background(51);

    let quad = new Quadtree(new Rectangle(0, 0, width, height), 4);

    for (let p of particles) {
        quad.insert(new Point(p.position, p));
    }

    if (debug) {
        quad.draw();
    }

    for (let p of particles) {
        let neighbors = [];

        let bounds = new Circle(p.position.x, p.position.y, p.perceprionRadius);
        quad.query(bounds, neighbors);

        p.steer(neighbors.map(q => q.data));
    }

    for (let p of particles) {
        p.update();
        detectEdges(p);
    }

    for (let p of particles) {
        noStroke();
        fill(color(255, 255, 255));
        push();
        translate(p.position.x, p.position.y);
        rotate(p.velocity.heading() - radians(90));
        triangle(0,0, -2, -5, 2, -5);
        pop();

    }
}
