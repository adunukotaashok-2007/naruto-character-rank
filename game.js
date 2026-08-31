const socket = io();

let roomCode = "";
let playerName = "";
let selectedGame = "rank";

let myPlayerId = "";
let currentAuction = null;

// ======================================================
// HELPERS
// ======================================================

function get(id) {
return document.getElementById(id);
}

function showMessage(message) {

let box = get("message");

if (!box) {

    box = document.createElement("div");

    box.id = "message";

    document.body.appendChild(box);

}

box.textContent = message;

box.style.display = "block";

setTimeout(() => {

    box.style.display = "none";

}, 3000);

}

// ======================================================
// MAIN MENU
// ======================================================

function selectGame(game) {

selectedGame = game;

const menu = get("gameMenu");

if (menu) {
    menu.style.display = "none";
}

const lobby = get("lobby");

if (lobby) {
    lobby.style.display = "block";
}

const title = get("selectedGameTitle");

if (title) {

    title.textContent =
        game === "auction"
            ? "🔨 Naruto Auction"
            : "🏆 Character Rank";

}

}

function showRankGame() {

selectedGame = "rank";

showLobby();

}

function showAuctionGame() {

selectedGame = "auction";

showLobby();

}

function showLobby() {

const menu = get("gameMenu");

const lobby = get("lobby");

if (menu) {
    menu.style.display = "none";
}

if (lobby) {
    lobby.style.display = "block";
}

}

// ======================================================
// LOBBY
// ======================================================

function createRoom() {

const input =
    get("playerName");


playerName =
    input
        ? input.value.trim()
        : "";


if (!playerName) {

    showMessage(
        "Enter your name."
    );

    return;

}


socket.emit(
    "createRoom",
    {
        playerName,
        game: selectedGame
    }
);

}

function joinRoom() {

const nameInput =
    get("playerName");

const roomInput =
    get("roomCode");


playerName =
    nameInput
        ? nameInput.value.trim()
        : "";


roomCode =
    roomInput
        ? roomInput.value.trim().toUpperCase()
        : "";


if (!playerName) {

    showMessage(
        "Enter your name."
    );

    return;

}


if (!roomCode) {

    showMessage(
        "Enter room code."
    );

    return;

}


socket.emit(
    "joinRoom",
    {
        playerName,
        roomCode
    }
);

}

// ======================================================
// ROOM CREATED
// ======================================================

socket.on(
"roomCreated",
data => {

    roomCode =
        data.roomCode;

    myPlayerId =
        socket.id;


    displayRoom(
        data
    );

}

);

// ======================================================
// ROOM JOINED
// ======================================================

socket.on(
"roomJoined",
data => {

    roomCode =
        data.roomCode;

    myPlayerId =
        socket.id;


    displayRoom(
        data
    );

}

);

// ======================================================
// DISPLAY ROOM
// ======================================================

function displayRoom(data) {

const lobby =
    get("lobby");

if (lobby) {
    lobby.style.display = "none";
}


const room =
    get("room");

if (room) {
    room.style.display = "block";
}


const code =
    get("roomCodeDisplay");

if (code) {
    code.textContent =
        roomCode;
}


updatePlayers(
    data.players || []
);


const startButton =
    get("startGameButton");

if (startButton) {

    startButton.style.display =
        "block";

}

}

// ======================================================
// PLAYERS
// ======================================================

socket.on(
"playersUpdated",
data => {

    updatePlayers(
        data.players || []
    );

}

);

function updatePlayers(players) {

const list =
    get("playersList");

if (!list) return;


list.innerHTML = "";


players.forEach(
    (player, index) => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "player-card";


        div.innerHTML = `

            <strong>
                ${index + 1}.
                ${escapeHTML(player.name)}
            </strong>

            <span>
                💰 ₹${player.balance}
            </span>

            <span>
                👥 ${player.teamCount}/5
            </span>

        `;


        list.appendChild(div);

    }
);

}

// ======================================================
// START GAME
// ======================================================

function startGame() {

socket.emit(
    "startGame",
    {
        roomCode
    }
);

}

// ======================================================
// RANK GAME START
// ======================================================

