const socket = io();

let roomCode = "";
let playerName = "";
let selectedGame = "rank";
let currentAuction = null;

/* =========================================
CHARACTER DATA
========================================= */

const characters = [
{
name: "Minato",
image: "/assets/characters/images%20(6).jpeg"
},
{
name: "Tobirama",
image: "/assets/characters/images%20(7).jpeg"
},
{
name: "Hashirama",
image: "/assets/characters/images%20(8).jpeg"
},
{
name: "Jiraiya",
image: "/assets/characters/images%20(9).jpeg"
},
{
name: "Hiruzen",
image: "/assets/characters/images%20(10).jpeg"
},
{
name: "Orochimaru",
image: "/assets/characters/images%20(11).jpeg"
},
{
name: "Guy",
image: "/assets/characters/images%20(12).jpeg"
},
{
name: "Lee",
image: "/assets/characters/images%20(13).jpeg"
},
{
name: "Shikamaru",
image: "/assets/characters/images%20(14).jpeg"
},
{
name: "Neji",
image: "/assets/characters/images%20(15).jpeg"
},
{
name: "Gaara",
image: "/assets/characters/images%20(16).jpeg"
},
{
name: "Kisame",
image: "/assets/characters/images%20(17).jpeg"
},
{
name: "Sakura",
image: "/assets/characters/images%20(18).jpeg"
},
{
name: "Nagato / Pain",
image: "/assets/characters/images%20(19).jpeg"
},
{
name: "Obito",
image: "/assets/characters/images%20(20).jpeg"
}
];

const rankCharacters = [
"Naruto",
"Sasuke",
"Itachi",
"Madara",
"Kakashi",
"Minato",
"Tobirama",
"Hashirama",
"Jiraiya",
"Hiruzen",
"Orochimaru",
"Guy",
"Lee",
"Shikamaru",
"Neji",
"Gaara",
"Kisame",
"Sakura",
"Nagato",
"Obito"
];

/* =========================================
HELPERS
========================================= */

function $(id) {
return document.getElementById(id);
}

function message(text) {

const box = $("message");

box.textContent = text;
box.style.display = "block";

setTimeout(() => {
    box.style.display = "none";
}, 2500);

}

function hideAll() {

[
    "gameMenu",
    "lobby",
    "room",
    "rankGame",
    "rankResult",
    "auctionGame",
    "finalResults"
].forEach(id => {

    const element = $(id);

    if (element) {
        element.style.display = "none";
    }
});

}

/* =========================================
MENU
========================================= */

function selectGame(game) {

selectedGame = game;

$("gameMenu").style.display = "none";
$("lobby").style.display = "block";

$("selectedGameTitle").textContent =
    game === "auction"
        ? "🔨 NARUTO AUCTION"
        : "🏆 CHARACTER RANK";

}

function backToMenu() {

$("lobby").style.display = "none";
$("gameMenu").style.display = "block";

}

/* =========================================
CREATE ROOM
========================================= */

function createRoom() {

playerName =
    $("playerName").value.trim();

if (!playerName) {
    message("Enter your name.");
    return;
}

socket.emit("createRoom", {
    playerName,
    game: selectedGame
});

}

/* =========================================
JOIN ROOM
========================================= */

function joinRoom() {

playerName =
    $("playerName").value.trim();

roomCode =
    $("roomCode").value
    .trim()
    .toUpperCase();

if (!playerName) {
    message("Enter your name.");
    return;
}

if (!roomCode) {
    message("Enter room code.");
    return;
}

socket.emit("joinRoom", {
    playerName,
    roomCode
});

}

/* =========================================
ROOM
========================================= */

socket.on("roomCreated", data => {

roomCode = data.roomCode;

openRoom(data);

});

socket.on("roomJoined", data => {

roomCode = data.roomCode;

openRoom(data);

});

function openRoom(data) {

hideAll();

$("room").style.display = "block";

$("roomCodeDisplay").textContent =
    data.roomCode;

updatePlayers(
    data.players || []
);

}

socket.on("playersUpdated", data => {

updatePlayers(
    data.players || []
);

updateAuctionPlayers(
    data.players || []
);

});

function updatePlayers(players) {

const list = $("playersList");

if (!list) return;

list.innerHTML = "";

players.forEach((player, index) => {

    const div =
        document.createElement("div");

    div.className = "player";

    div.innerHTML = `
        <strong>
            ${index + 1}. ${player.name}
        </strong>

        <span>
            💰 ₹${player.balance}
            &nbsp;
            👥 ${player.teamCount}/5
        </span>
    `;

    list.appendChild(div);
});

}

/* =========================================
START GAME
========================================= */

function startGame() {

socket.emit("startGame", {
    roomCode
});

}

/* =========================================
RANK
========================================= */

socket.on("gameStarted", data => {

if (data.game !== "rank") return;

showRank(
    data.category,
    data.categoryName
);

});

function showRank(category, categoryName) {

hideAll();

$("rankGame").style.display = "block";

$("rankCategory").textContent =
    categoryName;

$("rankProgress").textContent =
    "Answers: 0/0";

const box =
    $("characterButtons");

box.innerHTML = "";

rankCharacters.forEach(character => {

    const button =
        document.createElement("button");

    button.className = "character";

    button.textContent = character;

    button.onclick = () => {

        socket.emit("submitRank", {
            roomCode,
            category,
            option: character
        });

        document
            .querySelectorAll(".character")
            .forEach(
                b => b.disabled = true
            );
    };

    box.appendChild(button);
});

}

