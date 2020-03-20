const FRICTION = 0.001;
const WRAP = true;
const PARTICLE_COUNT = 4;
const REPEL_DISTANCE = 8.0;

let particles = [];

function Particle(pos, vel) {
    this.pos = pos;
    this.vel = vel;

    this.update = function () {
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
    };

    this.draw = function () {
        noStroke();
        color(255, 0, 255);
        ellipse(this.pos.x, this.pos.y, 8, 8);
    };

    this.calculateForce = function calculateForce(driver) {
        let distanse = p5.Vector.dist(this.pos, driver.pos);
        let direction = p5.Vector.sub(driver.pos, this.pos).normalize();

        if (distanse <= REPEL_DISTANCE) {
            return direction.mult(0.01).mult(log(distanse / REPEL_DISTANCE));
        } else {
            return direction.mult(0.01).div(distanse * distanse);
        }
    }
}

function setup() {
    createCanvas(400, 400);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        let pos = createVector(random(0, width), random(0, height));
        let vel = createVector(0.0, 0.0);
        particles.push(new Particle(pos, vel));
    }
}

function draw() {
    clear();
    background(51);

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        let resultForce = createVector(0.0, 0.0);

        // Calculate resulting force
        for (let j = 0; j < particles.length; j++) {
            if (i !== j) {
                let q = particles[j];
                resultForce.add(p.calculateForce(q));
            }
        }

        // Calculate friction
        let friction = p5.Vector.mult(p.vel, -FRICTION);
        resultForce.add(friction);

        // Apply force
        let dv = p5.Vector.mult(resultForce, deltaTime);

        p.vel.add(dv);
    }


    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}