socket.on(
"gameStarted",
data => {

    if (
        data.game !== "rank"
    ) return;


    showRankScreen(
        data.category || 0,
        data.categoryName
    );

}

);

// ======================================================
// RANK SCREEN
// ======================================================

function showRankScreen(
category,
categoryName
) {

hideAllScreens();


const screen =
    get("rankGame");

if (!screen) return;


screen.style.display =
    "block";


const title =
    get("rankCategory");

if (title) {

    title.textContent =
        categoryName ||
        "Character Rank";

}


const characterButtons =
    get("characterButtons");


if (!characterButtons) return;


characterButtons.innerHTML = "";


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


rankCharacters.forEach(
    character => {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            character;


        button.className =
            "character-button";


        button.onclick =
            () => {

                document
                    .querySelectorAll(
                        ".character-button"
                    )
                    .forEach(
                        btn =>
                            btn.classList
                                .remove(
                                    "selected"
                                )
                    );


                button.classList.add(
                    "selected"
                );


                submitRankAnswer(
                    category,
                    character
                );

            };


        characterButtons.appendChild(
            button
        );

    }
);

}

// ======================================================
// RANK ANSWER
// ======================================================

function submitRankAnswer(
category,
character
) {

socket.emit(
    "submitRank",
    {

        roomCode,

        category,

        option:
            character

    }
);


showMessage(
    `You selected ${character}`
);

}

// ======================================================
// RANK PROGRESS
// ======================================================

socket.on(
"rankProgress",
data => {

    const progress =
        get("rankProgress");


    if (progress) {

        progress.textContent =
            `Answers: ${data.submitted}/${data.total}`;

    }

}

);

// ======================================================
// RANK RESULT
// ======================================================

socket.on(
"rankResult",
data => {

    hideAllScreens();


    const screen =
        get("rankResult");

    if (!screen) return;


    screen.style.display =
        "block";


    const title =
        get("resultCategory");


    if (title) {

        title.textContent =
            `🏆 ${data.category}`;

    }


    const list =
        get("rankResultsList");


    if (!list) return;


    list.innerHTML = "";


    data.players.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "ranking-row";


            div.innerHTML = `

                <strong>
                    #${index + 1}
                </strong>

                <span>
                    ${escapeHTML(player.player)}
                </span>

                <span>
                    ${escapeHTML(player.option)}
                </span>

            `;


            list.appendChild(
                div
            );

        }
    );

}

);

// ======================================================
// NEXT CATEGORY
// ======================================================

function nextRankCategory() {

socket.emit(
    "nextRankCategory",
    {
        roomCode
    }
);

}

socket.on(
"nextRankCategory",
data => {

    showRankScreen(
        data.category,
        data.categoryName
    );

}

);

// ======================================================
// RANK FINISHED
// ======================================================

socket.on(
"rankFinished",
data => {

    hideAllScreens();


    const screen =
        get("finalResults");

    if (!screen) return;


    screen.style.display =
        "block";


    const list =
        get("finalResultsList");


    if (!list) return;


    list.innerHTML = "";


    data.players.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "ranking-row";


            div.innerHTML = `

                <strong>
                    #${index + 1}
                </strong>

                <span>
                    ${escapeHTML(player.name)}
                </span>

            `;


            list.appendChild(
                div
            );

        }
    );

}

);

// ======================================================
// AUCTION START
// ======================================================

function showAuctionScreen() {

hideAllScreens();


const screen =
    get("auctionGame");

if (!screen) return;


screen.style.display =
    "block";

}

socket.on(
"auctionUpdate",
data => {

    showAuctionScreen();


    currentAuction =
        data;


    updateAuctionUI(
        data
    );

}

);

// ======================================================
// AUCTION UI
// ======================================================

