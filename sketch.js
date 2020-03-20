const WRAP = true;

const PARTICLE_COUNT = 100;
const TYPES_COUNT = 3;

const FRICTION = 0.05;

const REPEL_CONSTANT = 0.002;
const REPEL_DISTANCE = 8.0;

const FORCE_CONSTANT = 0.1;
const MAX_FORCE_DISTANCE = 100.0;

let particles = [];

function Particle(pos, vel, type) {
    this.pos = pos;
    this.vel = vel;
    this.type = type;

    this.force = createVector(0.0, 0.0);

    this.update = function () {
        let dv = p5.Vector.mult(this.force, deltaTime);
        this.vel.add(dv);

        let dx = p5.Vector.mult(this.vel, deltaTime);
        this.pos.add(dx);

        if (WRAP) {
            if (this.pos.x < 0) {
                this.pos.x = width + this.pos.x;
            }

            if (this.pos.x > width) {
                this.pos.x = this.pos.x - width;
            }

            if (this.pos.y < 0) {
                this.pos.y = height + this.pos.y;
            }

            if (this.pos.y > height) {
                this.pos.y = this.pos.y - height;
            }
        } else {
            if (this.pos.x < 0 || this.pos.x > width) {
                this.vel.x *= -1;
            }

            if (this.pos.y < 0 || this.pos.y > height) {
                this.vel.y *= -1;
            }
        }

        this.force = createVector(0.0, 0.0);
    };

    this.draw = function () {
        noStroke();
        fill(this.type.color);
        ellipse(this.pos.x, this.pos.y, 8, 8);
    };

    this.applyFriction = function () {
        let friction = p5.Vector.mult(this.vel, -FRICTION);
        this.force.add(friction);
    };

    this.applyForce = function (f) {
        this.force.add(f);
    };

    this.calculateForce = function calculateForce(driver) {
        let distanse = p5.Vector.dist(this.pos, driver.pos);
        let direction = p5.Vector.sub(driver.pos, this.pos).normalize();

        if (distanse <= REPEL_DISTANCE) {
            return direction.mult(REPEL_CONSTANT).mult(log(distanse / REPEL_DISTANCE));
        } else if (distanse <= MAX_FORCE_DISTANCE) {

            let c = FORCE_CONSTANT;

            if (this.type !== driver.type) {
                c *= -1;
            }

            return direction.mult(c).div(distanse);
        } else {
            return createVector(0.0, 0.0);
        }
    }
}

function setup() {
    createCanvas(500, 500);
    colorMode(HSB);

    let particle_types = [];

    for (let j = 0; j < TYPES_COUNT; j++) {
        particle_types.push({
            color: color(random(0, 255), 200, 255)
        });
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        let pos = createVector(random(0, width), random(0, height));
        let vel = createVector(0.0, 0.0);
        let type = random(particle_types);
        particles.push(new Particle(pos, vel, type));
    }
}

function draw() {
    clear();
    background(0, 0, 20);

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        // Calculate resulting force
        for (let j = 0; j < particles.length; j++) {
            if (i !== j) {
                let q = particles[j];
                let force = p.calculateForce(q);
                p.applyForce(force);
            }
        }

        p.applyFriction();

        particles[i].update();
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}
