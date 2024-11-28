canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    balls.forEach(ball => {
        const distX = mouseX - ball.x;
        const distY = mouseY - ball.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < ball.radius) {
            ball.isDragging = true;
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (balls.some(ball => ball.isDragging)) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        balls.forEach(ball => {
            if (ball.isDragging) {
                ball.x = mouseX;
                ball.y = mouseY;
            }
        });
    }
});

canvas.addEventListener('mouseup', () => {
    balls.forEach(ball => {
        ball.isDragging = false;
    });
});