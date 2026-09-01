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

    Guy: {
        name: "Might Guy",
        image: "assets/characters/images%20(12).jpeg"
    },

    Lee: {
        name: "Rock Lee",
        image: "assets/characters/images%20(13).jpeg"
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

    Duy: {
        name: "Might Duy",
        image: "assets/characters/download%20(33).jpeg"
    },

    Shizune: { name: "Shizune", image: "assets/characters/download%20(34).jpeg" },
    Asuma: { name: "Asuma", image: "assets/characters/download%20(35).jpeg" },
    Kurenai: { name: "Kurenai", image: "assets/characters/download%20(36).jpeg" },
    Yamato: { name: "Yamato", image: "assets/characters/download%20(37).jpeg" },
    Sai: { name: "Sai", image: "assets/characters/download%20(38).jpeg" },
    Konohamaru: { name: "Konohamaru", image: "assets/characters/download%20(39).jpeg" },
    Kurotsuchi: { name: "Kurotsuchi", image: "assets/characters/download%20(40).jpeg" },
    Mifune: { name: "Mifune", image: "assets/characters/download%20(41).jpeg" },
    Fu: { name: "Fū", image: "assets/characters/download%20(42).jpeg" },
    Utakata: { name: "Utakata", image: "assets/characters/download%20(43).jpeg" },
    Roshi: { name: "Rōshi", image: "assets/characters/download%20(44).jpeg" },
    Chiyo: { name: "Chiyo", image: "assets/characters/images%20(21).jpeg" },
    Rasa: { name: "Rasa", image: "assets/characters/images%20(22).jpeg" },
    Darui: { name: "Darui", image: "assets/characters/images%20(24).jpeg" },
    Chojuro: { name: "Chōjūrō", image: "assets/characters/images%20(25).jpeg" }
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
   RANKINGS
========================================================= */

const rankings = {

    Speed: [
        "Minato", "Naruto", "Tobirama", "FourthRaikage",
        "Sasuke", "Kakashi", "Shisui", "Guy", "Lee", "Duy", "Obito"
    ],

    Strength: [
        "Madara", "Hashirama", "Naruto", "Sasuke", "Guy",
        "Tsunade", "Minato", "Itachi", "Obito", "KillerB", "Duy"
    ],

    "Battle IQ": [
        "Shikamaru", "Itachi", "Kakashi", "Minato", "Tobirama",
        "Madara", "Sasuke", "Orochimaru", "Jiraiya", "Obito"
    ],

    Durability: [
        "Hashirama", "Naruto", "Madara", "Kisame", "KillerB",
        "Tsunade", "Obito", "Sakura", "Gaara", "ThirdRaikage"
    ],

    Chakra: [
        "Naruto", "Hashirama", "Madara", "Kisame", "Nagato",
        "KillerB", "Minato", "Tobirama", "Jiraiya", "Orochimaru"
    ],

    Ninjutsu: [
        "Madara", "Naruto", "Sasuke", "Hashirama", "Orochimaru",
        "Kakashi", "Minato", "Tobirama", "Jiraiya", "Itachi"
    ],

    /* IMPORTANT:
       Guy + Duy + Lee are valid keys */
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
        "Itachi", "Shisui", "Sasuke", "Madara", "Kurenai",
        "Obito", "Orochimaru", "Kakashi", "Sakura", "Ino"
    ],

    Defense: [
        "Gaara", "Hashirama", "Madara", "Naruto", "Kakashi",
        "Tsunade", "Sasuke", "Obito", "ThirdRaikage", "Kisame"
    ],

    Attack: [
        "Madara", "Naruto", "Sasuke", "Hashirama", "Guy",
        "Minato", "Itachi", "KillerB", "Nagato", "Obito"
    ],

    Stamina: [
        "Naruto", "Hashirama", "Kisame", "KillerB", "Madara",
        "Tsunade", "Sakura", "Jiraiya", "Orochimaru", "ThirdRaikage"
    ],

    Leadership: [
        "Hashirama", "Naruto", "Minato", "Tobirama", "Madara",
        "Kakashi", "Gaara", "Tsunade", "Jiraiya", "Itachi"
    ],

    Versatility: [
        "Kakashi", "Naruto", "Sasuke", "Orochimaru", "Itachi",
        "Madara", "Jiraiya", "Minato", "Tobirama", "Obito"
    ],

    Experience: [
        "Hiruzen", "Madara", "Orochimaru", "Jiraiya", "Tobirama",
        "Hashirama", "Kakashi", "Itachi", "Onoki", "Tsunade"
    ],

    Teamwork: [
        "Naruto", "Kakashi", "Shikamaru", "Minato", "Sakura",
        "Gaara", "Hinata", "Choji", "Kiba", "Shino"
    ],

    "Overall Power": [
        "Madara", "Naruto", "Sasuke", "Hashirama", "Minato",
        "Itachi", "Obito", "Nagato", "Guy", "Tobirama"
    ]
};


