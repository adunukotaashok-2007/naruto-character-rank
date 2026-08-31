
/* =========================================================
   NARUTO CHARACTER GAMES
   COMPLETE GAME.JS
   ========================================================= */

/* =========================================================
   SOCKET.IO
   ========================================================= */

const socket = io();

/* =========================================================
   GAME STATE
   ========================================================= */

let selectedGame = "";
let roomCode = "";
let playerName = "";
let isHost = false;

let currentCategoryIndex = 0;
let currentCategory = null;

let mySelection = null;

let auctionCharacter = null;
let currentBid = 0;
let highestBidder = null;
let auctionTime = 15;
let auctionActive = false;


/* =========================================================
   CHARACTER IMAGES
   ========================================================= */

const CHARACTERS = {

    Naruto: {
        name: "Naruto",
        image: "assets/characters/images%20%282%29.jpeg"
    },

    Sasuke: {
        name: "Sasuke",
        image: "assets/characters/images%20%283%29.jpeg"
    },

    Itachi: {
        name: "Itachi",
        image: "assets/characters/images%20%284%29.jpeg"
    },

    Madara: {
        name: "Madara",
        image: "assets/characters/images%20%285%29.jpeg"
    },

    Kakashi: {
        name: "Kakashi",
        image: "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg"
    },

    Minato: {
        name: "Minato",
        image: "assets/characters/images%20%286%29.jpeg"
    },

    Tobirama: {
        name: "Tobirama",
        image: "assets/characters/images%20%287%29.jpeg"
    },

    Hashirama: {
        name: "Hashirama",
        image: "assets/characters/images%20%288%29.jpeg"
    },

    Jiraiya: {
        name: "Jiraiya",
        image: "assets/characters/images%20%289%29.jpeg"
    },

    Hiruzen: {
        name: "Hiruzen",
        image: "assets/characters/images%20%2810%29.jpeg"
    },

    Orochimaru: {
        name: "Orochimaru",
        image: "assets/characters/images%20%2811%29.jpeg"
    },

    Guy: {
        name: "Might Guy",
        image: "assets/characters/images%20%2812%29.jpeg"
    },

    Lee: {
        name: "Rock Lee",
        image: "assets/characters/images%20%2813%29.jpeg"
    },

    Shikamaru: {
        name: "Shikamaru",
        image: "assets/characters/images%20%2814%29.jpeg"
    },

    Neji: {
        name: "Neji",
        image: "assets/characters/images%20%2815%29.jpeg"
    },

    Gaara: {
        name: "Gaara",
        image: "assets/characters/images%20%2816%29.jpeg"
    },

    Kisame: {
        name: "Kisame",
        image: "assets/characters/images%20%2817%29.jpeg"
    },

    Sakura: {
        name: "Sakura",
        image: "assets/characters/images%20%2818%29.jpeg"
    },

    Nagato: {
        name: "Nagato / Pain",
        image: "assets/characters/images%20%2819%29.jpeg"
    },

    Obito: {
        name: "Obito",
        image: "assets/characters/images%20%2820%29.jpeg"
    }
};


/* =========================================================
   RANK CATEGORIES
   FIVE CHARACTERS EACH
   ========================================================= */

const RANK_CATEGORIES = [

    {
        title: "⚡ SPEED",
        characters: [
            "Minato",
            "Tobirama",
            "Naruto",
            "Lee",
            "Kakashi"
        ]
    },

    {
        title: "💪 STRENGTH",
        characters: [
            "Madara",
            "Hashirama",
            "Naruto",
            "Guy",
            "Sakura"
        ]
    },

    {
        title: "🧠 INTELLIGENCE",
        characters: [
            "Shikamaru",
            "Itachi",
            "Tobirama",
            "Kakashi",
            "Minato"
        ]
    },

    {
        title: "🔵 CHAKRA",
        characters: [
            "Naruto",
            "Hashirama",
            "Madara",
            "Nagato",
            "Minato"
        ]
    },

    {
        title: "⚔️ BATTLE SKILL",
        characters: [
            "Madara",
            "Naruto",
            "Hashirama",
            "Itachi",
            "Kakashi"
        ]
    }
];


/* =========================================================
   HELPER
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


function show(id) {

    const element = $(id);

    if (element) {
        element.classList.remove("hidden");
    }
}


function hide(id) {

    const element = $(id);

    if (element) {
        element.classList.add("hidden");
    }
}


/* =========================================================
   MESSAGE
   ========================================================= */

