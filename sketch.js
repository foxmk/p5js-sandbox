const PARTICLE_COUNT = 1000;
const TYPES_COUNT = 4;

let particles = [];

function generateTypes(particle_types) {
    if (particle_types === undefined) {
        particle_types = [];
    }

    for (let j = 0; j < TYPES_COUNT; j++) {
        let attraction_constants = [];

        for (let k = 0; k < TYPES_COUNT; k++) {
            attraction_constants.push(randomGaussian(0, FORCE_SD));
        }

        particle_types.push({
            type_id: j,
            color: color(random(0, 255), 200, 255),
            attraction_constants: attraction_constants
        });
    }

    return particle_types;
}

function generateParticles(particle_types) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        let pos = createVector(random(0, width), random(0, height));
        let vel = createVector(0.0, 0.0);
        let type = random(particle_types);
        particles.push(new Particle(pos, vel, type));
    }
}

let bounds;

function setup() {
    createCanvas(500, 500);

    bounds = new Circle(0, 0, 40, 40);

    let particle_types = generateTypes();
    generateParticles(particle_types);
}


function draw() {
    clear();
    background(51);

    bounds = new Circle(mouseX - 20, mouseY - 20, 40, 40);

    let quad = new Quadtree(new Rectangle(0, 0, width, height), 4);

    for (let p of particles) {
        quad.insert(new Point(p.pos, p));
    }

    // quad.draw();

    for (let p of particles) {
        let points = [];
        quad.query(new Circle(p.pos.x, p.pos.y, MAX_FORCE_DISTANCE), points);

        // Calculate resulting force
        for (let q of points) {
            if (p !== q.data) {
                let force = calculateForce(p, q.data);
                p.applyForce(force);
            }
        }

        let drag = p5.Vector.div(p.vel, -FRICTION);
        p.applyForce(drag);
    }

    for (let p of particles) {
        p.update();
    }

    // for (let p of points) {
    //     strokeWeight(4);
    //     stroke(255, 0, 0);
    //     point(p.position.x, p.position.y);
    // }

    // noFill();
    // stroke(0, 255, 0);
    // strokeWeight(1);
    // ellipseMode(RADIUS);
    // ellipse(bounds.x, bounds.y, bounds.r, bounds.r);

    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}