socket.on("rankProgress", data => {

$("rankProgress").textContent =
    `Answers: ${data.submitted}/${data.total}`;

});

socket.on("rankResult", data => {

hideAll();

$("rankResult").style.display =
    "block";

$("resultCategory").textContent =
    "🏆 " + data.category;

const list =
    $("rankResultsList");

list.innerHTML = "";

data.players.forEach((player, index) => {

    const div =
        document.createElement("div");

    div.className = "ranking";

    div.innerHTML = `
        <strong>#${index + 1}</strong>
        <span>${player.player}</span>
        <span>${player.option}</span>
    `;

    list.appendChild(div);
});

});

function nextRankCategory() {

socket.emit("nextRankCategory", {
    roomCode
});

}

socket.on("nextRankCategory", data => {

showRank(
    data.category,
    data.categoryName
);

});

socket.on("rankFinished", data => {

hideAll();

$("finalResults").style.display =
    "block";

$("finalResultsTitle").textContent =
    "🏆 CHARACTER RANK FINISHED";

const list =
    $("finalResultsList");

list.innerHTML = "";

data.players.forEach((player, index) => {

    const div =
        document.createElement("div");

    div.className =
        "final-player";

    div.innerHTML = `
        <h3>
            #${index + 1} ${player.name}
        </h3>

        <p>💰 ₹${player.balance}</p>

        <p>👥 ${player.teamCount}/5</p>
    `;

    list.appendChild(div);
});

});

/* =========================================
AUCTION
========================================= */

socket.on("auctionUpdate", data => {

hideAll();

$("auctionGame").style.display =
    "block";

currentAuction = data;

$("auctionCharacter").textContent =
    data.character;

$("currentBid").textContent =
    "₹" + data.currentBid;

$("highestBidder").textContent =
    data.highestBidder
        ? "Highest Bidder: " +
          data.highestBidder
        : "No bids yet";

$("auctionTimer").textContent =
    "⏱️ " + data.timeLeft;

$("auctionBalance").textContent =
    "💰 Balance: ₹" +
    data.myBalance;

$("auctionTeamCount").textContent =
    "👥 Team: " +
    data.myTeamCount +
    "/5";


/* CHARACTER IMAGE */

const character =
    characters.find(
        c => c.name === data.character
    );

const image =
    $("auctionCharacterImage");

if (character) {

    image.src =
        character.image;

    image.alt =
        character.name;

} else {

    image.src = "";
    image.alt = data.character;
}


/* BID BUTTON */

const button =
    $("bidButton");

if (
    data.highestBidderId ===
    socket.id
) {

    button.textContent =
        "🔒 HIGHEST BIDDER";

} else {

    button.textContent =
        "+₹50";
}

button.disabled =
    !data.canBid;


updateAuctionPlayers(
    data.players || []
);

});

function updateAuctionPlayers(players) {

const list =
    $("auctionPlayersList");

if (!list) return;

list.innerHTML = "";

players.forEach((player, index) => {

    const div =
        document.createElement("div");

    div.className = "player";

    div.innerHTML = `
        <strong>
            ${index + 1}. ${player.name}
        </strong>

        <span>
            💰 ₹${player.balance}
            &nbsp;
            👥 ${player.teamCount}/5
        </span>
    `;

    list.appendChild(div);
});

}

/* =========================================
BID ₹50
========================================= */

function bid50() {

if (!currentAuction) return;

if (!currentAuction.canBid) return;

socket.emit("auctionBid", {
    roomCode
});

}

/* =========================================
AUCTION RESULT
========================================= */

socket.on("auctionResult", data => {

if (data.sold) {

    message(
        `🏆 ${data.character} → ${data.winner} for ₹${data.bid}`
    );

} else {

    message(
        `❌ ${data.character} → UNSOLD`
    );
}

});

/* =========================================
AUCTION FINISHED
========================================= */

socket.on("auctionFinished", data => {

hideAll();

$("finalResults").style.display =
    "block";

$("finalResultsTitle").textContent =
    "🏆 AUCTION FINAL RESULTS";

const list =
    $("finalResultsList");

list.innerHTML = "";

data.ranking.forEach((player, index) => {

    const div =
        document.createElement("div");

    div.className =
        "final-player";

    let teamHTML = "";

    if (player.team.length) {

        teamHTML =
            player.team.map(
                character =>
                    `<span class="team-character">
                        ${character}
                    </span>`
            ).join("");
    }

    div.innerHTML = `
        <h3>
            #${index + 1} ${player.name}
        </h3>

        <p>
            💰 Balance:
            ₹${player.balance}
        </p>

        <p>
            👥 Team:
            ${player.teamCount}/5
        </p>

        <div>
            ${teamHTML}
        </div>
    `;

    list.appendChild(div);
});

});

/* =========================================
ERROR
========================================= */

socket.on("roomError", text => {
message(text);
});

/* =========================================
GLOBAL FUNCTIONS
========================================= */

window.selectGame = selectGame;
window.backToMenu = backToMenu;
window.createRoom = createRoom;
window.joinRoom = joinRoom;
window.startGame = startGame;
window.nextRankCategory = nextRankCategory;
window.bid50 = bid50;

console.log(
"🍥 Naruto Character Games loaded"
);
