/* =========================================================
   NARUTO CHARACTER RANK + AUCTION
   COMPLETE GAME.JS
   Supports 2-6 players
========================================================= */

const socket = io();

/* =========================================================
   CHARACTER DATA
========================================================= */

const characters = {
    Naruto: { name: "Naruto", image: "assets/characters/images%20(2).jpeg" },
    Sasuke: { name: "Sasuke", image: "assets/characters/images%20(3).jpeg" },
    Itachi: { name: "Itachi", image: "assets/characters/images%20(4).jpeg" },
    Madara: { name: "Madara", image: "assets/characters/images%20(5).jpeg" },

    Kakashi: {
        name: "Kakashi",
        image: "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg"
    },

    Minato: { name: "Minato", image: "assets/characters/images%20(6).jpeg" },
    Tobirama: { name: "Tobirama", image: "assets/characters/images%20(7).jpeg" },
    Hashirama: { name: "Hashirama", image: "assets/characters/images%20(8).jpeg" },
    Jiraiya: { name: "Jiraiya", image: "assets/characters/images%20(9).jpeg" },
    Hiruzen: { name: "Hiruzen", image: "assets/characters/images%20(10).jpeg" },
    Orochimaru: { name: "Orochimaru", image: "assets/characters/images%20(11).jpeg" },

    /* TAIJUTSU */
    Guy: {
        name: "Might Guy",
        image: "assets/characters/images%20(12).jpeg"
    },

    Lee: {
        name: "Rock Lee",
        image: "assets/characters/images%20(13).jpeg"
    },

    Duy: {
        name: "Might Duy",
        image: "assets/characters/download%20(33).jpeg"
    },

    Shikamaru: { name: "Shikamaru", image: "assets/characters/images%20(14).jpeg" },
    Neji: { name: "Neji", image: "assets/characters/images%20(15).jpeg" },
    Gaara: { name: "Gaara", image: "assets/characters/images%20(16).jpeg" },
    Kisame: { name: "Kisame", image: "assets/characters/images%20(17).jpeg" },
    Sakura: { name: "Sakura", image: "assets/characters/images%20(18).jpeg" },
    Nagato: { name: "Nagato / Pain", image: "assets/characters/images%20(19).jpeg" },
    Obito: { name: "Obito", image: "assets/characters/images%20(20).jpeg" },

    Tsunade: { name: "Tsunade", image: "assets/characters/download.jpeg" },
    KillerB: { name: "Killer B", image: "assets/characters/download%20(1).jpeg" },
    Kabuto: { name: "Kabuto", image: "assets/characters/download%20(2).jpeg" },
    Shisui: { name: "Shisui", image: "assets/characters/download%20(3).jpeg" },
    Sakumo: { name: "Sakumo Hatake", image: "assets/characters/download%20(4).jpeg" },
    Hanzo: { name: "Hanzo", image: "assets/characters/download%20(5).jpeg" },
    ThirdRaikage: { name: "Third Raikage", image: "assets/characters/download%20(6).jpeg" },
    FourthRaikage: { name: "Fourth Raikage", image: "assets/characters/download%20(7).jpeg" },
    Onoki: { name: "Onoki", image: "assets/characters/download%20(8).jpeg" },
    Mei: { name: "Mei Terumi", image: "assets/characters/download%20(9).jpeg" },
    Sasori: { name: "Sasori", image: "assets/characters/download%20(10).jpeg" },
    Deidara: { name: "Deidara", image: "assets/characters/download%20(11).jpeg" },
    Mu: { name: "Mū", image: "assets/characters/download%20(12).jpeg" },
    Gengetsu: { name: "Gengetsu Hōzuki", image: "assets/characters/download%20(13).jpeg" },
    Danzo: { name: "Danzō", image: "assets/characters/download%20(14).jpeg" },
    Kakuzu: { name: "Kakuzu", image: "assets/characters/download%20(15).jpeg" },
    Hidan: { name: "Hidan", image: "assets/characters/download%20(16).jpeg" },
    Konan: { name: "Konan", image: "assets/characters/download%20(17).jpeg" },
    Zabuza: { name: "Zabuza", image: "assets/characters/download%20(18).jpeg" },
    Kimimaro: { name: "Kimimaro", image: "assets/characters/download%20(19).jpeg" },
    Suigetsu: { name: "Suigetsu", image: "assets/characters/download%20(20).jpeg" },
    Jugo: { name: "Jūgo", image: "assets/characters/download%20(21).jpeg" },
    Karin: { name: "Karin", image: "assets/characters/download%20(22).jpeg" },
    Yahiko: { name: "Yahiko", image: "assets/characters/download%20(23).jpeg" },
    Zetsu: { name: "Zetsu", image: "assets/characters/download%20(24).jpeg" },
    Hinata: { name: "Hinata", image: "assets/characters/download%20(25).jpeg" },
    Ino: { name: "Ino", image: "assets/characters/download%20(26).jpeg" },
    Choji: { name: "Choji", image: "assets/characters/download%20(27).jpeg" },
    Kiba: { name: "Kiba", image: "assets/characters/download%20(28).jpeg" },
    Shino: { name: "Shino", image: "assets/characters/download%20(29).jpeg" },
    Tenten: { name: "Tenten", image: "assets/characters/download%20(30).jpeg" },
    Iruka: { name: "Iruka", image: "assets/characters/download%20(31).jpeg" },
    Anko: { name: "Anko", image: "assets/characters/download%20(32).jpeg" },

    Shizune: { name: "Shizune", image: "assets/characters/download%20(34).jpeg" },
    Asuma: { name: "Asuma", image: "assets/characters/download%20(35).jpeg" },
    Kurenai: { name: "Kurenai", image: "assets/characters/download%20(36).jpeg" },
    Yamato: { name: "Yamato", image: "assets/characters/download%20(37).jpeg" },
    Sai: { name: "Sai", image: "assets/characters/download%20(38).jpeg" },
    Konohamaru: { name: "Konohamaru", image: "assets/characters/download%20(39).jpeg" },
    Chiyo: { name: "Chiyo", image: "assets/characters/images%20(21).jpeg" },
    Rasa: { name: "Rasa", image: "assets/characters/images%20(22).jpeg" },
    Darui: { name: "Darui", image: "assets/characters/images%20(24).jpeg" },
    Chojuro: { name: "Chōjūrō", image: "assets/characters/images%20(25).jpeg" },

    Mifune: { name: "Mifune", image: "assets/characters/download%20(41).jpeg" },
    Fu: { name: "Fū", image: "assets/characters/download%20(42).jpeg" },
    Utakata: { name: "Utakata", image: "assets/characters/download%20(43).jpeg" },
    Roshi: { name: "Rōshi", image: "assets/characters/download%20(44).jpeg" }
};


