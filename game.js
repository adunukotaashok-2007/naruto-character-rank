/* =========================================================
   NARUTO CHARACTER RANK
   MULTIPLAYER CLIENT
   ========================================================= */

const socket = io();

/* =========================================================
   STATE
========================================================= */

let myPlayerId = null;
let myName = "";
let roomCode = "";
let isHost = false;
let gameMode = "rank";

let players = [];

let currentCategoryIndex = 0;
let totalCategories = 16;

let auctionState = {
    active: false,
    character: null,
    currentBid: 0,
    highestBidder: null,
    highestBidderName: null,
    remainingTime: 0,
    bidAmount: 50,
    bidTime: 10,
    characterNumber: 0,
    totalCharacters: 0
};

let myBalance = 0;
let mySpent = 0;
let myTeam = [];

let rankSelections = {};

/* =========================================================
   RANK CATEGORIES
========================================================= */

const RANK_CATEGORIES = [
    "Speed",
    "Strength",
    "Battle IQ",
    "Durability",
    "Chakra",
    "Ninjutsu",
    "Taijutsu",
    "Genjutsu",
    "Defense",
    "Attack",
    "Stamina",
    "Leadership",
    "Versatility",
    "Experience",
    "Teamwork",
    "Overall Power"
];

/* =========================================================
   CHARACTER IMAGES
========================================================= */

const CHARACTER_IMAGES = {

    Naruto:
        "assets/characters/images%20%282%29.jpeg",

    Sasuke:
        "assets/characters/images%20%283%29.jpeg",

    Itachi:
        "assets/characters/images%20%284%29.jpeg",

    Madara:
        "assets/characters/images%20%285%29.jpeg",

    Kakashi:
        "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg",

    Minato:
        "assets/characters/images%20%286%29.jpeg",

    Tobirama:
        "assets/characters/images%20%287%29.jpeg",

    Hashirama:
        "assets/characters/images%20%288%29.jpeg",

    Jiraiya:
        "assets/characters/images%20%289%29.jpeg",

    Hiruzen:
        "assets/characters/images%20%2810%29.jpeg",

    Orochimaru:
        "assets/characters/images%20%2811%29.jpeg",

    Guy:
        "assets/characters/images%20%2812%29.jpeg",

    Lee:
        "assets/characters/images%20%2813%29.jpeg",

    Shikamaru:
        "assets/characters/images%20%2814%29.jpeg",

    Neji:
        "assets/characters/images%20%2815%29.jpeg",

    Gaara:
        "assets/characters/images%20%2816%29.jpeg",

    Kisame:
        "assets/characters/images%20%2817%29.jpeg",

    Sakura:
        "assets/characters/images%20%2818%29.jpeg",

    Nagato:
        "assets/characters/images%20%2819%29.jpeg",

    Obito:
        "assets/characters/images%20%2820%29.jpeg"
};

/* =========================================================
   DOM HELPERS
========================================================= */

function get(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = get(id);

    if (element) {
        element.textContent = value;
    }
}

function show(id) {
    const element = get(id);

    if (element) {
        element.style.display = "";
    }
}

function hide(id) {
    const element = get(id);

    if (element) {
        element.style.display = "none";
    }
}

/* =========================================================
   CREATE ROOM
========================================================= */

function createRoom() {

    const nameInput = get("playerName");
    const maxPlayersInput = get("maxPlayers");
    const teamSizeInput = get("teamSize");
    const balanceInput = get("startingBalance");
    const bidAmountInput = get("bidAmount");
    const bidTimeInput = get("bidTime");
    const modeInput = get("gameMode");

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    if (!name) {
        showMessage("Enter your name.");
        return;
    }

    const maxPlayers =
        maxPlayersInput
            ? Number(maxPlayersInput.value)
            : 6;

    const teamSize =
        teamSizeInput
            ? Number(teamSizeInput.value)
            : 5;

    const startingBalance =
        balanceInput
            ? Number(balanceInput.value)
            : 1000;

    const bidAmount =
        bidAmountInput
            ? Number(bidAmountInput.value)
            : 50;

    const bidTime =
        bidTimeInput
            ? Number(bidTimeInput.value)
            : 10;

    const selectedMode =
        modeInput
            ? modeInput.value
            : "rank";

    myName = name;

    socket.emit("createRoom", {

        name,

        maxPlayers,

        teamSize,

        startingBalance,

        bidAmount,

        bidTime,

        gameMode:
            selectedMode

    });
}

