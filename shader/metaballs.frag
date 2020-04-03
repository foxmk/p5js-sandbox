precision highp float;

uniform vec2 p[2];

void main() {

    float r = 0.2;
    float sqDoubleR = (0.04 * 2.0) * (0.04 * 2.0);
    float sumDist = 0.0;

    for (int i = 0; i < 1; i++) {
        float dx = gl_PointCoord.x - p[i].x;
        float dy = gl_PointCoord.y - p[i].y;
        float sqDist =  dx * dx + dy * dy;
        sumDist += sqDist;
    }

    float dd = sqDoubleR - sumDist;

    if (dd < 0.0) {
        gl_FragColor = vec4(1, 1, 1, 1);
    } else {
        gl_FragColor = vec4(0.9, 0, 0, 1);
    }
}
