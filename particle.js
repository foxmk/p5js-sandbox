const FRICTION = 20.0;

const REPEL_CONSTANT = 0.002;
const REPEL_DISTANCE = 5.0;
const FORCE_SD = 0.001;
const MAX_FORCE_DISTANCE = 30.0;

class Particle {
    constructor(pos, vel, type) {
        this.pos = pos;
        this.vel = vel;
        this.type = type;

        this.perceprionRadius = MAX_FORCE_DISTANCE;
        this.force = createVector(0.0, 0.0);
    }


    update() {
        let dv = p5.Vector.mult(this.force, deltaTime);
        this.vel.add(dv);

        let dx = p5.Vector.mult(this.vel, deltaTime);
        this.pos.add(dx);

        this.force = createVector(0.0, 0.0);
    }

    steer(neighbors) {
        for (let q of neighbors) {
            if (this !== q) {
                let force = calculateForce(this, q);
                this.force.add(force);
            }
        }

        let drag = p5.Vector.div(this.vel, -FRICTION);
        this.force.add(drag);
    }
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

function generateTypes(particle_types) {
    if (particle_types === undefined) {
        particle_types = [];
    }

    for (let j = 0; j < TYPES_COUNT; j++) {
        let attraction_constants = [];

        for (let k = 0; k < TYPES_COUNT; k++) {
            attraction_constants.push(randomGaussian(0, FORCE_SD));
        }

        colorMode(HSB);
        particle_types.push({
            type_id: j,
            color: color(random(0, 255), 200, 255),
            attraction_constants: attraction_constants
        });
        colorMode(RGB);
    }

    return particle_types;
}
