const socket = io();

/* =========================================================
   CHARACTER DATA
========================================================= */

const characters = {
    Naruto: {
        name: "Naruto",
        image: "assets/characters/images%20(2).jpeg"
    },

    Sasuke: {
        name: "Sasuke",
        image: "assets/characters/images%20(3).jpeg"
    },

    Itachi: {
        name: "Itachi",
        image: "assets/characters/images%20(4).jpeg"
    },

    Madara: {
        name: "Madara",
        image: "assets/characters/images%20(5).jpeg"
    },

    Kakashi: {
        name: "Kakashi",
        image: "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg"
    },

    Minato: {
        name: "Minato",
        image: "assets/characters/images%20(6).jpeg"
    },

    Tobirama: {
        name: "Tobirama",
        image: "assets/characters/images%20(7).jpeg"
    },

    Hashirama: {
        name: "Hashirama",
        image: "assets/characters/images%20(8).jpeg"
    },

    Jiraiya: {
        name: "Jiraiya",
        image: "assets/characters/images%20(9).jpeg"
    },

    Hiruzen: {
        name: "Hiruzen",
        image: "assets/characters/images%20(10).jpeg"
    },

    Orochimaru: {
        name: "Orochimaru",
        image: "assets/characters/images%20(11).jpeg"
    },

    Guy: {
        name: "Might Guy",
        image: "assets/characters/images%20(12).jpeg"
    },

    Lee: {
        name: "Rock Lee",
        image: "assets/characters/images%20(13).jpeg"
    },

    Shikamaru: {
        name: "Shikamaru",
        image: "assets/characters/images%20(14).jpeg"
    },

    Neji: {
        name: "Neji",
        image: "assets/characters/images%20(15).jpeg"
    },

    Gaara: {
        name: "Gaara",
        image: "assets/characters/images%20(16).jpeg"
    },

    Kisame: {
        name: "Kisame",
        image: "assets/characters/images%20(17).jpeg"
    },

    Sakura: {
        name: "Sakura",
        image: "assets/characters/images%20(18).jpeg"
    },

    Nagato: {
        name: "Nagato / Pain",
        image: "assets/characters/images%20(19).jpeg"
    },

    Obito: {
        name: "Obito",
        image: "assets/characters/images%20(20).jpeg"
    },

    Tsunade: {
        name: "Tsunade",
        image: "assets/characters/download.jpeg"
    },

    KillerB: {
        name: "Killer B",
        image: "assets/characters/download%20(1).jpeg"
    },

    Kabuto: {
        name: "Kabuto",
        image: "assets/characters/download%20(2).jpeg"
    },

    Shisui: {
        name: "Shisui",
        image: "assets/characters/download%20(3).jpeg"
    },

    Sakumo: {
        name: "Sakumo Hatake",
        image: "assets/characters/download%20(4).jpeg"
    },

    Hanzo: {
        name: "Hanzo",
        image: "assets/characters/download%20(5).jpeg"
    },

    ThirdRaikage: {
        name: "Third Raikage",
        image: "assets/characters/download%20(6).jpeg"
    },

    FourthRaikage: {
        name: "Fourth Raikage",
        image: "assets/characters/download%20(7).jpeg"
    },

    Onoki: {
        name: "Onoki",
        image: "assets/characters/download%20(8).jpeg"
    },

    Mei: {
        name: "Mei Terumi",
        image: "assets/characters/download%20(9).jpeg"
    },

    Sasori: {
        name: "Sasori",
        image: "assets/characters/download%20(10).jpeg"
    },

    Deidara: {
        name: "Deidara",
        image: "assets/characters/download%20(11).jpeg"
    },

    Mu: {
        name: "Mū",
        image: "assets/characters/download%20(12).jpeg"
    },

    Gengetsu: {
        name: "Gengetsu Hōzuki",
        image: "assets/characters/download%20(13).jpeg"
    },

    Danzo: {
        name: "Danzō",
        image: "assets/characters/download%20(14).jpeg"
    },

    Kakuzu: {
        name: "Kakuzu",
        image: "assets/characters/download%20(15).jpeg"
    },

    Hidan: {
        name: "Hidan",
        image: "assets/characters/download%20(16).jpeg"
    },

    Konan: {
        name: "Konan",
        image: "assets/characters/download%20(17).jpeg"
    },

    Zabuza: {
        name: "Zabuza",
        image: "assets/characters/download%20(18).jpeg"
    },

    Kimimaro: {
        name: "Kimimaro",
        image: "assets/characters/download%20(19).jpeg"
    },

    Suigetsu: {
        name: "Suigetsu",
        image: "assets/characters/download%20(20).jpeg"
    },

    Jugo: {
        name: "Jūgo",
        image: "assets/characters/download%20(21).jpeg"
    },

    Karin: {
        name: "Karin",
        image: "assets/characters/download%20(22).jpeg"
    },

    Yahiko: {
        name: "Yahiko",
        image: "assets/characters/download%20(23).jpeg"
    },

    Zetsu: {
        name: "Zetsu",
        image: "assets/characters/download%20(24).jpeg"
    },

    Hinata: {
        name: "Hinata",
        image: "assets/characters/download%20(25).jpeg"
    },

    Ino: {
        name: "Ino",
        image: "assets/characters/download%20(26).jpeg"
    },

    Choji: {
        name: "Choji",
        image: "assets/characters/download%20(27).jpeg"
    },

    Kiba: {
        name: "Kiba",
        image: "assets/characters/download%20(28).jpeg"
    },

    Shino: {
        name: "Shino",
        image: "assets/characters/download%20(29).jpeg"
    },

    Tenten: {
        name: "Tenten",
        image: "assets/characters/download%20(30).jpeg"
    },

    Iruka: {
        name: "Iruka",
        image: "assets/characters/download%20(31).jpeg"
    },

    Anko: {
        name: "Anko",
        image: "assets/characters/download%20(32).jpeg"
    },

    Duy: {
        name: "Might Duy",
        image: "assets/characters/download%20(33).jpeg"
    },

    Shizune: {
        name: "Shizune",
        image: "assets/characters/download%20(34).jpeg"
    },

    Asuma: {
        name: "Asuma",
        image: "assets/characters/download%20(35).jpeg"
    },

    Kurenai: {
        name: "Kurenai",
        image: "assets/characters/download%20(36).jpeg"
    },

    Yamato: {
        name: "Yamato",
        image: "assets/characters/download%20(37).jpeg"
    },

    Sai: {
        name: "Sai",
        image: "assets/characters/download%20(38).jpeg"
    },

    Konohamaru: {
        name: "Konohamaru",
        image: "assets/characters/download%20(39).jpeg"
    },

    Kurotsuchi: {
        name: "Kurotsuchi",
        image: "assets/characters/download%20(40).jpeg"
    },

    Mifune: {
        name: "Mifune",
        image: "assets/characters/download%20(41).jpeg"
    },

    Fu: {
        name: "Fū",
        image: "assets/characters/download%20(42).jpeg"
    },

    Utakata: {
        name: "Utakata",
        image: "assets/characters/download%20(43).jpeg"
    },

    Roshi: {
        name: "Rōshi",
        image: "assets/characters/download%20(44).jpeg"
    },

    Rasa: {
        name: "Rasa",
        image: "assets/characters/images%20(22).jpeg"
    },

    Chiyo: {
        name: "Chiyo",
        image: "assets/characters/images%20(21).jpeg"
    },

    Darui: {
        name: "Darui",
        image: "assets/characters/images%20(24).jpeg"
    },

    Chojuro: {
        name: "Chōjūrō",
        image: "assets/characters/images%20(25).jpeg"
    }
};


