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
   CATEGORY ORDER
   No points are shown to players.
========================================================= */

const rankings = {

    Speed: [
        "Minato",
        "Naruto",
        "Tobirama",
        "FourthRaikage",
        "Sasuke",
        "Shisui",
        "Kakashi",
        "Guy",
        "Lee",
        "Obito",
        "Duy"
    ],

    Strength: [
        "Madara",
        "Hashirama",
        "Naruto",
        "Sasuke",
        "Guy",
        "Tsunade",
        "ThirdRaikage",
        "Minato",
        "KillerB",
        "Lee",
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
        "ThirdRaikage",
        "Kisame",
        "KillerB",
        "Tsunade",
        "Obito",
        "Sakura",
        "Gaara"
    ],

    Chakra: [
        "Naruto",
        "Hashirama",
        "Madara",
        "Nagato",
        "Kisame",
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

    /*
     * IMPORTANT:
     * Guy + Lee + Duy are all here.
     */

    Taijutsu: [
        "Guy",
        "Lee",
        "Duy",
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
        "Ino",
        "Sakura"
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
   STATE
========================================================= */

let myName = "";
let roomCode = "";
let isHost = false;
let gameMode = "rank";

let currentCategory = 0;
let totalCategories = 16;

let currentAuction = null;
let auctionCountdown = null;

/* =========================================================
   HELPERS
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

function showMessage(text) {

    const message = $("message");

    if (!message) {
        alert(text);
        return;
    }

    message.textContent = text;
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 2500);
}

function getCharacterName(id) {

    return characters[id]
        ? characters[id].name
        : id;
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

    gameMode =
        $("gameMode")?.value || "rank";

    const maxPlayers =
        Number($("maxPlayers")?.value) || 6;

    const teamSize =
        Number($("teamSize")?.value) || 5;

    const startingBalance =
        Number($("startingBalance")?.value) || 1000;

    socket.emit("createRoom", {

        name,

        gameMode,

        maxPlayers,

        teamSize,

        startingBalance,

        bidAmount:
            Number($("bidAmount")?.value) || 50,

        bidTime: 10

    });
};

/* =========================================================
   JOIN
========================================================= */

window.joinRoom = function () {

    const name =
        $("joinPlayerName")
            ?.value.trim();

    const code =
        $("joinRoomCode")
            ?.value.trim()
            .toUpperCase();

    if (!name || !code) {

        showMessage(
            "Enter your name and room code."
        );

        return;
    }

    myName = name;

    socket.emit("joinRoom", {
        name,
        roomCode: code
    });
};

/* =========================================================
   START
========================================================= */

window.startGame = function () {

    if (!isHost) {

        showMessage(
            "Only the host can start."
        );

        return;
    }

    socket.emit("startGame");
};

/* =========================================================
   ROOM CREATED
========================================================= */

socket.on("roomCreated", data => {

    roomCode = data.roomCode;

    isHost = true;

    gameMode = data.gameMode;

    showScreen("lobbyScreen");

    updateRoomCode();

    showMessage(
        `Room created: ${roomCode}`
    );
});

/* =========================================================
   ROOM JOINED
========================================================= */

socket.on("roomJoined", data => {

    roomCode = data.roomCode;

    isHost = data.isHost;

    gameMode = data.gameMode;

    showScreen("lobbyScreen");

    updateRoomCode();

    showMessage(
        `Joined room ${roomCode}`
    );
});

/* =========================================================
   ROOM CODE
========================================================= */

function updateRoomCode() {

    const elements = [
        $("roomCode"),
        $("displayRoomCode"),
        $("roomCodeDisplay")
    ];

    elements.forEach(element => {

        if (element) {
            element.textContent =
                roomCode;
        }

    });
}

/* =========================================================
   PLAYERS
========================================================= */

socket.on("playersUpdated", data => {

    const players =
        data.players || [];

    const list =
        $("playersList");

    if (!list) return;

    list.innerHTML = "";

    players.forEach(player => {

        const div =
            document.createElement("div");

        div.className =
            "player-item";

        div.innerHTML = `
            <strong>${player.name}</strong>
            <span>
                ${player.balance} 💰
            </span>
        `;

        list.appendChild(div);

    });
});

/* =========================================================
   RANK SCREEN
========================================================= */

function updateRankHeader() {

    const title =
        $("categoryTitle");

    if (title) {
        title.textContent =
            categories[currentCategory];
    }

    const number =
        $("categoryNumber");

    if (number) {
        number.textContent =
            `${currentCategory + 1} / ${totalCategories}`;
    }

    const progress =
        $("categoryProgress");

    if (progress) {
        progress.textContent =
            `Category ${currentCategory + 1} / ${totalCategories}`;
    }
}

/* =========================================================
   BUILD RANK SCREEN
========================================================= */

function buildRankScreen() {

    updateRankHeader();

    const list =
        $("characterGrid");

    if (!list) return;

    list.innerHTML = "";

    const category =
        categories[currentCategory];

    let ranked =
        [...(rankings[category] || [])];

    const rankedSet =
        new Set(ranked);

    /*
     * Add ALL remaining characters.
     */

    Object.keys(characters)
        .forEach(id => {

            if (!rankedSet.has(id)) {
                ranked.push(id);
            }

        });

    ranked.forEach(id => {

        const char =
            characters[id];

        if (!char) return;

        const card =
            document.createElement("button");

        card.className =
            "character-card";

        card.dataset.character =
            id;

        card.innerHTML = `
            <img
                src="${char.image}"
                alt="${char.name}"
                loading="lazy"
                onerror="this.style.display='none'"
            >

            <strong>
                ${char.name}
            </strong>
        `;

        card.onclick = () => {

            selectRankCharacter(id);

        };

        list.appendChild(card);

    });
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

    socket.emit("rankSelect", {

        categoryIndex:
            currentCategory,

        character

    });

    /*
     * Only THIS player's screen
     * displays the selection.
     */

    markMySelection(character);
}

/* =========================================================
   MY SELECTION
========================================================= */

socket.on("myRankSelection", data => {

    if (
        data.categoryIndex !==
        currentCategory
    ) {
        return;
    }

    markMySelection(
        data.character
    );
});

function markMySelection(character) {

    document
        .querySelectorAll(
            ".character-card"
        )
        .forEach(card => {

            card.classList.remove(
                "selected"
            );

        });

    const selected =
        document.querySelector(
            `.character-card[data-character="${character}"]`
        );

    if (selected) {

        selected.classList.add(
            "selected"
        );

    }

    const status =
        $("selectionStatus");

    if (status) {

        status.textContent =
            `You selected ${getCharacterName(character)}`;

    }
}

/* =========================================================
   OTHER PLAYER SELECTED
   DOES NOT SHOW THEIR CHARACTER
========================================================= */

socket.on(
    "playerRankSelected",
    data => {

        const status =
            $("selectionStatus");

        if (!status) return;

        status.textContent =
            `${data.playerName} has selected.`;

    }
);

/* =========================================================
   CATEGORY COMPLETE
========================================================= */

socket.on(
    "rankCategoryComplete",
    data => {

        showMessage(
            `Everyone completed ${categories[data.categoryIndex]}`
        );

    }
);

/* =========================================================
   NEXT CATEGORY
========================================================= */

socket.on(
    "rankNextCategory",
    data => {

        currentCategory =
            Number(data.categoryIndex);

        totalCategories =
            Number(
                data.totalCategories
            ) || 16;

        buildRankScreen();

    }
);

/* =========================================================
   RANK STARTED
========================================================= */

socket.on(
    "rankGameStarted",
    data => {

        currentCategory =
            Number(
                data.categoryIndex
            ) || 0;

        totalCategories =
            Number(
                data.totalCategories
            ) || 16;

        showScreen(
            "rankScreen"
        );

        buildRankScreen();

    }
);

/* =========================================================
   RANK FINISHED
========================================================= */

socket.on(
    "rankGameFinished",
    data => {

        showScreen(
            "rankResultScreen"
        );

        displayFinalTeams(
            data.teams || []
        );

        displayAIAnalysis(
            data.analysis
        );

    }
);

/* =========================================================
   FINAL TEAMS
========================================================= */

function displayFinalTeams(teams) {

    const container =
        $("rankResults");

    if (!container) return;

    container.innerHTML = "";

    teams.forEach(team => {

        const box =
            document.createElement("div");

        box.className =
            "final-player";

        const charactersHTML =
            team.team
                .map(id => `
                    <div class="team-character">
                        ${getCharacterName(id)}
                    </div>
                `)
                .join("");

        box.innerHTML = `
            <h3>
                ${team.playerName}
            </h3>

            <div class="final-team">
                ${charactersHTML}
            </div>
        `;

        container.appendChild(box);

    });
}

/* =========================================================
   AI ANALYSIS
========================================================= */

function displayAIAnalysis(analysis) {

    const possible =
        [
            $("aiAnalysis"),
            $("teamAnalysis"),
            $("auctionAIAnalysis")
        ];

    const box =
        possible.find(element => element);

    if (!box) return;

    if (!analysis) {

        box.innerHTML =
            "<p>No team analysis available.</p>";

        return;
    }

    box.innerHTML = `
        <h2>🤖 AI Team Analysis</h2>

        <div class="ai-analysis-text">
            ${formatAIText(analysis.text || "")}
        </div>
    `;
}

function formatAIText(text) {

    return String(text)
        .replace(/\n/g, "<br>");
}

/* =========================================================
   AUCTION STARTED
========================================================= */

socket.on(
    "auctionStarted",
    data => {

        gameMode = "auction";

        showScreen(
            "auctionScreen"
        );

        updateAuctionSettings(
            data.settings
        );

    }
);

/* =========================================================
   AUCTION CHARACTER
========================================================= */

socket.on(
    "auctionCharacter",
    data => {

        currentAuction =
            data;

        showScreen(
            "auctionScreen"
        );

        renderAuction(
            data
        );

    }
);

/* =========================================================
   AUCTION TIMER
========================================================= */

socket.on(
    "auctionTimer",
    data => {

        currentAuction =
            data;

        renderAuctionTimer(
            data.timeLeft
        );

        updateAuctionMoney(
            data.players
        );

    }
);

/* =========================================================
   AUCTION UPDATED
========================================================= */

socket.on(
    "auctionUpdated",
    data => {

        currentAuction =
            data;

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
        characters[data.character];

    if (!character) return;

    const name =
        $("auctionCharacterName");

    if (name) {
        name.textContent =
            character.name;
    }

    const image =
        $("auctionCharacterImage");

    if (image) {

        image.src =
            character.image;

        image.alt =
            character.name;
    }

    const bid =
        $("currentBid");

    if (bid) {
        bid.textContent =
            data.currentBid || 0;
    }

    const bidder =
        $("highestBidder");

    if (bidder) {

        bidder.textContent =
            data.highestBidderName
                ? `Highest bidder: ${data.highestBidderName}`
                : "No bids yet";
    }

    renderAuctionTimer(
        data.timeLeft
    );

    updateAuctionMoney(
        data.players
    );

    updateAuctionButtons(
        data
    );
}

/* =========================================================
   AUCTION TIMER DISPLAY
========================================================= */

function renderAuctionTimer(time) {

    const timer =
        $("auctionTimer");

    if (timer) {

        timer.textContent =
            `${Math.max(0, Number(time) || 0)}s`;

    }
}

/* =========================================================
   AUCTION MONEY
========================================================= */

function updateAuctionMoney(players) {

    if (!Array.isArray(players)) {
        return;
    }

    const me =
        players.find(
            player =>
                player.id === socket.id
        );

    if (!me) return;

    const elements = [
        $("remainingMoney"),
        $("myBalance"),
        $("auctionBalance")
    ];

    elements.forEach(element => {

        if (element) {

            element.textContent =
                `${me.balance} 💰`;

        }

    });
}

/* =========================================================
   AUCTION SETTINGS
========================================================= */

function updateAuctionSettings(settings) {

    if (!settings) return;

    const bidAmount =
        $("bidAmountDisplay");

    if (bidAmount) {

        bidAmount.textContent =
            `${settings.bidAmount} 💰`;

    }

    const teamSize =
        $("teamSizeDisplay");

    if (teamSize) {

        teamSize.textContent =
            settings.teamSize;

    }
}

/* =========================================================
   AUCTION BUTTONS
========================================================= */

function updateAuctionButtons(data) {

    const bidButton =
        $("bidButton");

    const giveUpButton =
        $("giveUpButton");

    const unsoldButton =
        $("unsoldButton");

    if (bidButton) {

        bidButton.disabled =
            !data.active ||
            data.highestBidder === socket.id;

    }

    if (giveUpButton) {

        giveUpButton.disabled =
            !data.active;

    }

    if (unsoldButton) {

        /*
         * Before anybody bids:
         * button says UNSOLD.
         *
         * Once bidding starts:
         * it becomes GIVE UP.
         */

        if (data.highestBidder) {

            unsoldButton.textContent =
                "GIVE UP";

            unsoldButton.disabled =
                false;

            unsoldButton.onclick =
                window.giveUpAuction;

        } else {

            unsoldButton.textContent =
                "UNSOLD";

            unsoldButton.disabled =
                false;

            unsoldButton.onclick =
                window.unsoldAuction;

        }
    }
}

/* =========================================================
   BID
========================================================= */

window.bidAuction = function () {

    socket.emit(
        "auctionBid"
    );
};

/* =========================================================
   GIVE UP
========================================================= */

window.giveUpAuction = function () {

    socket.emit(
        "auctionGiveUp"
    );

    showMessage(
        "You gave up on this character."
    );
};

/* =========================================================
   UNSOLD
========================================================= */

window.unsoldAuction = function () {

    socket.emit(
        "auctionUnsold"
    );
};

/* =========================================================
   AUCTION GIVE UP RESULT
========================================================= */

socket.on(
    "auctionGiveUp",
    data => {

        if (
            data.playerId ===
            socket.id
        ) {

            showMessage(
                "You gave up."
            );

        } else {

            showMessage(
                `${data.playerName} gave up.`
            );

        }

    }
);

/* =========================================================
   SOLD
========================================================= */

socket.on(
    "auctionSold",
    data => {

        const buyer =
            data.buyerId === socket.id
                ? "You"
                : data.buyerName;

        showMessage(
            `${data.character} sold to ${buyer} for ${data.price} 💰`
        );

        updateAuctionMoney(
            data.teams
        );

        const result =
            $("auctionResult");

        if (result) {

            result.innerHTML = `
                <strong>
                    ${getCharacterName(data.character)}
                </strong>

                sold to
                <strong>
                    ${data.buyerName}
                </strong>

                for
                <strong>
                    ${data.price} 💰
                </strong>

                <br>

                Remaining money:
                <strong>
                    ${data.remainingMoney} 💰
                </strong>
            `;

        }

    }
);

/* =========================================================
   UNSOLD RESULT
========================================================= */

socket.on(
    "auctionUnsoldResult",
    data => {

        showMessage(
            `${getCharacterName(data.character)} was UNSOLD`
        );

        const result =
            $("auctionResult");

        if (result) {

            result.textContent =
                `${getCharacterName(data.character)} was UNSOLD`;

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
            "auctionResultScreen"
        );

        displayFinalTeams(
            data.teams || []
        );

        displayAIAnalysis(
            data.analysis
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
            message
        );

    }
);

/* =========================================================
   HOST CHANGE
========================================================= */

socket.on(
    "hostChanged",
    data => {

        isHost =
            data.host === socket.id;

        if (isHost) {

            showMessage(
                "You are now the host."
            );

        }

    }
);

/* =========================================================
   INITIAL SCREEN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Don't automatically change the screen
         * if index.html already controls it.
         */

        updateRoomCode();

    }
);
