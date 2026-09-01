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
   RANKING DATA
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
        "Duy"
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
        "Sakura"
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
   STATE
========================================================= */

let myName = "";
let roomCode = "";
let isHost = false;
let gameMode = "rank";

let currentCategory = 0;

let auctionTimer = null;
let currentAuctionState = null;

let myRankSelections = {};

let auctionGivenUp = new Set();


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
   BUILD RANK SCREEN
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
            `${currentCategory + 1} / ${categories.length}`;

    }

    const list =
        $("characterGrid");

    if (!list) return;

    list.innerHTML = "";

    let ranked =
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

        card.className =
            "character-card";

        if (
            myRankSelections[currentCategory] ===
            key
        ) {

            card.classList.add(
                "selected"
            );

        }

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


    updateRankStatus();

}


/* =========================================================
   RANK STATUS
========================================================= */

function updateRankStatus() {

    const status =
        $("selectionStatus");

    if (!status) return;

    if (
        myRankSelections[currentCategory]
    ) {

        const key =
            myRankSelections[currentCategory];

        status.textContent =
            `You selected ${characters[key]?.name || key}. Waiting for other players...`;

    } else {

        status.textContent =
            "Choose a character.";

    }

}


/* =========================================================
   SELECT RANK CHARACTER
========================================================= */

function selectRankCharacter(character) {

    myRankSelections[currentCategory] =
        character;

    buildRankScreen();

    socket.emit("rankSelect", {

        categoryIndex:
            currentCategory,

        character

    });

    showMessage(
        `Selected ${characters[character]?.name || character}`
    );

}


/* =========================================================
   RANK SELECTION MADE
========================================================= */

socket.on(
    "rankSelectionMade",
    data => {

        /*
         * IMPORTANT:
         *
         * Do NOT change the current player's
         * selected character based on another
         * player's selection.
         *
         * This fixes the issue where Player 1
         * sees Player 2's selection.
         */

        if (
            data.playerId === socket.id
        ) {

            myRankSelections[
                data.categoryIndex
            ] = data.character;

            if (
                data.categoryIndex ===
                currentCategory
            ) {

                updateRankStatus();

            }

        }

    }
);


/* =========================================================
   RANK CATEGORY COMPLETE
========================================================= */