/* =========================================================
   JOIN ROOM
========================================================= */

function joinRoom() {

    const nameInput =
        get("playerName");

    const roomInput =
        get("roomCode");

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const code =
        roomInput
            ? roomInput.value.trim().toUpperCase()
            : "";

    if (!name) {
        showMessage("Enter your name.");
        return;
    }

    if (!code) {
        showMessage("Enter room code.");
        return;
    }

    myName = name;

    socket.emit("joinRoom", {

        name,

        roomCode:
            code

    });
}

/* =========================================================
   START GAME
========================================================= */

function startGame() {

    if (!isHost) {
        showMessage(
            "Only the host can start the game."
        );

        return;
    }

    socket.emit("startGame");
}

/* =========================================================
   SOCKET CONNECT
========================================================= */

socket.on("connect", () => {

    myPlayerId =
        socket.id;

    console.log(
        "Connected:",
        socket.id
    );

    setText(
        "connectionStatus",
        "🟢 Connected"
    );
});

/* =========================================================
   SOCKET DISCONNECT
========================================================= */

socket.on("disconnect", () => {

    setText(
        "connectionStatus",
        "🔴 Disconnected"
    );

});

/* =========================================================
   ROOM CREATED
========================================================= */

socket.on(
    "roomCreated",
    data => {

        roomCode =
            data.roomCode;

        isHost =
            data.isHost;

        gameMode =
            data.gameMode;

        showRoomScreen();

        updateRoomUI();

        showMessage(
            `Room created: ${roomCode}`
        );

        console.log(
            "Room created:",
            roomCode
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
            data.isHost;

        gameMode =
            data.gameMode;

        showRoomScreen();

        updateRoomUI();

        showMessage(
            `Joined room ${roomCode}`
        );
    }
);

/* =========================================================
   ROOM UI
========================================================= */

function showRoomScreen() {

    hide("menuScreen");
    hide("loginScreen");

    show("roomScreen");

}

function updateRoomUI() {

    setText(
        "roomCodeDisplay",
        roomCode
    );

    setText(
        "roomCode",
        roomCode
    );

    setText(
        "gameModeDisplay",
        gameMode === "auction"
            ? "💰 AUCTION"
            : "🏆 CHARACTER RANK"
    );

    const startButton =
        get("startGameButton");

    if (startButton) {

        startButton.style.display =
            isHost ? "" : "none";

    }

    setText(
        "hostStatus",
        isHost
            ? "👑 You are the host"
            : "Waiting for host..."
    );
}

/* =========================================================
   PLAYERS UPDATED
========================================================= */

socket.on(
    "playersUpdated",
    data => {

        players =
            data.players || [];

        renderPlayers();

        const me =
            players.find(
                player =>
                    player.id ===
                    myPlayerId
            );

        if (me) {

            myBalance =
                me.balance;

            mySpent =
                me.spent;

            myTeam =
                [...(me.team || [])];

            updateMoneyUI();
            renderMyTeam();
        }
    }
);

/* =========================================================
   RENDER PLAYERS
========================================================= */

function renderPlayers() {

    const container =
        get("playersList") ||
        get("playerList") ||
        get("players");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    players.forEach(
        (player, index) => {

            const item =
                document.createElement("div");

            item.className =
                "player-item";

            if (
                player.id ===
                myPlayerId
            ) {
                item.classList.add(
                    "me"
                );
            }

            item.innerHTML = `

                <div class="player-number">
                    ${index + 1}
                </div>

                <div class="player-info">

                    <strong>
                        ${escapeHTML(
                            player.name
                        )}
                    </strong>

                    ${
                        player.id ===
                        myPlayerId
                            ? `
                                <span>
                                    YOU
                                </span>
                              `
                            : ""
                    }

                </div>

                <div class="player-money">
                    💰 ${player.balance}
                </div>

            `;

            container.appendChild(item);

        }
    );

    setText(
        "playerCount",
        `${players.length} players`
    );
}

/* =========================================================
   GAME STARTED
========================================================= */

socket.on(
    "gameStarted",
    data => {

        gameMode =
            data.gameMode;

        hide("roomScreen");

        if (
            gameMode ===
            "auction"
        ) {

            showAuctionScreen();

        } else {

            showRankScreen();

        }
    }
);

/* =========================================================
   RANK NEXT CATEGORY
========================================================= */

socket.on(
    "rankNextCategory",
    data => {

        currentCategoryIndex =
            Number(
                data.categoryIndex
            );

        totalCategories =
            Number(
                data.totalCategories
            ) || 16;

        rankSelections = {};

        showRankScreen();

        renderRankCategory();

    }
);

/* =========================================================
   SHOW RANK SCREEN
========================================================= */

function showRankScreen() {

    hide("roomScreen");
    hide("auctionScreen");
    hide("menuScreen");

    show("rankScreen");

}

/* =========================================================
   RENDER RANK CATEGORY
========================================================= */

function renderRankCategory() {

    const categoryName =
        RANK_CATEGORIES[
            currentCategoryIndex
        ] || "Category";

    setText(
        "categoryTitle",
        `🏆 ${categoryName}`
    );

    setText(
        "categoryNumber",
        `Category ${
            currentCategoryIndex + 1
        } / ${totalCategories}`
    );

    const grid =
        get("characterGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    /*
     * Use all available characters
     * from the ranking game.
     */

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
        "Duy",
        "Shikamaru",
        "Neji",
        "Gaara",
        "Kisame",
        "Sakura",
        "Nagato",
        "Obito",
        "Tsunade",
        "KillerB",
        "Kabuto",
        "Shisui",
        "Sakumo",
        "Hanzo",
        "ThirdRaikage",
        "FourthRaikage",
        "Onoki",
        "Mei",
        "Sasori",
        "Deidara",
        "Mu",
        "Gengetsu",
        "Danzo",
        "Kakuzu",
        "Hidan",
        "Konan",
        "Zabuza",
        "Kimimaro",
        "Suigetsu",
        "Jugo",
        "Karin",
        "Yahiko",
        "Zetsu",
        "Hinata",
        "Ino",
        "Choji",
        "Kiba",
        "Shino",
        "Tenten",
        "Iruka",
        "Anko",
        "Shizune",
        "Asuma",
        "Kurenai",
        "Yamato",
        "Sai",
        "Konohamaru",
        "Chiyo",
        "Rasa",
        "Darui",
        "Chojuro",
        "Kurotsuchi",
        "Mifune",
        "Fu",
        "Utakata",
        "Roshi"
    ];

    characters.forEach(
        character => {

            const card =
                document.createElement(
                    "button"
                );

            card.className =
                "character-card";

            card.type =
                "button";

            const image =
                CHARACTER_IMAGES[
                    character
                ] || "";

            card.innerHTML = `

                ${
                    image
                        ? `
                            <img
                                src="${image}"
                                alt="${escapeHTML(
                                    character
                                )}"
                                onerror="
                                    this.style.display='none'
                                "
                            >
                          `
                        : ""
                }

                <div class="character-name">
                    ${escapeHTML(
                        character
                    )}
                </div>

            `;

            card.onclick = () => {

                selectRankCharacter(
                    character,
                    card
                );

            };

            grid.appendChild(card);

        }
    );
}

