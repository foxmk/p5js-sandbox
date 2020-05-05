const MAX_SAMPLES = 30
const MIN_SAMPLE_RADIUS = 10.0
const MAX_SAMPLE_RADIUS = 30.0
const WIDTH = 500
const HEIGHT = 500

let activePoints = []
let samples = []
let seeded = false

function setup () {
  let canvas = createCanvas(WIDTH, HEIGHT)
  canvas.parent('sketch')

  while (samplePoint() !== null) {}
}

function samplePoint () {
  function generateCandidate (point) {
    let a = p5.Vector.random2D()
    a.setMag(random(MIN_SAMPLE_RADIUS / 2.0, MAX_SAMPLE_RADIUS / 2.0))
    return p5.Vector.add(a, point)
  }

  function isFarEnough (candidate) {
    for (let p of samples) {
      if (p5.Vector.dist(p, candidate) < MIN_SAMPLE_RADIUS) {
        return false
      }
    }
    return true
  }

  function isWithinBorders (candidate) {
    return candidate.x > 0 && candidate.x <= WIDTH && candidate.y > 0 && candidate.y <= HEIGHT
  }

  if (activePoints.length === 0) {
    if (!seeded) {
      let p = createVector(random(0, WIDTH), random(0, HEIGHT))
      activePoints.push(p)
      samples.push(p)
      seeded = true
      return p
    } else {
      return null
    }
  }

  while (activePoints.length > 0) {
    let point = random(activePoints)

    for (let j = 0; j < MAX_SAMPLES; j++) {
      let candidate = generateCandidate(point)

      if (isFarEnough(candidate) && isWithinBorders(candidate)) {
        activePoints.push(candidate)
        samples.push(candidate)
        return candidate
      }
    }

    activePoints.splice(activePoints.indexOf(point), 1)
  }
}

let xoff = 0
let yoff = 0
let hxoff = 0
let hyoff = 0


function draw () {
  clear()
  colorMode(RGB)
  background(51)

  let noiseScale = 0.01

  noStroke()

  for (let p of samples) {
    let hue = map(noise(p.x * noiseScale + hxoff, p.y * noiseScale + hyoff), 0, 1, 0, 360)
    let rad = map(noise(p.x * noiseScale + xoff, p.y * noiseScale + yoff), 0, 1, 2, 10)

    colorMode(HSL)
    fill(color(hue, 100, 50))
    ellipse(p.x, p.y, rad, rad)
  }

  xoff += 0.01
  yoff += 0.01
  hxoff += 0.01
  hyoff += 0.001
}
