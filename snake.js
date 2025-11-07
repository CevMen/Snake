// Setup the canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set the size of the grid
const gridSize = 60;
const tileCount = canvas.width / gridSize;
let gameOff = true;

// Snake properties
let snake = [{ x: 5, y: 5 }];
let dx = 0;
let dy = 0;
let snakeLength = 1;

// Food properties
let food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };

//  track score
const scoreCount = document.getElementById("div-body");
let score = 0;

// Add to score
function increaseScore() {
    score = score + 10;
    scoreCount.innerText = `Score: ${score}`
    console.log(score);
}

// Game speed
let gameSpeed = 200; // 200ms between moves

// Speed up when snake eats fruit
function addSpeed() {
    if (gameSpeed >= 180) {
        gameSpeed -= 5;
    }
}

// Reset the game when it's over
function resetGame() {
    gameOff = true;
    snake = [{ x: 5, y: 5 }];
    dx = 0;
    dy = 0;
    snakeLength = 1;
    score = 0;
    scoreCount.innerText = `Score: ${score}`
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    gameSpeed = 200;
    setTimeout(gameLoop, gameSpeed);
}

// Change direction of snake movement
function changeDirection(event) {
    const keyPressed = event.keyCode;

    // Prevent reversing direction
    if (keyPressed === 37 && dx === 0) { // Left arrow
        dx = -1;
        dy = 0;
    } else if (keyPressed === 38 && dy === 0) { // Up arrow
        dx = 0;
        dy = -1;
    } else if (keyPressed === 39 && dx === 0) { // Right arrow
        dx = 1;
        dy = 0;
    } else if (keyPressed === 40 && dy === 0) { // Down arrow
        dx = 0;
        dy = 1;
    }
}

document.addEventListener("keydown", changeDirection);

// Game loop
function gameLoop() {

    if (gameOff) { gameOff = false; }

    // Move the snake
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        alert("Game Over! You hit the wall.");
        resetGame();
        return;
    }

    // Check for collision with self
    for (let i = 0; i < snake.length; i++) {
        if ((snake[i].x === head.x && snake[i].y === head.y) && (dx !== 0 || dy !== 0)) {
            alert("Game Over! You collided with yourself.");
            resetGame();
            return;
        }
    }

    // Add the new head to the snake body
    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        snakeLength++;
        addSpeed();
        food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
        for (let i = 0; i < snake.length; i++) {
            if ((head.x === food.x || snake[i].x === food.x) && (head.y === food.y || snake[i].y === food.y)) {
                food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
            }
        }
        increaseScore();
    }

    // Remove extra segments of the snake
    if (snake.length > snakeLength) {
        snake.pop();
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw the snake
    ctx.fillStyle = "green";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }

    // Loop the game
    setTimeout(gameLoop, gameSpeed);
}

// Start the game loop
if (gameOff) { document.addEventListener("keydown", gameLoop()) };
console.log(scoreCount)