/* =========================================================
   SELECT RANK CHARACTER
========================================================= */

function selectRankCharacter(
    character,
    card
) {

    /*
     * Remove previous visual selection.
     */

    document
        .querySelectorAll(
            ".character-card.selected"
        )
        .forEach(element => {

            element.classList.remove(
                "selected"
            );

        });

    card.classList.add(
        "selected"
    );

    rankSelections[
        currentCategoryIndex
    ] = character;

    socket.emit(
        "rankSelect",
        {
            categoryIndex:
                currentCategoryIndex,

            character
        }
    );

    setText(
        "selectionStatus",
        `Selected: ${character}`
    );
}

/* =========================================================
   RANK SELECTION MADE
========================================================= */

socket.on(
    "rankSelectionMade",
    data => {

        const message =
            `${data.playerName} selected ${data.character}`;

        setText(
            "rankActivity",
            message
        );

        addActivity(message);

    }
);

/* =========================================================
   RANK WAITING
========================================================= */

socket.on(
    "rankWaiting",
    data => {

        setText(
            "selectionStatus",
            "⏳ Waiting for other players..."
        );

        setText(
            "waitingText",
            `Waiting for all players to finish ${
                data.categoryName ||
                RANK_CATEGORIES[
                    data.categoryIndex
                ]
            }`
        );

    }
);