function updateAuctionUI(data) {

// ----------------------------------------------
// CHARACTER
// ----------------------------------------------

const character =
    get("auctionCharacter");


if (character) {

    character.textContent =
        data.character;

}


// ----------------------------------------------
// BID
// ----------------------------------------------

const bid =
    get("currentBid");


if (bid) {

    bid.textContent =
        `₹${data.currentBid}`;

}


// ----------------------------------------------
// HIGHEST BIDDER
// ----------------------------------------------

const highest =
    get("highestBidder");


if (highest) {

    highest.textContent =
        data.highestBidder
            ? `Highest Bidder: ${data.highestBidder}`
            : "No bids yet";

}


// ----------------------------------------------
// TIMER
// ----------------------------------------------

const timer =
    get("auctionTimer");


if (timer) {

    timer.textContent =
        `⏱️ ${data.timeLeft}`;

}


// ----------------------------------------------
// BALANCE
// ----------------------------------------------

const balance =
    get("auctionBalance");


if (balance) {

    balance.textContent =
        `💰 Balance: ₹${data.myBalance}`;

}


// ----------------------------------------------
// TEAM
// ----------------------------------------------

const team =
    get("auctionTeamCount");


if (team) {

    team.textContent =
        `👥 Team: ${data.myTeamCount}/5`;

}


// ----------------------------------------------
// +50 BUTTON
// ----------------------------------------------

const button =
    get("bidButton");


if (button) {

    button.textContent =
        "+₹50";


    button.disabled =
        !data.canBid;


    if (
        data.highestBidderId ===
        socket.id
    ) {

        button.textContent =
            "🔒 Highest Bidder";

    }

}


// ----------------------------------------------
// PLAYER LIST
// ----------------------------------------------

updatePlayers(
    data.players || []
);

}

// ======================================================
// BID BUTTON
// ======================================================

function bid50() {

if (!roomCode) return;


if (
    !currentAuction
) return;


if (
    !currentAuction.canBid
) {

    return;

}


socket.emit(
    "auctionBid",
    {
        roomCode
    }
);

}

// ======================================================
// AUCTION RESULT
// ======================================================

socket.on(
"auctionResult",
data => {

    const character =
        data.character;


    if (data.sold) {

        showMessage(
            `🏆 ${character} sold to ${data.winner} for ₹${data.bid}`
        );

    } else {

        showMessage(
            `❌ ${character} UNSOLD`
        );

    }


    // Server automatically starts
    // the next character after 2 seconds.

}

);

// ======================================================
// AUCTION FINISHED
// ======================================================

socket.on(
"auctionFinished",
data => {

    hideAllScreens();


    const screen =
        get("finalResults");

    if (!screen) return;


    screen.style.display =
        "block";


    const title =
        get("finalResultsTitle");


    if (title) {

        title.textContent =
            "🏆 AUCTION FINAL RESULTS";

    }


    const list =
        get("finalResultsList");


    if (!list) return;


    list.innerHTML = "";


    data.ranking.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "final-player";


            div.innerHTML = `

                <h3>
                    #${index + 1}
                    ${escapeHTML(player.name)}
                </h3>

                <p>
                    💰 Balance:
                    ₹${player.balance}
                </p>

                <p>
                    👥 Team:
                    ${player.teamCount}/5
                </p>

                <p>
                    ${player.team.length
                        ? player.team.join(", ")
                        : "No characters"}
                </p>

            `;


            list.appendChild(
                div
            );

        }
    );

}

);

// ======================================================
// ERROR
// ======================================================

socket.on(
"roomError",
message => {

    showMessage(
        message
    );

}

);

// ======================================================
// HIDE SCREENS
// ======================================================

function hideAllScreens() {

const screens = [

    "gameMenu",

    "lobby",

    "room",

    "rankGame",

    "rankResult",

    "auctionGame",

    "finalResults"

];


screens.forEach(
    id => {

        const element =
            get(id);

        if (element) {

            element.style.display =
                "none";

        }

    }
);

}

// ======================================================
// HTML SAFETY
// ======================================================

function escapeHTML(value) {

return String(value)
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}

// ======================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ======================================================

window.selectGame =
selectGame;

window.showRankGame =
showRankGame;

window.showAuctionGame =
showAuctionGame;

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

// ======================================================
// START
// ======================================================

hideAllScreens();

const menu =
get("gameMenu");

if (menu) {

menu.style.display =
    "block";

}

console.log(
"🍥 Naruto Character Games loaded"
);
