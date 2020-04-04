precision highp float;

uniform vec3 balls[900];
const float r = 0.1;

void main() {

    float v = 0.0;
    for (int i = 0; i < 900; i++) {
        vec3 ball = balls[i];
        float dx =  ball.x - gl_PointCoord.x;
        float dy =  ball.y - gl_PointCoord.y;
        float sqDist =  dx * dx + dy * dy;

        v += (r*r/sqDist) * ball.z;
    }

    if (v > 1.0) {
        gl_FragColor = vec4(0.9, 0, 0, 1);
    } else {
        gl_FragColor = vec4(1, 1, 1, 1);
    }
}