/* =========================================================
   CATEGORIES
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
   RANKINGS
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

let players = [];

let currentCategory = 0;
let mySelections = {};
let selectedThisCategory = false;

let auctionState = null;
let auctionGivenUp = false;
let auctionEndTime = 0;
let auctionTimerInterval = null;


/* =========================================================
   DOM HELPER
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   SHOW SCREEN
========================================================= */

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

    if (!message) {
        return;
    }

    message.textContent = text;
    message.style.display = "block";

    clearTimeout(showMessage.timer);

    showMessage.timer = setTimeout(() => {

        message.style.display = "none";

    }, 3000);
}


/* =========================================================
   CREATE ROOM
========================================================= */

window.createRoom = function () {

    const input = $("playerName");

    const name =
        input
            ? input.value.trim()
            : "";

    if (!name) {

        showMessage("Enter your name.");

        return;
    }

    myName = name;

    const mode =
        $("gameMode")?.value ||
        "rank";

    let maxPlayers =
        Number(
            $("maxPlayers")?.value
        );

    if (
        !Number.isFinite(maxPlayers) ||
        maxPlayers < 2
    ) {
        maxPlayers = 6;
    }

    if (maxPlayers > 6) {
        maxPlayers = 6;
    }

    let teamSize =
        Number(
            $("teamSize")?.value
        );

    if (
        !Number.isFinite(teamSize) ||
        teamSize < 1
    ) {
        teamSize = 5;
    }

    let startingBalance =
        Number(
            $("startingBalance")?.value
        );

    if (
        !Number.isFinite(startingBalance) ||
        startingBalance < 0
    ) {
        startingBalance = 1000;
    }

    socket.emit(
        "createRoom",
        {
            name,
            gameMode: mode,
            maxPlayers,
            teamSize,
            startingBalance,
            bidAmount: 50,
            bidTime: 10
        }
    );
};


/* =========================================================
   JOIN ROOM
========================================================= */

window.joinRoom = function () {

    const name =
        $("joinPlayerName")
            ?.value
            .trim();

    const code =
        $("joinRoomCode")
            ?.value
            .trim()
            .toUpperCase();

    if (!name || !code) {

        showMessage(
            "Enter your name and room code."
        );

        return;
    }

    myName = name;

    socket.emit(
        "joinRoom",
        {
            name,
            roomCode: code
        }
    );
};


