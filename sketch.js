let width = 800;
let height = 600;

let boids = [];
let boidVel = 2;
let visual_range = 200
let boid_scale = 0.5;
let boid_turnrate = 0.1;

let padding = 30;

function setup() {
  // put setup code here
  let c = createCanvas(width, height);
  c.parent("sketch");

  angleMode(RADIANS);

  generateBoids(100);
}

function generateBoids(n) {
  for (let i = 0; i < n; i++) {
    let b = new Boid(random(0, width), random(0, height), random(-Math.PI, Math.PI), boidVel);

    b.set_range(visual_range);
    b.set_scale(boid_scale);
    b.set_turnrate(boid_turnrate);

    boids.push(b);

  }
  console.log(boids.length);
}

function draw() {

  background(0);

  point(width / 2, height / 2);

  for (let b of boids) {

    if (b == null) {

      point(width / 2, height / 2);
      break;

    }

    b.move(boids);

    if (b.x < padding || b.x > width - padding || b.y < padding || b.y > height - padding)
      b.turn_toward(width / 2, height / 2, 2, 0.5);

    b.show();

  }
  
  // boids[0].visualize_neighbors();

}
