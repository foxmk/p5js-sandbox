let particles = [];

function Particle(pos, vel) {
    this.pos = pos;
    this.vel = vel;

    this.update = function () {
        let dx = p5.Vector.mult(this.vel, deltaTime);
        this.pos.add(dx);

        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1;
        }

        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1;
        }
    };

    this.draw = function () {
        noStroke();
        color(255, 0, 255);
        ellipse(this.pos.x, this.pos.y, 8, 8);
    };
}

function setup() {
    createCanvas(400, 400);

    particles.push(new Particle(createVector(40.0, 40.0), createVector(0.0, 0.0)));
    particles.push(new Particle(createVector(120.0, 120.0), createVector(0.0, 0.0)));
}

function calculateForce(driven, driver) {
    let distanse = p5.Vector.dist(driven.pos, driver.pos);
    let direction = p5.Vector.sub(driver.pos, driven.pos).normalize();
    return direction.mult(0.01).div(distanse * distanse);
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
                resultForce.add(calculateForce(p, q));
            }
        }

        // Calculate friction
        let friction = p5.Vector.mult(p.vel, -0.001);
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
