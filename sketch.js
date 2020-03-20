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

    particles.push(new Particle(createVector(40.0, 40.0), createVector(0.5, 0.1)));
}

function draw() {
    clear();
    background(51);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}