/* =========================================================
   RANK CATEGORY COMPLETE
========================================================= */

socket.on(
    "rankCategoryComplete",
    data => {

        setText(
            "selectionStatus",
            "✅ Everyone selected!"
        );

        showMessage(
            `${data.categoryName} completed!`
        );

    }
);

/* =========================================================
   RANK FINISHED
========================================================= */

socket.on(
    "rankFinished",
    data => {

        showRankResults(
            data.results
        );

    }
);

/* =========================================================
   RANK RESULTS
========================================================= */

function showRankResults(results) {

    hide("rankScreen");
    show("resultsScreen");

    const container =
        get("rankResults");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    results.forEach(
        player => {

            const box =
                document.createElement(
                    "div"
                );

            box.className =
                "result-player";

            let html = `
                <h3>
                    ${escapeHTML(
                        player.playerName
                    )}
                </h3>
            `;

            RANK_CATEGORIES.forEach(
                category => {

                    html += `

                        <div class="result-row">

                            <span>
                                ${escapeHTML(
                                    category
                                )}
                            </span>

                            <strong>
                                ${escapeHTML(
                                    player.selections[
                                        category
                                    ] || "-"
                                )}
                            </strong>

                        </div>

                    `;

                }
            );

            box.innerHTML =
                html;

            container.appendChild(
                box
            );

        }
    );
}

/* =========================================================
   AUCTION STARTED
========================================================= */

socket.on(
    "auctionStarted",
    data => {

        gameMode =
            "auction";

        hide("roomScreen");
        hide("rankScreen");

        showAuctionScreen();

        setText(
            "auctionSettings",
            `Starting money: ${
                data.settings.startingBalance
            } | Bid: ${
                data.settings.bidAmount
            } | Timer: ${
                data.settings.bidTime
            } sec`
        );

    }
);

/* =========================================================
   SHOW AUCTION SCREEN
========================================================= */

function showAuctionScreen() {

    hide("roomScreen");
    hide("rankScreen");

    show("auctionScreen");

}

/* =========================================================
   NEW AUCTION CHARACTER
========================================================= */

socket.on(
    "auctionNewCharacter",
    data => {

        showAuctionScreen();

        auctionState.character =
            data.character;

        auctionState.characterNumber =
            data.characterNumber;

        auctionState.totalCharacters =
            data.totalCharacters;

        auctionState.currentBid =
            0;

        auctionState.highestBidder =
            null;

        auctionState.highestBidderName =
            null;

        setText(
            "auctionCharacter",
            data.character
        );

        setText(
            "auctionCharacterNumber",
            `Character ${
                data.characterNumber
            } / ${
                data.totalCharacters
            }`
        );

        renderAuctionCharacter(
            data.character
        );

        setText(
            "auctionBid",
            "₹0"
        );

        setText(
            "currentBid",
            "₹0"
        );

        setText(
            "highestBidder",
            "No bids yet"
        );

        setText(
            "auctionTimer",
            "10"
        );

        updateBidButton();

    }
);

/* =========================================================
   AUCTION CHARACTER IMAGE
========================================================= */