/* =========================================================
   START GAME
========================================================= */

window.startGame = function () {

    if (!isHost) {

        showMessage(
            "Only the host can start the game."
        );

        return;
    }

    if (players.length < 2) {

        showMessage(
            "At least 2 players are required."
        );

        return;
    }

    socket.emit("startGame");
};


/* =========================================================
   ROOM CREATED
========================================================= */

socket.on(
    "roomCreated",
    data => {

        roomCode =
            data.roomCode || "";

        isHost =
            !!data.isHost;

        gameMode =
            data.gameMode || "rank";

        showScreen(
            "lobbyScreen"
        );

        const code =
            $("roomCode");

        if (code) {
            code.textContent =
                roomCode;
        }

        updateHostUI();

        showMessage(
            `Room created: ${roomCode}`
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
            data.roomCode || "";

        isHost =
            !!data.isHost;

        gameMode =
            data.gameMode || "rank";

        showScreen(
            "lobbyScreen"
        );

        const code =
            $("roomCode");

        if (code) {
            code.textContent =
                roomCode;
        }

        updateHostUI();

        showMessage(
            `Joined room: ${roomCode}`
        );
    }
);


/* =========================================================
   ERROR
========================================================= */

socket.on(
    "errorMessage",
    message => {

        showMessage(
            typeof message === "string"
                ? message
                : "Something went wrong."
        );
    }
);


/* =========================================================
   HOST CHANGED
========================================================= */

socket.on(
    "hostChanged",
    data => {

        isHost =
            data.host === socket.id;

        updateHostUI();

        if (isHost) {

            showMessage(
                "You are now the host."
            );
        }
    }
);


/* =========================================================
   HOST UI
========================================================= */

function updateHostUI() {

    const button =
        $("startGameButton");

    if (!button) {
        return;
    }

    button.style.display =
        isHost
            ? "block"
            : "none";
}


/* =========================================================
   PLAYERS UPDATED
========================================================= */

socket.on(
    "playersUpdated",
    data => {

        players =
            Array.isArray(
                data.players
            )
                ? data.players
                : [];

        renderPlayers();

        updateRankWaitingStatus();

        updateAuctionPlayers();
    }
);


/* =========================================================
   RENDER PLAYERS
========================================================= */

function renderPlayers() {

    const container =
        $("playersList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    players.forEach(
        player => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "player-item";

            const you =
                player.id === socket.id
                    ? " (You)"
                    : "";

            div.innerHTML = `
                <strong>
                    ${escapeHTML(player.name)}
                    ${you}
                </strong>

                <span>
                    ₹${Number(
                        player.balance || 0
                    ).toLocaleString()}
                </span>
            `;

            container.appendChild(
                div
            );
        }
    );
}


/* =========================================================
   RANK GAME STARTED
========================================================= */

socket.on(
    "rankGameStarted",
    data => {

        currentCategory =
            Number(
                data.categoryIndex
            ) || 0;

        mySelections = {};

        selectedThisCategory =
            false;

        showScreen(
            "rankScreen"
        );

        buildRankScreen();

        showMessage(
            `Category 1/16: ${categories[0]}`
        );
    }
);


/* =========================================================
   BUILD RANK SCREEN
========================================================= */

function buildRankScreen() {

    const category =
        categories[currentCategory];

    if (!category) {
        return;
    }

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
            `Category ${currentCategory + 1} / 16`;
    }

    const current =
        $("currentCategory");

    if (current) {

        current.textContent =
            category;
    }

    const grid =
        $("characterGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    let ranked =
        Array.isArray(
            rankings[category]
        )
            ? [...rankings[category]]
            : [];

    const rankedSet =
        new Set(ranked);

    Object.keys(
        characters
    ).forEach(key => {

        if (!rankedSet.has(key)) {

            ranked.push(key);
        }
    });

    ranked.forEach(
        (key, index) => {

            const char =
                characters[key];

            if (!char) {
                return;
            }

            const card =
                document.createElement(
                    "button"
                );

            card.type =
                "button";

            card.className =
                "character-card";

            card.dataset.character =
                key;

            const selected =
                mySelections[
                    currentCategory
                ] === key;

            if (selected) {

                card.classList.add(
                    "selected-by-me"
                );
            }

            card.innerHTML = `
                <div class="rank-number">
                    #${index + 1}
                </div>

                <img
                    src="${char.image}"
                    alt="${escapeHTML(char.name)}"
                    onerror="
                        this.style.display='none'
                    "
                >

                <strong>
                    ${escapeHTML(char.name)}
                </strong>
            `;

            card.addEventListener(
                "click",
                () => {

                    if (
                        selectedThisCategory
                    ) {

                        showMessage(
                            "You already selected this category."
                        );

                        return;
                    }

                    selectRankCharacter(
                        key
                    );
                }
            );

            grid.appendChild(
                card
            );
        }
    );

    if (selectedThisCategory) {

        markMyRankSelection(
            mySelections[
                currentCategory
            ]
        );
    }

    updateRankWaitingStatus();
}


