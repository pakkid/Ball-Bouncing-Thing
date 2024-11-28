const controls = {
    gravity: document.getElementById('gravity'),
    speed: document.getElementById('speed'),
    numBalls: document.getElementById('numBalls'),
    ballColor: document.getElementById('ballColor'),
    circleSize: document.getElementById('circleSize'),
    ballSize: document.getElementById('ballSize')
};

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

controls.numBalls.addEventListener('input', () => {
    createBalls(parseInt(controls.numBalls.value), parseInt(controls.ballSize.value), controls.ballColor.value, parseFloat(controls.speed.value), parseFloat(controls.gravity.value));
});

controls.ballColor.addEventListener('input', () => {
    balls.forEach(ball => {
        ball.color = controls.ballColor.value;
    });
});

controls.circleSize.addEventListener('input', () => {
    updateCircleSize(parseInt(controls.circleSize.value));
});

controls.ballSize.addEventListener('input', () => {
    balls.forEach(ball => {
        ball.radius = parseInt(controls.ballSize.value);
    });
});

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