/* =========================================================
   16 CATEGORIES
========================================================= */

const categories = [
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
   CHARACTER RANKINGS
========================================================= */

const rankings = {

    Speed: [
        "Minato",
        "Naruto",
        "Tobirama",
        "FourthRaikage",
        "Sasuke",
        "Kakashi",
        "Shisui",
        "Guy",
        "Lee",
        "Duy",
        "Obito"
    ],

    Strength: [
        "Madara",
        "Hashirama",
        "Naruto",
        "Sasuke",
        "Guy",
        "Tsunade",
        "Minato",
        "Itachi",
        "Obito",
        "KillerB",
        "Duy"
    ],

    "Battle IQ": [
        "Shikamaru",
        "Itachi",
        "Kakashi",
        "Minato",
        "Tobirama",
        "Madara",
        "Sasuke",
        "Orochimaru",
        "Jiraiya",
        "Obito"
    ],

    Durability: [
        "Hashirama",
        "Naruto",
        "Madara",
        "Kisame",
        "KillerB",
        "Tsunade",
        "Obito",
        "Sakura",
        "Gaara",
        "ThirdRaikage"
    ],

    Chakra: [
        "Naruto",
        "Hashirama",
        "Madara",
        "Kisame",
        "Nagato",
        "KillerB",
        "Minato",
        "Tobirama",
        "Jiraiya",
        "Orochimaru"
    ],

    Ninjutsu: [
        "Madara",
        "Naruto",
        "Sasuke",
        "Hashirama",
        "Orochimaru",
        "Kakashi",
        "Minato",
        "Tobirama",
        "Jiraiya",
        "Itachi"
    ],

    Taijutsu: [
        "Guy",
        "Duy",
        "Lee",
        "Naruto",
        "Sasuke",
        "Neji",
        "ThirdRaikage",
        "FourthRaikage",
        "KillerB",
        "Sakura",
        "Kakashi"
    ],

    Genjutsu: [
        "Itachi",
        "Shisui",
        "Sasuke",
        "Madara",
        "Kurenai",
        "Obito",
        "Orochimaru",
        "Kakashi",
        "Sakura",
        "Ino"
    ],

    Defense: [
        "Gaara",
        "Hashirama",
        "Madara",
        "Naruto",
        "Kakashi",
        "Tsunade",
        "Sasuke",
        "Obito",
        "ThirdRaikage",
        "Kisame"
    ],

    Attack: [
        "Madara",
        "Naruto",
        "Sasuke",
        "Hashirama",
        "Guy",
        "Minato",
        "Itachi",
        "KillerB",
        "Nagato",
        "Obito"
    ],

    Stamina: [
        "Naruto",
        "Hashirama",
        "Kisame",
        "KillerB",
        "Madara",
        "Tsunade",
        "Sakura",
        "Jiraiya",
        "Orochimaru",
        "ThirdRaikage"
    ],

    Leadership: [
        "Hashirama",
        "Naruto",
        "Minato",
        "Tobirama",
        "Madara",
        "Kakashi",
        "Gaara",
        "Tsunade",
        "Jiraiya",
        "Itachi"
    ],

    Versatility: [
        "Kakashi",
        "Naruto",
        "Sasuke",
        "Orochimaru",
        "Itachi",
        "Madara",
        "Jiraiya",
        "Minato",
        "Tobirama",
        "Obito"
    ],

    Experience: [
        "Hiruzen",
        "Madara",
        "Orochimaru",
        "Jiraiya",
        "Tobirama",
        "Hashirama",
        "Kakashi",
        "Itachi",
        "Onoki",
        "Tsunade"
    ],

    Teamwork: [
        "Naruto",
        "Kakashi",
        "Shikamaru",
        "Minato",
        "Sakura",
        "Gaara",
        "Hinata",
        "Choji",
        "Kiba",
        "Shino"
    ],

    "Overall Power": [
        "Madara",
        "Naruto",
        "Sasuke",
        "Hashirama",
        "Minato",
        "Itachi",
        "Obito",
        "Nagato",
        "Guy",
        "Tobirama"
    ]
};


/* =========================================================
   GAME STATE
========================================================= */

let myName = "";
let roomCode = "";
let isHost = false;
let gameMode = "rank";

let currentCategory = 0;

let currentAuctionState = null;
let auctionTimer = null;
let auctionEndTime = 0;

let players = [];

let auctionGivenUp = false;


/* =========================================================
   DOM
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {
            screen.classList.add("hidden");
        });

    const screen = $(id);

    if (screen) {
        screen.classList.remove("hidden");
    }
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(text) {

    const message = $("message");

    if (!message) return;

    message.textContent = text;
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 2500);
}


/* =========================================================
   CREATE ROOM
========================================================= */

window.createRoom = function () {

    const name =
        $("playerName")?.value.trim();

    if (!name) {
        showMessage("Enter your name.");
        return;
    }

    myName = name;

    const mode =
        $("gameMode")?.value || "rank";

    let maxPlayers =
        Number($("maxPlayers")?.value);

    if (!maxPlayers || maxPlayers < 2) {
        maxPlayers = 6;
    }

    const teamSize =
        Number($("teamSize")?.value) || 5;

    const startingBalance =
        Number($("startingBalance")?.value) || 1000;

    socket.emit("createRoom", {
        name,
        gameMode: mode,
        maxPlayers,
        teamSize,
        startingBalance,
        bidAmount: 50,
        bidTime: 10
    });
};


/* =========================================================
   JOIN ROOM
========================================================= */

window.joinRoom = function () {

    const name =
        $("joinPlayerName")?.value.trim();

    const code =
        $("joinRoomCode")
            ?.value.trim()
            .toUpperCase();

    if (!name || !code) {
        showMessage("Enter your name and room code.");
        return;
    }

    myName = name;

    socket.emit("joinRoom", {
        name,
        roomCode: code
    });
};


/* =========================================================
   START GAME
========================================================= */

window.startGame = function () {

    if (!isHost) {
        showMessage("Only the host can start.");
        return;
    }

    socket.emit("startGame");
};


/* =========================================================
   ROOM CREATED
========================================================= */

socket.on("roomCreated", data => {

    roomCode = data.roomCode;
    isHost = !!data.isHost;
    gameMode = data.gameMode;

    showScreen("lobbyScreen");

    const codeElement =
        $("roomCode");

    if (codeElement) {
        codeElement.textContent = roomCode;
    }

    updateHostUI();

    showMessage(`Room created: ${roomCode}`);
});


/* =========================================================
   ROOM JOINED
========================================================= */

socket.on("roomJoined", data => {

    roomCode = data.roomCode;
    isHost = !!data.isHost;
    gameMode = data.gameMode;

    showScreen("lobbyScreen");

    const codeElement =
        $("roomCode");

    if (codeElement) {
        codeElement.textContent = roomCode;
    }

    updateHostUI();
});


/* =========================================================
   PLAYERS
========================================================= */

socket.on("playersUpdated", data => {

    players =
        Array.isArray(data.players)
            ? data.players
            : [];

    renderPlayers();
});


function renderPlayers() {

    const container =
        $("playersList");

    if (!container) return;

    container.innerHTML = "";

    players.forEach(player => {

        const div =
            document.createElement("div");

        div.className = "player-item";

        const hostText =
            player.id === socket.id
                ? " (You)"
                : "";

        div.innerHTML = `
            <strong>${player.name}${hostText}</strong>
            <span>
                ${Number(player.balance || 0)}
            </span>
        `;

        container.appendChild(div);
    });
}


/* =========================================================
   HOST UI
========================================================= */

function updateHostUI() {

    const start =
        $("startGameButton");

    if (start) {
        start.style.display =
            isHost ? "block" : "none";
    }
}


/* =========================================================
   RANK SCREEN
========================================================= */

function buildRankScreen() {

    const category =
        categories[currentCategory];

    const title =
        $("categoryTitle");

    if (title) {
        title.textContent =
            `${category} (${currentCategory + 1}/16)`;
    }

    const counter =
        $("categoryCounter");

    if (counter) {
        counter.textContent =
            `${currentCategory + 1} / 16`;
    }

    const list =
        $("characterGrid");

    if (!list) return;

    list.innerHTML = "";

    const ranked =
        [...(rankings[category] || [])];

    const rankedSet =
        new Set(ranked);

    Object.keys(characters).forEach(key => {

        if (!rankedSet.has(key)) {
            ranked.push(key);
        }

    });

    ranked.forEach((key, index) => {

        const char =
            characters[key];

        if (!char) return;

        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "character-card";

        card.dataset.character =
            key;

        card.innerHTML = `
            <div class="rank-number">
                #${index + 1}
            </div>

            <img
                src="${char.image}"
                alt="${char.name}"
                onerror="this.style.display='none'"
            >

            <strong>
                ${char.name}
            </strong>
        `;

        card.onclick = () => {
            selectRankCharacter(key);
        };

        list.appendChild(card);
    });

    updateRankWaitingStatus();
}


/* =========================================================
   SELECT CHARACTER
========================================================= */

function selectRankCharacter(character) {

    if (!characters[character]) {
        showMessage("Invalid character.");
        return;
    }

    socket.emit("rankSelect", {
        categoryIndex: currentCategory,
        character
    });

    showMessage(
        `You selected ${characters[character].name}`
    );

    markMyRankSelection(character);
}


/* =========================================================
   MARK OWN SELECTION
========================================================= */

function markMyRankSelection(character) {

    document
        .querySelectorAll(".character-card")
        .forEach(card => {

            card.classList.remove("selected-by-me");

        });

    const selected =
        document.querySelector(
            `.character-card[data-character="${CSS.escape(character)}"]`
        );

    if (selected) {
        selected.classList.add("selected-by-me");
    }
}


/* =========================================================
   RANK SELECTION MADE
========================================================= */

socket.on("rankSelectionMade", data => {

    const status =
        $("selectionStatus");

    if (!status) return;

    const char =
        characters[data.character];

    status.textContent =
        `${data.playerName} selected ${
            char ? char.name : data.character
        }`;

    /*
     * IMPORTANT:
     * Do NOT mark another player's selected
     * character on our screen.
     *
     * Each player can choose independently.
     */

    updateRankWaitingStatus();
});


/* =========================================================
   WAITING STATUS
========================================================= */

function updateRankWaitingStatus() {

    const status =
        $("rankWaitingStatus");

    if (!status) return;

    status.textContent =
        "Waiting for all players to select...";
}


/* =========================================================
   RANK CATEGORY COMPLETE
========================================================= */

socket.on("rankCategoryComplete", data => {

    showMessage(
        `Category ${Number(data.categoryIndex) + 1}/16 completed.`
    );

});


/* =========================================================
   NEXT CATEGORY
========================================================= */

socket.on("rankNextCategory", data => {

    const next =
        Number(data.categoryIndex);

    if (!Number.isInteger(next)) {
        return;
    }

    currentCategory =
        Math.max(
            0,
            Math.min(
                next,
                categories.length - 1
            )
        );

    buildRankScreen();

    showMessage(
        `Category ${currentCategory + 1}/16: ${categories[currentCategory]}`
    );
});


/* =========================================================
   RANK START
========================================================= */

socket.on("rankGameStarted", data => {

    currentCategory =
        Number(data.categoryIndex) || 0;

    showScreen("rankScreen");

    buildRankScreen();
});


/* =========================================================
   RANK FINISHED
========================================================= */

socket.on("rankGameFinished", data => {

    showScreen("rankResultScreen");

    renderRankResults(data);
});


function renderRankResults(data) {

    const container =
        $("rankResults");

    if (!container) return;

    container.innerHTML = "";

    const results =
        Array.isArray(data.results)
            ? data.results
            : [];

    results.forEach(player => {

        const box =
            document.createElement("div");

        box.className =
            "final-player";

        let html = `
            <h2>${player.playerName}</h2>
            <div class="final-team">
        `;

        const selections =
            player.selections || {};

        categories.forEach(
            (category, index) => {

                const key =
                    selections[index];

                if (!key) return;

                const char =
                    characters[key];

                html += `
                    <div class="team-character">
                        ${
                            char
                                ? char.name
                                : key
                        }
                    </div>
                `;
            }
        );

        html += `
            </div>
        `;

        box.innerHTML = html;

        container.appendChild(box);
    });

    /*
     * AI / strongest team information
     */

    if (data.aiEvaluation) {

        const aiBox =
            document.createElement("div");

        aiBox.className =
            "ai-overall-result";

        aiBox.innerHTML = `
            <h2>🤖 AI OVERALL EVALUATION</h2>

            <p>
                ${
                    data.aiEvaluation.summary ||
                    "AI evaluation completed."
                }
            </p>

            ${
                data.aiEvaluation.bestTeam
                    ? `
                        <h3>
                            🏆 Strongest Team:
                            ${data.aiEvaluation.bestTeam}
                        </h3>
                    `
                    : ""
            }

            ${
                data.aiEvaluation.reason
                    ? `
                        <p>
                            <strong>Why:</strong>
                            ${data.aiEvaluation.reason}
                        </p>
                    `
                    : ""
            }
        `;

        container.appendChild(aiBox);
    }
}


/* =========================================================
   AUCTION STARTED
========================================================= */

socket.on("auctionStarted", data => {

    showScreen("auctionScreen");

    auctionGivenUp = false;

    if (data && data.settings) {

        updateAuctionSettings(
            data.settings
        );
    }
});


function updateAuctionSettings(settings) {

    const amount =
        $("bidAmount");

    if (amount) {
        amount.textContent =
            `Bid increment: ${settings.bidAmount}`;
    }
}


/* =========================================================
   AUCTION CHARACTER
========================================================= */

socket.on("auctionCharacter", data => {

    currentAuctionState = data;

    auctionGivenUp = false;

    showScreen("auctionScreen");

    renderAuctionCharacter();

    startLocalAuctionTimer(
        Number(data.timeLeft || data.bidTime || 10)
    );
});


/* =========================================================
   AUCTION UPDATE
========================================================= */

socket.on("auctionUpdated", data => {

    currentAuctionState = data;

    renderAuctionCharacter();

    const seconds =
        Number(data.timeLeft);

    if (Number.isFinite(seconds)) {
        startLocalAuctionTimer(seconds);
    }
});


/* =========================================================
   AUCTION TIMER UPDATE
========================================================= */

socket.on("auctionTimer", data => {

    if (!currentAuctionState) return;

    currentAuctionState.timeLeft =
        Number(data.timeLeft);

    updateAuctionTimer(
        Number(data.timeLeft)
    );
});


/* =========================================================
   LOCAL TIMER
========================================================= */

function startLocalAuctionTimer(seconds) {

    clearInterval(auctionTimer);

    seconds =
        Math.max(
            0,
            Math.ceil(Number(seconds) || 0)
        );

    auctionEndTime =
        Date.now() +
        seconds * 1000;

    updateAuctionTimer(seconds);

    auctionTimer =
        setInterval(() => {

            const remaining =
                Math.max(
                    0,
                    Math.ceil(
                        (auctionEndTime - Date.now()) /
                        1000
                    )
                );

            updateAuctionTimer(
                remaining
            );

            if (remaining <= 0) {
                clearInterval(auctionTimer);
                auctionTimer = null;
            }

        }, 200);
}


function updateAuctionTimer(seconds) {

    const timer =
        $("auctionTimer");

    if (!timer) return;

    timer.textContent =
        `${Math.max(0, seconds)}s`;

    if (seconds <= 3) {
        timer.classList.add("danger");
    } else {
        timer.classList.remove("danger");
    }
}


/* =========================================================
   RENDER AUCTION
========================================================= */

function renderAuctionCharacter() {

    const state =
        currentAuctionState;

    if (!state) return;

    const characterKey =
        state.character;

    const char =
        characters[characterKey];

    const nameElement =
        $("auctionCharacterName");

    if (nameElement) {
        nameElement.textContent =
            char
                ? char.name
                : characterKey || "Unknown";
    }

    const imageElement =
        $("auctionCharacterImage");

    if (imageElement) {

        if (char) {

            imageElement.src =
                char.image;

            imageElement.alt =
                char.name;

            imageElement.style.display =
                "block";

        } else {

            imageElement.style.display =
                "none";
        }
    }

    const currentBid =
        Number(state.currentBid || 0);

    const bidElement =
        $("currentBid");

    if (bidElement) {
        bidElement.textContent =
            `Current Bid: ${currentBid}`;
    }

    const bidderElement =
        $("highestBidder");

    if (bidderElement) {

        bidderElement.textContent =
            state.highestBidderName
                ? `Highest Bidder: ${state.highestBidderName}`
                : "No bids yet";
    }

    updateMoneyDisplay();

    updateBidButtons();
}


/* =========================================================
   MONEY DISPLAY
========================================================= */

function updateMoneyDisplay() {

    if (!currentAuctionState) return;

    const myPlayer =
        players.find(
            p => p.id === socket.id
        );

    let remaining =
        Number(
            currentAuctionState.myRemainingBalance
        );

    if (!Number.isFinite(remaining)) {

        remaining =
            Number(
                myPlayer?.balance || 0
            );
    }

    const spent =
        Number(
            currentAuctionState.mySpent ||
            0
        );

    const remainingElement =
        $("remainingMoney");

    if (remainingElement) {

        remainingElement.textContent =
            `Remaining: ${remaining}`;
    }

    const spentElement =
        $("spentMoney");

    if (spentElement) {

        spentElement.textContent =
            `Spent: ${spent}`;
    }

    const balanceElement =
        $("playerBalance");

    if (balanceElement) {

        balanceElement.textContent =
            `Balance: ${remaining}`;
    }
}


/* =========================================================
   BID BUTTON
========================================================= */

function updateBidButtons() {

    const bid =
        $("bidButton");

    const giveup =
        $("giveUpButton");

    const unsold =
        $("unsoldButton");

    if (bid) {

        bid.disabled =
            auctionGivenUp ||
            !currentAuctionState ||
            !currentAuctionState.active;

        bid.textContent =
            "BID";
    }

    if (giveup) {

        giveup.disabled =
            auctionGivenUp ||
            !currentAuctionState ||
            !currentAuctionState.active;

        giveup.textContent =
            "GIVE UP";
    }

    /*
     * Unsold is now effectively Give Up
     * while the auction is active.
     */

    if (unsold) {

        unsold.disabled =
            auctionGivenUp ||
            !currentAuctionState ||
            !currentAuctionState.active;

        unsold.textContent =
            "GIVE UP";
    }
}


/* =========================================================
   BID
========================================================= */

window.bid = function () {

    if (!currentAuctionState) {
        showMessage("Auction has not started.");
        return;
    }

    if (auctionGivenUp) {
        showMessage(
            "You already gave up on this character."
        );
        return;
    }

    socket.emit("auctionBid");
};


/*
 * Support different HTML button names.
 */

window.placeBid = window.bid;
window.auctionBid = window.bid;


/* =========================================================
   GIVE UP
========================================================= */

window.giveUp = function () {

    if (!currentAuctionState) {
        return;
    }

    if (auctionGivenUp) {
        return;
    }

    auctionGivenUp = true;

    socket.emit("auctionGiveUp");

    /*
     * Also support the old event if the server
     * has only auctionUnsold.
     */
    socket.emit("auctionUnsold");

    updateBidButtons();

    showMessage(
        "You gave up on this character."
    );
};


window.auctionGiveUp =
    window.giveUp;


/* =========================================================
   OLD UNSOLD BUTTON
========================================================= */

window.unsold = function () {
    window.giveUp();
};


/* =========================================================
   AUCTION SOLD
========================================================= */

socket.on("auctionSold", data => {

    clearInterval(auctionTimer);
    auctionTimer = null;

    currentAuctionState =
        data.state || currentAuctionState;

    const buyer =
        data.buyerName ||
        data.playerName ||
        data.highestBidderName ||
        "Unknown";

    const character =
        characters[data.character];

    const price =
        Number(
            data.price ||
            data.currentBid ||
            0
        );

    showMessage(
        `${character?.name || data.character} sold to ${buyer} for ${price}`
    );

    renderAuctionSale(data);
});


/* =========================================================
   AUCTION UNSOLD
========================================================= */

socket.on("auctionUnsoldResult", data => {

    clearInterval(auctionTimer);
    auctionTimer = null;

    const character =
        characters[data.character];

    showMessage(
        `${character?.name || data.character} is UNSOLD`
    );
});


/* =========================================================
   AUCTION CHARACTER FINISHED
========================================================= */

socket.on("auctionCharacterFinished", data => {

    if (!data) return;

    if (data.sold) {

        const char =
            characters[data.character];

        showMessage(
            `${char?.name || data.character} sold to ${
                data.buyerName || "Unknown"
            } for ${
                Number(data.price || 0)
            }`
        );

    } else {

        const char =
            characters[data.character];

        showMessage(
            `${char?.name || data.character} is UNSOLD`
        );
    }
});


/* =========================================================
   AUCTION SALE DISPLAY
========================================================= */

function renderAuctionSale(data) {

    const result =
        $("auctionSaleResult");

    if (!result) return;

    const char =
        characters[data.character];

    result.innerHTML = `
        <h2>
            ${char?.name || data.character}
        </h2>

        <p>
            ${
                data.sold
                    ? `Sold to <strong>${
                        data.buyerName || "Unknown"
                    }</strong>`
                    : "UNSOLD"
            }
        </p>

        ${
            data.sold
                ? `
                    <p>
                        Price:
                        <strong>
                            ${Number(data.price || 0)}
                        </strong>
                    </p>
                `
                : ""
        }
    `;
}


/* =========================================================
   PLAYERS BALANCE UPDATE
========================================================= */

socket.on("playersUpdated", data => {

    players =
        Array.isArray(data.players)
            ? data.players
            : [];

    renderPlayers();

    updateMoneyDisplay();
});


/* =========================================================
   AUCTION FINISHED
========================================================= */

socket.on("auctionFinished", data => {

    clearInterval(auctionTimer);
    auctionTimer = null;

    showScreen("auctionResultScreen");

    renderAuctionFinal(data);
});


function renderAuctionFinal(data) {

    const container =
        $("auctionResults");

    if (!container) return;

    container.innerHTML = "";

    const finalPlayers =
        Array.isArray(data.players)
            ? data.players
            : [];

    finalPlayers.forEach(player => {

        const box =
            document.createElement("div");

        box.className =
            "final-player";

        let html = `
            <h2>${player.name}</h2>

            <p>
                Remaining Money:
                <strong>
                    ${Number(player.balance || 0)}
                </strong>
            </p>

            <div class="final-team">
        `;

        const team =
            Array.isArray(player.team)
                ? player.team
                : [];

        team.forEach(characterKey => {

            const char =
                characters[characterKey];

            html += `
                <div class="team-character">

                    ${
                        char
                            ? `
                                <img
                                    src="${char.image}"
                                    alt="${char.name}"
                                >
                                <span>
                                    ${char.name}
                                </span>
                              `
                            : `
                                <span>
                                    ${characterKey}
                                </span>
                              `
                    }

                </div>
            `;
        });

        html += `
            </div>
        `;

        box.innerHTML =
            html;

        container.appendChild(box);
    });


    /*
     * AI strongest team recommendation
     */

    if (data.aiEvaluation) {

        const ai =
            document.createElement("div");

        ai.className =
            "ai-overall-result";

        ai.innerHTML = `
            <h2>🤖 AI TEAM ANALYSIS</h2>

            ${
                data.aiEvaluation.bestTeam
                    ? `
                        <h3>
                            🏆 Best Team:
                            ${data.aiEvaluation.bestTeam}
                        </h3>
                    `
                    : ""
            }

            ${
                data.aiEvaluation.summary
                    ? `
                        <p>
                            ${data.aiEvaluation.summary}
                        </p>
                    `
                    : ""
            }

            ${
                data.aiEvaluation.reason
                    ? `
                        <p>
                            <strong>Why:</strong>
                            ${data.aiEvaluation.reason}
                        </p>
                    `
                    : ""
            }

            ${
                data.aiEvaluation.suggestions
                    ? `
                        <p>
                            <strong>Suggestion:</strong>
                            ${data.aiEvaluation.suggestions}
                        </p>
                    `
                    : ""
            }
        `;

        container.appendChild(ai);
    }
}


/* =========================================================
   GENERIC ERROR
========================================================= */

socket.on("errorMessage", message => {

    showMessage(
        message || "Something went wrong."
    );

});


/* =========================================================
   HOST CHANGED
========================================================= */

socket.on("hostChanged", data => {

    isHost =
        data.host === socket.id;

    updateHostUI();

    if (isHost) {
        showMessage(
            "You are now the host."
        );
    }
});


/* =========================================================
   CONNECTION
========================================================= */

socket.on("connect", () => {

    console.log(
        "Connected to server:",
        socket.id
    );

});


socket.on("disconnect", () => {

    clearInterval(auctionTimer);
    auctionTimer = null;

    showMessage(
        "Disconnected from server."
    );

});


/* =========================================================
   INITIAL UI
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateHostUI();

    }
);
