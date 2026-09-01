/* =========================================================
   NARUTO CHARACTER RANK + AUCTION
   COMPLETE GAME.JS
========================================================= */

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
        "Duy",
        "Tsunade",
        "Minato",
        "Itachi",
        "Obito",
        "KillerB"
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
let auctionSeconds = 0;


/* =========================================================
   DOM HELPER
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   SCREEN
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

    if (!message) return;

    message.textContent = text;
    message.style.display = "block";

    clearTimeout(
        showMessage.timeout
    );

    showMessage.timeout =
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
        Number(
            $("maxPlayers")?.value
        );

    if (!maxPlayers || maxPlayers < 2) {
        maxPlayers = 6;
    }

    let teamSize =
        Number(
            $("teamSize")?.value
        );

    if (!teamSize || teamSize < 1) {
        teamSize = 5;
    }

    let startingBalance =
        Number(
            $("startingBalance")?.value
        );

    if (
        !startingBalance ||
        startingBalance < 1
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

    socket.emit(
        "joinRoom",
        {
            name,
            roomCode: code
        }
    );
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

socket.on(
    "roomCreated",
    data => {

        roomCode =
            data.roomCode;

        isHost =
            true;

        gameMode =
            data.gameMode;

        const code =
            $("roomCode");

        if (code) {
            code.textContent =
                roomCode;
        }

        showScreen("lobbyScreen");
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
            false;

        gameMode =
            data.gameMode;

        const code =
            $("roomCode");

        if (code) {
            code.textContent =
                roomCode;
        }

        showScreen("lobbyScreen");
    }
);


/* =========================================================
   PLAYERS UPDATED
========================================================= */

socket.on(
    "playersUpdated",
    data => {

        const list =
            $("playersList");

        if (!list) return;

        list.innerHTML = "";

        data.players.forEach(
            player => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "player-item";

                div.textContent =
                    player.name;

                list.appendChild(div);
            }
        );

        const waiting =
            $("waitingText");

        if (waiting) {

            if (
                data.players.length < 2
            ) {

                waiting.textContent =
                    "Waiting for another player...";

            } else {

                waiting.textContent =
                    "Ready! Host can start the game.";
            }
        }
    }
);


/* =========================================================
   ERROR
========================================================= */

socket.on(
    "errorMessage",
    message => {
        showMessage(message);
    }
);


/* =========================================================
   RANK SCREEN
========================================================= */

function buildRankScreen() {

    const title =
        $("categoryTitle");

    const counter =
        $("categoryCounter");

    const category =
        categories[currentCategory];

    if (title) {
        title.textContent =
            category;
    }

    if (counter) {

        counter.textContent =
            `Category ${currentCategory + 1}/16`;
    }

    const list =
        $("characterGrid");

    if (!list) return;

    list.innerHTML = "";

    let ranked =
        [
            ...(rankings[category] || [])
        ];

    const rankedSet =
        new Set(ranked);

    Object.keys(characters)
        .forEach(key => {

            if (
                !rankedSet.has(key)
            ) {
                ranked.push(key);
            }

        });

    ranked.forEach(
        (key, index) => {

            const char =
                characters[key];

            if (!char) return;

            const card =
                document.createElement(
                    "button"
                );

            card.className =
                "character-card";

            card.innerHTML = `

                <div class="rank-number">
                    #${index + 1}
                </div>

                <img
                    src="${char.image}"
                    alt="${char.name}"
                    onerror="
                        this.style.display='none'
                    "
                >

                <strong>
                    ${char.name}
                </strong>

            `;

            card.onclick = () => {

                selectRankCharacter(
                    key
                );

            };

            list.appendChild(card);
        }
    );
}


/* =========================================================
   SELECT CHARACTER
========================================================= */

function selectRankCharacter(
    character
) {

    socket.emit(
        "rankSelect",
        {
            categoryIndex:
                currentCategory,

            character
        }
    );

    showMessage(
        `Selected ${characters[character]?.name || character}`
    );
}


/* =========================================================
   PRIVATE RANK SELECTION
========================================================= */

socket.on(
    "rankSelectionMade",
    data => {

        /*
         * IMPORTANT:
         * Do NOT show the selected character
         * to all players.
         *
         * The server should send only
         * private confirmation to the player.
         */

        if (
            data.playerId ===
            socket.id
        ) {

            showMessage(
                `You selected ${
                    characters[data.character]?.name ||
                    data.character
                }`
            );

            const status =
                $("selectionStatus");

            if (status) {

                status.textContent =
                    "Selection recorded. Waiting for other players...";
            }
        }
    }
);


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

        showScreen(
            "rankScreen"
        );

        buildRankScreen();
    }
);


