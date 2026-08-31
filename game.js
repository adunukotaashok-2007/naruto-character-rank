const socket = io();

let roomCode = "";
let playerName = "";
let selectedGame = "rank";

let currentAuction = null;

// ===============================
// HELPER
// ===============================

function $(id) {
return document.getElementById(id);
}

function showMessage(text) {

const message = $("message");

if (!message) return;

message.textContent = text;
message.style.display = "block";

setTimeout(() => {
    message.style.display = "none";
}, 2500);

}

// ===============================
// MENU
// ===============================

function selectGame(game) {

console.log("Selected:", game);

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

// ===============================
// CREATE ROOM
// ===============================

function createRoom() {

playerName =
    $("playerName").value.trim();

if (!playerName) {

    showMessage("Enter your name.");

    return;
}

socket.emit("createRoom", {

    playerName: playerName,

    game: selectedGame

});

}

// ===============================
// JOIN ROOM
// ===============================

function joinRoom() {

playerName =
    $("playerName").value.trim();

roomCode =
    $("roomCode").value
        .trim()
        .toUpperCase();

if (!playerName) {

    showMessage("Enter your name.");

    return;
}

if (!roomCode) {

    showMessage("Enter room code.");

    return;
}

socket.emit("joinRoom", {

    playerName,

    roomCode

});

}

// ===============================
// ROOM CREATED
// ===============================

socket.on("roomCreated", data => {

roomCode = data.roomCode;

openRoom(data);

});

// ===============================
// ROOM JOINED
// ===============================

socket.on("roomJoined", data => {

roomCode = data.roomCode;

openRoom(data);

});

// ===============================
// OPEN ROOM
// ===============================

function openRoom(data) {

$("gameMenu").style.display = "none";

$("lobby").style.display = "none";

$("room").style.display = "block";

$("roomCodeDisplay").textContent =
    data.roomCode;

updatePlayers(data.players);

}

// ===============================
// PLAYERS
// ===============================

socket.on("playersUpdated", data => {

updatePlayers(data.players);

});

function updatePlayers(players) {

const list = $("playersList");

if (!list) return;

list.innerHTML = "";

players.forEach((player, index) => {

    const div =
        document.createElement("div");

    div.className = "player-card";

    div.innerHTML = `
        <strong>
            ${index + 1}. ${player.name}
        </strong>

        <span>
            💰 ₹${player.balance}
        </span>

        <span>
            👥 ${player.teamCount}/5
        </span>
    `;

    list.appendChild(div);

});

}

// ===============================
// START
// ===============================

function startGame() {

socket.emit("startGame", {

    roomCode

});

}

// ===============================
// RANK START
// ===============================

socket.on("gameStarted", data => {

if (data.game === "rank") {

    showRank(
        data.category,
        data.categoryName
    );

}

});

// ===============================
// RANK
// ===============================

function showRank(category, categoryName) {

hideScreens();

$("rankGame").style.display = "block";

$("rankCategory").textContent =
    categoryName;

const box =
    $("characterButtons");

box.innerHTML = "";

const characters = [

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

characters.forEach(character => {

    const button =
        document.createElement("button");

    button.className =
        "character-button";

    button.textContent =
        character;

    button.onclick = () => {

        document
            .querySelectorAll(
                ".character-button"
            )
            .forEach(btn =>
                btn.disabled = true
            );

        socket.emit("submitRank", {

            roomCode,

            category,

            option: character

        });

    };

    box.appendChild(button);

});

}

// ===============================
// RANK PROGRESS
// ===============================

socket.on("rankProgress", data => {

$("rankProgress").textContent =
    `Answers: ${data.submitted}/${data.total}`;

});

// ===============================
// RANK RESULT
// ===============================

socket.on("rankResult", data => {

hideScreens();

$("rankResult").style.display = "block";

$("resultCategory").textContent =
    "🏆 " + data.category;

const list =
    $("rankResultsList");

list.innerHTML = "";

data.players.forEach((player, index) => {

    const row =
        document.createElement("div");

    row.className = "ranking-row";

    row.innerHTML = `
        <strong>
            #${index + 1}
        </strong>

        <span>
            ${player.player}
        </span>

        <span>
            ${player.option}
        </span>
    `;

    list.appendChild(row);

});

});

// ===============================
// NEXT CATEGORY
// ===============================

function nextRankCategory() {

socket.emit(
    "nextRankCategory",
    {
        roomCode
    }
);

}

socket.on("nextRankCategory", data => {

showRank(
    data.category,
    data.categoryName
);

});

// ===============================
// AUCTION UPDATE
// ===============================

socket.on("auctionUpdate", data => {

hideScreens();

$("auctionGame").style.display =
    "block";

currentAuction = data;

$("auctionCharacter").textContent =
    data.character;

$("currentBid").textContent =
    "₹" + data.currentBid;

$("auctionTimer").textContent =
    "⏱️ " + data.timeLeft;

$("auctionBalance").textContent =
    "💰 Balance: ₹" + data.myBalance;

$("auctionTeamCount").textContent =
    "👥 Team: " +
    data.myTeamCount +
    "/5";

$("highestBidder").textContent =
    data.highestBidder
        ? "Highest Bidder: " +
          data.highestBidder
        : "No bids yet";


const button =
    $("bidButton");


button.disabled =
    !data.canBid;


if (
    data.highestBidderId ===
    socket.id
) {

    button.textContent =
        "🔒 Highest Bidder";

} else {

    button.textContent =
        "+₹50";

}

updateAuctionPlayers(
    data.players
);

});

// ===============================
// AUCTION PLAYERS
// ===============================

function updateAuctionPlayers(players) {

const list =
    $("auctionPlayersList");

if (!list) return;

list.innerHTML = "";

players.forEach((player, index) => {

    const div =
        document.createElement("div");

    div.className =
        "player-card";

    div.innerHTML = `
        <strong>
            ${index + 1}. ${player.name}
        </strong>

        <span>
            💰 ₹${player.balance}
        </span>

        <span>
            👥 ${player.teamCount}/5
        </span>
    `;

    list.appendChild(div);

});

}

// ===============================
// BID +₹50
// ===============================

function bid50() {

if (!currentAuction) return;

if (!currentAuction.canBid) return;

socket.emit(
    "auctionBid",
    {
        roomCode
    }
);

}

// ===============================
// AUCTION RESULT
// ===============================

socket.on("auctionResult", data => {

if (data.sold) {

    showMessage(
        `🏆 ${data.character} sold to ${data.winner} for ₹${data.bid}`
    );

} else {

    showMessage(
        `❌ ${data.character} UNSOLD`
    );

}

});

// ===============================
// AUCTION FINISHED
// ===============================

socket.on("auctionFinished", data => {

hideScreens();

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

    div.innerHTML = `
        <h3>
            #${index + 1}
            ${player.name}
        </h3>

        <p>
            💰 Balance: ₹${player.balance}
        </p>

        <p>
            👥 Team: ${player.teamCount}/5
        </p>

        <p>
            ${player.team.length
                ? player.team.join(", ")
                : "No characters"}
        </p>
    `;

    list.appendChild(div);

});

});

// ===============================
// ERROR
// ===============================

socket.on("roomError", message => {

showMessage(message);

});

// ===============================
// HIDE ALL
// ===============================

function hideScreens() {

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

        element.style.display =
            "none";

    }

});

}

// ===============================
// MAKE GLOBAL
// ===============================

window.selectGame =
selectGame;

window.backToMenu =
backToMenu;

window.createRoom =
createRoom;

window.joinRoom =
joinRoom;

window.startGame =
startGame;

window.nextRankCategory =
nextRankCategory;

window.bid50 =
bid50;

console.log(
"🍥 Naruto Character Games loaded successfully"
);
