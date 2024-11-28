function createBalls(numBalls, ballSize, ballColor, speed, gravity) {
    balls = [];
    for (let i = 0; i < numBalls; i++) {
        balls.push({
            x: circle.x,
            y: circle.y - circle.radius + ballSize,
            radius: ballSize,
            dx: speed,
            dy: 0,
            gravity: gravity,
            friction: 0.99,
            color: ballColor,
            isDragging: false
        });
    }
}

function updateBall(ball) {
    if (!ball.isDragging) {
        ball.dy += ball.gravity;
        ball.x += ball.dx;
        ball.y += ball.dy;
    }

    const distX = ball.x - circle.x;
    const distY = ball.y - circle.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance + ball.radius > circle.radius) {
        const angle = Math.atan2(distY, distX);
        const overlap = distance + ball.radius - circle.radius;

        ball.x -= overlap * Math.cos(angle);
        ball.y -= overlap * Math.sin(angle);

        const normalX = distX / distance;
        const normalY = distY / distance;

        const dotProduct = ball.dx * normalX + ball.dy * normalY;

        ball.dx -= 2 * dotProduct * normalX;
        ball.dy -= 2 * dotProduct * normalY;

        ball.dx *= ball.friction;
        ball.dy *= ball.friction;
    }
}