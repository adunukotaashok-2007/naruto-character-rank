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
   CATEGORY RANKINGS
   IMPORTANT:
   These use CHARACTER KEYS, not display names.
========================================================= */

const rankings = {

    "Speed": [
        "Minato",
        "Naruto",
        "Tobirama",
        "FourthRaikage",
        "Sasuke",
        "Kakashi",
        "Shisui",
        "Guy",
        "Lee",
        "Obito"
    ],

    "Strength": [
        "Madara",
        "Hashirama",
        "Naruto",
        "Sasuke",
        "Guy",
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

    "Durability": [
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

    "Chakra": [
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

    "Ninjutsu": [
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

    "Taijutsu": [
        "Guy",
        "Duy",
        "Lee",
        "Naruto",
        "Sasuke",
        "Neji",
        "ThirdRaikage",
        "FourthRaikage",
        "KillerB",
        "Kakashi"
    ],

    "Genjutsu": [
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

    "Defense": [
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

    "Attack": [
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

    "Stamina": [
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

    "Leadership": [
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

    "Versatility": [
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

    "Experience": [
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

    "Teamwork": [
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

let auctionTimer = null;
let currentAuctionState = null;


/* =========================================================
   DOM HELPER
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   SCREEN HELPER
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
        console.log(text);
        return;
    }

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

    let teamSize =
        Number($("teamSize")?.value);

    if (!teamSize || teamSize < 1) {
        teamSize = 5;
    }

    let startingBalance =
        Number($("startingBalance")?.value);

    if (!startingBalance || startingBalance < 0) {
        startingBalance = 1000;
    }

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
   START GAME
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

    showMessage(
        `Room created: ${roomCode}`
    );

    updateRoomInformation(data);

    showScreen("lobbyScreen");
});


/* =========================================================
   ROOM JOINED
========================================================= */

socket.on("roomJoined", data => {

    roomCode = data.roomCode;
    isHost = false;
    gameMode = data.gameMode;

    updateRoomInformation(data);

    showScreen("lobbyScreen");

    showMessage(
        `Joined room ${roomCode}`
    );
});


/* =========================================================
   ROOM INFORMATION
========================================================= */

function updateRoomInformation(data) {

    const code =
        $("roomCode");

    if (code) {
        code.textContent =
            data.roomCode || roomCode;
    }

    const mode =
        $("roomGameMode");

    if (mode) {
        mode.textContent =
            data.gameMode || gameMode;
    }

    if (data.settings) {

        const team =
            $("roomTeamSize");

        if (team) {
            team.textContent =
                data.settings.teamSize;
        }

        const money =
            $("roomStartingBalance");

        if (money) {
            money.textContent =
                data.settings.startingBalance;
        }
    }
}


/* =========================================================
   PLAYERS UPDATED
========================================================= */

socket.on("playersUpdated", data => {

    const list =
        $("playersList");

    if (!list) return;

    list.innerHTML = "";

    data.players.forEach((player, index) => {

        const div =
            document.createElement("div");

        div.className =
            "player-item";

        div.textContent =
            `${index + 1}. ${player.name}`;

        if (player.balance !== undefined) {

            div.textContent +=
                ` — ₹${player.balance}`;

        }

        list.appendChild(div);
    });

    const waiting =
        $("waitingText");

    if (waiting) {

        if (data.players.length < 2) {

            waiting.textContent =
                "Waiting for another player...";

        } else {

            waiting.textContent =
                "Ready! Host can start the game.";
        }
    }
});


/* =========================================================
   HOST CHANGED
========================================================= */

socket.on("hostChanged", data => {

    isHost =
        data.host === socket.id;

    showMessage(
        isHost
            ? "You are now the host."
            : "Host changed."
    );
});


/* =========================================================
   BUILD CHARACTER RANK SCREEN
========================================================= */

function buildRankScreen() {

    const title =
        $("categoryTitle");

    const number =
        $("categoryNumber");

    const total =
        $("categoryTotal");

    const progress =
        $("categoryProgress");


    /* -----------------------------------------
       CATEGORY TITLE
    ----------------------------------------- */

    if (title) {

        title.textContent =
            categories[currentCategory];
    }


    /* -----------------------------------------
       1 / 16
    ----------------------------------------- */

    if (number) {

        number.textContent =
            currentCategory + 1;
    }


    if (total) {

        total.textContent =
            categories.length;
    }


    /* -----------------------------------------
       OPTIONAL SINGLE COUNTER
       Example: 1 / 16
    ----------------------------------------- */

    if (progress) {

        progress.textContent =
            `${currentCategory + 1} / ${categories.length}`;
    }


    /* -----------------------------------------
       CHARACTER GRID
    ----------------------------------------- */

    const list =
        $("characterGrid");

    if (!list) return;

    list.innerHTML = "";


    const category =
        categories[currentCategory];


    /*
     * Start with the best characters for this
     * category, then append every other character.
     */

    const ranked =
        [
            ...(rankings[category] || [])
        ];


    const rankedSet =
        new Set(ranked);


    Object.keys(characters)
        .forEach(key => {

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


        card.innerHTML = `

            <div class="rank-number">
                #${index + 1}
            </div>

            <img
                src="${char.image}"
                alt="${char.name}"
                loading="lazy"
                onerror="
                    this.style.display='none';
                "
            >

            <strong>
                ${char.name}
            </strong>

        `;


        card.addEventListener(
            "click",
            () => {

                selectRankCharacter(key);

            }
        );


        list.appendChild(card);
    });
}


/* =========================================================
   SELECT RANK CHARACTER
========================================================= */

function selectRankCharacter(character) {

    if (!characters[character]) {
        return;
    }

    socket.emit("rankSelect", {

        categoryIndex:
            currentCategory,

        character
    });

    showMessage(
        `Selected ${characters[character].name}`
    );
}


/* =========================================================
   RANK SELECTION MADE
========================================================= */

socket.on(
    "rankSelectionMade",
    data => {

        const char =
            characters[data.character];

        const name =
            char
                ? char.name
                : data.character;


        const status =
            $("selectionStatus");

        if (status) {

            status.textContent =
                `${data.playerName} selected ${name}`;
        }
    }
);


/* =========================================================
   RANK CATEGORY COMPLETE
========================================================= */

socket.on(
    "rankCategoryComplete",
    data => {

        showMessage(
            "Everyone selected!"
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


        if (
            currentCategory < 0 ||
            currentCategory >= categories.length
        ) {
            currentCategory = 0;
        }


        buildRankScreen();

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
   RANK FINISHED
========================================================= */

socket.on(
    "rankGameFinished",
    data => {

        showScreen(
            "rankResultScreen"
        );


        const container =
            $("rankResults");

        if (!container) return;

        container.innerHTML = "";


        if (
            !data.results ||
            !data.results.length
        ) {

            container.innerHTML =
                "<p>No results available.</p>";

            return;
        }


        data.results.forEach(player => {

            const box =
                document.createElement("div");

            box.className =
                "final-player";


            let html = `

                <h3>
                    ${escapeHTML(
                        player.playerName
                    )}
                </h3>

            `;


            Object.entries(
                player.selections || {}
            ).forEach(
                ([categoryIndex, key]) => {

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
                                        key
                                      )
                            }

                        </div>

                    `;
                }
            );


            box.innerHTML =
                html;


            container.appendChild(
                box
            );
        });


        buildOverallResult(
            data.results
        );
    }
);


/* =========================================================
   OVERALL RESULT
========================================================= */

function buildOverallResult(results) {

    const overall =
        $("overallWinner");

    if (!overall) return;


    /*
     * AI-style recommendation:
     *
     * This does NOT use points.
     * It compares the characters selected in
     * all 16 categories and identifies the
     * strongest overall selection profile.
     */


    const playerProfiles =
        results.map(player => {

            const selected =
                Object.values(
                    player.selections || {}
                );


            let eliteCount = 0;


            selected.forEach(
                (key, index) => {

                    const category =
                        categories[index];


                    const top =
                        rankings[category] || [];


                    const position =
                        top.indexOf(key);


                    if (
                        position !== -1 &&
                        position < 3
                    ) {

                        eliteCount++;
                    }
                }
            );


            return {

                player,

                eliteCount,

                total:
                    selected.length

            };

        });


    playerProfiles.sort(
        (a, b) => {

            if (
                b.eliteCount !==
                a.eliteCount
            ) {

                return (
                    b.eliteCount -
                    a.eliteCount
                );
            }


            return (
                b.total -
                a.total
            );
        }
    );


    const winner =
        playerProfiles[0];


    if (!winner) return;


    overall.innerHTML = `

        <div class="overall-winner-box">

            <h2>
                🏆 Best Overall Player
            </h2>

            <h3>
                ${escapeHTML(
                    winner.player.playerName
                )}
            </h3>

            <p>
                AI-style analysis considers
                the player's selections across
                all 16 categories.
            </p>

        </div>

    `;
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

        currentAuctionState =
            data;


        showScreen(
            "auctionScreen"
        );


        renderAuction(
            data
        );


        startAuctionCountdown(
            getAuctionTime(data)
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
         * If server sends a new time,
         * synchronize the local countdown.
         */

        if (
            data.timeLeft !== undefined ||
            data.seconds !== undefined
        ) {

            startAuctionCountdown(
                getAuctionTime(data)
            );
        }
    }
);


/* =========================================================
   AUCTION TIMER FROM SERVER
========================================================= */

socket.on(
    "auctionTimer",
    data => {

        startAuctionCountdown(
            getAuctionTime(data)
        );
    }
);


/* =========================================================
   GET AUCTION TIME
========================================================= */

function getAuctionTime(data) {

    if (!data) {
        return 10;
    }

    if (
        data.timeLeft !== undefined
    ) {

        return Number(
            data.timeLeft
        );
    }

    if (
        data.seconds !== undefined
    ) {

        return Number(
            data.seconds
        );
    }

    if (
        data.bidTime !== undefined
    ) {

        return Number(
            data.bidTime
        );
    }


    if (
        data.settings &&
        data.settings.bidTime !== undefined
    ) {

        return Number(
            data.settings.bidTime
        );
    }


    return 10;
}


/* =========================================================
   AUCTION COUNTDOWN
========================================================= */

function startAuctionCountdown(seconds) {

    clearInterval(
        auctionTimer
    );


    let remaining =
        Math.max(
            0,
            Number(seconds) || 10
        );


    updateAuctionTimer(
        remaining
    );


    auctionTimer =
        setInterval(
            () => {

                remaining--;


                if (
                    remaining <= 0
                ) {

                    remaining = 0;

                    updateAuctionTimer(
                        remaining
                    );


                    clearInterval(
                        auctionTimer
                    );

                    auctionTimer =
                        null;

                    return;
                }


                updateAuctionTimer(
                    remaining
                );

            },
            1000
        );
}


/* =========================================================
   UPDATE TIMER DISPLAY
========================================================= */

function updateAuctionTimer(seconds) {

    const timer =
        $("auctionTimer");

    if (!timer) return;


    timer.textContent =
        String(seconds);


    timer.setAttribute(
        "data-time",
        String(seconds)
    );


    if (
        seconds <= 3
    ) {

        timer.classList.add(
            "danger"
        );

    } else {

        timer.classList.remove(
            "danger"
        );
    }
}


/* =========================================================
   RENDER AUCTION
========================================================= */

function renderAuction(data) {

    if (!data) return;


    const characterKey =
        data.character;


    const char =
        characters[characterKey];


    const name =
        char
            ? char.name
            : characterKey;


    /* -----------------------------------------
       CHARACTER NAME
    ----------------------------------------- */

    const title =
        $("auctionCharacterName");

    if (title) {

        title.textContent =
            name;
    }


    /* -----------------------------------------
       CHARACTER IMAGE
    ----------------------------------------- */

    const image =
        $("auctionCharacterImage");

    if (image) {

        if (char) {

            image.src =
                char.image;

            image.alt =
                char.name;

            image.style.display =
                "block";

        } else {

            image.style.display =
                "none";
        }
    }


    /* -----------------------------------------
       CURRENT BID
    ----------------------------------------- */

    const bid =
        $("currentBid");

    if (bid) {

        bid.textContent =
            data.currentBid ?? 0;
    }


    /* -----------------------------------------
       HIGHEST BIDDER
    ----------------------------------------- */

    const bidder =
        $("highestBidder");


    if (bidder) {

        let bidderName =
            data.highestBidderName;


        /*
         * Some server versions send:
         * bidderName
         */

        if (
            !bidderName &&
            data.bidderName
        ) {

            bidderName =
                data.bidderName;
        }


        /*
         * Some versions send bidder object.
         */

        if (
            !bidderName &&
            data.highestBidder &&
            typeof data.highestBidder === "object"
        ) {

            bidderName =
                data.highestBidder.name;
        }


        bidder.textContent =
            bidderName ||
            "No bids yet";
    }


    /* -----------------------------------------
       AUCTION STATUS
    ----------------------------------------- */

    const status =
        $("auctionStatus");

    if (status) {

        if (
            data.highestBidderName ||
            data.bidderName
        ) {

            status.textContent =
                `Highest bidder: ${
                    data.highestBidderName ||
                    data.bidderName
                }`;

        } else {

            status.textContent =
                "Waiting for bids...";
        }
    }


    /* -----------------------------------------
       TEAM INFORMATION
    ----------------------------------------- */

    renderAuctionPlayers(
        data.players
    );
}


/* =========================================================
   RENDER AUCTION PLAYERS
========================================================= */

function renderAuctionPlayers(players) {

    const container =
        $("auctionPlayers");

    if (!container || !Array.isArray(players)) {
        return;
    }


    container.innerHTML = "";


    players.forEach(player => {

        const box =
            document.createElement("div");

        box.className =
            "auction-player";


        const teamCount =
            Array.isArray(player.team)
                ? player.team.length
                : 0;


        box.innerHTML = `

            <strong>
                ${escapeHTML(
                    player.name || "Player"
                )}
            </strong>

            <span>
                Balance:
                ${player.balance ?? 0}
            </span>

            <span>
                Team:
                ${teamCount}
            </span>

        `;


        container.appendChild(
            box
        );
    });
}


/* =========================================================
   BID BUTTON
========================================================= */

window.placeBid = function () {

    if (!currentAuctionState) {

        showMessage(
            "Auction has not started."
        );

        return;
    }


    socket.emit(
        "auctionBid"
    );
};


/* =========================================================
   SUPPORT COMMON BID BUTTON NAMES
========================================================= */

window.bid = window.placeBid;
window.auctionBid = window.placeBid;


/* =========================================================
   UNSOLD BUTTON
========================================================= */

window.markUnsold = function () {

    socket.emit(
        "auctionUnsold"
    );
};


window.unsold = window.markUnsold;
window.auctionUnsold =
    window.markUnsold;


/* =========================================================
   AUCTION SOLD EVENT
========================================================= */

socket.on(
    "auctionSold",
    data => {

        clearInterval(
            auctionTimer
        );


        const character =
            data.character;


        const char =
            characters[character];


        const characterName =
            char
                ? char.name
                : character;


        /*
         * IMPORTANT:
         * Never display undefined.
         */

        const winner =
            data.winnerName ||
            data.bidderName ||
            data.highestBidderName ||
            data.playerName ||
            "Player";


        showAuctionResult(
            `${characterName} sold to ${winner}`
        );
    }
);


/* =========================================================
   AUCTION UNSOLD EVENT
========================================================= */

socket.on(
    "auctionUnsold",
    data => {

        clearInterval(
            auctionTimer
        );


        const character =
            data?.character ||
            currentAuctionState?.character;


        const char =
            characters[character];


        const name =
            char
                ? char.name
                : character || "Character";


        showAuctionResult(
            `${name} — UNSOLD`
        );
    }
);


/* =========================================================
   GENERIC AUCTION FINISHED
========================================================= */

socket.on(
    "auctionFinished",
    data => {

        clearInterval(
            auctionTimer
        );


        showAuctionFinalResult(
            data
        );
    }
);


/* =========================================================
   AUCTION CHARACTER SOLD / FINISHED
========================================================= */

socket.on(
    "auctionCharacterSold",
    data => {

        clearInterval(
            auctionTimer
        );


        const char =
            characters[data.character];


        const name =
            char
                ? char.name
                : data.character;


        const winner =
            data.winnerName ||
            data.bidderName ||
            data.highestBidderName ||
            data.playerName ||
            "Player";


        showAuctionResult(
            `${name} sold to ${winner}`
        );
    }
);


/* =========================================================
   AUCTION RESULT MESSAGE
========================================================= */

function showAuctionResult(text) {

    const result =
        $("auctionResult");


    if (result) {

        result.textContent =
            text;

        result.style.display =
            "block";
    }


    showMessage(
        text
    );
}


/* =========================================================
   AUCTION FINAL RESULT
========================================================= */

function showAuctionFinalResult(data) {

    showScreen(
        "auctionResultScreen"
    );


    const container =
        $("auctionResults");


    if (!container) return;


    container.innerHTML = "";


    if (
        data &&
        Array.isArray(data.players)
    ) {

        data.players.forEach(
            player => {

                const box =
                    document.createElement(
                        "div"
                    );


                box.className =
                    "final-player";


                box.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            player.name
                        )}
                    </h3>

                    <p>
                        Balance:
                        ${player.balance ?? 0}
                    </p>

                    <p>
                        Team:
                        ${
                            Array.isArray(
                                player.team
                            )
                                ? player.team.length
                                : 0
                        }
                    </p>

                `;


                container.appendChild(
                    box
                );
            }
        );
    }
}


/* =========================================================
   ERROR MESSAGE
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
   GENERAL ERROR
========================================================= */

socket.on(
    "connect_error",
    error => {

        console.error(
            "Socket connection error:",
            error
        );


        showMessage(
            "Cannot connect to multiplayer server."
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
            "Connected to server:",
            socket.id
        );
    }
);


/* =========================================================
   DISCONNECTION
========================================================= */

socket.on(
    "disconnect",
    reason => {

        console.log(
            "Disconnected:",
            reason
        );

        clearInterval(
            auctionTimer
        );
    }
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";
    }


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
   DEBUG
========================================================= */

console.log(
    "Naruto Character Rank loaded."
);

console.log(
    "Characters:",
    Object.keys(characters).length
);

console.log(
    "Categories:",
    categories.length
);
