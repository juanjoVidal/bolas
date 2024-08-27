const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const radius = Math.min(canvas.width, canvas.height) / 2 - 10;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let balls = [];
let rotation = 0;
let angleOpen = 15 * Math.PI / 180;

function drawCircle() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, rotation + angleOpen / 2, rotation + 2 * Math.PI - angleOpen / 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
}

function Ball(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = 10;

    this.update = function () {
        this.x += this.dx;
        this.y += this.dy;

        // Check for collision with the walls
        const distance = Math.sqrt((this.x - centerX) ** 2 + (this.y - centerY) ** 2);
        if (distance + this.radius >= radius) {
            let angle = Math.atan2(this.y - centerY, this.x - centerX);
            if (!(angle > rotation + angleOpen / 2 && angle < rotation + 2 * Math.PI - angleOpen / 2)) {
                this.dx = -this.dx;
                this.dy = -this.dy;
            } else {
                // Ball escaped the circle
                this.escaped = true;
            }
        }

        // Draw the ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f00';
        ctx.fill();
        ctx.closePath();
    };
}

function generateBalls(ball) {
    for (let i = 0; i < 3; i++) {
        let dx = (Math.random() - 0.5) * 4;
        let dy = (Math.random() - 0.5) * 4;
        balls.push(new Ball(ball.x, ball.y, dx, dy));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rotate the circle
    rotation += 0.01;
    drawCircle();

    for (let i = balls.length - 1; i >= 0; i--) {
        let ball = balls[i];
        ball.update();
        if (ball.escaped) {
            balls.splice(i, 1);
            generateBalls(ball);
        }
    }

    if (balls.length < 50) {
        requestAnimationFrame(animate);
    } else {
        alert("Se han generado más de 50 bolas. ¡Fin del programa!");
    }
}

// Iniciar con una bola
balls.push(new Ball(centerX, centerY, 2, 2));
animate();