function renderAuctionCharacter(
    character
) {

    const image =
        get("auctionCharacterImage");

    if (!image) {
        return;
    }

    const src =
        CHARACTER_IMAGES[
            character
        ];

    if (src) {

        image.src =
            src;

        image.alt =
            character;

        image.style.display =
            "";

    } else {

        image.removeAttribute(
            "src"
        );

        image.style.display =
            "none";
    }
}

/* =========================================================
   AUCTION CHARACTER STATE
========================================================= */

socket.on(
    "auctionCharacter",
    data => {

        updateAuctionState(
            data
        );

    }
);

socket.on(
    "auctionReady",
    data => {

        updateAuctionState(
            data
        );

    }
);

socket.on(
    "auctionUpdated",
    data => {

        updateAuctionState(
            data
        );

    }
);

/* =========================================================
   UPDATE AUCTION STATE
========================================================= */

function updateAuctionState(
    data
) {

    if (!data) {
        return;
    }

    auctionState = {
        ...auctionState,
        ...data
    };

    showAuctionScreen();

    setText(
        "auctionCharacter",
        data.character ||
        auctionState.character ||
        "-"
    );

    setText(
        "currentBid",
        `₹${
            Number(
                data.currentBid || 0
            )
        }`
    );

    setText(
        "auctionBid",
        `₹${
            Number(
                data.currentBid || 0
            )
        }`
    );

    setText(
        "highestBidder",
        data.highestBidderName ||
        "No bids yet"
    );

    setText(
        "auctionTimer",
        data.remainingTime ??
        0
    );

    setText(
        "auctionCharacterNumber",
        `Character ${
            data.characterNumber ||
            1
        } / ${
            data.totalCharacters ||
            0
        }`
    );

    updateBidButton();

}

/* =========================================================
   TIMER
========================================================= */

socket.on(
    "auctionTimer",
    data => {

        const seconds =
            Number(
                data.seconds
            ) || 0;

        auctionState.remainingTime =
            seconds;

        setText(
            "auctionTimer",
            seconds
        );

        const timer =
            get("auctionTimer");

        if (timer) {

            timer.classList.toggle(
                "danger",
                seconds <= 3
            );

        }

    }
);

/* =========================================================
   MONEY UPDATE
========================================================= */

socket.on(
    "auctionMoneyUpdated",
    data => {

        myBalance =
            Number(
                data.balance
            ) || 0;

        mySpent =
            Number(
                data.spent
            ) || 0;

        updateMoneyUI();

        updateBidButton(
            data
        );

    }
);

/* =========================================================
   MONEY UI
========================================================= */

function updateMoneyUI() {

    setText(
        "myBalance",
        `₹${myBalance}`
    );

    setText(
        "balance",
        `₹${myBalance}`
    );

    setText(
        "mySpent",
        `₹${mySpent}`
    );

    setText(
        "spent",
        `₹${mySpent}`
    );

}

/* =========================================================
   BID BUTTON
========================================================= */

function updateBidButton(
    personalState = null
) {

    const button =
        get("bidButton") ||
        get("placeBidButton");

    if (!button) {
        return;
    }

    let canBid =
        auctionState.active;

    if (personalState) {

        canBid =
            personalState.canBid;

    } else {

        const nextBid =
            Number(
                auctionState.currentBid || 0
            ) +
            Number(
                auctionState.bidAmount || 50
            );

        canBid =
            auctionState.active &&
            auctionState.highestBidder !==
                myPlayerId &&
            myBalance >= nextBid &&
            myTeam.length <
                getTeamSize();

    }

    button.disabled =
        !canBid;

    if (
        auctionState.highestBidder ===
        myPlayerId
    ) {

        button.textContent =
            "✓ HIGHEST BID";

    } else {

        const nextBid =
            Number(
                auctionState.currentBid || 0
            ) +
            Number(
                auctionState.bidAmount || 50
            );

        button.textContent =
            `BID ₹${nextBid}`;
    }
}

/* =========================================================
   GET TEAM SIZE
========================================================= */

