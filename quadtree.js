const DEFAULT_CAPACITY = 4;

class Point {
    constructor(position) {
        this.position = position;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return !(point.position.x < this.x || point.position.x >= this.x + this.w || point.position.y < this.y || point.position.y >= this.y + this.h)
    }

    intersects(other) {
        return !(other.x > this.x + this.w && this.x > other.x + other.w && other.y > this.y + this.h && this.y > other.y + other.h)
    }
}

class Quadtree {
    constructor(bounds, capacity) {
        this.bounds = bounds;
        this.capacity = capacity || DEFAULT_CAPACITY;

        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.bounds.contains(point)) {
            return false;
        }

        if (this.divided) {
            return this.topleft.insert(point) ||
                this.topright.insert(point) ||
                this.bottomleft.insert(point) ||
                this.bottomright.insert(point);
        } else {
            this.points.push(point);

            if (this.points.length > this.capacity) {
                return this.subdivide();
            } else {
                return true;
            }
        }
    }

    subdivide() {
        let x = this.bounds.x;
        let y = this.bounds.y;

        let halfWidth = this.bounds.w / 2;
        let halfHeight = this.bounds.h / 2;

        let tl = new Rectangle(x, y, halfWidth, halfHeight);
        let tr = new Rectangle(x + halfWidth, y, halfWidth, halfHeight);
        let bl = new Rectangle(x, y + halfHeight, halfWidth, halfHeight);
        let br = new Rectangle(x + halfWidth, y + halfHeight, halfWidth, halfHeight);

        this.topleft = new Quadtree(tl, this.capacity);
        this.topright = new Quadtree(tr, this.capacity);
        this.bottomleft = new Quadtree(bl, this.capacity);
        this.bottomright = new Quadtree(br, this.capacity);

        let allInserted = true;

        for (let p of this.points) {
            let inserted = this.topleft.insert(p) ||
                this.topright.insert(p) ||
                this.bottomleft.insert(p) ||
                this.bottomright.insert(p);

            allInserted &= inserted;
        }

        this.points = [];
        this.divided = true;

        return allInserted;
    }

    query(bounds, points) {
        if (points === undefined) {
            points = [];
        }

        if (this.divided) {
            this.topleft.query(bounds, points);
            this.topright.query(bounds, points);
            this.bottomleft.query(bounds, points);
            this.bottomright.query(bounds, points);
        } else {
            if (this.bounds.intersects(bounds)) {
                for (let p of this.points) {
                    if (bounds.contains(p)) {
                        points.push(p);
                    }
                }
            }
        }

        return points;
    }

    draw() {
        colorMode(RGB);
        noFill();
        stroke(255, 0, 0);
        strokeWeight(1);
        rectMode(CORNER);
        rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);

        for (let p of this.points) {
            strokeWeight(4);
            stroke(255, 255, 255);
            point(p.position.x, p.position.y);
        }

        if (this.divided) {
            this.topleft.draw();
            this.topright.draw();
            this.bottomleft.draw();
            this.bottomright.draw();
        }
    }
}