/* =========================================================
   STATE
========================================================= */

let myName = "";
let roomCode = "";
let isHost = false;
let gameMode = "rank";

let currentCategory = 0;
let players = [];

let mySelections = {};
let selectedThisCategory = false;

let auctionTimer = null;
let auctionEndTime = 0;
let currentAuctionState = null;
let auctionGivenUp = false;


/* =========================================================
   DOM
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {
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

    clearTimeout(showMessage.timeout);

    showMessage.timeout = setTimeout(() => {
        message.style.display = "none";
    }, 2500);
}


/* =========================================================
   CREATE ROOM
========================================================= */

window.createRoom = function () {

    const name = $("playerName")?.value.trim();

    if (!name) {
        showMessage("Enter your name.");
        return;
    }

    myName = name;

    const mode = $("gameMode")?.value || "rank";

    let maxPlayers = Number($("maxPlayers")?.value);

    if (!Number.isFinite(maxPlayers) || maxPlayers < 2) {
        maxPlayers = 6;
    }

    let teamSize = Number($("teamSize")?.value);

    if (!Number.isFinite(teamSize) || teamSize < 1) {
        teamSize = 5;
    }

    let startingBalance =
        Number($("startingBalance")?.value);

    if (!Number.isFinite(startingBalance) || startingBalance < 0) {
        startingBalance = 1000;
    }

    socket.emit("createRoom", {
        name,
        gameMode: mode,
        maxPlayers,
        teamSize,
        startingBalance,

        /*
         * Server defaults are allowed to handle
         * these values.
         */
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
            ?.value
            .trim()
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

    roomCode = data.roomCode || "";
    isHost = !!data.isHost;
    gameMode = data.gameMode || "rank";

    showScreen("lobbyScreen");

    const code = $("roomCode");

    if (code) {
        code.textContent = roomCode;
    }

    updateHostUI();

    showMessage(`Room created: ${roomCode}`);
});


/* =========================================================
   ROOM JOINED
========================================================= */

socket.on("roomJoined", data => {

    roomCode = data.roomCode || "";
    isHost = !!data.isHost;
    gameMode = data.gameMode || "rank";

    showScreen("lobbyScreen");

    const code = $("roomCode");

    if (code) {
        code.textContent = roomCode;
    }

    updateHostUI();

    showMessage(`Joined room: ${roomCode}`);
});


/* =========================================================
   ERROR
========================================================= */

socket.on("errorMessage", message => {

    showMessage(
        typeof message === "string"
            ? message
            : "Something went wrong."
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
        showMessage("You are now the host.");
    }
});


function updateHostUI() {

    const start = $("startGameButton");

    if (start) {
        start.style.display =
            isHost ? "block" : "none";
    }
}


/* =========================================================
   PLAYERS
========================================================= */

socket.on("playersUpdated", data => {

    players =
        Array.isArray(data.players)
            ? data.players
            : [];

    renderPlayers();

    updateRankWaitingStatus();
    updateAuctionPlayers();
});


function renderPlayers() {

    const container = $("playersList");

    if (!container) return;

    container.innerHTML = "";

    players.forEach(player => {

        const div =
            document.createElement("div");

        div.className = "player-item";

        const you =
            player.id === socket.id
                ? " (You)"
                : "";

        div.innerHTML = `
            <strong>${escapeHTML(player.name)}${you}</strong>
            <span>₹${Number(player.balance || 0).toLocaleString()}</span>
        `;

        container.appendChild(div);
    });
}


/* =========================================================
   RANK GAME STARTED
========================================================= */

socket.on("rankGameStarted", data => {

    currentCategory =
        Number.isInteger(Number(data.categoryIndex))
            ? Number(data.categoryIndex)
            : 0;

    mySelections = {};
    selectedThisCategory = false;

    showScreen("rankScreen");

    buildRankScreen();

    showMessage(
        `Category 1/16: ${categories[0]}`
    );
});


/* =========================================================
   BUILD RANK SCREEN
========================================================= */

function buildRankScreen() {

    const category =
        categories[currentCategory];

    if (!category) return;

    selectedThisCategory =
        mySelections[currentCategory] !== undefined;

    /* Title */

    const title =
        $("categoryTitle");

    if (title) {
        title.textContent =
            `${category} (${currentCategory + 1}/16)`;
    }

    /* Counter */

    const counter =
        $("categoryCounter");

    if (counter) {
        counter.textContent =
            `Category ${currentCategory + 1} / 16`;
    }

    /* Optional category name element */

    const categoryName =
        $("currentCategory");

    if (categoryName) {
        categoryName.textContent =
            category;
    }

    /* Character grid */

    const grid =
        $("characterGrid");

    if (!grid) return;

    grid.innerHTML = "";

    let ranked =
        [...(rankings[category] || [])];

    /*
     * Add all remaining characters.
     *
     * This is important because Guy / Lee / Duy
     * are real keys in characters.
     */

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

        /*
         * NEVER create an invalid character card.
         */

        if (!char) return;

        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "character-card";

        card.dataset.character =
            key;

        if (
            mySelections[currentCategory] === key
        ) {
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
                onerror="this.style.display='none'"
            >

            <strong>
                ${escapeHTML(char.name)}
            </strong>
        `;

        card.addEventListener(
            "click",
            () => {

                if (selectedThisCategory) {
                    showMessage(
                        "You already selected this category."
                    );
                    return;
                }

                selectRankCharacter(key);
            }
        );

        grid.appendChild(card);
    });

    updateRankWaitingStatus();
}


/* =========================================================
   SELECT RANK CHARACTER
========================================================= */

function selectRankCharacter(character) {

    if (!characters[character]) {
        showMessage(
            "Invalid character."
        );
        return;
    }

    if (
        mySelections[currentCategory] !==
        undefined
    ) {
        return;
    }

    mySelections[currentCategory] =
        character;

    selectedThisCategory = true;

    /*
     * Save locally immediately.
     * This prevents another player's event
     * from changing our selected card.
     */

    markMyRankSelection(character);

    socket.emit("rankSelect", {
        categoryIndex: currentCategory,
        character
    });

    const name =
        characters[character].name;

    showMessage(
        `You selected ${name}`
    );

    updateRankWaitingStatus();
}


/* =========================================================
   MARK MY SELECTION
========================================================= */

function markMyRankSelection(character) {

    document
        .querySelectorAll(".character-card")
        .forEach(card => {

            card.classList.remove(
                "selected-by-me"
            );

            /*
             * Disable every card after selection.
             */

            card.disabled = true;
        });

    const selected =
        document.querySelector(
            `.character-card[data-character="${CSS.escape(character)}"]`
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

socket.on("rankSelectionMade", data => {

    /*
     * IMPORTANT:
     *
     * We do NOT modify our character cards
     * when another player selects.
     *
     * Therefore Player 1 selecting Naruto
     * will NOT show Naruto selected on Player 2.
     */

    const status =
        $("selectionStatus");

    if (status) {

        const char =
            characters[data.character];

        status.textContent =
            `${data.playerName} selected ${
                char
                    ? char.name
                    : data.character
            }`;
    }

    updateRankWaitingStatus();
});


/* =========================================================
   WAITING STATUS
========================================================= */

function updateRankWaitingStatus() {

    const status =
        $("rankWaitingStatus");

    if (!status) return;

    const count =
        players.length;

    if (count === 0) {

        status.textContent =
            selectedThisCategory
                ? "Waiting for other players..."
                : "Choose your character.";

        return;
    }

    if (selectedThisCategory) {

        status.textContent =
            `You selected a character. Waiting for ${count - 1} other player(s)...`;

    } else {

        status.textContent =
            `Choose a character for ${categories[currentCategory]}.`;

    }
}


/* =========================================================
   CATEGORY COMPLETE
========================================================= */

socket.on("rankCategoryComplete", data => {

    const category =
        Number(data.categoryIndex);

    /*
     * Don't immediately change category here.
     *
     * Server sends rankNextCategory after everyone
     * has selected.
     */

    if (
        category === currentCategory
    ) {

        showMessage(
            `${categories[category]} complete!`
        );
    }
});


/* =========================================================
   NEXT CATEGORY
========================================================= */

socket.on("rankNextCategory", data => {

    const next =
        Number(data.categoryIndex);

    if (
        !Number.isInteger(next) ||
        next < 0 ||
        next >= categories.length
    ) {
        return;
    }

    currentCategory =
        next;

    selectedThisCategory =
        mySelections[currentCategory] !==
        undefined;

    buildRankScreen();

    showMessage(
        `Category ${currentCategory + 1}/16: ${
            categories[currentCategory]
        }`
    );
});


/* =========================================================
   RANK FINISHED
========================================================= */

socket.on("rankGameFinished", data => {

    showScreen("rankResultScreen");

    renderRankResults(
        data
    );
});


/* =========================================================
   RANK RESULTS
========================================================= */

function renderRankResults(data) {

    const container =
        $("rankResults");

    if (!container) return;

    container.innerHTML = "";

    const results =
        Array.isArray(data?.results)
            ? data.results
            : [];

    if (!results.length) {

        container.innerHTML =
            "<p>No ranking results received.</p>";

        return;
    }

    /*
     * Create a result box for every player.
     */

    results.forEach(player => {

        const box =
            document.createElement("div");

        box.className =
            "final-player";

        const title =
            document.createElement("h3");

        title.textContent =
            player.playerName ||
            "Player";

        box.appendChild(title);

        const selections =
            player.selections || {};

        categories.forEach(
            (category, index) => {

                const key =
                    selections[index];

                if (!key) return;

                const char =
                    characters[key];

                const row =
                    document.createElement("div");

                row.className =
                    "team-character";

                row.textContent =
                    `${index + 1}. ${category}: ${
                        char
                            ? char.name
                            : key
                    }`;

                box.appendChild(row);
            }
        );

        container.appendChild(box);
    });

    /*
     * Show strongest player/team using local
     * category scoring if the server doesn't
     * provide AI results.
     */

    renderBestRankedPlayer(results);
}


/* =========================================================
   BEST RANKED PLAYER
========================================================= */

function renderBestRankedPlayer(results) {

    if (!results.length) return;

    /*
     * Higher position = more points.
     * #1 gets 10 points, #2 gets 9, etc.
     */

    const scores =
        results.map(player => {

            let score = 0;

            const selections =
                player.selections || {};

            categories.forEach(
                (category, categoryIndex) => {

                    const selected =
                        selections[categoryIndex];

                    if (!selected) return;

                    const list =
                        rankings[category] || [];

                    const position =
                        list.indexOf(selected);

                    if (position >= 0) {

                        score +=
                            Math.max(
                                1,
                                10 - position
                            );

                    } else {

                        score += 1;
                    }
                }
            );

            return {
                player,
                score
            };
        });

    scores.sort(
        (a, b) =>
            b.score - a.score
    );

    const winner =
        scores[0];

    if (!winner) return;

    const container =
        $("rankResults");

    if (!container) return;

    const best =
        document.createElement("div");

    best.className =
        "best-team-result";

    best.innerHTML = `
        <h2>🏆 Strongest Overall Selection</h2>
        <h3>${escapeHTML(winner.player.playerName)}</h3>
        <p>Score: ${winner.score}</p>
        <p>
            This selection performed strongest across
            the 16 ranking categories.
        </p>
    `;

    container.prepend(best);
}


/* =========================================================
   AUCTION STARTED
========================================================= */

socket.on("auctionStarted", data => {

    showScreen("auctionScreen");

    auctionGivenUp = false;

    /*
     * Starting money.
     */

    if (data?.settings) {

        const startingBalance =
            Number(
                data.settings.startingBalance || 0
            );

        /*
         * Don't overwrite an already updated
         * balance unnecessarily.
         */

        const me =
            getMe();

        if (!me) {
            setRemainingMoney(
                startingBalance
            );
        }
    }

    updateAuctionPlayers();
});


/* =========================================================
   NEW AUCTION CHARACTER
========================================================= */

socket.on("auctionCharacter", data => {

    showScreen("auctionScreen");

    auctionGivenUp = false;

    currentAuctionState =
        data;

    updateAuctionUI(data);

    /*
     * Prefer server's actual end/time information.
     */

    let seconds =
        Number(
            data.timeLeft
        );

    if (
        !Number.isFinite(seconds) ||
        seconds <= 0
    ) {

        seconds =
            Number(
                data.bidTime ||
                data.settings?.bidTime ||
                10
            );
    }

    startAuctionCountdown(
        seconds
    );
});


/* =========================================================
   AUCTION UPDATED
========================================================= */

socket.on("auctionUpdated", data => {

    currentAuctionState =
        data;

    updateAuctionUI(data);

    /*
     * A bid resets the timer.
     *
     * Server should send the fresh timeLeft.
     */

    let seconds =
        Number(data.timeLeft);

    if (
        Number.isFinite(seconds) &&
        seconds > 0
    ) {

        startAuctionCountdown(
            seconds
        );

    } else {

        /*
         * If server does not send timeLeft,
         * use configured bid time.
         */

        seconds =
            Number(
                data.bidTime ||
                data.settings?.bidTime ||
                10
            );

        startAuctionCountdown(
            seconds
        );
    }
});


/* =========================================================
   AUCTION UI
========================================================= */

function updateAuctionUI(data) {

    if (!data) return;

    currentAuctionState =
        data;

    const characterKey =
        data.character;

    const character =
        characters[characterKey];

    /*
     * Character name
     */

    const characterElement =
        $("auctionCharacter");

    if (characterElement) {

        characterElement.textContent =
            character
                ? character.name
                : characterKey || "Waiting...";
    }

    /*
     * Character image
     */

    const image =
        $("auctionCharacterImage");

    if (image) {

        if (character) {

            image.src =
                character.image;

            image.alt =
                character.name;

            image.style.display =
                "block";

        } else {

            image.style.display =
                "none";
        }
    }

    /*
     * Current bid
     */

    const currentBid =
        Number(
            data.currentBid || 0
        );

    const bidElement =
        $("currentBid");

    if (bidElement) {

        bidElement.textContent =
            `Current Bid: ₹${currentBid.toLocaleString()}`;
    }

    /*
     * Highest bidder
     */

    const highestName =
        data.highestBidderName ||
        data.highestBidderPlayerName ||
        findPlayerName(
            data.highestBidder
        );

    const highestElement =
        $("highestBidder");

    if (highestElement) {

        highestElement.textContent =
            highestName
                ? `Highest Bidder: ${highestName}`
                : "No bids yet";
    }

    /*
     * Remaining money
     */

    let balance =
        data.myBalance;

    if (
        balance === undefined ||
        balance === null
    ) {

        const me =
            getMe();

        if (me) {
            balance =
                me.balance;
        }
    }

    if (
        balance !== undefined &&
        balance !== null
    ) {

        setRemainingMoney(
            Number(balance)
        );
    }

    /*
     * Maximum amount we can currently bid.
     */

    const bidButton =
        getBidButton();

    if (bidButton) {

        const bidAmount =
            Number(
                data.bidAmount ||
                data.settings?.bidAmount ||
                50
            );

        const nextBid =
            currentBid +
            bidAmount;

        const myBalance =
            Number(
                balance || 0
            );

        bidButton.disabled =
            auctionGivenUp ||
            myBalance < nextBid ||
            data.highestBidder === socket.id;

        bidButton.textContent =
            `BID ₹${bidAmount.toLocaleString()}`;
    }

    /*
     * Give Up / Unsold button
     */

    const giveUpButton =
        getGiveUpButton();

    if (giveUpButton) {

        giveUpButton.disabled =
            auctionGivenUp;

        giveUpButton.textContent =
            auctionGivenUp
                ? "GIVEN UP"
                : "GIVE UP";
    }

    updateAuctionPlayers();
}


/* =========================================================
   REMAINING MONEY
========================================================= */

function setRemainingMoney(amount) {

    const money =
        Number.isFinite(Number(amount))
            ? Number(amount)
            : 0;

    /*
     * Support multiple possible IDs
     * so the HTML can use any of these.
     */

    const elements = [
        $("remainingMoney"),
        $("moneyLeft"),
        $("myBalance"),
        $("playerBalance")
    ].filter(Boolean);

    elements.forEach(element => {

        element.textContent =
            `Money Left: ₹${money.toLocaleString()}`;
    });
}


/* =========================================================
   AUCTION COUNTDOWN
========================================================= */

function startAuctionCountdown(seconds) {

    stopAuctionCountdown();

    let remaining =
        Math.max(
            0,
            Math.ceil(
                Number(seconds) || 10
            )
        );

    auctionEndTime =
        Date.now() +
        remaining * 1000;

    updateAuctionTimerDisplay(
        remaining
    );

    auctionTimer =
        setInterval(() => {

            remaining =
                Math.max(
                    0,
                    Math.ceil(
                        (auctionEndTime -
                            Date.now()) /
                        1000
                    )
                );

            updateAuctionTimerDisplay(
                remaining
            );

            if (remaining <= 0) {

                stopAuctionCountdown();
            }

        }, 200);
}


/* =========================================================
   STOP TIMER
========================================================= */

function stopAuctionCountdown() {

    if (auctionTimer) {

        clearInterval(
            auctionTimer
        );

        auctionTimer =
            null;
    }
}


/* =========================================================
   TIMER DISPLAY
========================================================= */

function updateAuctionTimerDisplay(seconds) {

    const timer =
        $("auctionTimer");

    if (timer) {

        timer.textContent =
            `Time: ${seconds}s`;
    }

    const timer2 =
        $("auctionCountdown");

    if (timer2) {

        timer2.textContent =
            `${seconds}s`;
    }
}


/* =========================================================
   BID
========================================================= */

window.bidCharacter = function () {

    if (auctionGivenUp) {

        showMessage(
            "You gave up on this character."
        );

        return;
    }

    if (
        !currentAuctionState
    ) {

        showMessage(
            "No auction is active."
        );

        return;
    }

    const me =
        getMe();

    const currentBid =
        Number(
            currentAuctionState.currentBid ||
            0
        );

    const increment =
        Number(
            currentAuctionState.bidAmount ||
            currentAuctionState.settings?.bidAmount ||
            50
        );

    const nextBid =
        currentBid +
        increment;

    if (
        me &&
        Number(me.balance) < nextBid
    ) {

        showMessage(
            "Not enough money."
        );

        return;
    }

    socket.emit(
        "auctionBid"
    );
};


/*
 * Support older HTML that uses bid().
 */

window.bid = window.bidCharacter;


/* =========================================================
   GIVE UP
========================================================= */

window.giveUpAuction = function () {

    if (auctionGivenUp) {
        return;
    }

    auctionGivenUp = true;

    /*
     * IMPORTANT:
     *
     * This does NOT permanently remove the player
     * from the whole auction.
     *
     * It only means:
     * "I don't want this current character."
     *
     * Server must keep the player available for
     * the next character.
     */

    socket.emit(
        "auctionGiveUp"
    );

    /*
     * Compatibility with the server version
     * that uses auctionUnsold.
     */

    socket.emit(
        "auctionUnsold"
    );

    showMessage(
        "You gave up on this character."
    );

    const button =
        getGiveUpButton();

    if (button) {

        button.disabled =
            true;

        button.textContent =
            "GIVEN UP";
    }

    const bidButton =
        getBidButton();

    if (bidButton) {
        bidButton.disabled =
            true;
    }
};


/*
 * Support old HTML.
 */

window.auctionGiveUp =
    window.giveUpAuction;


/* =========================================================
   AUCTION SOLD
========================================================= */

socket.on("auctionSold", data => {

    stopAuctionCountdown();

    const buyer =
        data.buyerName ||
        data.playerName ||
        findPlayerName(
            data.buyerId ||
            data.highestBidder
        ) ||
        "Unknown Player";

    const character =
        characters[
            data.character
        ];

    const price =
        Number(
            data.amount ||
            data.currentBid ||
            0
        );

    showMessage(
        `${character?.name || data.character} sold to ${buyer} for ₹${price.toLocaleString()}`
    );

    /*
     * Update balance immediately if provided.
     */

    if (
        data.myBalance !==
        undefined
    ) {

        setRemainingMoney(
            Number(data.myBalance)
        );
    }

    /*
     * Reset give-up state for next character.
     */

    auctionGivenUp =
        false;
});


/* =========================================================
   AUCTION UNSOLD
========================================================= */

socket.on("auctionUnsold", data => {

    stopAuctionCountdown();

    const character =
        characters[
            data?.character
        ];

    showMessage(
        `${character?.name || data?.character || "Character"} was UNSOLD`
    );

    auctionGivenUp =
        false;
});


/* =========================================================
   AUCTION CHARACTER FINISHED
========================================================= */

socket.on("auctionCharacterFinished", data => {

    stopAuctionCountdown();

    if (data?.sold) {

        const buyer =
            data.buyerName ||
            findPlayerName(
                data.buyerId
            ) ||
            "Unknown Player";

        showMessage(
            `${data.character} sold to ${buyer}`
        );

    } else {

        showMessage(
            `${data.character || "Character"} was unsold.`
        );
    }
});


/* =========================================================
   AUCTION PLAYERS
========================================================= */

function updateAuctionPlayers() {

    const container =
        $("auctionPlayers");

    if (!container) return;

    container.innerHTML = "";

    players.forEach(player => {

        const div =
            document.createElement("div");

        div.className =
            "auction-player";

        const team =
            Array.isArray(player.team)
                ? player.team
                : [];

        const teamNames =
            team.map(key => {

                const char =
                    characters[key];

                return char
                    ? char.name
                    : key;

            });

        div.innerHTML = `
            <strong>
                ${escapeHTML(player.name)}
            </strong>

            <span>
                ₹${Number(player.balance || 0).toLocaleString()}
            </span>

            <small>
                Team: ${teamNames.length
                    ? escapeHTML(teamNames.join(", "))
                    : "Empty"}
            </small>
        `;

        container.appendChild(
            div
        );
    });
}


/* =========================================================
   AUCTION FINISHED
========================================================= */

socket.on("auctionFinished", data => {

    stopAuctionCountdown();

    auctionGivenUp = false;

    /*
     * Server may send final players.
     */

    if (
        Array.isArray(data?.players)
    ) {

        players =
            data.players;

        renderPlayers();
    }

    showAuctionFinalResults(
        data
    );
});


/* =========================================================
   FINAL AUCTION RESULTS
========================================================= */

function showAuctionFinalResults(data) {

    /*
     * Different HTML versions may have
     * different result screen IDs.
     */

    const screen =
        $("auctionResultScreen");

    if (screen) {

        showScreen(
            "auctionResultScreen"
        );
    }

    const container =
        $("auctionResults") ||
        $("finalTeams") ||
        $("teamResults");

    if (!container) return;

    container.innerHTML = "";

    const finalPlayers =
        Array.isArray(data?.players)
            ? data.players
            : players;

    finalPlayers.forEach(player => {

        const box =
            document.createElement("div");

        box.className =
            "final-team";

        const team =
            Array.isArray(player.team)
                ? player.team
                : [];

        let html = `
            <h3>
                ${escapeHTML(player.name || "Player")}
            </h3>

            <p>
                Money Left:
                ₹${Number(player.balance || 0).toLocaleString()}
            </p>

            <div class="team-list">
        `;

        team.forEach(key => {

            const char =
                characters[key];

            html += `
                <div class="team-character">
                    ${
                        char
                            ? escapeHTML(char.name)
                            : escapeHTML(key)
                    }
                </div>
            `;
        });

        html += `
            </div>
        `;

        box.innerHTML =
            html;

        container.appendChild(
            box
        );
    });

    /*
     * Compare teams locally if server
     * did not provide AI evaluation.
     */

    compareFinalTeams(
        finalPlayers,
        container
    );
}


/* =========================================================
   TEAM COMPARISON
========================================================= */

function compareFinalTeams(
    finalPlayers,
    container
) {

    if (
        !Array.isArray(finalPlayers) ||
        finalPlayers.length < 2
    ) {
        return;
    }

    const scores =
        finalPlayers.map(player => {

            let score = 0;

            const team =
                Array.isArray(player.team)
                    ? player.team
                    : [];

            team.forEach(character => {

                categories.forEach(
                    category => {

                        const list =
                            rankings[category] ||
                            [];

                        const position =
                            list.indexOf(
                                character
                            );

                        if (position >= 0) {

                            score +=
                                Math.max(
                                    1,
                                    11 - position
                                );
                        }
                    }
                );
            });

            return {
                player,
                score
            };
        });

    scores.sort(
        (a, b) =>
            b.score - a.score
    );

    const winner =
        scores[0];

    if (!winner) return;

    const comparison =
        document.createElement("div");

    comparison.className =
        "team-comparison";

    comparison.innerHTML = `
        <h2>🏆 Strongest Team</h2>

        <h3>
            ${escapeHTML(
                winner.player.name ||
                "Player"
            )}
        </h3>

        <p>
            Team Score:
            ${winner.score}
        </p>

        <p>
            The team is strongest based on
            performance across the available
            ranking categories.
        </p>

        <hr>

        <h3>Team Comparison</h3>
    `;

    scores.forEach(item => {

        const row =
            document.createElement("p");

        row.textContent =
            `${item.player.name}: ${item.score}`;

        comparison.appendChild(
            row
        );
    });

    container.prepend(
        comparison
    );
}


/* =========================================================
   AI EVALUATION RESULT
========================================================= */

socket.on("aiEvaluation", data => {

    displayAIEvaluation(
        data
    );
});


socket.on("teamAIEvaluation", data => {

    displayAIEvaluation(
        data
    );
});


socket.on("aiTeamResult", data => {

    displayAIEvaluation(
        data
    );
});


function displayAIEvaluation(data) {

    if (!data) return;

    const container =
        $("aiEvaluation") ||
        $("teamAIResult") ||
        $("rankAIResult");

    if (!container) return;

    let text =
        data.analysis ||
        data.result ||
        data.message ||
        data.reason ||
        "";

    if (
        typeof text !== "string"
    ) {

        try {

            text =
                JSON.stringify(
                    text,
                    null,
                    2
                );

        } catch {
            text =
                "AI evaluation received.";
        }
    }

    container.innerHTML = `
        <h2>🤖 AI Overall Evaluation</h2>
        <div>
            ${escapeHTML(text)}
        </div>
    `;
}


/* =========================================================
   GET MY PLAYER
========================================================= */

function getMe() {

    return players.find(
        player =>
            player.id === socket.id
    );
}


/* =========================================================
   FIND PLAYER NAME
========================================================= */

function findPlayerName(id) {

    if (!id) return "";

    const player =
        players.find(
            p => p.id === id
        );

    return player
        ? player.name
        : "";
}


/* =========================================================
   BID BUTTON FINDER
========================================================= */

function getBidButton() {

    return (
        $("bidButton") ||
        $("auctionBidButton") ||
        document.querySelector(
            '[onclick="bidCharacter()"]'
        ) ||
        document.querySelector(
            '[onclick="bid()"]'
        )
    );
}


/* =========================================================
   GIVE UP BUTTON FINDER
========================================================= */

function getGiveUpButton() {

    return (
        $("giveUpButton") ||
        $("auctionGiveUpButton") ||
        document.querySelector(
            '[onclick="giveUpAuction()"]'
        ) ||
        document.querySelector(
            '[onclick="auctionGiveUp()"]'
        )
    );
}


/* =========================================================
   SOCKET CONNECTION
========================================================= */

socket.on("connect", () => {

    console.log(
        "Connected to server:",
        socket.id
    );
});


socket.on("disconnect", () => {

    showMessage(
        "Disconnected from server. Reconnecting..."
    );
});


/* =========================================================
   GENERIC GAME START
========================================================= */

socket.on("gameStarted", data => {

    if (
        data?.gameMode
    ) {

        gameMode =
            data.gameMode;
    }

    if (
        gameMode === "auction"
    ) {

        showScreen(
            "auctionScreen"
        );

    } else {

        showScreen(
            "rankScreen"
        );
    }
});


/* =========================================================
   SAFE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   INITIAL UI
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Make sure the initial screen isn't
         * accidentally showing a game screen.
         */

        const rankScreen =
            $("rankScreen");

        const auctionScreen =
            $("auctionScreen");

        /*
         * Do not force a screen if the existing
         * HTML already controls it.
         */

        if (rankScreen) {
            rankScreen.classList.add(
                "hidden"
            );
        }

        if (auctionScreen) {
            auctionScreen.classList.add(
                "hidden"
            );
        }
    }
);
