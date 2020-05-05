const MAX_SAMPLES = 30;
const MIN_SAMPLE_RADIUS = 10.0;
const MAX_SAMPLE_RADIUS = 30.0;
const WIDTH = 500;
const HEIGHT = 500;

let samples = [];

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch');

  let sampler = new PoissonSampler(MIN_SAMPLE_RADIUS, MAX_SAMPLE_RADIUS, WIDTH,
      HEIGHT, MAX_SAMPLES);

  let done = false;

  while (!done) {
    let p = sampler.sample();
    if (p === null) {
      done = true;
    } else {
      samples.push(p);
    }
  }
}

let xoff = 0;
let yoff = 0;
let hxoff = 0;
let hyoff = 0;

function draw() {
  clear();
  colorMode(RGB);
  background(51);

  let noiseScale = 0.1;

  noStroke();

  for (let p of samples) {
    let hue = map(noise(p.x * noiseScale + hxoff, p.y * noiseScale + hyoff), 0,
        1, 0, 360);
    let rad = map(noise(p.x * noiseScale + xoff, p.y * noiseScale + yoff), 0, 1,
        2, 10);

    colorMode(HSL);
    fill(color(hue, 100, 50));
    ellipse(p.x, p.y, rad, rad);
  }

  xoff += 0.01;
  yoff += 0.01;
  hxoff += 0.01;
  hyoff += 0.001;
}