function message(text) {

    const box = $("message");

    if (!box) {
        alert(text);
        return;
    }

    box.textContent = text;
    box.style.display = "block";

    setTimeout(() => {

        box.style.display = "none";

    }, 2500);
}


/* =========================================================
   SELECT GAME
   THIS FIXES THE TWO HOME BUTTONS
   ========================================================= */

function selectGame(game) {

    selectedGame = game;

    hide("home");

    show("gameMenu");

    const title =
        $("selectedGameTitle");

    if (title) {

        if (game === "rank") {

            title.textContent =
                "🏆 CHARACTER RANK";

        } else {

            title.textContent =
                "🔨 NARUTO AUCTION";
        }
    }
}


/* =========================================================
   BACK TO HOME
   ========================================================= */

function backHome() {

    hide("gameMenu");
    hide("roomScreen");
    hide("rankScreen");
    hide("auctionScreen");
    hide("finalScreen");

    show("home");

    selectedGame = "";
}


/* =========================================================
   CREATE ROOM
   ========================================================= */

function createRoom() {

    const input =
        $("playerName");

    if (!input) {

        message(
            "Player name box not found."
        );

        return;
    }

    playerName =
        input.value.trim();

    if (!playerName) {

        message(
            "Enter your player name."
        );

        return;
    }

    if (!selectedGame) {

        message(
            "Select a game first."
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


/* =========================================================
   JOIN ROOM
   ========================================================= */

function joinRoom() {

    const nameInput =
        $("playerName");

    const roomInput =
        $("roomCodeInput");

    if (!nameInput ||
        !roomInput) {

        message(
            "Room fields not found."
        );

        return;
    }

    playerName =
        nameInput.value.trim();

    roomCode =
        roomInput.value
            .trim()
            .toUpperCase();

    if (!playerName) {

        message(
            "Enter your player name."
        );

        return;
    }

    if (!roomCode) {

        message(
            "Enter the room code."
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


/* =========================================================
   ROOM CREATED
   ========================================================= */

socket.on(
    "roomCreated",
    data => {

        roomCode =
            data.roomCode;

        isHost = true;

        hide("gameMenu");
        show("roomScreen");

        updateRoom(
            data.players
        );

        setText(
            "roomCode",
            roomCode
        );

        showHostButton();
    }
);


/* =========================================================
   ROOM JOINED
   ========================================================= */

socket.on(
    "roomJoined",
    data => {

        roomCode =
            data.roomCode;

        isHost =
            data.hostId ===
            socket.id;

        hide("gameMenu");
        show("roomScreen");

        updateRoom(
            data.players
        );

        setText(
            "roomCode",
            roomCode
        );

        if (isHost) {

            showHostButton();

        } else {

            hideHostButton();
        }
    }
);


/* =========================================================
   PLAYERS UPDATED
   ========================================================= */

socket.on(
    "playersUpdated",
    data => {

        updateRoom(
            data.players
        );
    }
);


/* =========================================================
   UPDATE ROOM
   ========================================================= */

function updateRoom(players) {

    const list =
        $("playersList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    players.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "player";

            div.innerHTML = `
                <span>
                    ${index + 1}.
                    ${escapeHTML(player.name)}
                </span>

                <span>
                    ${player.teamCount || 0}/5
                </span>
            `;

            list.appendChild(div);
        }
    );

    setText(
        "playerCount",
        `${players.length}/6 Players`
    );
}


/* =========================================================
   HOST BUTTON
   ========================================================= */

function showHostButton() {

    const button =
        $("hostStartButton");

    if (!button) {
        return;
    }

    button.classList.remove(
        "hidden"
    );

    button.textContent =
        selectedGame === "rank"
            ? "🏆 START CHARACTER RANK"
            : "🔨 START NARUTO AUCTION";
}


function hideHostButton() {

    const button =
        $("hostStartButton");

    if (button) {

        button.classList.add(
            "hidden"
        );
    }
}


/* =========================================================
   HOST START
   ========================================================= */

function startSelectedGame() {

    if (!isHost) {

        message(
            "Only the host can start."
        );

        return;
    }

    if (selectedGame === "rank") {

        socket.emit(
            "startRankGame",
            {
                roomCode
            }
        );

    } else {

        socket.emit(
            "startAuctionGame",
            {
                roomCode
            }
        );
    }
}


/* =========================================================
   RANK GAME STARTED
   ========================================================= */

socket.on(
    "rankGameStarted",
    data => {

        currentCategoryIndex =
            data.categoryIndex;

        currentCategory =
            data.category;

        mySelection = null;

        hide("roomScreen");
        hide("gameMenu");

        show("rankScreen");

        renderRankCategory();
    }
);


/* =========================================================
   RENDER RANK CATEGORY
   ========================================================= */

function renderRankCategory() {

    const category =
        currentCategory ||
        RANK_CATEGORIES[
            currentCategoryIndex
        ];

    if (!category) {
        return;
    }

    setText(
        "categoryTitle",
        category.title
    );

    setText(
        "categoryNumber",
        `Category ${
            currentCategoryIndex + 1
        } / ${
            RANK_CATEGORIES.length
        }`
    );


    const grid =
        $("characterGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";


    category.characters.forEach(
        (character, index) => {

            const data =
                CHARACTERS[
                    character
                ];

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "character-card";

            button.innerHTML = `

                <img
                    src="${data?.image || ""}"
                    alt="${data?.name || character}"
                    onerror="this.style.display='none'"
                >

                <strong>
                    ${index + 1}.
                    ${data?.name || character}
                </strong>
            `;

            button.onclick =
                () => selectRankCharacter(
                    character
                );

            grid.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   SELECT RANK CHARACTER
   ========================================================= */

function selectRankCharacter(
    character
) {

    if (mySelection) {

        message(
            "You already selected. Wait for the other players."
        );

        return;
    }

    mySelection =
        character;


    const buttons =
        document.querySelectorAll(
            ".character-card"
        );

    buttons.forEach(
        button => {

            button.disabled =
                true;
        }
    );


    socket.emit(
        "selectRankCharacter",
        {
            roomCode,
            character
        }
    );


    message(
        `You selected ${character}. Waiting for other players...`
    );
}


/* =========================================================
   SELECTION ACCEPTED
   ========================================================= */

socket.on(
    "selectionAccepted",
    data => {

        mySelection =
            data.character;

        message(
            `✅ ${data.character} selected`
        );
    }
);


/* =========================================================
   SELECTION PROGRESS
   ========================================================= */

socket.on(
    "selectionProgress",
    data => {

        setText(
            "selectionProgress",
            `Players selected: ${data.selected}/${data.total}`
        );
    }
);


/* =========================================================
   ALL PLAYERS SELECTED
   ========================================================= */

socket.on(
    "allPlayersSelected",
    data => {

        message(
            "✅ Everyone selected! Next category coming..."
        );
    }
);


/* =========================================================
   NEXT CATEGORY
   ========================================================= */

socket.on(
    "rankNextCategory",
    data => {

        currentCategoryIndex =
            data.categoryIndex;

        currentCategory =
            data.category;

        mySelection = null;

        renderRankCategory();
    }
);


/* =========================================================
   RANK FINISHED
   ========================================================= */

socket.on(
    "rankGameFinished",
    data => {

        hide("rankScreen");

        show("finalScreen");

        renderFinalRanking(
            data.ranking
        );
    }
);


/* =========================================================
   AUCTION STARTED
   ========================================================= */

socket.on(
    "auctionStarted",
    () => {

        hide("roomScreen");
        hide("gameMenu");

        show("auctionScreen");

        message(
            "🔨 Auction started!"
        );
    }
);


/* =========================================================
   AUCTION UPDATE
   ========================================================= */

socket.on(
    "auctionUpdate",
    data => {

        auctionCharacter =
            data.character;

        currentBid =
            data.currentBid;

        highestBidder =
            data.highestBidder;

        auctionTime =
            data.timeLeft;

        auctionActive =
            data.auctionActive;


        renderAuction(
            data
        );
    }
);


/* =========================================================
   RENDER AUCTION
   ========================================================= */

function renderAuction(data) {

    const character =
        CHARACTERS[
            data.character
        ];


    setText(
        "auctionCharacter",
        character?.name ||
        data.character
    );


    setText(
        "auctionCharacterName",
        character?.name ||
        data.character
    );


    setText(
        "currentBid",
        `₹${data.currentBid}`
    );


    setText(
        "highestBidder",
        data.highestBidder
            ? `Highest bidder: ${data.highestBidder}`
            : "No bids yet"
    );


    setText(
        "auctionTimer",
        data.timeLeft
    );


    const image =
        $("auctionCharacterImage");

    if (
        image &&
        character?.image
    ) {

        image.src =
            character.image;

        image.alt =
            character.name;

        image.style.display =
            "block";
    }


    /*
     * ONLY ONE BID BUTTON:
     * ₹50
     */

    const button =
        $("bidButton");

    if (!button) {
        return;
    }


    button.textContent =
        "💰 BID ₹50";


    /*
     * HIGHEST BIDDER CANNOT
     * CLICK AGAIN.
     */

    if (
        highestBidder ===
        playerName
    ) {

        button.disabled =
            true;

        button.textContent =
            "🔒 HIGHEST BIDDER";

        return;
    }


    /*
     * AUCTION ENDED
     */

    if (!data.auctionActive) {

        button.disabled =
            true;

        return;
    }


    button.disabled =
        false;
}


/* =========================================================
   BID BUTTON
   ========================================================= */

function placeBid() {

    if (!auctionActive) {

        message(
            "Auction is not active."
        );

        return;
    }


    if (
        highestBidder ===
        playerName
    ) {

        message(
            "You are already the highest bidder."
        );

        return;
    }


    socket.emit(
        "placeBid",
        {
            roomCode
        }
    );
}


/* =========================================================
   AUCTION RESULT
   ========================================================= */

socket.on(
    "auctionResult",
    data => {

        if (data.sold) {

            message(
                `🔨 SOLD! ${data.character} → ${data.winner} for ₹${data.bid}`
            );

        } else {

            message(
                `❌ UNSOLD! ${data.character}`
            );
        }
    }
);


/* =========================================================
   AUCTION FINISHED
   ========================================================= */

socket.on(
    "auctionFinished",
    data => {

        hide("auctionScreen");

        show("finalScreen");

        renderFinalRanking(
            data.ranking
        );
    }
);


/* =========================================================
   FINAL RESULTS
   ========================================================= */

function renderFinalRanking(
    ranking
) {

    const container =
        $("finalResults");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    ranking.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "final-player";


            let teamHTML = "";

            if (
                player.team &&
                player.team.length
            ) {

                teamHTML =
                    player.team.map(
                        character => {

                            const data =
                                CHARACTERS[
                                    character
                                ];

                            return `

                                <div class="team-character">

                                    ${
                                        data?.image
                                        ? `
                                            <img
                                                class="team-character-image"
                                                src="${data.image}"
                                                alt="${data.name}"
                                            >
                                          `
                                        : ""
                                    }

                                    ${data?.name || character}

                                </div>
                            `;
                        }
                    ).join("");
            }


            div.innerHTML = `

                <h3>
                    ${index + 1}.
                    ${escapeHTML(player.name)}
                </h3>

                <p>
                    💰 Balance:
                    ₹${player.balance ?? 0}
                </p>

                <p>
                    👥 Characters:
                    ${player.teamCount ?? player.team?.length ?? 0}/5
                </p>

                <div class="team-characters">
                    ${teamHTML}
                </div>
            `;


            container.appendChild(
                div
            );
        }
    );
}


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

socket.on(
    "errorMessage",
    data => {

        message(
            data.message ||
            "Something went wrong."
        );
    }
);


/* =========================================================
   SOCKET CONNECTION
   ========================================================= */

socket.on(
    "connect",
    () => {

        console.log(
            "Connected to server:",
            socket.id
        );
    }
);


socket.on(
    "disconnect",
    () => {

        message(
            "⚠️ Connection lost. Reconnecting..."
        );
    }
);


/* =========================================================
   TEXT HELPER
   ========================================================= */

function setText(
    id,
    text
) {

    const element =
        $(id);

    if (element) {

        element.textContent =
            text;
    }
}


/* =========================================================
   HTML SAFETY
   ========================================================= */

function escapeHTML(
    text
) {

    return String(text)
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


/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
   ========================================================= */

window.selectGame =
    selectGame;

window.createRoom =
    createRoom;

window.joinRoom =
    joinRoom;

window.startSelectedGame =
    startSelectedGame;

window.selectRankCharacter =
    selectRankCharacter;

window.placeBid =
    placeBid;

window.backHome =
    backHome;