function getTeamSize() {

    const input =
        get("teamSize");

    if (input) {

        const value =
            Number(
                input.value
            );

        if (
            Number.isFinite(value) &&
            value > 0
        ) {
            return value;
        }
    }

    /*
     * Server normally sends the value
     * through auction state only indirectly.
     * Use a safe default here.
     */

    return 5;
}

/* =========================================================
   BID
========================================================= */

function placeBid() {

    socket.emit(
        "bid"
    );

}

/* =========================================================
   GIVE UP
========================================================= */

function giveUp() {

    socket.emit(
        "giveUp"
    );

}

/* =========================================================
   BID MADE
========================================================= */

socket.on(
    "auctionBidMade",
    data => {

        auctionState.currentBid =
            data.bid;

        auctionState.highestBidder =
            data.playerId;

        auctionState.highestBidderName =
            data.playerName;

        setText(
            "currentBid",
            `₹${data.bid}`
        );

        setText(
            "auctionBid",
            `₹${data.bid}`
        );

        setText(
            "highestBidder",
            data.playerName
        );

        addActivity(
            `🔥 ${data.playerName} bid ₹${data.bid} for ${data.character}`
        );

    }
);

/* =========================================================
   PLAYER GAVE UP
========================================================= */

socket.on(
    "auctionPlayerGaveUp",
    data => {

        addActivity(
            `🚫 ${data.playerName} gave up on ${data.character}`
        );

    }
);

/* =========================================================
   AUCTION SOLD
========================================================= */

socket.on(
    "auctionSold",
    data => {

        addActivity(
            `🏆 ${data.character} sold to ${data.winnerName} for ₹${data.price}`
        );

        if (
            data.winnerId ===
            myPlayerId
        ) {

            myBalance =
                data.balance;

            mySpent =
                data.spent;

            myTeam =
                [...(
                    data.team ||
                    []
                )];

            updateMoneyUI();
            renderMyTeam();

            showMessage(
                `🏆 You got ${data.character} for ₹${data.price}!`
            );

        } else {

            showMessage(
                `${data.character} sold to ${data.winnerName}`
            );

        }

        auctionState.active =
            false;

        updateBidButton();

    }
);

/* =========================================================
   AUCTION UNSOLD
========================================================= */

socket.on(
    "auctionUnsold",
    data => {

        addActivity(
            `❌ ${data.character} went unsold`
        );

        showMessage(
            `${data.character} went unsold`
        );

        auctionState.active =
            false;

        updateBidButton();

    }
);

/* =========================================================
   TEAM UI
========================================================= */

