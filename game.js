/* =========================================================
   🍥 NARUTO CHARACTER GAMES
   COMPLETE GAME.JS
   ========================================================= */

const socket = io();

/* =========================================================
   CHARACTER DATABASE
   YOUR EXACT IMAGE PATHS
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
   TOP 5 FOR EACH CATEGORY
   ========================================================= */

const RANK_CATEGORIES = [

    {
        id: "speed",
        title: "⚡ SPEED",
        characters: [
            "Minato",
            "Tobirama",
            "Naruto",
            "Rock Lee",
            "Kakashi"
        ]
    },

    {
        id: "strength",
        title: "💪 STRENGTH",
        characters: [
            "Madara",
            "Hashirama",
            "Naruto",
            "Might Guy",
            "Sakura"
        ]
    },

    {
        id: "intelligence",
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
        id: "chakra",
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
        id: "battle",
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
   CLANS
   ========================================================= */

const CLANS = [
    {
        name: "Uzumaki",
        members: [
            "Naruto",
            "Nagato"
        ]
    },

    {
        name: "Uchiha",
        members: [
            "Sasuke",
            "Itachi",
            "Madara",
            "Obito"
        ]
    },

    {
        name: "Senju",
        members: [
            "Hashirama",
            "Tobirama"
        ]
    },

    {
        name: "Hatake",
        members: [
            "Kakashi"
        ]
    },

    {
        name: "Nara",
        members: [
            "Shikamaru"
        ]
    },

    {
        name: "Hyuga",
        members: [
            "Neji"
        ]
    },

    {
        name: "Kazekage",
        members: [
            "Gaara"
        ]
    },

    {
        name: "Sannin",
        members: [
            "Jiraiya",
            "Orochimaru"
        ]
    }
];


/* =========================================================
   GAME STATE
   ========================================================= */

let roomCode = null;

let playerName = null;

let isHost = false;

let players = [];

let currentCategory = 0;

let mySelection = null;

let allSelections = {};

let gameStarted = false;


/* =========================================================
   DOM HELPERS
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

function setText(id, text) {

    const element = $(id);

    if (element) {
        element.textContent = text;
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

    clearTimeout(window.messageTimer);

    window.messageTimer =
        setTimeout(() => {
            box.style.display = "none";
        }, 2500);
}


/* =========================================================
   SCREEN SYSTEM
   ========================================================= */

function showScreen(screenId) {

    const screens = document.querySelectorAll(
        "section"
    );

    screens.forEach(screen => {
        screen.classList.add("hidden");
    });

    const target = $(screenId);

    if (target) {
        target.classList.remove("hidden");
    }

    window.scrollTo(0, 0);
}


/* =========================================================
   HOME
   ========================================================= */

function goHome() {

    showScreen("home");

    roomCode = null;

    playerName = null;

    isHost = false;

    players = [];

    currentCategory = 0;

    mySelection = null;

    allSelections = {};

    gameStarted = false;
}


/* =========================================================
   CREATE ROOM
   ========================================================= */

function createRoom(gameType = "rank") {

    const input =
        $("playerName") ||
        $("nameInput");

    if (!input) {
        message("Enter your name");
        return;
    }

    const name =
        input.value.trim();

    if (!name) {
        message("Enter your name first");
        return;
    }

    playerName = name;

    socket.emit(
        "createRoom",
        {
            playerName: name,
            game: gameType
        }
    );
}


/* =========================================================
   JOIN ROOM
   ========================================================= */

function joinRoom(gameType = "rank") {

    const nameInput =
        $("playerName") ||
        $("nameInput");

    const roomInput =
        $("roomCode") ||
        $("joinRoomCode");

    if (!nameInput || !roomInput) {
        message("Enter name and room code");
        return;
    }

    const name =
        nameInput.value.trim();

    const code =
        roomInput.value.trim().toUpperCase();

    if (!name) {
        message("Enter your name");
        return;
    }

    if (!code) {
        message("Enter room code");
        return;
    }

    playerName = name;

    socket.emit(
        "joinRoom",
        {
            playerName: name,
            roomCode: code,
            game: gameType
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

        players =
            data.players || [];

        setText(
            "roomCodeDisplay",
            roomCode
        );

        renderPlayers();

        showScreen("room");

        message(
            "Room created!"
        );
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
            data.hostId === socket.id;

        players =
            data.players || [];

        setText(
            "roomCodeDisplay",
            roomCode
        );

        renderPlayers();

        showScreen("room");

        message(
            "Joined room!"
        );
    }
);


/* =========================================================
   PLAYER UPDATES
   ========================================================= */

socket.on(
    "playersUpdated",
    data => {

        players =
            data.players || [];

        renderPlayers();

        updateWaitingText();
    }
);


/* =========================================================
   RENDER PLAYERS
   ========================================================= */

function renderPlayers() {

    const lists = [
        $("playersList"),
        $("auctionPlayersList")
    ];

    lists.forEach(list => {

        if (!list) return;

        list.innerHTML = "";

        players.forEach(
            (player, index) => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "player";

                const hostText =
                    player.id ===
                    players[0]?.id
                        ? " 👑 Host"
                        : "";

                div.innerHTML = `
                    <span>
                        ${escapeHtml(
                            player.name
                        )}
                        ${hostText}
                    </span>

                    <span>
                        ${index + 1}
                    </span>
                `;

                list.appendChild(div);
            }
        );
    });

    const count =
        $("playerCount");

    if (count) {
        count.textContent =
            `${players.length}/6 Players`;
    }
}


/* =========================================================
   START RANK GAME
   ========================================================= */

function startRankGame() {

    if (!roomCode) {
        message("Create or join a room first");
        return;
    }

    if (!isHost) {
        message(
            "Only the host can start the game"
        );

        return;
    }

    if (players.length < 2) {

        message(
            "At least 2 players are required"
        );

        return;
    }

    socket.emit(
        "startRankGame",
        {
            roomCode
        }
    );
}


/* =========================================================
   SERVER STARTED RANK GAME
   ========================================================= */

socket.on(
    "rankGameStarted",
    data => {

        gameStarted = true;

        currentCategory =
            data.categoryIndex || 0;

        allSelections = {};

        mySelection = null;

        showScreen("rankGame");

        renderCategory();

        updateWaitingText();
    }
);


/* =========================================================
   RENDER CATEGORY
   ========================================================= */

function renderCategory() {

    const category =
        RANK_CATEGORIES[
            currentCategory
        ];

    if (!category) {
        return;
    }

    mySelection = null;

    setText(
        "rankCategoryTitle",
        category.title
    );

    setText(
        "rankDescription",
        "Choose ONE character"
    );

    const list =
        $("rankCharacterList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    category.characters.forEach(
        (characterKey, index) => {

            const character =
                CHARACTERS[
                    characterKey
                ];

            if (!character) {
                return;
            }

            const card =
                document.createElement(
                    "button"
                );

            card.className =
                "rank-character-card";

            card.dataset.character =
                characterKey;

            card.innerHTML = `

                <div class="rank-position">
                    #${index + 1}
                </div>

                <img
                    src="${character.image}"
                    alt="${character.name}"
                    onerror="this.onerror=null;this.src='';"
                >

                <div class="rank-character-name">
                    ${character.name}
                </div>

            `;

            card.addEventListener(
                "click",
                () => {

                    if (mySelection) {
                        return;
                    }

                    selectCharacter(
                        characterKey
                    );
                }
            );

            list.appendChild(card);
        }
    );

    updateWaitingText();
}


/* =========================================================
   SELECT ONE CHARACTER
   ========================================================= */

function selectCharacter(
    characterKey
) {

    if (mySelection) {

        message(
            "You already selected!"
        );

        return;
    }

    mySelection =
        characterKey;

    disableRankButtons();

    socket.emit(
        "selectRankCharacter",
        {
            roomCode,
            character: characterKey
        }
    );

    message(
        `You selected ${CHARACTERS[characterKey].name}`
    );

    updateWaitingText();
}


/* =========================================================
   DISABLE AFTER SELECTION
   ========================================================= */

function disableRankButtons() {

    const buttons =
        document.querySelectorAll(
            ".rank-character-card"
        );

    buttons.forEach(button => {

        button.disabled = true;

        if (
            button.dataset.character ===
            mySelection
        ) {
            button.style.outline =
                "4px solid #10ac84";
        }
    });
}


/* =========================================================
   WAITING STATUS
   ========================================================= */

function updateWaitingText() {

    const element =
        $("rankWaiting");

    if (!element) {
        return;
    }

    if (mySelection) {

        element.textContent =
            "✅ You selected. Waiting for other players...";

    } else {

        element.textContent =
            "Choose ONE character";
    }
}


/* =========================================================
   EVERYONE SELECTED
   ========================================================= */

socket.on(
    "allPlayersSelected",
    data => {

        allSelections =
            data.selections || {};

        showSelectionSummary();

        setTimeout(
            () => {

                currentCategory++;

                if (
                    currentCategory >=
                    RANK_CATEGORIES.length
                ) {

                    socket.emit(
                        "finishRankGame",
                        {
                            roomCode
                        }
                    );

                    return;
                }

                mySelection = null;

                renderCategory();

            },
            1800
        );
    }
);


/* =========================================================
   SELECTION SUMMARY
   ========================================================= */

function showSelectionSummary() {

    const element =
        $("rankWaiting");

    if (!element) {
        return;
    }

    element.textContent =
        "🎉 Everyone selected! Next category...";
}


/* =========================================================
   FINAL RANKING
   ========================================================= */

socket.on(
    "rankGameFinished",
    data => {

        showScreen(
            "rankResults"
        );

        renderRankResults(
            data
        );
    }
);


/* =========================================================
   RESULTS
   ========================================================= */

function renderRankResults(data) {

    const list =
        $("rankResultsList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    const ranking =
        data.ranking || [];

    ranking.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "final-player";

            const team =
                player.team || [];

            let charactersHtml = "";

            team.forEach(
                characterKey => {

                    const character =
                        CHARACTERS[
                            characterKey
                        ];

                    if (!character) {
                        return;
                    }

                    charactersHtml += `

                        <span class="team-character">

                            <img
                                class="team-character-image"
                                src="${character.image}"
                                alt="${character.name}"
                            >

                            ${character.name}

                        </span>

                    `;
                }
            );

            div.innerHTML = `

                <h3>
                    ${index + 1}.
                    ${escapeHtml(
                        player.name
                    )}
                </h3>

                <p>
                    Characters:
                    ${team.length}
                </p>

                <div class="team-characters">
                    ${charactersHtml}
                </div>

            `;

            list.appendChild(div);
        }
    );
}


/* =========================================================
   AUCTION GAME
   ========================================================= */

function startAuctionGame() {

    if (!roomCode) {

        message(
            "Create or join a room first"
        );

        return;
    }

    if (!isHost) {

        message(
            "Only the host can start the game"
        );

        return;
    }

    socket.emit(
        "startAuctionGame",
        {
            roomCode
        }
    );
}


/* =========================================================
   AUCTION STARTED
   ========================================================= */

socket.on(
    "auctionStarted",
    data => {

        showScreen(
            "auctionGame"
        );

        renderAuction(
            data
        );
    }
);


/* =========================================================
   AUCTION UPDATE
   ========================================================= */

socket.on(
    "auctionUpdate",
    data => {

        renderAuction(
            data
        );
    }
);


/* =========================================================
   AUCTION RENDER
   ========================================================= */

function renderAuction(data) {

    if (!data) {
        return;
    }

    const character =
        CHARACTERS[
            data.character
        ];

    if (!character) {
        return;
    }

    const image =
        $("auctionCharacterImage");

    if (image) {

        image.src =
            character.image;

        image.alt =
            character.name;
    }

    setText(
        "auctionCharacter",
        character.name
    );

    setText(
        "auctionCharacterName",
        character.name
    );

    setText(
        "currentBid",
        `₹${data.currentBid || 0}`
    );

    setText(
        "highestBidder",
        data.highestBidder
            ? `Highest bidder: ${data.highestBidder}`
            : "No bids yet"
    );

    setText(
        "auctionTimer",
        data.timeLeft ?? 15
    );

    renderPlayers();

    updateBidButton(
        data
    );
}


/* =========================================================
   BID BUTTON
   ========================================================= */

function updateBidButton(data) {

    const button =
        $("bidButton");

    if (!button) {
        return;
    }

    button.textContent =
        "💰 BID ₹50";

    button.disabled =
        !data.auctionActive ||
        data.highestBidder ===
        playerName;

    if (
        data.highestBidder ===
        playerName
    ) {

        button.title =
            "You are the highest bidder";

    } else {

        button.title =
            "Bid ₹50";
    }
}


/* =========================================================
   BID ₹50
   ========================================================= */

function placeBid() {

    if (!roomCode) {
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
                `🔨 ${data.character} sold to ${data.winner} for ₹${data.bid}`
            );

        } else {

            message(
                `❌ ${data.character} went UNSOLD`
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

        showScreen(
            "auctionResults"
        );

        renderAuctionResults(
            data
        );
    }
);


/* =========================================================
   AUCTION RESULTS
   ========================================================= */

function renderAuctionResults(data) {

    const list =
        $("auctionResultsList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    const ranking =
        data.ranking || [];

    ranking.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "final-player";

            const team =
                player.team || [];

            let html = "";

            team.forEach(
                characterKey => {

                    const character =
                        CHARACTERS[
                            characterKey
                        ];

                    if (!character) {
                        return;
                    }

                    html += `

                        <span class="team-character">

                            <img
                                class="team-character-image"
                                src="${character.image}"
                                alt="${character.name}"
                            >

                            ${character.name}

                        </span>

                    `;
                }
            );

            div.innerHTML = `

                <h3>
                    ${index + 1}.
                    ${escapeHtml(
                        player.name
                    )}
                </h3>

                <p>
                    Team:
                    ${team.length}/5
                </p>

                <p>
                    Balance:
                    ₹${player.balance}
                </p>

                <div class="team-characters">
                    ${html}
                </div>

            `;

            list.appendChild(div);
        }
    );
}


