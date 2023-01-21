class Boid {

  constructor(x, y, dir, vel) {

    this.x = x;
    this.y = y;
    this.dir = dir;
    this.vel = vel;

    this.num_flockmates = 3;
    this.visual_range = 200;
    this.scale = 1;

    this.size = 8;
    this.neighbors = [];
    this.neighbors_dist = [];

    this.vis_neighbors = false;

  }

  set_flockmates(n) {

    this.num_flockmates = n;

  }

  set_range(r) {
    
    this.visual_range = r;

  }

  set_scale(s) {

    this.scale = s;

  }

  scan_neighbors(boids) {
    
    this.neighbors = [];
    this.neighbors_dist = [];

    for (let b of boids) {

      let b_dist = toroidal_dist_sq(this.x, this.y, b.x, b.y);

      if (b_dist > this.visual_range ** 2)
        continue;

      if (this.neighbors.length <= this.num_flockmates) {

        this.neighbors.push(b);
        this.neighbors_dist.push(b_dist);
      
      }
      else {

        // Find the boid the farthest distance from this
        let furthest_boid = 0;

        for (let i = 0; i < this.neighbors.length; i++) {

          if (this.neighbors_dist[i] > this.neighbors_dist[furthest_boid])
            furthest_boid = i;

        }
        // Swap out furthest boid for new one
        if (b_dist < this.neighbors_dist[furthest_boid]) {

          this.neighbors_dist[furthest_boid] = b_dist;
          this.neighbors[furthest_boid] = b;
        
        }
      }
    }
  }

  visualize_neighbors() {

    this.vis_neighbors = true;
  
  }

  move(boids) {

    this.scan_neighbors(boids);
    this.steer();

    this.x += Math.cos(this.dir) * this.vel;
    this.y += Math.sin(this.dir) * this.vel;

  }

  steer() {

  }

  show() {

    fill(255);
    stroke(255);

    // Move to origin, rotate, then move back and draw
    // This ensures each boid rotates around its own center
    push();
    translate(this.x, this.y);
    rotate(this.dir + radians(90));
    translate(-this.x, -this.y);
    triangle(this.x - this.size / 2 * this.scale, this.y + this.size * this.scale, this.x + this.size / 2 * this.scale, this.y + this.size * this.scale, this.x, this.y - this.size * this.scale);
    pop();

    if (this.vis_neighbors) {

      for (let n of this.neighbors) {
        stroke(0, 255, 0);
        strokeWeight(2);
        line(this.x, this.y, n.x, n.y);
      }

      this.vis_neighbors = false;

    }

  }
}

// Toroidal squared distance between objects
// - Finds the shortest distance between two objects
//   while accounting for screen wrapping
// - Returns distance squared to avoid
//   expensive sqrt calculations
function toroidal_dist_sq(x1, y1, x2, y2) {

  let dx = abs(x2 - x1);
  let dy = abs(y2 - y1);

  if (dx > 0.5)
    dx = 1.0 - dx;
  
  if (dy > 0.5)
    dy = 1.0 - dy;
  
  return (dx * dx + dy * dy);

}