/* =========================================================
   SELECT RANK CHARACTER
========================================================= */

function selectRankCharacter(
    character
) {

    if (!characters[character]) {

        showMessage(
            "Invalid character."
        );

        return;
    }

    if (
        mySelections[
            currentCategory
        ] !== undefined
    ) {
        return;
    }

    mySelections[
        currentCategory
    ] = character;

    selectedThisCategory =
        true;

    markMyRankSelection(
        character
    );

    socket.emit(
        "rankSelect",
        {
            categoryIndex:
                currentCategory,

            character
        }
    );

    showMessage(
        `You selected ${characters[character].name}`
    );

    updateRankWaitingStatus();
}


/* =========================================================
   MARK RANK SELECTION
========================================================= */

function markMyRankSelection(
    character
) {

    document
        .querySelectorAll(
            "#characterGrid .character-card"
        )
        .forEach(card => {

            card.disabled =
                true;

            card.classList.remove(
                "selected-by-me"
            );
        });

    const selected =
        document.querySelector(
            `#characterGrid .character-card[data-character="${CSS.escape(character)}"]`
        );

    if (selected) {

        selected.classList.add(
            "selected-by-me"
        );
    }
}


/* =========================================================
   RANK SELECTION MADE
========================================================= */

socket.on(
    "rankSelectionMade",
    data => {

        if (!data) {
            return;
        }

        /*
         * IMPORTANT:
         * Do NOT change our own selected card
         * because of another player's selection.
         */

        if (
            data.playerId ===
            socket.id
        ) {
            return;
        }

        updateRankWaitingStatus();
    }
);


/* =========================================================
   MY RANK STATUS
========================================================= */

socket.on(
    "myRankStatus",
    data => {

        if (!data) {
            return;
        }

        if (
            Number(data.categoryIndex) !==
            currentCategory
        ) {
            return;
        }

        selectedThisCategory =
            !!data.selected;

        if (
            data.selected &&
            data.character
        ) {

            mySelections[
                currentCategory
            ] = data.character;

            markMyRankSelection(
                data.character
            );
        }

        updateRankWaitingStatus();
    }
);


/* =========================================================
   RANK WAITING
========================================================= */

socket.on(
    "rankWaiting",
    data => {

        updateRankWaitingStatus(
            data
        );
    }
);


/* =========================================================
   UPDATE RANK WAITING
========================================================= */

function updateRankWaitingStatus(
    serverData = null
) {

    const status =
        $("rankWaiting");

    if (!status) {
        return;
    }

    if (
        gameMode !== "rank"
    ) {
        return;
    }

    const total =
        players.length;

    if (total < 2) {

        status.textContent =
            "Waiting for players...";

        return;
    }

    let selectedCount = 0;

    if (
        serverData &&
        Number.isFinite(
            Number(serverData.selectedCount)
        )
    ) {

        selectedCount =
            Number(
                serverData.selectedCount
            );

    } else {

        /*
         * The server determines the real
         * completion state. Locally count
         * ourselves as selected.
         */

        selectedCount =
            selectedThisCategory
                ? 1
                : 0;
    }

    if (selectedThisCategory) {

        status.textContent =
            "✓ You selected. Waiting for other players...";

    } else {

        status.textContent =
            "Select one character.";
    }

    if (
        selectedCount >= total
    ) {

        status.textContent =
            "All players selected. Calculating...";
    }
}


/* =========================================================
   NEXT RANK CATEGORY
========================================================= */

socket.on(
    "rankCategoryChanged",
    data => {

        const next =
            Number(
                data.categoryIndex
            );

        if (
            !Number.isInteger(next)
        ) {
            return;
        }

        currentCategory =
            next;

        selectedThisCategory =
            false;

        buildRankScreen();

        showMessage(
            `${categories[currentCategory]} (${currentCategory + 1}/16)`
        );
    }
);


/* =========================================================
   RANK FINISHED
========================================================= */

