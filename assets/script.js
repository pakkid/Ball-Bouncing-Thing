const canvas = document.getElementById('bouncingBallCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const controls = {
    gravity: document.getElementById('gravity'),
    speed: document.getElementById('speed'),
    numBalls: document.getElementById('numBalls'),
    ballColor: document.getElementById('ballColor'),
    circleSize: document.getElementById('circleSize'),
    ballSize: document.getElementById('ballSize'),
    imageUrl: document.getElementById('imageUrl'),
    imageSize: document.getElementById('imageSize'),
    imageFile: document.getElementById('imageFile'),
    pauseButton: document.getElementById('pauseButton'),
    resetButton: document.getElementById('resetButton')
};

let circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: parseInt(controls.circleSize.value)
};

let balls = [];
let isPaused = false;
let image = new Image();
let imageSize = parseInt(controls.imageSize.value);

function createBalls() {
    balls = [];
    for (let i = 0; i < parseInt(controls.numBalls.value); i++) {
        balls.push({
            x: circle.x,
            y: circle.y - circle.radius + parseInt(controls.ballSize.value),
            radius: parseInt(controls.ballSize.value),
            dx: parseFloat(controls.speed.value),
            dy: 0,
            gravity: parseFloat(controls.gravity.value),
            friction: 0.99,
            color: controls.ballColor.value,
            isDragging: false,
            lastMouseX: 0,
            lastMouseY: 0
        });
    }
}

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
    if (image.src) {
        ctx.drawImage(image, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
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

function animate() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawCircle();
        balls.forEach(ball => {
            drawBall(ball);
            updateBall(ball);
        });
    }

    requestAnimationFrame(animate);
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    balls.forEach(ball => {
        const distX = mouseX - circle.x;
        const distY = mouseY - circle.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < circle.radius) {
            ball.isDragging = true;
            ball.dx = 0;
            ball.dy = 0;
            ball.lastMouseX = mouseX;
            ball.lastMouseY = mouseY;
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
                const distX = mouseX - circle.x;
                const distY = mouseY - circle.y;
                const distance = Math.sqrt(distX * distX + distY * distY);

                if (distance + ball.radius <= circle.radius) {
                    ball.x = mouseX;
                    ball.y = mouseY;
                }
            }
        });
    }
});

canvas.addEventListener('mouseup', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    balls.forEach(ball => {
        if (ball.isDragging) {
            ball.dx = (mouseX - ball.lastMouseX) * 0.1;
            ball.dy = (mouseY - ball.lastMouseY) * 0.1;
            ball.isDragging = false;
        }
    });
});

canvas.addEventListener('mouseleave', () => {
    balls.forEach(ball => {
        if (ball.isDragging) {
            ball.isDragging = false;
        }
    });
});

controls.gravity.addEventListener('input', () => {
    balls.forEach(ball => {
        ball.gravity = parseFloat(controls.gravity.value);
    });
});

controls.speed.addEventListener('input', () => {
    balls.forEach(ball => {
        ball.dx = parseFloat(controls.speed.value);
    });
});

controls.numBalls.addEventListener('input', createBalls);

controls.ballColor.addEventListener('input', () => {
    balls.forEach(ball => {
        ball.color = controls.ballColor.value;
    });
});

controls.circleSize.addEventListener('input', () => {
    circle.radius = parseInt(controls.circleSize.value);
});

controls.ballSize.addEventListener('input', () => {
    balls.forEach(ball => {
        ball.radius = parseInt(controls.ballSize.value);
    });
});

controls.imageUrl.addEventListener('input', () => {
    image.src = controls.imageUrl.value;
});

controls.imageSize.addEventListener('input', () => {
    imageSize = parseInt(controls.imageSize.value);
});

controls.imageFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

const uploadBox = document.getElementById('uploadBox');
uploadBox.addEventListener('click', () => {
    controls.imageFile.click();
});

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#666';
    uploadBox.style.color = '#fff';
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.style.borderColor = '#555';
    uploadBox.style.color = '#aaa';
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#555';
    uploadBox.style.color = '#aaa';
    const file = e.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => {
                image.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
});

controls.pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    controls.pauseButton.innerHTML = isPaused ? '<span class="iconify" data-icon="mdi:play"></span>' : '<span class="iconify" data-icon="mdi:pause"></span>';
});

controls.resetButton.addEventListener('click', () => {
    image.src = '';
    controls.imageUrl.value = '';
    createBalls();
});

createBalls();
animate();

// Draggable and Minimizable Controls
const controlsElement = document.getElementById('controls');
const controlsHeader = document.getElementById('controlsHeader');
const minimizeButton = document.getElementById('minimizeButton');
const controlsBody = document.getElementById('controlsBody');

let isDragging = false;
let offsetX, offsetY;

controlsHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - controlsElement.offsetLeft;
    offsetY = e.clientY - controlsElement.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        controlsElement.style.left = `${e.clientX - offsetX}px`;
        controlsElement.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

minimizeButton.addEventListener('click', () => {
    if (controlsBody.style.display === 'none') {
        controlsBody.style.display = 'block';
        minimizeButton.textContent = '-';
    } else {
        controlsBody.style.display = 'none';
        minimizeButton.textContent = '+';
    }
});