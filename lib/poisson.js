class PoissonSampler {
  constructor(minRadius, maxRadius, maxX, maxY, maxCandidates) {
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.maxX = maxX;
    this.maxY = maxY;
    this.maxCandidates = maxCandidates;

    this.activePoints = [];
    this.samples = [];
    this.seeded = false;
  }

  sample() {

    if (this.activePoints.length === 0) {
      if (!this.seeded) {
        let p = createVector(random(0, this.maxX), random(0, this.maxY));
        this.seeded = true;
        this.activePoints.push(p);
        this.samples.push(p);
        return p;
      } else {
        return null;
      }
    } else {
      while (this.activePoints.length > 0) {
        let point = random(this.activePoints);

        for (let j = 0; j < this.maxCandidates; j++) {
          let candidate = this._generateCandidate(point);

          if (this._isFarEnough(candidate) &&
              this._isWithinBorders(candidate)) {
            this.activePoints.push(candidate);
            this.samples.push(candidate);
            return candidate;
          }
        }

        this.activePoints.splice(this.activePoints.indexOf(point), 1);
      }

      return null;
    }
  }

  _generateCandidate(point) {
    let a = p5.Vector.random2D();
    a.setMag(random(this.minRadius / 2.0, this.maxRadius / 2.0));
    return p5.Vector.add(a, point);
  }

  _isFarEnough(candidate) {
    for (let p of samples) {
      if (p5.Vector.dist(p, candidate) < this.minRadius) {
        return false;
      }
    }
    return true;
  }

  _isWithinBorders(candidate) {
    return candidate.x > 0 && candidate.x <= this.maxX && candidate.y > 0 &&
        candidate.y <= this.maxY;
  }
}
