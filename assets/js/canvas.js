const canvas = document.getElementById('bouncingBallCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 200
};

let balls = [];

function drawCircle() {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCircle();
    balls.forEach(ball => {
        drawBall(ball);
        updateBall(ball);
    });

    requestAnimationFrame(animate);
}

animate();