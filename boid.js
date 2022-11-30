class Boid {

  constructor(x, y, dir, vel) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.vel = vel;
    this.size = 8;
  }

  move() {
    this.x += Math.cos(this.dir) * this.vel;
    this.y += Math.sin(this.dir) * this.vel;
  }

  steer() {

  }

  show() {
    fill(255);
    push();
    translate(this.x, this.y);
    rotate(this.dir + radians(90));
    translate(-this.x, -this.y);
    triangle(this.x - this.size / 2, this.y + this.size, this.x + this.size / 2, this.y + this.size, this.x, this.y - this.size);
    pop();
  }
}
