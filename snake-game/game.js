document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const restartBtn = document.getElementById('restartBtn');

    // Game settings
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    // Game variables
    let score = 0;
    let gameOver = false;
    let gameSpeed = 100; // milliseconds
    let gameLoop;

    // Snake properties
    let snake = [
        { x: 5, y: 5 }
    ];
    let velocityX = 1;
    let velocityY = 0;

    // Food position
    let foodX = 10;
    let foodY = 10;

    // Draw functions
    function drawGame() {
        clearCanvas();

        if (gameOver) {
            displayGameOver();
            return;
        }

        moveSnake();
        checkCollision();
        drawSnake();
        drawFood();
        drawScore();
    }

    function clearCanvas() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        ctx.fillStyle = 'lime';
        for (let i = 0; i < snake.length; i++) {
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
        }
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
    }

    function drawScore() {
        scoreElement.textContent = score;
    }

    function displayGameOver() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Press Restart to play again', canvas.width / 2 - 110, canvas.height / 2 + 30);
    }

    // Game logic
    function moveSnake() {
        // Create new head
        const head = {
            x: snake[0].x + velocityX,
            y: snake[0].y + velocityY
        };

        // Add new head to beginning of snake array
        snake.unshift(head);

        // Check if snake ate food
        if (head.x === foodX && head.y === foodY) {
            score += 10;
            generateFood();

            // Increase game speed every 50 points
            if (score % 50 === 0) {
                gameSpeed = Math.max(50, gameSpeed - 10);
                resetGameLoop();
            }
        } else {
            // Remove tail segment if no food was eaten
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver = true;
            return;
        }

        // Self collision (start from 1 to ignore the head)
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver = true;
                return;
            }
        }
    }

    function generateFood() {
        // Random position for food
        function getRandomPosition() {
            return Math.floor(Math.random() * tileCount);
        }

        foodX = getRandomPosition();
        foodY = getRandomPosition();

        // Make sure food doesn't spawn on snake
        for (let segment of snake) {
            if (segment.x === foodX && segment.y === foodY) {
                // If food spawns on snake, generate new position
                generateFood();
                return;
            }
        }
    }

    // Controls
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;

        // Prevent reverse direction
        switch (e.key) {
            case 'ArrowUp':
                if (velocityY !== 1) {
                    velocityX = 0;
                    velocityY = -1;
                }
                break;
            case 'ArrowDown':
                if (velocityY !== -1) {
                    velocityX = 0;
                    velocityY = 1;
                }
                break;
            case 'ArrowLeft':
                if (velocityX !== 1) {
                    velocityX = -1;
                    velocityY = 0;
                }
                break;
            case 'ArrowRight':
                if (velocityX !== -1) {
                    velocityX = 1;
                    velocityY = 0;
                }
                break;
        }
    });

    // Game initialization and reset
    function startGame() {
        snake = [{ x: 5, y: 5 }];
        velocityX = 1;
        velocityY = 0;
        score = 0;
        gameOver = false;
        gameSpeed = 200;
        generateFood();
        resetGameLoop();
    }

    function resetGameLoop() {
        clearInterval(gameLoop);
        gameLoop = setInterval(drawGame, gameSpeed);
    }

    restartBtn.addEventListener('click', startGame);

    // Start the game
    startGame();
});