socket.on(
    "rankGameFinished",
    data => {

        const grid =
            $("characterGrid");

        const title =
            $("categoryTitle");

        const counter =
            $("categoryCounter");

        if (title) {

            title.textContent =
                "🏆 CHARACTER RANK COMPLETE";
        }

        if (counter) {

            counter.textContent =
                "16 / 16 Categories Completed";
        }

        if (grid) {

            grid.innerHTML = `
                <div class="sold">
                    🎉 ALL 16 CATEGORIES COMPLETED!
                    <br><br>
                    The Character Rank game is complete.
                </div>
            `;
        }
    }
);


/* =========================================================
   AUCTION GAME STARTED
========================================================= */

socket.on(
    "auctionStarted",
    data => {

        auctionGivenUp =
            false;

        showScreen(
            "auctionScreen"
        );

        ensureAuctionButtons();

        showMessage(
            "Auction started!"
        );
    }
);


/* =========================================================
   AUCTION CHARACTER
========================================================= */

socket.on(
    "auctionCharacter",
    data => {

        updateAuctionState(
            data
        );
    }
);


/* =========================================================
   AUCTION NEW CHARACTER
========================================================= */

socket.on(
    "auctionNewCharacter",
    data => {

        if (!data) {
            return;
        }

        /*
         * Some server versions send only
         * auctionNewCharacter.
         *
         * Build a state from it so the
         * character name NEVER stays blank.
         */

        if (!auctionState) {

            auctionState = {};
        }

        auctionState.character =
            data.character;

        auctionState.characterNumber =
            data.characterNumber;

        auctionState.totalCharacters =
            data.totalCharacters;

        auctionState.active =
            true;

        auctionGivenUp =
            false;

        showScreen(
            "auctionScreen"
        );

        ensureAuctionButtons();

        renderAuction();
    }
);


/* =========================================================
   AUCTION READY
========================================================= */

socket.on(
    "auctionReady",
    data => {

        updateAuctionState(
            data
        );

        auctionGivenUp =
            false;

        showScreen(
            "auctionScreen"
        );

        ensureAuctionButtons();

        renderAuction();
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

    auctionGivenUp =
        false;

    if (
        Number.isFinite(
            Number(data.remainingTime)
        )
    ) {

        auctionEndTime =
            Date.now() +
            Number(
                data.remainingTime
            ) * 1000;
    }

    showScreen(
        "auctionScreen"
    );

    ensureAuctionButtons();

    renderAuction();

    startAuctionTimer();
}


/* =========================================================
   AUCTION TIMER EVENT
========================================================= */

socket.on(
    "auctionTimer",
    data => {

        if (!data) {
            return;
        }

        const seconds =
            Math.max(
                0,
                Number(
                    data.seconds
                ) || 0
            );

        auctionEndTime =
            Date.now() +
            seconds * 1000;

        updateAuctionTimerText(
            seconds
        );
    }
);


/* =========================================================
   START CLIENT TIMER
========================================================= */

function startAuctionTimer() {

    stopAuctionTimer();

    if (!auctionState) {
        return;
    }

    if (
        !auctionState.active
    ) {
        return;
    }

    auctionTimerInterval =
        setInterval(
            () => {

                const seconds =
                    Math.max(
                        0,
                        Math.ceil(
                            (
                                auctionEndTime -
                                Date.now()
                            ) / 1000
                        )
                    );

                updateAuctionTimerText(
                    seconds
                );

                if (
                    seconds <= 0
                ) {

                    stopAuctionTimer();
                }

            },
            100
        );
}


/* =========================================================
   STOP TIMER
========================================================= */

function stopAuctionTimer() {

    if (
        auctionTimerInterval
    ) {

        clearInterval(
            auctionTimerInterval
        );

        auctionTimerInterval =
            null;
    }
}


/* =========================================================
   TIMER TEXT
========================================================= */

function updateAuctionTimerText(
    seconds
) {

    const possibleIds = [
        "auctionTimer",
        "timer",
        "bidTimer",
        "auctionTime"
    ];

    let element = null;

    for (
        const id of possibleIds
    ) {

        const found = $(id);

        if (found) {

            element = found;

            break;
        }
    }

    if (!element) {
        return;
    }

    element.textContent =
        `${seconds}s`;
}


/* =========================================================
   ENSURE AUCTION BUTTONS
========================================================= */

function ensureAuctionButtons() {

    /*
     * Supports common IDs.
     *
     * If your index already has these buttons,
     * this simply attaches the handlers.
     */

    const bidIds = [
        "bidButton",
        "bidBtn",
        "auctionBidButton"
    ];

    const giveUpIds = [
        "giveUpButton",
        "giveUpBtn",
        "auctionGiveUpButton"
    ];

    bidIds.forEach(
        id => {

            const button = $(id);

            if (!button) {
                return;
            }

            if (
                button.dataset.auctionBound ===
                "true"
            ) {
                return;
            }

            button.dataset.auctionBound =
                "true";

            button.type =
                "button";

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    placeBid();
                }
            );
        }
    );

    giveUpIds.forEach(
        id => {

            const button = $(id);

            if (!button) {
                return;
            }

            if (
                button.dataset.auctionBound ===
                "true"
            ) {
                return;
            }

            button.dataset.auctionBound =
                "true";

            button.type =
                "button";

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    giveUpAuction();
                }
            );
        }
    );
}


