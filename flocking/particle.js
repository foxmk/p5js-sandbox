const FRICTION = 20.0;

const REPEL_CONSTANT = 0.002;
const REPEL_DISTANCE = 5.0;
const FORCE_SD = 0.001;

const AVOIDANCE_FORCE = 0.01;
const AVOIDANCE_RANGE = 30.0;
const ALIGNMENT_FORCE = 0.8;
const ALIGNMENT_RANGE = 40.0;
const COHESION_FORCE = 0.001;
const PERCEPTION_RANGE = 70.0;

class Particle {
    constructor(pos, vel, type) {
        this.position = pos;
        this.velocity = vel;
        // this.type = type;

        this.perceprionRadius = PERCEPTION_RANGE;
        this.acceleration = createVector(0.0, 0.0);
    }


    update() {
        // this.vel.add(p5.Vector.mult(this.acceleration, deltaTime));
        this.velocity.add(this.acceleration);
        this.velocity.limit(1);
        // this.pos.add(p5.Vector.mult(this.vel, deltaTime));
        this.position.add(this.velocity);

        if (debug) {
            // Velocity vector
            stroke(color(255, 0, 0));
            strokeWeight(2);
            let velocityVector = p5.Vector.add(this.position, p5.Vector.mult(this.velocity, 10));
            line(this.position.x, this.position.y, velocityVector.x, velocityVector.y);

            // Perception radius
            stroke(color(255, 255, 0));
            strokeWeight(1);
            ellipseMode(RADIUS);
            ellipse(this.position.x, this.position.y, this.perceprionRadius, this.perceprionRadius);

            // Avoidance distance
            stroke(color(255, 0, 50));
            strokeWeight(1);
            ellipseMode(RADIUS);
            ellipse(this.position.x, this.position.y, AVOIDANCE_RANGE, AVOIDANCE_RANGE)

            // Alignment distance
            stroke(color(40, 0, 255));
            strokeWeight(1);
            ellipseMode(RADIUS);
            ellipse(this.position.x, this.position.y, ALIGNMENT_RANGE, ALIGNMENT_RANGE)

            // Steering force
            stroke(color(50, 50, 255));
            strokeWeight(1);
            let accVector = p5.Vector.add(this.position, p5.Vector.mult(this.acceleration, 100));
            line(this.position.x, this.position.y, accVector.x, accVector.y);
        }

        this.acceleration.mult(0);
    }

    applyForce(f) {
        this.acceleration.add(f);
    }

    steer(neighbors) {
        this.separate(neighbors);
        this.align(neighbors);
        this.cohere(neighbors);
        // this.drag();
    }

    drag() {
        let drag = p5.Vector.div(this.velocity, -FRICTION);
        this.applyForce(drag);
    }

    align(neighbors) {
        // This point will be in neighbors
        if (neighbors.length > 1) {
            let alignment = createVector(0, 0);

            for (let q of neighbors) {
                if (this !== q) {
                    let distSq = p5.Vector.sub(this.position, q.position).magSq();

                    if (distSq < ALIGNMENT_RANGE * ALIGNMENT_RANGE) {
                        alignment.add(q.velocity);
                    }
                }
            }

            if (alignment.magSq() > 0) {
                alignment.div(neighbors.length - 1);

                let diff = p5.Vector.sub(alignment, this.velocity);

                let mag = ALIGNMENT_FORCE * map(abs(alignment.angleBetween(this.velocity)), 1, PI, 0.1, 1);

                let direction = diff.normalize();
                let force = direction.setMag(mag);
                this.acceleration.add(force);
            }
        }
    }

    separate(neighbors) {
        // This point will be in neighbors
        for (let q of neighbors) {
            if (this !== q) {
                let diff = p5.Vector.sub(this.position, q.position);

                let distance = diff.mag();
                if (distance < AVOIDANCE_RANGE) {
                    let mag = AVOIDANCE_FORCE * (1 / (distance + 0.0001));
                    let direction = diff.normalize();
                    let force = direction.setMag(mag);
                    this.applyForce(force);
                }
            }
        }
    }

    cohere(neighbors) {
        // This point will be in neighbors
        if (neighbors.length > 2) {
            let center = createVector(0, 0);

            for (let q of neighbors) {
                if (this !== q) {
                    center.add(q.position);
                }
            }

            center.div(neighbors.length - 1);

            if (debug) {
                // Center of mass
                stroke(40, 255, 0);
                strokeWeight(4);
                point(center.x, center.y);
            }

            let diff = p5.Vector.sub(center, this.position);
            let distance = diff.mag();
            let mag = COHESION_FORCE * distance;
            let direction = diff.normalize();
            let force = direction.setMag(mag);
            this.applyForce(force);
        }
    }
}

//
// function calculateForce(driven, driver) {
//     let distanse = p5.Vector.dist(driven.pos, driver.pos);
//     let direction = p5.Vector.sub(driver.pos, driven.pos).normalize();
//
//     if (distanse <= REPEL_DISTANCE) {
//         let repelForceMag = REPEL_CONSTANT * log(distanse / REPEL_DISTANCE);
//         return direction.mult(repelForceMag);
//     } else if (distanse <= MAX_FORCE_DISTANCE) {
//         let num = 2.0 * abs(distanse - (MAX_FORCE_DISTANCE + REPEL_DISTANCE) * 0.5);
//         let den = MAX_FORCE_DISTANCE - REPEL_DISTANCE;
//
//         let f = driven.type.attraction_constants[driver.type.type_id] * (1.0 - num / den);
//         return direction.mult(f);
//
//     } else {
//         return createVector(0.0, 0.0);
//     }
// }
//
// function generateTypes(particle_types) {
//     if (particle_types === undefined) {
//         particle_types = [];
//     }
//
//     for (let j = 0; j < TYPES_COUNT; j++) {
//         let attraction_constants = [];
//
//         for (let k = 0; k < TYPES_COUNT; k++) {
//             attraction_constants.push(randomGaussian(0, FORCE_SD));
//         }
//
//         colorMode(HSB);
//         particle_types.push({
//             type_id: j,
//             color: color(random(0, 255), 200, 255),
//             attraction_constants: attraction_constants
//         });
//         colorMode(RGB);
//     }
//
//     return particle_types;
// }
