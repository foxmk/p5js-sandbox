const WRAP = false;

const PARTICLE_COUNT = 200;
const TYPES_COUNT = 3;

let particles = [];
let debug = true;

function detectEdges(p) {
    if (WRAP) {
        if (p.pos.x < 0) {
            p.pos.x = width + p.pos.x;
        }

        if (p.pos.x > width) {
            p.pos.x = p.pos.x - width;
        }

        if (p.pos.y < 0) {
            p.pos.y = height + p.pos.y;
        }

        if (p.pos.y > height) {
            p.pos.y = p.pos.y - height;
        }
    } else {
        if (p.pos.x < 0 || p.pos.x > width) {
            p.vel.x *= -1;
        }

        if (p.pos.y < 0 || p.pos.y > height) {
            p.vel.y *= -1;
        }
    }
}

function setup() {
    createCanvas(500, 500);

    let particle_types = generateTypes();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        let pos = createVector(random(0, width), random(0, height));
        let vel = createVector(0.0, 0.0);
        let type = random(particle_types);
        particles.push(new Particle(pos, vel, type));
    }
}

function draw() {
    clear();
    background(51);

    let quad = new Quadtree(new Rectangle(0, 0, width, height), 4);

    for (let p of particles) {
        quad.insert(new Point(p.pos, p));
    }

    if (debug) {
        quad.draw();
    }

    for (let p of particles) {
        let neighbors = [];
        let bounds = new Circle(p.pos.x, p.pos.y, p.perceprionRadius);
        quad.query(bounds, neighbors);

        p.steer(neighbors.map(q => q.data));
    }

    for (let p of particles) {
        p.update();
        detectEdges(p);
    }

    for (let p of particles) {
        noFill();
        stroke(p.type.color);
        strokeWeight(8);
        point(p.pos.x, p.pos.y);
    }
}