/* =========================================================
   BID
========================================================= */

function placeBid() {

    if (!auctionState) {

        showMessage(
            "Auction is not ready."
        );

        return;
    }

    if (
        auctionState.active === false
    ) {

        showMessage(
            "Auction has ended."
        );

        return;
    }

    if (auctionGivenUp) {

        showMessage(
            "You already gave up on this character."
        );

        return;
    }

    /*
     * Send only the event.
     *
     * The SERVER calculates the real bid.
     */

    socket.emit(
        "bid"
    );
}


/* =========================================================
   GLOBAL BID FUNCTION
========================================================= */

window.placeBid =
    placeBid;

window.bid =
    placeBid;

window.bidCharacter =
    placeBid;


/* =========================================================
   GIVE UP
========================================================= */

function giveUpAuction() {

    if (!auctionState) {

        showMessage(
            "Auction is not ready."
        );

        return;
    }

    if (
        auctionState.active === false
    ) {

        return;
    }

    if (auctionGivenUp) {

        showMessage(
            "You already gave up."
        );

        return;
    }

    auctionGivenUp =
        true;

    socket.emit(
        "giveUp"
    );

    renderAuction();

    showMessage(
        "You gave up on this character."
    );
}


/* =========================================================
   GLOBAL GIVE UP
========================================================= */

window.giveUpAuction =
    giveUpAuction;

window.giveUp =
    giveUpAuction;


/* =========================================================
   BID MADE
========================================================= */

socket.on(
    "auctionBidMade",
    data => {

        if (!data) {
            return;
        }

        if (!auctionState) {
            auctionState = {};
        }

        auctionState.character =
            data.character ||
            auctionState.character;

        auctionState.currentBid =
            Number(data.bid) || 0;

        auctionState.highestBidder =
            data.playerId;

        auctionState.highestBidderName =
            data.playerName ||
            "";

        auctionState.active =
            true;

        renderAuction();

        if (
            data.playerId ===
            socket.id
        ) {

            showMessage(
                `You bid ₹${Number(
                    data.bid
                ).toLocaleString()}`
            );

        } else {

            showMessage(
                `${data.playerName} bid ₹${Number(
                    data.bid
                ).toLocaleString()}`
            );
        }
    }
);


/* =========================================================
   AUCTION UPDATED
========================================================= */

socket.on(
    "auctionUpdated",
    data => {

        updateAuctionState(
            data
        );
    }
);


/* =========================================================
   MONEY UPDATED
========================================================= */

socket.on(
    "auctionMoneyUpdated",
    data => {

        if (!data) {
            return;
        }

        /*
         * Save money data in auction state.
         */

        if (!auctionState) {

            auctionState = {};
        }

        auctionState.balance =
            Number(
                data.balance
            ) || 0;

        auctionState.spent =
            Number(
                data.spent
            ) || 0;

        auctionState.currentBid =
            Number(
                data.currentBid
            ) || 0;

        auctionState.nextBid =
            Number(
                data.nextBid
            ) || 0;

        auctionState.canBid =
            !!data.canBid;

        if (data.gaveUp) {

            auctionGivenUp =
                true;
        }

        renderAuction();
    }
);


/* =========================================================
   PLAYER GAVE UP
========================================================= */

socket.on(
    "auctionPlayerGaveUp",
    data => {

        if (!data) {
            return;
        }

        if (
            data.playerId ===
            socket.id
        ) {

            auctionGivenUp =
                true;

            showMessage(
                "You gave up on this character."
            );

        } else {

            showMessage(
                `${data.playerName} gave up.`
            );
        }

        renderAuction();
    }
);


/* =========================================================
   AUCTION SOLD
========================================================= */

