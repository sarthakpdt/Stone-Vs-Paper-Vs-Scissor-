// Initialize global variables
const gameBox = document.getElementById('game-box');
const stoneCountElement = document.getElementById('stone-count');
const paperCountElement = document.getElementById('paper-count');
const scissorsCountElement = document.getElementById('scissors-count');

let items = []; // Store all moving items
const initialCount = 33; // Initial count of each type
const boxWidth = gameBox.clientWidth;
const boxHeight = gameBox.clientHeight;

// Create initial items
function createItems() {
    for (let i = 0; i < initialCount; i++) {
        createItem('🪨'); // Represent Stone with 🪨
        createItem('📰'); // Represent Paper with 📰
        createItem('✂'); // Represent Scissor with ✂
    }
}

// Function to create an individual item
function createItem(type) {
    const item = document.createElement('div');
    item.classList.add('item');
    item.dataset.type = type;

    if (type === '🪨') { // Stone
        item.classList.add('stone');
    } else if (type === '📰') { // Paper
        item.classList.add('paper');
    } else if (type === '✂') { // Scissors
        item.textContent = 'X'; // Represent Scissors with an 'X'
        item.classList.add('scissor');
    }

    // Random position inside the game box
    let size = type === '🪨' ? 10 : 20; // Adjusting size for collisions (Stone = 10px, Paper = 20px)
    item.style.width = `${size}px`;
    item.style.height = `${size}px`;

    item.style.top = `${Math.random() * (boxHeight - size)}px`;
    item.style.left = `${Math.random() * (boxWidth - size)}px`;

    // Assign higher speed (velocity) to ensure game ends within a minute
    item.dataset.dx = (Math.random() * 8 - 4).toFixed(2); // Random between -4 to 4
    item.dataset.dy = (Math.random() * 8 - 4).toFixed(2); // Random between -4 to 4

    gameBox.appendChild(item);
    items.push(item);
}

// Function to move items
function moveItems() {
    items.forEach(item => {
        let x = parseFloat(item.style.left);
        let y = parseFloat(item.style.top);
        let dx = parseFloat(item.dataset.dx);
        let dy = parseFloat(item.dataset.dy);
        let size = item.offsetWidth;

        // Update position
        x += dx;
        y += dy;

        // Bounce off walls
        if (x <= 0 || x + size >= boxWidth) item.dataset.dx = (-dx).toFixed(2);
        if (y <= 0 || y + size >= boxHeight) item.dataset.dy = (-dy).toFixed(2);

        // Apply new position
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
    });
}

// Check for collisions
function checkCollisions() {
    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            const item1 = items[i];
            const item2 = items[j];

            if (checkCollision(item1, item2)) {
                handleInteraction(item1, item2);
            }
        }
    }
}

// Collision detection (distance-based)
function checkCollision(item1, item2) {
    let x1 = parseFloat(item1.style.left) + item1.offsetWidth / 2;
    let y1 = parseFloat(item1.style.top) + item1.offsetHeight / 2;
    let x2 = parseFloat(item2.style.left) + item2.offsetWidth / 2;
    let y2 = parseFloat(item2.style.top) + item2.offsetHeight / 2;

    let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance < (item1.offsetWidth / 2 + item2.offsetWidth / 2);
}

// Handle interactions (Rock-Paper-Scissors elimination rules)
function handleInteraction(item1, item2) {
    const type1 = item1.dataset.type;
    const type2 = item2.dataset.type;

    if (type1 === '🪨' && type2 === '✂') { // Stone beats Scissors
        removeItem(item2);
    } else if (type1 === '✂' && type2 === '🪨') { // Scissors beats Stone
        removeItem(item1);
    } else if (type1 === '📰' && type2 === '🪨') { // Paper beats Stone
        removeItem(item2);
    } else if (type1 === '🪨' && type2 === '📰') { // Stone beats Paper
        removeItem(item1);
    } else if (type1 === '✂' && type2 === '📰') { // Scissors beats Paper
        removeItem(item2);
    } else if (type1 === '📰' && type2 === '✂') { // Paper beats Scissors
        removeItem(item1);
    }
}

// Remove item and update counts
function removeItem(item) {
    const type = item.dataset.type;
    items = items.filter(i => i !== item);
    gameBox.removeChild(item);

    updateCounts(type);
}

// Update the counters
function updateCounts(type) {
    let stoneCount = parseInt(stoneCountElement.textContent);
    let paperCount = parseInt(paperCountElement.textContent);
    let scissorsCount = parseInt(scissorsCountElement.textContent);

    if (type === '🪨') stoneCount--;
    else if (type === '📰') paperCount--;
    else if (type === '✂') scissorsCount--;

    stoneCountElement.textContent = stoneCount;
    paperCountElement.textContent = paperCount;
    scissorsCountElement.textContent = scissorsCount;

    checkWinner(stoneCount, paperCount, scissorsCount); // Check winner after each update
}

// Function to check if the game has ended and declare a winner
function checkWinner(stoneCount, paperCount, scissorsCount) {
    // If any of the two counts reach 0, check for winner
    if (stoneCount === 0 || paperCount === 0 || scissorsCount === 0) {
        let winner;
        if ((stoneCount === 0 && paperCount === 0 && scissorsCount > 0) || (stoneCount === 0 && paperCount > 0 && scissorsCount > 0)){
            winner = 'Scissors'; // Scissors wins if Stone and Paper are 0
        } else if ((paperCount === 0 && stoneCount > 0 && scissorsCount === 0) || (paperCount === 0 && stoneCount > 0 && scissorsCount > 0)) {
            winner = 'Stone'; // Stone wins if Paper is 0
        } else if ((scissorsCount === 0 && stoneCount === 0 && paperCount > 0) || (scissorsCount === 0 && paperCount > 0 && paperCount > 0)){
            winner = 'Paper'; // Paper wins if Scissors is 0
        }

        if (winner) {
            setTimeout(() => {
                alert(`The winner is ${winner}!`);
                resetGame(); // Reset the game after winner announcement
            }, 100);
        }
    }
}

// Function to reset the game
function resetGame() {
    // Clear all items and reset counters
    items.forEach(item => gameBox.removeChild(item));
    items = [];
    stoneCountElement.textContent = initialCount;
    paperCountElement.textContent = initialCount;
    scissorsCountElement.textContent = initialCount;

    createItems(); // Restart the game with initial counts
}

// Main game loop
function gameLoop() {
    moveItems();
    checkCollisions();
}

// Start the game
createItems();
setInterval(gameLoop, 20); // Increase update frequency to 20ms for faster resolution
