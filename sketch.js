const PARTICLE_COUNT = 200;
const TYPES_COUNT = 3;

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

function setup() {
    createCanvas(500, 500);
    colorMode(HSB);

    let particle_types = generateTypes();
    generateParticles(particle_types);
}

function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        // Calculate resulting force
        for (let j = 0; j < particles.length; j++) {
            if (i !== j) {
                let q = particles[j];
                let force = calculateForce(p, q);
                p.applyForce(force);
            }
        }

        let drag = p5.Vector.div(p.vel, -FRICTION);
        p.applyForce(drag);


        p.update();
    }
}

function drawParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}

function draw() {
    clear();
    background(0, 0, 20);
    updateParticles();
    drawParticles();
}