socket.on(
    "auctionSold",
    data => {

        if (!data) {
            return;
        }

        stopAuctionTimer();

        const char =
            characters[
                data.character
            ];

        const characterName =
            char
                ? char.name
                : data.character;

        if (
            data.winnerId ===
            socket.id
        ) {

            showMessage(
                `🎉 You won ${characterName} for ₹${Number(
                    data.price
                ).toLocaleString()}`
            );

        } else {

            showMessage(
                `🔨 ${data.winnerName} won ${characterName} for ₹${Number(
                    data.price
                ).toLocaleString()}`
            );
        }

        /*
         * Keep the state visible briefly.
         */

        if (!auctionState) {
            auctionState = {};
        }

        auctionState.active =
            false;

        renderAuctionResult(
            data,
            characterName
        );
    }
);


/* =========================================================
   AUCTION UNSOLD
========================================================= */

socket.on(
    "auctionUnsold",
    data => {

        stopAuctionTimer();

        const char =
            characters[
                data?.character
            ];

        const name =
            char
                ? char.name
                : (
                    data?.character ||
                    "Character"
                );

        showMessage(
            `${name} went unsold.`
        );

        if (!auctionState) {
            auctionState = {};
        }

        auctionState.active =
            false;

        renderAuctionUnsold(
            name
        );
    }
);


/* =========================================================
   AUCTION FINISHED
========================================================= */

socket.on(
    "auctionFinished",
    data => {

        stopAuctionTimer();

        showMessage(
            "🏆 Auction finished!"
        );

        renderAuctionFinished(
            data
        );
    }
);


/* =========================================================
   RENDER AUCTION
========================================================= */

function renderAuction() {

    if (!auctionState) {
        return;
    }

    /*
     * CHARACTER NAME
     */

    const characterKey =
        auctionState.character;

    const char =
        characters[
            characterKey
        ];

    const characterName =
        char
            ? char.name
            : (
                characterKey ||
                "Waiting for character..."
            );

    /*
     * Common character name IDs.
     */

    [
        "auctionCharacterName",
        "auctionCharacter",
        "characterName",
        "auctionName"
    ].forEach(
        id => {

            const element = $(id);

            if (!element) {
                return;
            }

            if (
                element.tagName ===
                "INPUT"
            ) {

                element.value =
                    characterName;

            } else {

                element.textContent =
                    characterName;
            }
        }
    );


    /*
     * CHARACTER IMAGE
     */

    const imageIds = [
        "auctionCharacterImage",
        "auctionImage",
        "characterImage"
    ];

    let imageElement = null;

    for (
        const id of imageIds
    ) {

        const element = $(id);

        if (element) {

            imageElement =
                element;

            break;
        }
    }

    if (
        imageElement &&
        char
    ) {

        imageElement.src =
            char.image;

        imageElement.alt =
            characterName;

        imageElement.style.display =
            "block";
    }


    /*
     * CURRENT BID
     */

    const bid =
        Number(
            auctionState.currentBid
        ) || 0;

    [
        "currentBid",
        "auctionCurrentBid",
        "bidAmount"
    ].forEach(
        id => {

            const element = $(id);

            if (!element) {
                return;
            }

            element.textContent =
                `₹${bid.toLocaleString()}`;
        }
    );


    /*
     * HIGHEST BIDDER
     */

    const highestName =
        auctionState.highestBidderName ||
        "No bids yet";

    [
        "highestBidder",
        "auctionHighestBidder",
        "highestBidderName"
    ].forEach(
        id => {

            const element = $(id);

            if (!element) {
                return;
            }

            element.textContent =
                highestName;
        }
    );


    /*
     * NEXT BID
     */

    const nextBid =
        Number(
            auctionState.nextBid
        ) ||
        (
            bid +
            Number(
                auctionState.bidAmount
            || 50)
        );

    [
        "nextBid",
        "auctionNextBid"
    ].forEach(
        id => {

            const element = $(id);

            if (!element) {
                return;
            }

            element.textContent =
                `₹${nextBid.toLocaleString()}`;
        }
    );


    /*
     * YOUR BALANCE
     */

    const balance =
        Number(
            auctionState.balance
        );

    if (
        Number.isFinite(balance)
    ) {

        [
            "auctionBalance",
            "myBalance",
            "playerBalance",
            "balance"
        ].forEach(
            id => {

                const element =
                    $(id);

                if (!element) {
                    return;
                }

                element.textContent =
                    `₹${balance.toLocaleString()}`;
            }
        );
    }


    /*
     * YOUR SPENT
     */

    const spent =
        Number(
            auctionState.spent
        );

    if (
        Number.isFinite(spent)
    ) {

        [
            "auctionSpent",
            "mySpent",
            "spent"
        ].forEach(
            id => {

                const element =
                    $(id);

                if (!element) {
                    return;
                }

                element.textContent =
                    `₹${spent.toLocaleString()}`;
            }
        );
    }


    /*
     * CHARACTER COUNTER
     */

    if (
        auctionState.characterNumber
    ) {

        const numberText =
            `${auctionState.characterNumber} / ${
                auctionState.totalCharacters || "?"
            }`;

        [
            "auctionCharacterCounter",
            "auctionCounter"
        ].forEach(
            id => {

                const element = $(id);

                if (element) {

                    element.textContent =
                        numberText;
                }
            }
        );
    }


    /*
     * BUTTON STATES
     */

    const bidButtons = [
        "bidButton",
        "bidBtn",
        "auctionBidButton"
    ];

    const giveButtons = [
        "giveUpButton",
        "giveUpBtn",
        "auctionGiveUpButton"
    ];

    const canBid =
        auctionState.canBid !== undefined
            ? auctionState.canBid
            : (
                auctionState.active &&
                !auctionGivenUp
            );

    bidButtons.forEach(
        id => {

            const button =
                $(id);

            if (!button) {
                return;
            }

            button.disabled =
                !canBid;

            button.textContent =
                canBid
                    ? `BID ₹${nextBid.toLocaleString()}`
                    : (
                        auctionGivenUp
                            ? "GAVE UP"
                            : "BID"
                    );
        }
    );

    giveButtons.forEach(
        id => {

            const button =
                $(id);

            if (!button) {
                return;
            }

            button.disabled =
                !auctionState.active ||
                auctionGivenUp;

            button.textContent =
                auctionGivenUp
                    ? "GAVE UP"
                    : "GIVE UP";
        }
    );

    updateAuctionPlayers();
}