socket.on(
    "rankCategoryComplete",
    data => {

        if (
            Number(data.categoryIndex) ===
            currentCategory
        ) {

            showMessage(
                "Everyone selected. Moving to next category..."
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

        myRankSelections = {};

        showScreen(
            "rankScreen"
        );

        buildRankScreen();

    }
);


/* =========================================================
   AI-STYLE RANK SCORE
========================================================= */

function getCharacterRankScore(
    player
) {

    let total = 0;

    let count = 0;

    Object.entries(
        player.selections || {}
    ).forEach(
        ([category, character]) => {

            const list =
                rankings[
                    categories[
                        Number(category)
                    ]
                ] || [];

            const position =
                list.indexOf(
                    character
                );

            if (position >= 0) {

                /*
                 * #1 = 100
                 * #10 = 10
                 */

                total +=
                    100 -
                    (position * 10);

            } else {

                /*
                 * Characters not in
                 * top 10 get a small base score.
                 */

                total += 5;

            }

            count++;

        }
    );

    if (!count) return 0;

    return Math.round(
        total / count
    );

}


/* =========================================================
   AI TEAM ANALYSIS
========================================================= */

function getTeamAnalysis(
    score
) {

    if (score >= 85) {

        return "AI Analysis: Elite team with exceptional overall strength.";

    }

    if (score >= 70) {

        return "AI Analysis: Very strong and highly competitive team.";

    }

    if (score >= 55) {

        return "AI Analysis: Balanced team with good competitive potential.";

    }

    if (score >= 40) {

        return "AI Analysis: Decent team but has several weaknesses.";

    }

    return "AI Analysis: Team needs improvement in several categories.";

}


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


        const players =
            data.results || [];


        const scored =
            players.map(player => {

                const score =
                    getCharacterRankScore(
                        player
                    );

                return {

                    ...player,

                    aiScore:
                        score

                };

            });


        scored.sort(
            (a, b) =>
                b.aiScore -
                a.aiScore
        );


        scored.forEach(
            (player, index) => {

                const box =
                    document.createElement(
                        "div"
                    );

                box.className =
                    "final-player";


                let html = `

                    <h2>
                        #${index + 1}
                        ${player.playerName}
                    </h2>

                    <h3>
                        AI Overall Score:
                        ${player.aiScore}/100
                    </h3>

                    <p>
                        ${getTeamAnalysis(
                            player.aiScore
                        )}
                    </p>

                    <div class="final-character-list">

                `;


                Object.entries(
                    player.selections || {}
                ).forEach(
                    ([categoryIndex, key]) => {

                        const char =
                            characters[key];

                        const categoryName =
                            categories[
                                Number(
                                    categoryIndex
                                )
                            ] || "Category";


                        html += `

                            <div class="team-character">

                                <b>
                                    ${categoryName}
                                </b>

                                <br>

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


                box.innerHTML =
                    html;


                container.appendChild(
                    box
                );

            }
        );


        if (scored.length) {

            const best =
                scored[0];

            const winner =
                document.createElement(
                    "div"
                );

            winner.className =
                "best-overall";

            winner.innerHTML = `

                <h2>
                    🏆 BEST OVERALL PLAYER
                </h2>

                <h1>
                    ${best.playerName}
                </h1>

                <h3>
                    AI Score:
                    ${best.aiScore}/100
                </h3>

                <p>
                    ${getTeamAnalysis(
                        best.aiScore
                    )}
                </p>

            `;

            container.prepend(
                winner
            );

        }

    }
);


/* =========================================================
   AUCTION STARTED
========================================================= */

socket.on(
    "auctionStarted",
    data => {

        auctionGivenUp.clear();

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

        auctionGivenUp.clear();

        renderAuction(
            data
        );

        startLocalAuctionTimer(
            data
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

        startLocalAuctionTimer(
            data
        );

    }
);


/* =========================================================
   AUCTION RENDER
========================================================= */

function renderAuction(
    data
) {

    if (!data) return;

    const characterKey =
        data.character;

    const char =
        characters[characterKey];


    const nameElement =
        $("auctionCharacterName");

    if (nameElement) {

        nameElement.textContent =
            char?.name ||
            characterKey ||
            "Unknown";

    }


    const imageElement =
        $("auctionCharacterImage");

    if (
        imageElement &&
        char
    ) {

        imageElement.src =
            char.image;

        imageElement.alt =
            char.name;

        imageElement.style.display =
            "block";

    }


    const bidElement =
        $("currentBid");

    if (bidElement) {

        bidElement.textContent =
            `Current Bid: ${Number(data.currentBid || 0)}`;

    }


    const timerElement =
        $("auctionTimer");

    if (timerElement) {

        timerElement.textContent =
            `${Number(data.timeLeft || 10)}s`;

    }


    updateAuctionMoney();

    updateAuctionButtons();

}


/* =========================================================
   AUCTION MONEY
========================================================= */

function updateAuctionMoney() {

    const state =
        currentAuctionState;

    if (!state) return;


    /*
     * Different server versions may send
     * players or balances in different ways.
     */

    let myBalance =
        null;


    if (
        typeof state.myBalance ===
        "number"
    ) {

        myBalance =
            state.myBalance;

    }


    if (
        myBalance === null &&
        Array.isArray(state.players)
    ) {

        const me =
            state.players.find(
                p =>
                    p.id === socket.id
            );

        if (me) {

            myBalance =
                Number(
                    me.balance
                );

        }

    }


    if (
        myBalance !== null
    ) {

        const money =
            $("myMoney");

        if (money) {

            money.textContent =
                `Money Left: ${myBalance}`;

        }

    }

}


/* =========================================================
   AUCTION BUTTONS
========================================================= */

function updateAuctionButtons() {

    const bidButton =
        $("bidButton");

    const unsoldButton =
        $("unsoldButton");

    if (bidButton) {

        const alreadyGivenUp =
            auctionGivenUp.has(
                currentAuctionState?.character
            );

        bidButton.disabled =
            alreadyGivenUp;

        bidButton.textContent =
            alreadyGivenUp
                ? "Given Up"
                : "BID";

    }


    if (unsoldButton) {

        /*
         * During an active auction this
         * button means GIVE UP.
         */

        unsoldButton.textContent =
            "Give Up";

        unsoldButton.style.display =
            "block";

    }

}


/* =========================================================
   BID
========================================================= */

window.bid = function () {

    if (!currentAuctionState) return;

    const character =
        currentAuctionState.character;

    if (
        auctionGivenUp.has(
            character
        )
    ) {

        showMessage(
            "You already gave up on this character."
        );

        return;
    }

    socket.emit(
        "auctionBid"
    );

};


/* =========================================================
   GIVE UP
========================================================= */

window.auctionUnsold = function () {

    if (!currentAuctionState) return;

    const character =
        currentAuctionState.character;

    auctionGivenUp.add(
        character
    );

    updateAuctionButtons();

    socket.emit(
        "auctionUnsold"
    );

    showMessage(
        "You gave up on this character."
    );

};


/* =========================================================
   ALSO SUPPORT COMMON BUTTON NAMES
========================================================= */

window.bidCharacter = window.bid;

window.giveUpBid =
    window.auctionUnsold;

window.unsoldCharacter =
    window.auctionUnsold;


/* =========================================================
   AUCTION TIMER
========================================================= */

function startLocalAuctionTimer(
    data
) {

    if (auctionTimer) {

        clearInterval(
            auctionTimer
        );

        auctionTimer = null;

    }


    let seconds =
        Number(
            data.timeLeft
        );


    if (
        !Number.isFinite(seconds)
    ) {

        seconds = 10;

    }


    updateTimerDisplay(
        seconds
    );


    auctionTimer =
        setInterval(
            () => {

                seconds--;

                if (
                    seconds < 0
                ) {

                    seconds = 0;

                }


                updateTimerDisplay(
                    seconds
                );


                if (
                    seconds <= 0
                ) {

                    clearInterval(
                        auctionTimer
                    );

                    auctionTimer =
                        null;

                }

            },
            1000
        );

}


/* =========================================================
   TIMER DISPLAY
========================================================= */

function updateTimerDisplay(
    seconds
) {

    const timer =
        $("auctionTimer");

    if (!timer) return;

    timer.textContent =
        `${seconds}s`;

}


/* =========================================================
   AUCTION SOLD
========================================================= */

socket.on(
    "auctionSold",
    data => {

        if (auctionTimer) {

            clearInterval(
                auctionTimer
            );

            auctionTimer =
                null;

        }


        const buyer =
            data.playerName ||
            data.buyerName ||
            data.highestBidderName ||
            data.name ||
            "Unknown Player";


        const character =
            characters[
                data.character
            ]?.name ||
            data.character ||
            "Unknown Character";


        showMessage(
            `${character} sold to ${buyer} for ${data.amount || data.currentBid || 0}`
        );

    }
);


/* =========================================================
   AUCTION UNSOLD RESULT
========================================================= */

socket.on(
    "auctionUnsoldResult",
    data => {

        if (auctionTimer) {

            clearInterval(
                auctionTimer
            );

            auctionTimer =
                null;

        }


        const character =
            characters[
                data.character
            ]?.name ||
            data.character ||
            "Character";


        showMessage(
            `${character} is UNSOLD`
        );

    }
);


/* =========================================================
   AUCTION FINISHED
========================================================= */

socket.on(
    "auctionFinished",
    data => {

        if (auctionTimer) {

            clearInterval(
                auctionTimer
            );

            auctionTimer =
                null;

        }


        showScreen(
            "auctionResultScreen"
        );


        const container =
            $("auctionResults");

        if (!container) return;

        container.innerHTML = "";


        const results =
            data?.players ||
            data?.results ||
            [];


        results.forEach(
            player => {

                const box =
                    document.createElement(
                        "div"
                    );

                box.className =
                    "final-player";


                let html = `

                    <h2>
                        ${player.name ||
                        player.playerName ||
                        "Player"}
                    </h2>

                    <p>
                        Money Left:
                        ${player.balance ?? 0}
                    </p>

                    <h3>
                        Team
                    </h3>

                `;


                const team =
                    player.team || [];


                team.forEach(
                    member => {

                        const key =
                            typeof member ===
                            "string"
                                ? member
                                : member.character;


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
            data.gameMode ||
            "rank";


        const roomElement =
            $("roomCode");

        if (roomElement) {

            roomElement.textContent =
                roomCode;

        }


        showScreen(
            "lobbyScreen"
        );


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
            data.gameMode ||
            "rank";


        const roomElement =
            $("roomCode");

        if (roomElement) {

            roomElement.textContent =
                roomCode;

        }


        showScreen(
            "lobbyScreen"
        );

        showMessage(
            `Joined room ${roomCode}`
        );

    }
);


/* =========================================================
   PLAYERS UPDATED
========================================================= */

socket.on(
    "playersUpdated",
    data => {

        const waiting =
            $("waitingText");


        if (!waiting) return;


        const count =
            data.players?.length ||
            0;


        if (count < 2) {

            waiting.textContent =
                "Waiting for another player...";

        } else {

            waiting.textContent =
                `${count} players connected. Host can start the game.`;

        }


        const playerList =
            $("playerList");


        if (playerList) {

            playerList.innerHTML = "";


            (data.players || []).forEach(
                player => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.textContent =
                        player.name;

                    playerList.appendChild(
                        item
                    );

                }
            );

        }

    }
);


/* =========================================================
   HOST CHANGED
========================================================= */

socket.on(
    "hostChanged",
    data => {

        if (
            data.host === socket.id
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


socket.on(
    "disconnect",
    () => {

        showMessage(
            "Disconnected from server."
        );

    }
);
