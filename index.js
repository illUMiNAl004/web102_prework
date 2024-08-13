// Import the JSON data about the crowdfunded games from the games.js file
import GAMES_DATA from './games.js';

// Create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// Remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Add data about each game as a card to the games-container
const gamesContainer = document.getElementById("games-container");

// Function to add all data from the games array to the page
function addGamesToPage(games) {
    for (const game of games) {
        const gameCard = document.createElement("div");
        gameCard.classList.add("game-card");
        gameCard.style.margin = "5px"; // Reduce the margin between game boxes

        const progressPercentage = (game.pledged / game.goal) * 100;

        gameCard.innerHTML = `
            <img src="${game.img}" class="game-img" alt="${game.name}">
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <p><strong>Funding:</strong> $${game.pledged.toLocaleString()}</p>
            <p><strong>Goal:</strong> $${game.goal.toLocaleString()}</p>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${Math.min(progressPercentage, 100)}%"></div>
            </div>
        `;

        gamesContainer.appendChild(gameCard);
    }
}

// Call the function to add games to the page
addGamesToPage(GAMES_JSON);

// Summary statistics at the top of the page
const contributionsCard = document.getElementById("num-contributions");
const totalContributions = GAMES_JSON.reduce((sum, game) => sum + game.backers, 0);
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((sum, game) => sum + game.pledged, 0);
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`;

// Add functions to filter the funded and unfunded games
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);
    addGamesToPage(unfundedGames);
}

function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);
    addGamesToPage(fundedGames);
}

function showAllGames() {
    deleteChildElements(gamesContainer);
    addGamesToPage(GAMES_JSON);
}

// Event listeners for buttons
document.getElementById("unfunded-btn").addEventListener("click", filterUnfundedOnly);
document.getElementById("funded-btn").addEventListener("click", filterFundedOnly);
document.getElementById("all-btn").addEventListener("click", showAllGames);

// More information at the top of the page about the company
const descriptionContainer = document.getElementById("description-container");
const numUnfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal).length;
const description = `We have ${numUnfundedGames} game${numUnfundedGames === 1 ? '' : 's'} that have not yet met their funding goals.`;
const descriptionElement = document.createElement("p");
descriptionElement.innerHTML = description;
descriptionContainer.appendChild(descriptionElement);

// Display the top 2 games
const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");
const sortedGames = GAMES_JSON.sort((a, b) => b.pledged - a.pledged);
const [topGame, secondGame] = sortedGames;

firstGameContainer.innerHTML = `
    <h3>🥇 Top Funded Game</h3>
    <h2>${topGame.name}</h2>
    <p>Amount Pledged: $${topGame.pledged.toLocaleString()}</p>
`;

secondGameContainer.innerHTML = `
    <h3>🥈 Runner Up</h3>
    <h2>${secondGame.name}</h2>
    <p>Amount Pledged: $${secondGame.pledged.toLocaleString()}</p>
`;

// Search functionality
const searchInput = document.createElement("input");
searchInput.setAttribute("type", "text");
searchInput.setAttribute("placeholder", "Search games...");
searchInput.style.textAlign = "center";
searchInput.id = "search-input";
searchInput.style.position = "absolute";
searchInput.style.right = "1%";
document.getElementById("button-container").appendChild(searchInput);

searchInput.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(query));
    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);
});