/* =========================================================
   AUCTION RESULT
========================================================= */

function renderAuctionResult(
    data,
    characterName
) {

    const title =
        $("auctionCharacterName");

    if (title) {

        title.textContent =
            `🔨 ${characterName}`;
    }

    const result =
        $("auctionResult");

    if (result) {

        result.textContent =
            `${data.winnerName} won for ₹${Number(
                data.price
            ).toLocaleString()}`;
    }
}


/* =========================================================
   UNSOLD RESULT
========================================================= */

function renderAuctionUnsold(
    characterName
) {

    const result =
        $("auctionResult");

    if (result) {

        result.textContent =
            `${characterName} — UNSOLD`;
    }
}


/* =========================================================
   AUCTION FINISHED SCREEN
========================================================= */

function renderAuctionFinished(
    data
) {

    const result =
        $("auctionResult");

    if (!result) {
        return;
    }

    let html =
        "🏆 AUCTION COMPLETE<br><br>";

    if (
        data &&
        Array.isArray(
            data.teams
        )
    ) {

        data.teams.forEach(
            team => {

                html += `
                    <div>
                        <strong>
                            ${escapeHTML(
                                team.playerName
                            )}
                        </strong>
                        :
                        ₹${Number(
                            team.spent || 0
                        ).toLocaleString()}
                        spent
                    </div>
                `;
            }
        );
    }

    result.innerHTML =
        html;
}


/* =========================================================
   UPDATE AUCTION PLAYERS
========================================================= */

function updateAuctionPlayers() {

    const container =
        $("auctionPlayers");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    players.forEach(
        player => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "auction-player";

            const team =
                Array.isArray(
                    player.team
                )
                    ? player.team
                    : [];

            const names =
                team.map(
                    key => {

                        return characters[key]
                            ? characters[key].name
                            : key;
                    }
                );

            div.innerHTML = `
                <strong>
                    ${escapeHTML(player.name)}
                </strong>

                <span>
                    ₹${Number(
                        player.balance || 0
                    ).toLocaleString()}
                </span>

                <small>
                    ${
                        names.length
                            ? names.map(
                                escapeHTML
                              ).join(", ")
                            : "No characters"
                    }
                </small>
            `;

            container.appendChild(
                div
            );
        }
    );
}


/* =========================================================
   SOCKET RECONNECT
========================================================= */

socket.on(
    "connect",
    () => {

        console.log(
            "Socket connected:",
            socket.id
        );
    }
);


/* =========================================================
   SOCKET DISCONNECT
========================================================= */

socket.on(
    "disconnect",
    () => {

        console.log(
            "Socket disconnected"
        );

        showMessage(
            "Connection lost. Reconnecting..."
        );
    }
);


/* =========================================================
   INITIAL SETUP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        ensureAuctionButtons();

        /*
         * If buttons are created later by
         * another script, check again.
         */

        setTimeout(
            ensureAuctionButtons,
            500
        );

        setTimeout(
            ensureAuctionButtons,
            1500
        );
    }
);
