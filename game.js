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
   16 RANKING CATEGORIES
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

    "Speed": [
        "Minato",
        "Naruto",
        "Tobirama",
        "FourthRaikage",
        "Sasuke",
        "Kakashi",
        "Shisui",
        "Might Guy",
        "Rock Lee",
        "Obito"
    ],

    "Strength": [
        "Madara",
        "Hashirama",
        "Naruto",
        "Sasuke",
        "Might Guy",
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
        "Might Guy",
        "Rock Lee",
        "Naruto",
        "Sasuke",
        "Neji",
        "ThirdRaikage",
        "FourthRaikage",
        "KillerB",
        "Sakura",
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
        "Might Guy",
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
        "Shikamaru",
        "Gaara",
        "Hinata",
        "Choji",
        "Kiba"
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
        "Might Guy",
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
   DOM HELPERS
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.add(
                "hidden"
            );

        });


    const screen = $(id);

    if (screen) {

        screen.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(text) {

    const message =
        $("message");

    if (!message) return;

    message.textContent =
        text;

    message.style.display =
        "block";


    setTimeout(() => {

        message.style.display =
            "none";

    }, 2500);

}


/* =========================================================
   CREATE ROOM
========================================================= */

window.createRoom = function () {

    const name =
        $("playerName")?.value.trim();


    if (!name) {

        showMessage(
            "Enter your name."
        );

        return;
    }


    myName =
        name;


    const mode =
        $("gameMode")?.value ||
        "rank";


    let maxPlayers =
        Number(
            $("maxPlayers")?.value
        );


    if (
        !maxPlayers ||
        maxPlayers < 2
    ) {

        maxPlayers = 6;

    }


    socket.emit(
        "createRoom",
        {

            name,

            gameMode:
                mode,

            maxPlayers,

            teamSize:
                Number(
                    $("teamSize")
                        ?.value
                ) || 5,

            startingBalance:
                Number(
                    $("startingBalance")
                        ?.value
                ) || 1000,

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


    myName =
        name;


    socket.emit(
        "joinRoom",
        {

            name,

            roomCode:
                code

        }
    );

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


    socket.emit(
        "startGame"
    );

};


/* =========================================================
   RANK SCREEN
========================================================= */

function buildRankScreen() {

    const title =
        $("categoryTitle");


    if (title) {

        title.textContent =
            categories[
                currentCategory
            ];

    }


    const list =
        $("characterGrid");


    if (!list) return;


    list.innerHTML = "";


    const category =
        categories[
            currentCategory
        ];


    let ranked =
        rankings[
            category
        ] || [];


    /*
     * Add every other character
     * after the featured ranking.
     */

    const rankedSet =
        new Set(ranked);


    Object.keys(
        characters
    ).forEach(key => {

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
                    onerror="this.style.display='none'"
                >

                <strong>
                    ${char.name}
                </strong>

            `;


            card.onclick =
                () => {

                    selectRankCharacter(
                        key
                    );

                };


            list.appendChild(
                card
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

    socket.emit(
        "rankSelect",
        {

            categoryIndex:
                currentCategory,

            character

        }
    );


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

        const status =
            $("selectionStatus");


        if (status) {

            status.textContent =
                `${data.playerName} selected ${characters[data.character]?.name || data.character}`;

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
            "Everyone selected. Next category..."
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
            data.categoryIndex;


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
            data.categoryIndex ||
            0;


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


        if (!container)
            return;


        container.innerHTML =
            "";


        data.results.forEach(
            player => {

                const box =
                    document.createElement(
                        "div"
                    );


                box.className =
                    "final-player";


                let html = `
                    <h3>
                        ${player.playerName}
                    </h3>
                `;


                Object.entries(
                    player.selections
                ).forEach(
                    ([categoryIndex, key]) => {

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


                box.innerHTML =
                    html;


                container.appendChild(
                    box
                );

            }
        );

    }
);


/* =========================================================
   AUCTION STARTED
========================================================= */

socket.on(
    "auctionStarted",
    data => {

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

    }
);


/* =========================================================
   RENDER AUCTION
========================================================= */

function renderAuction(
    data
) {

    const charKey =
        data.character;


    const char =
        characters[
            charKey
        ];


    if ($("auctionCharacterName")) {

        $("auctionCharacterName")
            .textContent =
            char
                ? char.name
                : charKey;

    }


    if ($("auctionCharacterImage")) {

        $("auctionCharacterImage")
            .src =
            char
                ? char.image
                : "";

    }


    if ($("currentBid")) {

        $("currentBid")
            .textContent =
            `₹${data.currentBid || 0}`;

    }


    if ($("highestBidder")) {

        $("highestBidder")
            .textContent =
            data.highestBidderName
                ? `Highest bidder: ${data.highestBidderName}`
                : "No bids yet";

    }


    /*
     * Update players.
     */

    const playersList =
        $("auctionPlayers");


    if (playersList) {

        playersList.innerHTML =
            "";


        data.players.forEach(
            player => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "auction-player";


                div.innerHTML = `

                    <div>
                        <strong>
                            ${player.name}
                        </strong>

                        <br>

                        💰 ₹${player.balance}

                    </div>

                    <div>
                        ${player.team.length}
                        / ${data.settings.teamSize}
                    </div>

                `;


                playersList.appendChild(
                    div
                );

            }
        );

    }


    updateBidButton(
        data
    );


    startLocalTimer(
        data.settings.bidTime
    );

}


/* =========================================================
   BID BUTTON
========================================================= */

function updateBidButton(
    data
) {

    const button =
        $("bidButton");


    if (!button)
        return;


    button.textContent =
        `💰 BID ₹${data.settings.bidAmount}`;


    /*
     * Highest bidder is disabled.
     */

    button.disabled =
        data.highestBidder ===
        socket.id;

}


/* =========================================================
   BID
========================================================= */

window.bid = function () {

    socket.emit(
        "auctionBid"
    );

};


/* =========================================================
   UNSOLD
========================================================= */

window.unsold = function () {

    socket.emit(
        "auctionUnsold"
    );

};


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

    }
);


/* =========================================================
   TIMER
========================================================= */

function startLocalTimer(
    seconds
) {

    clearInterval(
        auctionTimer
    );


    let remaining =
        seconds;


    updateTimer(
        remaining
    );


    auctionTimer =
        setInterval(
            () => {

                remaining--;

                updateTimer(
                    remaining
                );


                if (
                    remaining <= 0
                ) {

                    clearInterval(
                        auctionTimer
                    );

                }

            },
            1000
        );

}


/* =========================================================
   TIMER DISPLAY
========================================================= */

function updateTimer(
    seconds
) {

    const timer =
        $("auctionTimer");


    if (!timer)
        return;


    timer.textContent =
        seconds;


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
   AUCTION SOLD / UNSOLD
========================================================= */

socket.on(
    "auctionSold",
    data => {

        if (data.sold) {

            showMessage(
                `${data.character} sold to ${data.playerName} for ₹${data.price}`
            );

        } else {

            showMessage(
                `${data.character} — UNSOLD`
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

        clearInterval(
            auctionTimer
        );


        showScreen(
            "auctionResultScreen"
        );


        const container =
            $("auctionResults");


        if (!container)
            return;


        container.innerHTML =
            "";


        data.teams.forEach(
            player => {

                const box =
                    document.createElement(
                        "div"
                    );


                box.className =
                    "final-player";


                let html = `

                    <h2>
                        ${player.playerName}
                    </h2>

                    <p>
                        Balance:
                        ₹${player.balance}
                    </p>

                    <div class="team-characters">

                `;


                player.team.forEach(
                    item => {

                        const char =
                            characters[
                                item.character
                            ];


                        html += `

                            <div class="team-character">

                                ${
                                    char
                                        ? char.name
                                        : item.character
                                }

                                -
                                ₹${item.price}

                            </div>

                        `;

                    }
                );


                html += `
                    </div>
                `;


                box.innerHTML =
                    html;


                container.appendChild(
                    box
                );

            }
        );

    }
);


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


        showScreen(
            "lobbyScreen"
        );


        if ($("roomCode")) {

            $("roomCode")
                .textContent =
                roomCode;

        }


        if ($("hostText")) {

            $("hostText")
                .textContent =
                "You are the host";

        }


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
            data.roomCode;

        isHost =
            false;

        gameMode =
            data.gameMode;


        showScreen(
            "lobbyScreen"
        );


        if ($("roomCode")) {

            $("roomCode")
                .textContent =
                roomCode;

        }


        if ($("hostText")) {

            $("hostText")
                .textContent =
                "Waiting for host...";

        }

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


        if (!list)
            return;


        list.innerHTML =
            "";


        data.players.forEach(
            (player, index) => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "player";


                div.innerHTML = `

                    <span>
                        👤 ${player.name}
                    </span>

                    <span>
                        ${
                            index === 0
                                ? "👑 Host"
                                : "Player"
                        }
                    </span>

                `;


                list.appendChild(
                    div
                );

            }
        );

    }
);


/* =========================================================
   HOST CHANGED
========================================================= */

socket.on(
    "hostChanged",
    data => {

        if (
            data.host ===
            socket.id
        ) {

            isHost =
                true;


            showMessage(
                "You are now the host."
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

    }
);


/* =========================================================
   INITIAL SCREEN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        showScreen(
            "homeScreen"
        );

    }
);
