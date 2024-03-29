class Boid {

  constructor(x, y, dir, vel) {

    this.x = x;
    this.y = y;
    this.dir = dir;
    this.vel = vel;

    this.visual_range = 200;
    this.scale = 1;
    this.turnrate = 0.01;
    this.size = 8;
    this.cohesion_strength = 0.2;
    this.separation_strength = 0.2;
    this.alignment_strength = 0.2;

    this.neighbors = [];
    this.neighbors_dist = [];
    this.centroid = [this.x, this.y];

    this.vis_neighbors = false;

  }

  set_range(r) { this.visual_range = r; }

  set_scale(s) { this.scale = s; }

  set_turnrate(t) { this.turnrate = t; }

  set_cohesion_strength(c) { this.cohesion_strength = c; }

  set_separation_strength(c) { this.separation_strength = c; }

  set_alignment_strength(c) { this.alignment_strength = c; }

  get_neighbors(boids) {
    
    this.neighbors = [];
    this.neighbors_dist = [];

    for (let b of boids) {

      let b_dist = toroidal_dist_sq(this.x, this.y, b.x, b.y);

      if (b_dist < this.visual_range ** 2) {

        this.neighbors.push(b);
        this.neighbors_dist.push(b_dist);

      }
    }
  }

  visualize_neighbors() {

    this.vis_neighbors = true;
  
  }

  move(boids, w, h) {

    this.get_neighbors(boids, w, h);

    // Cohestion
    this.centroid = centroid(this.neighbors);
    this.turn_toward_point(this.centroid[0], this.centroid[1], this.cohesion_strength, 0.1);

    // Separation


    // Alignment
    let avg_x = cos(this.dir);
    let avg_y = sin(this.dir);
    for (let n of this.neighbors) {

      avg_x += cos(n.dir);
      avg_y += sin(n.dir);

    }
    avg_x /= this.neighbors.length;
    avg_y /= this.neighbors.length;
    let avg_dir = atan2(avg_y, avg_x);
    this.turn_toward_angle(avg_dir, this.alignment_strength, 0.1);

    // Apply movement    
    this.x += Math.cos(this.dir) * this.vel;
    this.y += Math.sin(this.dir) * this.vel;

  }

  steer_left(strength) {

    this.dir -= this.turnrate * strength;

    if (this.dir <= Math.PI)
      this.dir += 2 * Math.PI;

  }

  steer_right(strength) {

    this.dir += this.turnrate * strength;

    if (this.dir >= Math.PI)
      this.dir -= 2 * Math.PI;

  }

  turn_toward_angle(angle, strength, tolerance) {

    let diff = angle_diff(angle, this.dir);

    if (diff > tolerance) {

      let dir = sin(this.dir - angle);
      
      if (dir > 0)
        this.steer_left(strength);
      
      else
        this.steer_right(strength);

    }

  }

  turn_toward_point(x, y, strength, tolerance) {
    
    let dx = x - this.x;
    let dy = y - this.y;
    let angle_to = atan2(dy, dx);

    // line(this.x, this.y, cos(angle_to) * 20 + this.x, sin(angle_to) * 20 + this.y);

    this.turn_toward_angle(angle_to, strength, tolerance);/*

    let diff = angle_diff(angle_to, this.dir);

    if (diff > tolerance) {

      let dir = sin(this.dir - angle_to);
      
      if (dir > 0)
        this.steer_left(strength);
      
      else
        this.steer_right(strength);

    }*/
  }

  show() {

    fill(255);
    stroke(255);

    // Visualize neighbors
    if (this.vis_neighbors) {

      for (let n of this.neighbors) {
        stroke(0, 255, 0);
        strokeWeight(2);
        line(this.x, this.y, n.x, n.y);
      }

      this.vis_neighbors = false;

    }

    // Move to origin, rotate, then move back and draw
    // This ensures each boid rotates around its own center
    push();
    translate(this.x, this.y);
    rotate(this.dir + radians(90));
    translate(-this.x, -this.y);
    triangle(this.x - this.size / 2 * this.scale, this.y + this.size * this.scale, this.x + this.size / 2 * this.scale, this.y + this.size * this.scale, this.x, this.y - this.size * this.scale);
    pop();

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

  if (dx > width / 2)
    dx = 1.0 - dx;
  
  if (dy > 0.5)
    dy = 1.0 - dy;
  
  return (dx * dx + dy * dy);

}

// Centroid of n points
function centroid(points) {

  let x = 0;
  let y = 0;

  for (let p of points) {

    x += p.x;
    y += p.y;

  }

  x /= points.length;
  y /= points.length;

  return [x, y];

}

function angle_diff(a1, a2) {

  return acos(cos(a1) * cos(a2) + sin(a1) * sin(a2));

}
