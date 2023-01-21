let width = 600;
let height = 600;

let boids = [];
let boidVel = 1;
let num_flockmates = 3;

function setup() {
  // put setup code here
  let c = createCanvas(width, height);
  c.parent("sketch");

  angleMode(RADIANS);

  generateBoids(500);
}

function generateBoids(n) {
  for (let i = 0; i < n; i++) {
    boids.push(new Boid(random(0, width), random(0, height), random(0, 2 * 3.14159), boidVel, num_flockmates));
  }
  console.log(boids.length);
}

function draw() {
  // put drawing code here
  background(0);

    point(width / 2, height / 2);
  for (let b of boids) {
    if (b == null) {
      point(width / 2, height / 2);
      break;
    }
    b.move(boids);
    if (b.x > width) b.x = 0;
    if (b.x < 0) b.x = width;
    if (b.y > height) b.y = 0;
    if (b.y < 0) b.y = height;
    b.show();
  }
  boids[0].visualize_neighbors();
}
