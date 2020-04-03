let metaballs;

function preload() {
    metaballs = loadShader('./metaballs.vert', './metaballs.frag');

}

function setup() {
    let canvas = createCanvas(500, 500, WEBGL);
    canvas.parent('sketch');

    noStroke();

    shader(metaballs);
}

function draw() {
    metaballs.setUniform('p', [.0, .0, 0.4, .4]);
    // metaballs.setUniform('p', [[.0, .0], [.4, .4]]);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
}