/* =========================================================
   ROOM ERROR
   ========================================================= */

socket.on(
    "errorMessage",
    data => {

        message(
            data.message ||
            "Something went wrong"
        );
    }
);


/* =========================================================
   CONNECTION
   ========================================================= */

socket.on(
    "connect",
    () => {

        console.log(
            "Connected:",
            socket.id
        );
    }
);

socket.on(
    "disconnect",
    () => {

        console.log(
            "Disconnected"
        );

        message(
            "Connection lost. Trying to reconnect..."
        );
    }
);


/* =========================================================
   COPY ROOM CODE
   ========================================================= */

function copyRoomCode() {

    if (!roomCode) {
        return;
    }

    navigator.clipboard
        .writeText(roomCode)
        .then(() => {

            message(
                "Room code copied!"
            );

        })
        .catch(() => {

            message(
                `Room Code: ${roomCode}`
            );
        });
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

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


/* =========================================================
   GLOBAL BUTTON FUNCTIONS
   ========================================================= */

window.createRoom =
    createRoom;

window.joinRoom =
    joinRoom;

window.startRankGame =
    startRankGame;

window.startAuctionGame =
    startAuctionGame;

window.placeBid =
    placeBid;

window.copyRoomCode =
    copyRoomCode;

window.goHome =
    goHome;


/* =========================================================
   INITIAL SCREEN
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Do not automatically open the game.
         * Home screen stays visible until
         * the user chooses Character Rank
         * or Naruto Auction.
         */

        const sections =
            document.querySelectorAll(
                "section"
            );

        sections.forEach(
            (section, index) => {

                if (index === 0) {
                    section.classList.remove(
                        "hidden"
                    );
                } else {
                    section.classList.add(
                        "hidden"
                    );
                }
            }
        );

        const bidButton =
            $("bidButton");

        if (bidButton) {

            bidButton.addEventListener(
                "click",
                placeBid
            );
        }
    }
);