function renderMyTeam() {

    const container =
        get("myTeam") ||
        get("teamList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        myTeam.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-team">
                No characters yet
            </div>
        `;

        return;
    }

    myTeam.forEach(
        character => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "team-character";

            const image =
                CHARACTER_IMAGES[
                    character
                ];

            item.innerHTML = `

                ${
                    image
                        ? `
                            <img
                                src="${image}"
                                alt="${escapeHTML(
                                    character
                                )}"
                            >
                          `
                        : ""
                }

                <span>
                    ${escapeHTML(
                        character
                    )}
                </span>

            `;

            container.appendChild(
                item
            );

        }
    );

}

/* =========================================================
   AUCTION FINISHED
========================================================= */

socket.on(
    "auctionFinished",
    data => {

        auctionState.active =
            false;

        updateBidButton();

        showAuctionResults(
            data.teams
        );

    }
);

/* =========================================================
   AUCTION RESULTS
========================================================= */

function showAuctionResults(
    teams
) {

    hide("auctionScreen");
    show("resultsScreen");

    const container =
        get("auctionResults");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    teams.forEach(
        player => {

            const box =
                document.createElement(
                    "div"
                );

            box.className =
                "auction-result-player";

            box.innerHTML = `

                <h2>
                    ${escapeHTML(
                        player.playerName
                    )}
                </h2>

                <p>
                    💰 Remaining:
                    ₹${player.balance}
                </p>

                <p>
                    💸 Spent:
                    ₹${player.spent}
                </p>

                <h3>
                    🏆 Team
                </h3>

                <div class="result-team">

                    ${
                        player.team.length
                            ? player.team
                                .map(
                                    character =>
                                        `
                                            <span>
                                                ${escapeHTML(
                                                    character
                                                )}
                                            </span>
                                        `
                                )
                                .join("")
                            : `
                                <span>
                                    No characters
                                </span>
                              `
                    }

                </div>

            `;

            container.appendChild(
                box
            );

        }
    );

}

/* =========================================================
   HOST CHANGED
========================================================= */

socket.on(
    "hostChanged",
    data => {

        isHost =
            data.hostId ===
            myPlayerId;

        updateRoomUI();

        if (isHost) {

            showMessage(
                "👑 You are now the host."
            );

        }

    }
);

/* =========================================================
   ERROR
========================================================= */

socket.on(
    "errorMessage",
    message => {

        showMessage(
            message
        );

        console.error(
            message
        );

    }
);

/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message
) {

    const element =
        get("message") ||
        get("errorMessage") ||
        get("statusMessage");

    if (element) {

        element.textContent =
            message;

        element.style.display =
            "";

        clearTimeout(
            element._timer
        );

        element._timer =
            setTimeout(() => {

                element.style.display =
                    "none";

            }, 3500);

        return;
    }

    console.log(
        message
    );
}

/* =========================================================
   ACTIVITY
========================================================= */

function addActivity(
    message
) {

    const container =
        get("activityLog") ||
        get("auctionActivity");

    if (!container) {
        return;
    }

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "activity-item";

    item.textContent =
        message;

    container.prepend(
        item
    );

    while (
        container.children.length >
        30
    ) {

        container.removeChild(
            container.lastChild
        );

    }

}

/* =========================================================
   COPY ROOM CODE
========================================================= */

function copyRoomCode() {

    if (!roomCode) {
        return;
    }

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(roomCode)
            .then(() => {

                showMessage(
                    "Room code copied!"
                );

            });

        return;
    }

    const input =
        document.createElement(
            "input"
        );

    input.value =
        roomCode;

    document.body.appendChild(
        input
    );

    input.select();

    document.execCommand(
        "copy"
    );

    input.remove();

    showMessage(
        "Room code copied!"
    );
}

/* =========================================================
   LEAVE ROOM
========================================================= */

function leaveRoom() {

    /*
     * Socket.IO disconnects automatically
     * when page is left/reloaded.
     */

    location.reload();

}

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value
    )
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
   BUTTON EVENTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const create =
            get("createRoomButton");

        if (create) {

            create.onclick =
                createRoom;

        }

        const join =
            get("joinRoomButton");

        if (join) {

            join.onclick =
                joinRoom;

        }

        const start =
            get("startGameButton");

        if (start) {

            start.onclick =
                startGame;

        }

        const bid =
            get("bidButton");

        if (bid) {

            bid.onclick =
                placeBid;

        }

        const place =
            get("placeBidButton");

        if (place) {

            place.onclick =
                placeBid;

        }

        const giveUpButton =
            get("giveUpButton");

        if (giveUpButton) {

            giveUpButton.onclick =
                giveUp;

        }

        const copy =
            get("copyRoomButton");

        if (copy) {

            copy.onclick =
                copyRoomCode;

        }

        const leave =
            get("leaveRoomButton");

        if (leave) {

            leave.onclick =
                leaveRoom;

        }

    }
);

/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.createRoom =
    createRoom;

window.joinRoom =
    joinRoom;

window.startGame =
    startGame;

window.placeBid =
    placeBid;

window.giveUp =
    giveUp;

window.copyRoomCode =
    copyRoomCode;

window.leaveRoom =
    leaveRoom;

window.selectRankCharacter =
    selectRankCharacter;

/* =========================================================
   INITIAL STATUS
========================================================= */

setText(
    "connectionStatus",
    "🟡 Connecting..."
);

console.log(
    "Naruto Character Rank client loaded."
);
