const WRAP = false;

const FRICTION = 20.0;

const REPEL_CONSTANT = 0.002;
const REPEL_DISTANCE = 10.0;
const FORCE_SD = 0.001;
const MAX_FORCE_DISTANCE = 50.0;

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

    this.applyForce = function (f) {
        this.force.add(f);
    };
}

function calculateForce(driven, driver) {
    let distanse = p5.Vector.dist(driven.pos, driver.pos);
    let direction = p5.Vector.sub(driver.pos, driven.pos).normalize();

    if (distanse <= REPEL_DISTANCE) {
        let repelForceMag = REPEL_CONSTANT * log(distanse / REPEL_DISTANCE);
        return direction.mult(repelForceMag);
    } else if (distanse <= MAX_FORCE_DISTANCE) {
        let num = 2.0 * abs(distanse - (MAX_FORCE_DISTANCE + REPEL_DISTANCE) * 0.5);
        let den = MAX_FORCE_DISTANCE - REPEL_DISTANCE;

        let f = driven.type.attraction_constants[driver.type.type_id] * (1.0 - num / den);
        return direction.mult(f);

    } else {
        return createVector(0.0, 0.0);
    }
}