/* =========================================================
   CATEGORY COMPLETE
========================================================= */

socket.on(
    "rankCategoryComplete",
    data => {

        const completed =
            Number(
                data.categoryIndex
            );

        if (
            completed ===
            currentCategory
        ) {

            showMessage(
                `Category ${completed + 1}/16 completed.`
            );
        }
    }
);


/* =========================================================
   NEXT CATEGORY
========================================================= */

socket.on(
    "rankNextCategory",
    data => {

        currentCategory =
            Number(
                data.categoryIndex
            );

        if (
            currentCategory < 0 ||
            currentCategory >= 16
        ) {
            return;
        }

        buildRankScreen();

        const status =
            $("selectionStatus");

        if (status) {
            status.textContent =
                "Choose your character.";
        }
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

        displayRankResults(
            data
        );
    }
);


/* =========================================================
   RANK RESULTS
========================================================= */

function displayRankResults(data) {

    const container =
        $("rankResults");

    if (!container) return;

    container.innerHTML = "";

    if (
        !data ||
        !Array.isArray(
            data.results
        )
    ) {
        container.innerHTML =
            "<p>No ranking results.</p>";

        return;
    }

    data.results.forEach(
        player => {

            const box =
                document.createElement(
                    "div"
                );

            box.className =
                "final-player";

            let html = `
                <h2>
                    ${escapeHTML(
                        player.playerName
                    )}
                </h2>
            `;

            const selections =
                player.selections || {};

            Object.entries(
                selections
            ).forEach(
                ([categoryIndex, key]) => {

                    const category =
                        categories[
                            Number(
                                categoryIndex
                            )
                        ];

                    const char =
                        characters[key];

                    html += `
                        <div class="team-character">
                            <strong>
                                ${escapeHTML(
                                    category
                                )}
                            </strong>
                            :
                            ${escapeHTML(
                                char
                                    ? char.name
                                    : key
                            )}
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

    /*
     * AI FINAL ANALYSIS
     */

    if (
        data.aiAnalysis
    ) {

        const aiBox =
            document.createElement(
                "div"
            );

        aiBox.className =
            "ai-analysis";

        aiBox.innerHTML = `

            <h2>
                🤖 AI Best Team Analysis
            </h2>

            <p>
                ${escapeHTML(
                    data.aiAnalysis
                )}
            </p>

        `;

        container.appendChild(
            aiBox
        );
    }
}


/* =========================================================
   AUCTION STARTED
========================================================= */

socket.on(
    "auctionStarted",
    data => {

        gameMode =
            "auction";

        showScreen(
            "auctionScreen"
        );

        currentAuctionState =
            null;

        stopAuctionTimer();

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

        currentAuctionState =
            data;

        showScreen(
            "auctionScreen"
        );

        renderAuction(
            data
        );

        startAuctionCountdown(
            data.bidTime ||
            data.timeRemaining ||
            10
        );
    }
);


/* =========================================================
   AUCTION UPDATED
========================================================= */

socket.on(
    "auctionUpdated",
    data => {

        currentAuctionState =
            data;

        renderAuction(
            data
        );

        /*
         * Server resets the timer
         * after every valid bid.
         */

        startAuctionCountdown(
            data.timeRemaining ||
            data.bidTime ||
            10
        );
    }
);


/* =========================================================
   AUCTION TIMER
========================================================= */

function startAuctionCountdown(
    seconds
) {

    stopAuctionTimer();

    auctionSeconds =
        Math.max(
            0,
            Number(seconds) || 10
        );

    updateAuctionTimerUI();

    auctionTimer =
        setInterval(
            () => {

                auctionSeconds--;

                if (
                    auctionSeconds <= 0
                ) {

                    auctionSeconds = 0;

                    updateAuctionTimerUI();

                    stopAuctionTimer();

                    return;
                }

                updateAuctionTimerUI();

            },
            1000
        );
}


function stopAuctionTimer() {

    if (auctionTimer) {

        clearInterval(
            auctionTimer
        );

        auctionTimer =
            null;
    }
}


function updateAuctionTimerUI() {

    const elements = [
        $("auctionTimer"),
        $("bidTimer"),
        $("auctionCountdown")
    ];

    elements.forEach(
        element => {

            if (element) {

                element.textContent =
                    `${auctionSeconds}s`;
            }
        }
    );
}


/* =========================================================
   AUCTION UI
========================================================= */

function renderAuction(
    data
) {

    if (!data) return;

    currentAuctionState =
        data;

    const name =
        data.characterName ||
        data.character;

    const char =
        characters[name];

    const title =
        $("auctionCharacterName");

    if (title) {

        title.textContent =
            char
                ? char.name
                : name;
    }

    const image =
        $("auctionCharacterImage");

    if (
        image &&
        char
    ) {

        image.src =
            char.image;

        image.alt =
            char.name;
    }

    const bid =
        Number(
            data.currentBid
        ) || 0;

    const currentBid =
        $("currentBid");

    if (currentBid) {

        currentBid.textContent =
            `Current Bid: ${bid}`;
    }

    const remaining =
        data.remainingMoney;

    const money =
        $("remainingMoney");

    if (
        money &&
        remaining !== undefined
    ) {

        money.textContent =
            `Money Left: ${remaining}`;
    }

    /*
     * Other possible IDs.
     */

    const myBalance =
        $("myBalance");

    if (
        myBalance &&
        data.myBalance !== undefined
    ) {

        myBalance.textContent =
            `Balance: ${data.myBalance}`;
    }

    const buyer =
        $("highestBidderName");

    if (buyer) {

        buyer.textContent =
            data.highestBidderName
                ? `Highest Bidder: ${data.highestBidderName}`
                : "No bids yet";
    }

    const bidButton =
        $("bidButton");

    if (bidButton) {

        bidButton.disabled =
            Boolean(
                data.canBid === false
            );
    }

    const giveUpButton =
        $("giveUpButton");

    if (giveUpButton) {

        /*
         * At the beginning this acts
         * as Give Up.
         */

        giveUpButton.textContent =
            "Give Up";

        giveUpButton.disabled =
            Boolean(
                data.canGiveUp === false
            );

        giveUpButton.style.display =
            "block";
    }

    const unsoldButton =
        $("unsoldButton");

    if (unsoldButton) {

        /*
         * Replace old UNSOLD behavior
         * with Give Up.
         */

        unsoldButton.textContent =
            "Give Up";

        unsoldButton.style.display =
            "block";

        unsoldButton.disabled =
            Boolean(
                data.canGiveUp === false
            );
    }

    /*
     * Auction suggestion from AI.
     */

    const suggestion =
        $("auctionAISuggestion");

    if (
        suggestion &&
        data.aiSuggestion
    ) {

        suggestion.textContent =
            data.aiSuggestion;
    }
}


/* =========================================================
   UPDATE SETTINGS
========================================================= */

function updateAuctionSettings(
    settings
) {

    if (!settings) return;

    const bidAmount =
        $("bidAmount");

    if (bidAmount) {

        bidAmount.textContent =
            `Bid Increase: ${settings.bidAmount}`;
    }

    const teamSize =
        $("auctionTeamSize");

    if (teamSize) {

        teamSize.textContent =
            `Team Size: ${settings.teamSize}`;
    }

    const starting =
        $("auctionStartingBalance");

    if (starting) {

        starting.textContent =
            `Starting Money: ${settings.startingBalance}`;
    }
}


/* =========================================================
   BID BUTTON
========================================================= */

window.placeBid = function () {

    if (!currentAuctionState) {
        return;
    }

    socket.emit(
        "auctionBid"
    );
};


/* =========================================================
   GIVE UP
========================================================= */

window.giveUp = function () {

    if (!currentAuctionState) {
        return;
    }

    socket.emit(
        "auctionGiveUp"
    );

    showMessage(
        "You gave up on this character."
    );
};


/* =========================================================
   OLD UNSOLD BUTTON
========================================================= */

window.auctionUnsold = function () {

    /*
     * Keep old HTML working.
     * It now sends Give Up instead.
     */

    giveUp();
};


/* =========================================================
   AUCTION SOLD
========================================================= */

socket.on(
    "auctionSold",
    data => {

        stopAuctionTimer();

        const character =
            data.characterName ||
            data.character;

        const buyer =
            data.buyerName ||
            data.playerName ||
            "Unknown Player";

        const price =
            Number(
                data.price ||
                data.currentBid ||
                0
            );

        showMessage(
            `${character} sold to ${buyer} for ${price}`
        );

        /*
         * Update balances for everyone.
         */

        if (
            data.players
        ) {

            updateAuctionPlayers(
                data.players
            );
        }

        /*
         * Keep screen visible for
         * the sold announcement.
         */

        const status =
            $("auctionStatus");

        if (status) {

            status.textContent =
                `${character} sold to ${buyer} for ${price}`;
        }
    }
);


/* =========================================================
   AUCTION UNSOLD RESULT
========================================================= */

socket.on(
    "auctionUnsold",
    data => {

        stopAuctionTimer();

        const character =
            data.characterName ||
            data.character;

        showMessage(
            `${character} was UNSOLD`
        );

        const status =
            $("auctionStatus");

        if (status) {

            status.textContent =
                `${character} was UNSOLD`;
        }
    }
);


/* =========================================================
   AUCTION PLAYERS / MONEY
========================================================= */

socket.on(
    "auctionPlayersUpdated",
    data => {

        updateAuctionPlayers(
            data.players ||
            []
        );
    }
);


function updateAuctionPlayers(
    players
) {

    const container =
        $("auctionPlayers");

    if (!container) return;

    container.innerHTML = "";

    players.forEach(
        player => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "auction-player";

            div.innerHTML = `

                <strong>
                    ${escapeHTML(
                        player.name
                    )}
                </strong>

                <span>
                    Money:
                    ${Number(
                        player.balance || 0
                    )}
                </span>

                <span>
                    Team:
                    ${
                        Array.isArray(
                            player.team
                        )
                            ? player.team.length
                            : 0
                    }
                </span>

            `;

            container.appendChild(
                div
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

        stopAuctionTimer();

        showScreen(
            "auctionResultScreen"
        );

        displayAuctionResults(
            data
        );
    }
);


/* =========================================================
   FINAL AUCTION TEAMS
========================================================= */

function displayAuctionResults(
    data
) {

    const container =
        $("auctionResults");

    if (!container) return;

    container.innerHTML = "";

    const players =
        data.players ||
        data.results ||
        [];

    players.forEach(
        player => {

            const box =
                document.createElement(
                    "div"
                );

            box.className =
                "final-player";

            let html = `

                <h2>
                    ${escapeHTML(
                        player.name ||
                        player.playerName ||
                        "Player"
                    )}
                </h2>

            `;

            const team =
                player.team || [];

            html += `
                <h3>
                    Team (${team.length})
                </h3>
            `;

            team.forEach(
                item => {

                    const key =
                        typeof item === "string"
                            ? item
                            : item.character;

                    const char =
                        characters[key];

                    html += `

                        <div class="team-character">

                            ${
                                char
                                    ? escapeHTML(
                                        char.name
                                    )
                                    : escapeHTML(
                                        key || "Unknown"
                                    )
                            }

                        </div>

                    `;
                }
            );

            if (
                player.balance !== undefined
            ) {

                html += `
                    <p>
                        Remaining Money:
                        ${Number(
                            player.balance
                        )}
                    </p>
                `;
            }

            box.innerHTML =
                html;

            container.appendChild(
                box
            );
        }
    );

    /*
     * AI final recommendation.
     */

    const ai =
        data.aiAnalysis ||
        data.bestTeamAnalysis ||
        data.aiRecommendation;

    if (ai) {

        const aiBox =
            document.createElement(
                "div"
            );

        aiBox.className =
            "ai-analysis";

        aiBox.innerHTML = `

            <h2>
                🤖 AI Best Team
            </h2>

            <p>
                ${escapeHTML(
                    ai
                )}
            </p>

        `;

        container.appendChild(
            aiBox
        );
    }
}


/* =========================================================
   AI AUCTION SUGGESTION
========================================================= */

socket.on(
    "auctionAISuggestion",
    data => {

        const box =
            $("auctionAISuggestion");

        if (!box) return;

        box.textContent =
            data.message ||
            data.suggestion ||
            "AI suggestion unavailable.";
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

        if (isHost) {

            showMessage(
                "You are now the host."
            );
        }
    }
);


/* =========================================================
   GAME STARTED COMPATIBILITY
========================================================= */

socket.on(
    "gameStarted",
    () => {

        const button =
            $("nextCategoryButton");

        if (button) {
            button.style.display =
                "block";
        }
    }
);


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
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
   INITIAL STATE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Make sure only the lobby
         * is visible initially if
         * no screen is already active.
         */

        const visible =
            document.querySelector(
                ".screen:not(.hidden)"
            );

        if (!visible) {

            const lobby =
                $("lobbyScreen");

            if (lobby) {
                lobby.classList.remove(
                    "hidden"
                );
            }
        }
    }
);
