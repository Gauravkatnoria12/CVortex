const canvas = document.getElementById('canvas1');
const container = document.getElementById('canvas-container');
const ctx = canvas.getContext('2d');

// Function to set canvas dimensions based on container
function setDimensions() {
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
}

setDimensions();

let particlesArray;

// Mouse interaction relative to the canvas/container
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80)
}

// Track mouse position relative to the canvas element
canvas.addEventListener('mousemove', function (event) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

window.addEventListener('resize', function () {
  setDimensions();
  mouse.radius = ((canvas.height / 80) * (canvas.width / 80));
  init();
});

// Handle mouse leaving the canvas area
canvas.addEventListener('mouseleave', function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

// Create particle class
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // Bounce off edges
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Check collision
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 2;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 2;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 2;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 2;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;

  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 2) + 1;
    let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
    let directionX = (Math.random() * 0.4) - 0.2;
    let directionY = (Math.random() * 0.4) - 0.2;

    let colors = ['rgba(255,255,255,0.7)', 'rgba(0, 150, 255, 0.6)', 'rgba(138, 43, 226, 0.6)'];
    let color = colors[Math.floor(Math.random() * colors.length)];

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - (distance / 20000);
        ctx.strokeStyle = 'rgba(100, 116, 139,' + opacityValue + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

init();
animate();