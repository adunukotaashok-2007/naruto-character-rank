/* =========================================================
   NARUTO CHARACTER BATTLE
   GAME.JS
   =========================================================
   FEATURES
   ---------------------------------------------------------
   • Multiplayer room
   • 2–25 players
   • Character Rank
   • 16 Rank categories
   • Private Rank selections
   • Progress: selected / total players
   • Character Auction
   • ₹50 bid increment
   • 15-second auction timer
   • Give Up
   • Team of 5
   • Final team results
   • OpenAI final analysis
   ========================================================= */


/* =========================================================
   SOCKET
========================================================= */

const socket = io({
    transports: [
        "websocket",
        "polling"
    ]
});


/* =========================================================
   CHARACTER IMAGE DATABASE
   MUST MATCH SERVER
========================================================= */

const CHARACTER_IMAGES = {

    "Naruto":
        "assets/characters/images%20%282%29.jpeg",

    "Sasuke":
        "assets/characters/images%20%283%29.jpeg",

    "Itachi":
        "assets/characters/images%20%284%29.jpeg",

    "Madara":
        "assets/characters/images%20%285%29.jpeg",

    "Kakashi":
        "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg",

    "Minato":
        "assets/characters/images%20%286%29.jpeg",

    "Tobirama":
        "assets/characters/images%20%287%29.jpeg",

    "Hashirama":
        "assets/characters/images%20%288%29.jpeg",

    "Jiraiya":
        "assets/characters/images%20%289%29.jpeg",

    "Hiruzen":
        "assets/characters/images%20%2810%29.jpeg",

    "Orochimaru":
        "assets/characters/images%20%2811%29.jpeg",

    "Might Guy":
        "assets/characters/images%20%2812%29.jpeg",

    "Rock Lee":
        "assets/characters/images%20%2813%29.jpeg",

    "Shikamaru":
        "assets/characters/images%20%2814%29.jpeg",

    "Neji":
        "assets/characters/images%20%2815%29.jpeg",

    "Gaara":
        "assets/characters/images%20%2816%29.jpeg",

    "Kisame":
        "assets/characters/images%20%2817%29.jpeg",

    "Sakura":
        "assets/characters/images%20%2818%29.jpeg",

    "Nagato":
        "assets/characters/images%20%2819%29.jpeg",

    "Obito":
        "assets/characters/images%20%2820%29.jpeg",

    "Killer B":
        "assets/characters/download%20%281%29.jpeg",

    "Sasori":
        "assets/characters/download%20%2810%29.jpeg",

    "Deidara":
        "assets/characters/download%20%2811%29.jpeg",

    "Mu":
        "assets/characters/download%20%2812%29.jpeg",

    "Gengetsu Hōzuki":
        "assets/characters/download%20%2813%29.jpeg",

    "Danzo":
        "assets/characters/download%20%2814%29.jpeg",

    "Kakuzu":
        "assets/characters/download%20%2815%29.jpeg",

    "Hidan":
        "assets/characters/download%20%2816%29.jpeg",

    "Konan":
        "assets/characters/download%20%2817%29.jpeg",

    "Zabuza":
        "assets/characters/download%20%2818%29.jpeg",

    "Kimimaro":
        "assets/characters/download%20%2819%29.jpeg",

    "Kabuto":
        "assets/characters/download%20%282%29.jpeg",

    "Suigetsu":
        "assets/characters/download%20%2820%29.jpeg",

    "Jugo":
        "assets/characters/download%20%2821%29.jpeg",

    "Karin":
        "assets/characters/download%20%2822%29.jpeg",

    "Yahiko":
        "assets/characters/download%20%2823%29.jpeg",

    "Zetsu":
        "assets/characters/download%20%2824%29.jpeg",

    "Hinata":
        "assets/characters/download%20%2825%29.jpeg",

    "Ino":
        "assets/characters/download%20%2826%29.jpeg",

    "Choji":
        "assets/characters/download%20%2827%29.jpeg",

    "Kiba":
        "assets/characters/download%20%2828%29.jpeg",

    "Shino":
        "assets/characters/download%20%2829%29.jpeg",

    "Shisui":
        "assets/characters/download%20%283%29.jpeg",

    "Tenten":
        "assets/characters/download%20%2830%29.jpeg",

    "Iruka":
        "assets/characters/download%20%2831%29.jpeg",

    "Anko":
        "assets/characters/download%20%2832%29.jpeg",

    "Duy":
        "assets/characters/download%20%2833%29.jpeg",

    "Shizune":
        "assets/characters/download%20%2834%29.jpeg",

    "Asuma":
        "assets/characters/download%20%2835%29.jpeg",

    "Kurenai":
        "assets/characters/download%20%2836%29.jpeg",

    "Yamato":
        "assets/characters/download%20%2837%29.jpeg",

    "Sai":
        "assets/characters/download%20%2838%29.jpeg",

    "Konohamaru":
        "assets/characters/download%20%2839%29.jpeg",

    "Sakumo":
        "assets/characters/download%20%284%29.jpeg",

    "Kurotsuchi":
        "assets/characters/download%20%2840%29.jpeg",

    "Mifune":
        "assets/characters/download%20%2841%29.jpeg",

    "Fu":
        "assets/characters/download%20%2842%29.jpeg",

    "Utakata":
        "assets/characters/download%20%2843%29.jpeg",

    "Hanzo":
        "assets/characters/download%20%285%29.jpeg",

    "Four Tails Jinchuriki":
        "assets/characters/download%20%2844%29.jpeg",

    "Third Raikage":
        "assets/characters/download%20%286%29.jpeg",

    "Fourth Raikage":
        "assets/characters/download%20%287%29.jpeg",

    "Onoki":
        "assets/characters/download%20%288%29.jpeg",

    "Mei":
        "assets/characters/download%20%289%29.jpeg",

    "Tsunade":
        "assets/characters/download.jpeg",

    "Chiyo":
        "assets/characters/images%20%2821%29.jpeg",

    "Rasa":
        "assets/characters/images%20%2822%29.jpeg",

    "Masashi Kishimoto":
        "assets/characters/images%20%2823%29.jpeg",

    "Darui":
        "assets/characters/images%20%2824%29.jpeg",

    "Chōjūrō":
        "assets/characters/images%20%2825%29.jpeg"
};


/* =========================================================
   EXACT SERVER CHARACTER LIST
========================================================= */

const SERVER_CHARACTERS = [

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

    "Might Guy",
    "Rock Lee",
    "Duy",

    "Shikamaru",
    "Neji",
    "Gaara",
    "Kisame",
    "Sakura",
    "Nagato",
    "Obito",

    "Killer B",
    "Sasori",
    "Deidara",
    "Mu",
    "Gengetsu Hōzuki",
    "Danzo",
    "Kakuzu",
    "Hidan",
    "Konan",
    "Zabuza",
    "Kimimaro",

    "Kabuto",
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
    "Shisui",
    "Tenten",
    "Iruka",
    "Anko",
    "Shizune",
    "Asuma",
    "Kurenai",
    "Yamato",
    "Sai",
    "Konohamaru",

    "Sakumo",
    "Kurotsuchi",
    "Mifune",
    "Fu",
    "Utakata",
    "Hanzo",

    "Four Tails Jinchuriki",
    "Third Raikage",
    "Fourth Raikage",
    "Onoki",
    "Mei",
    "Tsunade",

    "Chiyo",
    "Rasa",
    "Masashi Kishimoto",
    "Darui",
    "Chōjūrō"
];


/* =========================================================
   RANK CATEGORIES
========================================================= */

const RANK_CATEGORIES = [

    "⚡ SPEED",

    "💪 STRENGTH",

    "🧠 BATTLE IQ",

    "🩸 DURABILITY",

    "🌀 CHAKRA",

    "🔥 NINJUTSU",

    "⚔️ TAIJUTSU",

    "👁️ GENJUTSU",

    "🛡️ DEFENSE",

    "💥 ATTACK",

    "❤️ STAMINA",

    "👑 LEADERSHIP",

    "🔄 VERSATILITY",

    "📚 EXPERIENCE",

    "🤝 TEAMWORK",

    "🏆 OVERALL POWER"

];


/* =========================================================
   CONSTANTS
========================================================= */

const STARTING_BALANCE =
    1000;

const BID_INCREMENT =
    50;

const AUCTION_TIME =
    15;

const TEAM_SIZE =
    5;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const homeScreen =
    document.getElementById(
        "homeScreen"
    );

const roomScreen =
    document.getElementById(
        "roomScreen"
    );

const rankScreen =
    document.getElementById(
        "rankScreen"
    );

const auctionScreen =
    document.getElementById(
        "auctionScreen"
    );

const playerNameInput =
    document.getElementById(
        "playerName"
    );

const gameModeSelect =
    document.getElementById(
        "gameMode"
    );

const roomCodeInput =
    document.getElementById(
        "roomCodeInput"
    );

const roomCodeDisplay =
    document.getElementById(
        "roomCodeDisplay"
    );

const playersList =
    document.getElementById(
        "playersList"
    );

const playerCount =
    document.getElementById(
        "playerCount"
    );

const startGameButton =
    document.getElementById(
        "startGameButton"
    );

const message =
    document.getElementById(
        "message"
    );

const characterGrid =
    document.getElementById(
        "characterGrid"
    );

const rankStatus =
    document.getElementById(
        "rankStatus"
    );

const auctionImage =
    document.getElementById(
        "auctionCharacterImage"
    );

const auctionCharacter =
    document.getElementById(
        "auctionCharacter"
    );

const auctionTimer =
    document.getElementById(
        "auctionTimer"
    );

const auctionBid =
    document.getElementById(
        "auctionBid"
    );

const auctionHighest =
    document.getElementById(
        "auctionHighest"
    );

const auctionBalance =
    document.getElementById(
        "auctionBalance"
    );

const auctionNextBid =
    document.getElementById(
        "auctionNextBid"
    );

const auctionMoney =
    document.getElementById(
        "auctionMoney"
    );

const bidButton =
    document.getElementById(
        "bidButton"
    );

const giveUpButton =
    document.getElementById(
        "giveUpButton"
    );

const myTeam =
    document.getElementById(
        "myTeam"
    );


/* =========================================================
   STATE
========================================================= */

let myPlayerId =
    null;

let currentRoomCode =
    null;

let currentGameMode =
    "rank";

let currentPlayers =
    [];

let currentCategory =
    0;

let selectedCharacter =
    null;

let currentAuction =
    null;

let currentTeam =
    [];

let roomSettings = {

    teamSize:
        TEAM_SIZE,

    startingBalance:
        STARTING_BALANCE,

    bidAmount:
        BID_INCREMENT,

    bidTime:
        AUCTION_TIME

};


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(value);

    return div.innerHTML;

}


/* =========================================================
   GET CHARACTER IMAGE
========================================================= */

function getCharacterImage(
    character
) {

    if (!character) {
        return "";
    }

    return (
        CHARACTER_IMAGES[
            character
        ] || ""
    );

}


/* =========================================================
   CREATE SAFE IMAGE
========================================================= */

function createImage(
    character,
    className = ""
) {

    const image =
        getCharacterImage(
            character
        );

    if (!image) {

        const fallback =
            document.createElement(
                "div"
            );

        fallback.className =
            "image-fallback";

        fallback.textContent =
            "Image unavailable";

        return fallback;

    }


    const img =
        document.createElement(
            "img"
        );

    img.src =
        image;

    img.alt =
        character;

    img.loading =
        "lazy";

    if (className) {

        img.className =
            className;

    }


    img.addEventListener(
        "error",
        () => {

            const fallback =
                document.createElement(
                    "div"
                );

            fallback.className =
                "image-fallback";

            fallback.textContent =
                "Image unavailable";

            img.replaceWith(
                fallback
            );

        }
    );


    return img;

}


/* =========================================================
   SHOW SCREEN
========================================================= */

function showScreen(
    screen
) {

    [
        homeScreen,
        roomScreen,
        rankScreen,
        auctionScreen
    ]
    .forEach(
        item => {

            if (item) {

                item.classList.add(
                    "hidden"
                );

            }

        }
    );


    if (screen) {

        screen.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   MESSAGE
========================================================= */

let messageTimer =
    null;

function showMessage(
    text
) {

    if (!message) {
        return;
    }


    message.textContent =
        text;

    message.classList.add(
        "show"
    );


    clearTimeout(
        messageTimer
    );


    messageTimer =
        setTimeout(
            () => {

                message.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   CREATE ROOM
========================================================= */

document
    .getElementById(
        "createButton"
    )
    .addEventListener(
        "click",
        () => {

            const name =
                playerNameInput.value
                    .trim();

            const gameMode =
                gameModeSelect.value;


            if (!name) {

                showMessage(
                    "Enter your name."
                );

                playerNameInput.focus();

                return;

            }


            socket.emit(
                "createRoom",
                {

                    name:

                        name,

                    gameMode:

                        gameMode,

                    maxPlayers:

                        25,

                    teamSize:

                        TEAM_SIZE,

                    startingBalance:

                        STARTING_BALANCE,

                    bidAmount:

                        BID_INCREMENT,

                    bidTime:

                        AUCTION_TIME

                }
            );

        }
    );


/* =========================================================
   SHOW JOIN BOX
========================================================= */

document
    .getElementById(
        "showJoinButton"
    )
    .addEventListener(
        "click",
        () => {

            const box =
                document.getElementById(
                    "joinBox"
                );

            if (box) {

                box.classList.toggle(
                    "hidden"
                );

            }

        }
    );


/* =========================================================
   JOIN ROOM
========================================================= */

document
    .getElementById(
        "joinButton"
    )
    .addEventListener(
        "click",
        () => {

            const name =
                playerNameInput.value
                    .trim();

            const roomCode =
                roomCodeInput.value
                    .trim()
                    .toUpperCase();


            if (!name) {

                showMessage(
                    "Enter your name."
                );

                return;

            }


            if (!roomCode) {

                showMessage(
                    "Enter room code."
                );

                return;

            }


            socket.emit(
                "joinRoom",
                {

                    name:

                        name,

                    roomCode:

                        roomCode

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

        myPlayerId =
            socket.id;

        currentRoomCode =
            data.roomCode;

        currentGameMode =
            data.gameMode;


        roomCodeDisplay.textContent =
            data.roomCode;


        document
            .getElementById(
                "roomMode"
            )
            .textContent =

                data.gameMode ===
                "auction"

                    ? "🔥 Auction Mode — ₹50 bid increment — 15 seconds"

                    : "🏆 Character Rank Mode";


        startGameButton.classList.remove(
            "hidden"
        );


        showScreen(
            roomScreen
        );

    }
);


/* =========================================================
   ROOM JOINED
========================================================= */

socket.on(
    "roomJoined",
    data => {

        myPlayerId =
            socket.id;

        currentRoomCode =
            data.roomCode;

        currentGameMode =
            data.gameMode;


        roomCodeDisplay.textContent =
            data.roomCode;


        document
            .getElementById(
                "roomMode"
            )
            .textContent =

                data.gameMode ===
                "auction"

                    ? "🔥 Auction Mode — ₹50 bid increment — 15 seconds"

                    : "🏆 Character Rank Mode";


        if (data.isHost) {

            startGameButton.classList.remove(
                "hidden"
            );

        } else {

            startGameButton.classList.add(
                "hidden"
            );

        }


        showScreen(
            roomScreen
        );

    }
);


/* =========================================================
   PLAYERS UPDATED
========================================================= */

socket.on(
    "playersUpdated",
    data => {

        currentPlayers =
            data.players || [];


        playerCount.textContent =
            `Players: ${currentPlayers.length}`;


        playersList.innerHTML =
            "";


        currentPlayers.forEach(
            player => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "player-card";


                if (
                    player.id ===
                    myPlayerId
                ) {

                    card.classList.add(
                        "me"
                    );

                }


                const teamCount =
                    Array.isArray(
                        player.team
                    )
                        ? player.team.length
                        : 0;


                card.innerHTML = `

                    <div class="player-name">

                        ${escapeHtml(
                            player.name
                        )}

                        ${
                            player.id ===
                            myPlayerId
                                ? " (YOU)"
                                : ""
                        }

                    </div>

                    <div class="player-balance">

                        💰 Balance:
                        ₹${Number(
                            player.balance ??
                            STARTING_BALANCE
                        ).toLocaleString(
                            "en-IN"
                        )}

                    </div>

                    <div class="player-team">

                        🏆 Team:
                        ${teamCount}/${TEAM_SIZE}

                    </div>

                `;


                playersList.appendChild(
                    card
                );

            }
        );

    }
);


/* =========================================================
   START GAME
========================================================= */

startGameButton.addEventListener(
    "click",
    () => {

        socket.emit(
            "startGame"
        );

    }
);


/* =========================================================
   GAME STARTED
========================================================= */

socket.on(
    "gameStarted",
    data => {

        currentGameMode =
            data.gameMode;


        if (
            data.gameMode ===
            "auction"
        ) {

            showScreen(
                auctionScreen
            );

        } else {

            showScreen(
                rankScreen
            );

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
                data.categoryIndex ?? 0
            );

        selectedCharacter =
            null;


        renderRankCategory(
            data
        );

    }
);


/* =========================================================
   RANK NEXT CATEGORY
========================================================= */

socket.on(
    "rankNextCategory",
    data => {

        currentCategory =
            Number(
                data.categoryIndex ?? 0
            );

        selectedCharacter =
            null;


        renderRankCategory(
            data
        );

    }
);


/* =========================================================
   RENDER RANK CATEGORY
========================================================= */

function renderRankCategory(
    data
) {

    showScreen(
        rankScreen
    );


    const categoryTitle =
        document.getElementById(
            "categoryTitle"
        );


    const categoryNumber =
        document.getElementById(
            "categoryNumber"
        );


    if (categoryTitle) {

        categoryTitle.textContent =
            data.categoryName ||
            RANK_CATEGORIES[
                currentCategory
            ] ||
            "Character Rank";

    }


    if (categoryNumber) {

        categoryNumber.textContent =
            `Category ${
                Number(
                    data.categoryNumber ??
                    currentCategory + 1
                )
            } / ${
                Number(
                    data.totalCategories ??
                    16
                )
            }`;

    }


    rankStatus.textContent =
        "Choose one character.";


    renderRankCharacters();

}


/* =========================================================
   RENDER RANK CHARACTERS
========================================================= */

function renderRankCharacters() {

    characterGrid.innerHTML =
        "";


    SERVER_CHARACTERS.forEach(
        (
            character,
            index
        ) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "character-card";


            card.dataset.character =
                character;


            if (
                selectedCharacter ===
                character
            ) {

                card.classList.add(
                    "selected"
                );

            }


            const rankNumber =
                document.createElement(
                    "div"
                );


            rankNumber.className =
                "rank-number";


            rankNumber.textContent =
                `#${index + 1}`;


            card.appendChild(
                rankNumber
            );


            const image =
                createImage(
                    character
                );


            card.appendChild(
                image
            );


            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "character-name";


            name.textContent =
                character;


            card.appendChild(
                name
            );


            if (
                index === 0
            ) {

                const badge =
                    document.createElement(
                        "div"
                    );


                badge.className =
                    "best-badge";


                badge.textContent =
                    "🥇 CHARACTER";


                card.appendChild(
                    badge
                );

            }


            if (
                selectedCharacter ===
                character
            ) {

                const badge =
                    document.createElement(
                        "div"
                    );


                badge.className =
                    "selection-badge";


                badge.textContent =
                    "✅ SELECTED";


                card.appendChild(
                    badge
                );

            }


            characterGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   RANK CHARACTER CLICK
========================================================= */

characterGrid.addEventListener(
    "click",
    event => {

        const card =
            event.target.closest(
                ".character-card"
            );


        if (!card) {
            return;
        }


        const character =
            card.dataset.character;


        if (!character) {
            return;
        }


        if (selectedCharacter) {

            showMessage(
                "You already selected a character for this category."
            );

            return;

        }


        selectedCharacter =
            character;


        card.classList.add(
            "selected"
        );


        rankStatus.textContent =
            `Selected: ${character} | Waiting for other players...`;


        socket.emit(
            "rankSelect",
            {

                categoryIndex:

                    currentCategory,

                character:

                    character

            }
        );

    }
);


/* =========================================================
   PRIVATE RANK SELECTION ACCEPTED
   IMPORTANT:
   SERVER SENDS THIS ONLY TO THE PLAYER
========================================================= */

socket.on(
    "rankSelectionAccepted",
    data => {

        if (
            Number(
                data.categoryIndex
            ) !==
            currentCategory
        ) {

            return;

        }


        selectedCharacter =
            data.character;


        rankStatus.textContent =
            `✅ Selected: ${data.character} | Waiting for other players...`;


        renderRankCharacters();

    }
);


/* =========================================================
   RANK WAITING
   ONLY SHOW COUNT
   NEVER SHOW OTHER PLAYER'S CHARACTER
========================================================= */

socket.on(
    "rankWaiting",
    data => {

        const selected =
            Number(
                data.selectedCount || 0
            );


        const total =
            Number(
                data.totalPlayers || 0
            );


        if (selectedCharacter) {

            rankStatus.textContent =
                `✅ You selected ${selectedCharacter} | ${selected}/${total} players selected`;

        } else {

            rankStatus.textContent =
                `${selected}/${total} players selected`;

        }

    }
);


/* =========================================================
   RANK CATEGORY COMPLETE
========================================================= */

socket.on(
    "rankCategoryComplete",
    () => {

        rankStatus.textContent =
            "✅ Everyone selected! Loading next category...";

    }
);


/* =========================================================
   MY RANK STATUS
========================================================= */

socket.on(
    "myRankStatus",
    data => {

        if (
            data &&
            data.selected
        ) {

            selectedCharacter =
                data.character;


            rankStatus.textContent =
                `✅ Selected: ${data.character} | Waiting...`;


            renderRankCharacters();

        }

    }
);


/* =========================================================
   RANK FINISHED
========================================================= */

socket.on(
    "rankFinished",
    data => {

        selectedCharacter =
            null;


        const categoryTitle =
            document.getElementById(
                "categoryTitle"
            );


        const categoryNumber =
            document.getElementById(
                "categoryNumber"
            );


        if (categoryTitle) {

            categoryTitle.textContent =
                "🏆 RANKING COMPLETE";

        }


        if (categoryNumber) {

            categoryNumber.textContent =
                "16 / 16 Categories";

        }


        rankStatus.textContent =
            "🎉 All categories completed!";


        /*
         * The server may reveal all selections
         * only AFTER the game is complete.
         */

        if (
            data &&
            Array.isArray(
                data.results
            )
        ) {

            renderRankFinalSelections(
                data.results
            );

        }


        showScreen(
            rankScreen
        );

    }
);


/* =========================================================
   RANK FINAL SELECTIONS
========================================================= */

function renderRankFinalSelections(
    results
) {

    if (!characterGrid) {
        return;
    }


    characterGrid.innerHTML =
        "";


    if (
        !Array.isArray(
            results
        ) ||
        results.length === 0
    ) {

        const box =
            document.createElement(
                "div"
            );

        box.className =
            "panel";

        box.style.gridColumn =
            "1 / -1";

        box.innerHTML = `
            <h2>🎉 Rank Game Complete</h2>
            <p style="text-align:center;color:#aaa;">
                All 16 categories have been completed.
            </p>
        `;

        characterGrid.appendChild(
            box
        );

        return;

    }


    results.forEach(
        category => {

            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "panel";

            box.style.gridColumn =
                "1 / -1";

            const title =
                document.createElement(
                    "h2"
                );


            title.textContent =
                category.categoryName ||
                "Category";


            box.appendChild(
                title
            );


            const selections =
                category.selections ||
                category.players ||
                [];


            selections.forEach(
                selection => {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.style.padding =
                        "8px";

                    row.style.borderBottom =
                        "1px solid #333";


                    row.textContent =
                        `${selection.playerName || "Player"} → ${selection.character || "Unknown"}`;


                    box.appendChild(
                        row
                    );

                }
            );


            characterGrid.appendChild(
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

        showScreen(
            auctionScreen
        );


        roomSettings =
            {

                teamSize:
                    Number(
                        data?.teamSize ??
                        TEAM_SIZE
                    ),

                startingBalance:
                    Number(
                        data?.startingBalance ??
                        STARTING_BALANCE
                    ),

                bidAmount:
                    BID_INCREMENT,

                bidTime:
                    AUCTION_TIME

            };


        bidButton.textContent =
            "💰 BID ₹50";


        giveUpButton.disabled =
            false;


        auctionTimer.textContent =
            AUCTION_TIME;


        showMessage(
            "🔥 Auction started! ₹50 increments, 15 seconds per character."
        );

    }
);


/* =========================================================
   AUCTION NEW CHARACTER
========================================================= */

socket.on(
    "auctionNewCharacter",
    data => {

        showScreen(
            auctionScreen
        );


        const character =
            data.character;


        currentAuction =
            data;


        auctionCharacter.textContent =
            character;


        document
            .getElementById(
                "auctionCharacterNumber"
            )
            .textContent =
                `Character ${
                    data.characterNumber ||
                    1
                } / ${
                    data.totalCharacters ||
                    SERVER_CHARACTERS.length
                }`;


        auctionBid.textContent =
            "₹0";


        auctionHighest.textContent =
            "Nobody";


        auctionNextBid.textContent =
            "Next Bid: ₹50";


        auctionTimer.textContent =
            AUCTION_TIME;


        auctionTimer.classList.remove(
            "warning"
        );


        bidButton.disabled =
            false;


        giveUpButton.disabled =
            false;


        updateAuctionCharacter(
            character
        );

    }
);


/* =========================================================
   AUCTION CHARACTER
========================================================= */

socket.on(
    "auctionCharacter",
    data => {

        if (
            data &&
            data.character
        ) {

            updateAuctionCharacter(
                data.character
            );

        }

    }
);


/* =========================================================
   UPDATE AUCTION CHARACTER
========================================================= */

function updateAuctionCharacter(
    character
) {

    auctionCharacter.textContent =
        character;


    const image =
        getCharacterImage(
            character
        );


    const parent =
        auctionImage.parentNode;


    const oldFallback =
        parent.querySelector(
            ".auction-image-fallback"
        );


    if (oldFallback) {

        oldFallback.remove();

    }


    if (image) {

        auctionImage.src =
            image;

        auctionImage.alt =
            character;

        auctionImage.style.display =
            "block";

    } else {

        auctionImage.removeAttribute(
            "src"
        );

        auctionImage.style.display =
            "none";


        const fallback =
            document.createElement(
                "div"
            );


        fallback.className =
            "auction-image-fallback";


        fallback.textContent =
            "Image unavailable";


        parent.insertBefore(
            fallback,
            auctionCharacter
        );

    }

}


/* =========================================================
   AUCTION UPDATED
========================================================= */

socket.on(
    "auctionUpdated",
    data => {

        currentAuction =
            data;


        if (
            data.character
        ) {

            updateAuctionCharacter(
                data.character
            );

        }


        const currentBid =
            Number(
                data.currentBid || 0
            );


        const nextBid =
            currentBid +
            BID_INCREMENT;


        auctionBid.textContent =
            `₹${currentBid.toLocaleString(
                "en-IN"
            )}`;


        auctionHighest.textContent =
            data.highestBidderName ||
            "Nobody";


        auctionNextBid.textContent =
            `Next Bid: ₹${nextBid.toLocaleString(
                "en-IN"
            )}`;


        const seconds =
            Number(
                data.remainingTime ?? 0
            );


        auctionTimer.textContent =
            seconds;


        updateTimerStyle(
            seconds
        );

    }
);


/* =========================================================
   AUCTION TIMER
========================================================= */

socket.on(
    "auctionTimer",
    data => {

        const seconds =
            Number(
                data.seconds ?? 0
            );


        auctionTimer.textContent =
            seconds;


        updateTimerStyle(
            seconds
        );

    }
);


/* =========================================================
   TIMER STYLE
========================================================= */

function updateTimerStyle(
    seconds
) {

    if (
        seconds <= 5 &&
        seconds > 0
    ) {

        auctionTimer.classList.add(
            "warning"
        );

    } else {

        auctionTimer.classList.remove(
            "warning"
        );

    }

}


/* =========================================================
   AUCTION MONEY UPDATED
========================================================= */

socket.on(
    "auctionMoneyUpdated",
    data => {

        const balance =
            Number(
                data.balance ?? 0
            );


        const spent =
            Number(
                data.spent ?? 0
            );


        const currentBid =
            Number(
                data.currentBid ?? 0
            );


        const nextBid =
            currentBid +
            BID_INCREMENT;


        auctionBalance.textContent =
            `₹${balance.toLocaleString(
                "en-IN"
            )}`;


        auctionMoney.textContent =
            `Balance: ₹${balance.toLocaleString(
                "en-IN"
            )} | Spent: ₹${spent.toLocaleString(
                "en-IN"
            )}`;


        auctionNextBid.textContent =
            `Next Bid: ₹${nextBid.toLocaleString(
                "en-IN"
            )}`;


        bidButton.disabled =
            !data.canBid;


        giveUpButton.disabled =
            Boolean(
                data.gaveUp
            );

    }
);


/* =========================================================
   BID BUTTON
========================================================= */

bidButton.addEventListener(
    "click",
    () => {

        if (
            bidButton.disabled
        ) {

            return;

        }


        socket.emit(
            "bid"
        );

    }
);


/* =========================================================
   GIVE UP BUTTON
========================================================= */

giveUpButton.addEventListener(
    "click",
    () => {

        if (
            giveUpButton.disabled
        ) {

            return;

        }


        socket.emit(
            "giveUp"
        );

    }
);


/* =========================================================
   AUCTION BID MADE
========================================================= */

socket.on(
    "auctionBidMade",
    data => {

        const amount =
            Number(
                data.bid || 0
            );


        showMessage(
            `💰 ${data.playerName} bid ₹${amount.toLocaleString(
                "en-IN"
            )}`
        );

    }
);


/* =========================================================
   AUCTION GIVE UP
========================================================= */

socket.on(
    "auctionPlayerGaveUp",
    data => {

        if (
            data.playerId !==
            myPlayerId
        ) {

            showMessage(
                `${data.playerName} gave up on ${data.character}`
            );

        }

    }
);


/* =========================================================
   AUCTION SOLD
========================================================= */

socket.on(
    "auctionSold",
    data => {

        const price =
            Number(
                data.price || 0
            );


        showMessage(
            `🔥 ${data.character} sold to ${data.winnerName} for ₹${price.toLocaleString(
                "en-IN"
            )}`
        );


        if (
            data.winnerId ===
            myPlayerId
        ) {

            currentTeam =
                Array.isArray(
                    data.team
                )
                    ? data.team
                    : currentTeam;


            updateTeam(
                currentTeam
            );

        }

    }
);


/* =========================================================
   AUCTION UNSOLD
========================================================= */

socket.on(
    "auctionUnsold",
    data => {

        showMessage(
            `❌ ${data.character} was unsold`
        );

    }
);


/* =========================================================
   AUCTION FINISHED
========================================================= */

socket.on(
    "auctionFinished",
    data => {

        showMessage(
            "🏆 AUCTION FINISHED!"
        );


        if (
            Array.isArray(
                data.teams
            )
        ) {

            const myResult =
                data.teams.find(
                    team =>
                        team.playerId ===
                        myPlayerId
                );


            if (myResult) {

                currentTeam =
                    Array.isArray(
                        myResult.team
                    )
                        ? myResult.team
                        : [];


                updateTeam(
                    currentTeam
                );

            }

        }


        /*
         * Keep the auction screen visible
         * while the server generates AI results.
         */

        showScreen(
            auctionScreen
        );


        if (
            Array.isArray(
                data.teams
            )
        ) {

            renderAuctionFinalTeams(
                data.teams
            );

        }

    }
);


/* =========================================================
   UPDATE MY TEAM
========================================================= */

function updateTeam(
    team
) {

    if (
        !Array.isArray(
            team
        )
    ) {

        return;

    }


    currentTeam =
        team;


    myTeam.innerHTML =
        "";


    if (
        team.length === 0
    ) {

        myTeam.innerHTML = `

            <div
                style="
                    width:100%;
                    color:#777;
                    padding:20px;
                "
            >
                No characters purchased yet.
            </div>

        `;

        return;

    }


    team.forEach(
        character => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "team-character";


            const image =
                createImage(
                    character
                );


            item.appendChild(
                image
            );


            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "team-character-name";


            name.textContent =
                character;


            item.appendChild(
                name
            );


            myTeam.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   FINAL AUCTION TEAMS
========================================================= */

function renderAuctionFinalTeams(
    teams
) {

    if (
        !Array.isArray(
            teams
        )
    ) {

        return;

    }


    const existing =
        document.getElementById(
            "auctionFinalTeams"
        );


    if (existing) {

        existing.remove();

    }


    const container =
        document.createElement(
            "div"
        );


    container.id =
        "auctionFinalTeams";


    container.className =
        "panel";


    container.style.marginTop =
        "20px";


    container.innerHTML =
        `<h2>🏆 FINAL TEAMS</h2>`;


    teams.forEach(
        teamData => {

            const teamBox =
                document.createElement(
                    "div"
                );


            teamBox.style.marginTop =
                "20px";

            teamBox.style.padding =
                "15px";

            teamBox.style.border =
                "1px solid #333";

            teamBox.style.borderRadius =
                "12px";


            const name =
                document.createElement(
                    "h3"
                );


            name.textContent =
                teamData.playerName ||
                "Player";


            name.style.color =
                "#ff9800";


            teamBox.appendChild(
                name
            );


            const roster =
                Array.isArray(
                    teamData.team
                )
                    ? teamData.team
                    : [];


            const list =
                document.createElement(
                    "div"
                );


            list.className =
                "team-list";


            roster.forEach(
                character => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "team-character";


                    item.appendChild(
                        createImage(
                            character
                        )
                    );


                    const label =
                        document.createElement(
                            "div"
                        );


                    label.className =
                        "team-character-name";


                    label.textContent =
                        character;


                    item.appendChild(
                        label
                    );


                    list.appendChild(
                        item
                    );

                }
            );


            teamBox.appendChild(
                list
            );


            container.appendChild(
                teamBox
            );

        }
    );


    auctionScreen.appendChild(
        container
    );

}


/* =========================================================
   HOST CHANGED
========================================================= */

socket.on(
    "hostChanged",
    data => {

        if (
            data.hostId ===
            socket.id
        ) {

            startGameButton.classList.remove(
                "hidden"
            );


            showMessage(
                "👑 You are now the host."
            );

        } else {

            startGameButton.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   FINAL AI RESULTS LOADING
========================================================= */

socket.on(
    "finalResultsLoading",
    data => {

        renderAILoading(
            data?.message ||
            "AI is analyzing all teams..."
        );

    }
);


/* =========================================================
   FINAL AI RESULTS
========================================================= */

socket.on(
    "finalAIResults",
    data => {

        if (
            data &&
            data.results
        ) {

            renderFinalAIResults(
                data.results,
                data.gameMode
            );

        }

    }
);


/* =========================================================
   CREATE / GET AI RESULTS CONTAINER
========================================================= */

function getAIResultsContainer() {

    let container =
        document.getElementById(
            "aiFinalResults"
        );


    if (container) {

        return container;

    }


    container =
        document.createElement(
            "div"
        );


    container.id =
        "aiFinalResults";


    container.className =
        "panel";


    container.style.marginTop =
        "20px";


    /*
     * Add it to whichever game screen
     * is currently active.
     */

    if (
        currentGameMode ===
        "auction"
    ) {

        auctionScreen.appendChild(
            container
        );

    } else {

        rankScreen.appendChild(
            container
        );

    }


    return container;

}


/* =========================================================
   AI LOADING SCREEN
========================================================= */

function renderAILoading(
    text
) {

    const container =
        getAIResultsContainer();


    container.innerHTML = `

        <div style="
            text-align:center;
            padding:30px 15px;
        ">

            <div style="
                font-size:45px;
                margin-bottom:15px;
            ">
                🤖
            </div>

            <h2 style="
                color:#ff9800;
                margin-bottom:10px;
            ">
                AI FINAL ANALYSIS
            </h2>

            <p style="
                color:#aaa;
                font-size:16px;
            ">
                ${escapeHtml(text)}
            </p>

            <div style="
                margin-top:20px;
                font-size:30px;
            ">
                ⏳
            </div>

        </div>

    `;


    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   FINAL AI RESULTS
========================================================= */

function renderFinalAIResults(
    results,
    gameMode
) {

    const container =
        getAIResultsContainer();


    if (!results) {

        container.innerHTML = `

            <h2 style="color:#ff9800;">
                🤖 AI RESULTS
            </h2>

            <p style="color:#aaa;">
                AI result unavailable.
            </p>

        `;

        return;

    }


    const winner =
        results.winner ||
        {};


    const bestCharacter =
        results.bestCharacter ||
        {};


    const bestTeam =
        results.bestTeam ||
        {};


    const rankings =
        Array.isArray(
            results.rankings
        )
            ? results.rankings
            : [];


    const strengths =
        Array.isArray(
            winner.strengths
        )
            ? winner.strengths
            : [];


    const weaknesses =
        Array.isArray(
            winner.weaknesses
        )
            ? winner.weaknesses
            : [];


    container.innerHTML =
        "";


    const heading =
        document.createElement(
            "h2"
        );


    heading.textContent =
        "🤖 AI FINAL ANALYSIS";


    heading.style.color =
        "#ff9800";


    heading.style.textAlign =
        "center";


    heading.style.marginBottom =
        "20px";


    container.appendChild(
        heading
    );


    /* =====================================================
       WINNER
    ===================================================== */

    const winnerBox =
        document.createElement(
            "div"
        );


    winnerBox.style.padding =
        "20px";

    winnerBox.style.border =
        "2px solid #ff9800";

    winnerBox.style.borderRadius =
        "15px";

    winnerBox.style.marginBottom =
        "20px";

    winnerBox.style.textAlign =
        "center";


    winnerBox.innerHTML = `

        <div style="
            font-size:45px;
        ">
            🏆
        </div>

        <h2 style="
            color:#ff9800;
            margin:10px 0;
        ">
            ${escapeHtml(
                winner.playerName ||
                "Unknown"
            )}
        </h2>

        <div style="
            font-size:22px;
            font-weight:bold;
        ">
            AI Score:
            ${Number(
                winner.score || 0
            )}
        </div>

        <p style="
            color:#ccc;
            margin-top:12px;
            line-height:1.6;
        ">
            ${escapeHtml(
                winner.reason ||
                "Best overall team."
            )}
        </p>

    `;


    container.appendChild(
        winnerBox
    );


    /* =====================================================
       BEST CHARACTER
    ===================================================== */

    const bestCharacterBox =
        document.createElement(
            "div"
        );


    bestCharacterBox.style.padding =
        "15px";

    bestCharacterBox.style.background =
        "#171717";

    bestCharacterBox.style.border =
        "1px solid #333";

    bestCharacterBox.style.borderRadius =
        "12px";

    bestCharacterBox.style.marginBottom =
        "15px";


    bestCharacterBox.innerHTML = `

        <h3 style="
            color:#ff9800;
            margin-bottom:8px;
        ">
            ⭐ BEST CHARACTER
        </h3>

        <p>
            <strong>
                ${escapeHtml(
                    bestCharacter.character ||
                    "Unknown"
                )}
            </strong>
        </p>

        <p style="
            color:#aaa;
            margin-top:6px;
        ">
            Owner:
            ${escapeHtml(
                bestCharacter.owner ||
                "Unknown"
            )}
        </p>

        <p style="
            color:#ccc;
            margin-top:8px;
            line-height:1.5;
        ">
            ${escapeHtml(
                bestCharacter.reason ||
                ""
            )}
        </p>

    `;


    container.appendChild(
        bestCharacterBox
    );


    /* =====================================================
       BEST TEAM
    ===================================================== */

    const bestTeamBox =
        document.createElement(
            "div"
        );


    bestTeamBox.style.padding =
        "15px";

    bestTeamBox.style.background =
        "#171717";

    bestTeamBox.style.border =
        "1px solid #333";

    bestTeamBox.style.borderRadius =
        "12px";

    bestTeamBox.style.marginBottom =
        "20px";


    bestTeamBox.innerHTML = `

        <h3 style="
            color:#ff9800;
            margin-bottom:8px;
        ">
            👑 BEST TEAM
        </h3>

        <p>
            <strong>
                ${escapeHtml(
                    bestTeam.playerName ||
                    winner.playerName ||
                    "Unknown"
                )}
            </strong>
        </p>

        <p style="
            color:#ccc;
            margin-top:8px;
            line-height:1.5;
        ">
            ${escapeHtml(
                bestTeam.reason ||
                ""
            )}
        </p>

    `;


    container.appendChild(
        bestTeamBox
    );


    /* =====================================================
       RANKINGS
    ===================================================== */

    if (
        rankings.length > 0
    ) {

        const rankingHeading =
            document.createElement(
                "h3"
            );


        rankingHeading.textContent =
            "📊 TEAM RANKINGS";


        rankingHeading.style.color =
            "#ff9800";


        rankingHeading.style.marginBottom =
            "10px";


        container.appendChild(
            rankingHeading
        );


        rankings.forEach(
            rank => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.style.padding =
                    "15px";

                row.style.marginBottom =
                    "10px";

                row.style.background =
                    "#171717";

                row.style.border =
                    "1px solid #333";

                row.style.borderRadius =
                    "10px";


                const strengthsText =
                    Array.isArray(
                        rank.strengths
                    )
                        ? rank.strengths.join(
                            ", "
                        )
                        : "";


                const weaknessesText =
                    Array.isArray(
                        rank.weaknesses
                    )
                        ? rank.weaknesses.join(
                            ", "
                        )
                        : "";


                row.innerHTML = `

                    <div style="
                        font-size:18px;
                        font-weight:bold;
                        color:#ff9800;
                    ">
                        #${Number(
                            rank.position || 0
                        )}
                        —
                        ${escapeHtml(
                            rank.playerName ||
                            "Player"
                        )}
                    </div>

                    <div style="
                        margin-top:6px;
                    ">
                        AI Score:
                        <strong>
                            ${Number(
                                rank.score || 0
                            )}
                        </strong>
                    </div>

                    ${
                        strengthsText
                            ? `
                                <div style="
                                    margin-top:8px;
                                    color:#9ccc9c;
                                ">
                                    💪 Strengths:
                                    ${escapeHtml(
                                        strengthsText
                                    )}
                                </div>
                            `
                            : ""
                    }

                    ${
                        weaknessesText
                            ? `
                                <div style="
                                    margin-top:6px;
                                    color:#ff9999;
                                ">
                                    ⚠️ Weaknesses:
                                    ${escapeHtml(
                                        weaknessesText
                                    )}
                                </div>
                            `
                            : ""
                    }

                    <p style="
                        color:#ccc;
                        margin-top:8px;
                        line-height:1.5;
                    ">
                        ${escapeHtml(
                            rank.reason ||
                            ""
                        )}
                    </p>

                `;


                container.appendChild(
                    row
                );

            }
        );

    }


    /* =====================================================
       OVERALL ANALYSIS
    ===================================================== */

    if (
        results.analysis
    ) {

        const analysisBox =
            document.createElement(
                "div"
            );


        analysisBox.style.padding =
            "15px";

        analysisBox.style.marginTop =
            "15px";

        analysisBox.style.background =
            "#171717";

        analysisBox.style.border =
            "1px solid #333";

        analysisBox.style.borderRadius =
            "12px";


        analysisBox.innerHTML = `

            <h3 style="
                color:#ff9800;
                margin-bottom:10px;
            ">
                🧠 AI TEAM ANALYSIS
            </h3>

            <p style="
                color:#ccc;
                line-height:1.7;
                white-space:pre-line;
            ">
                ${escapeHtml(
                    results.analysis
                )}
            </p>

        `;


        container.appendChild(
            analysisBox
        );

    }


    /* =====================================================
       BATTLE PREDICTION
    ===================================================== */

    if (
        results.battlePrediction
    ) {

        const predictionBox =
            document.createElement(
                "div"
            );


        predictionBox.style.padding =
            "15px";

        predictionBox.style.marginTop =
            "15px";

        predictionBox.style.background =
            "#171717";

        predictionBox.style.border =
            "1px solid #333";

        predictionBox.style.borderRadius =
            "12px";


        predictionBox.innerHTML = `

            <h3 style="
                color:#ff9800;
                margin-bottom:10px;
            ">
                ⚔️ BATTLE PREDICTION
            </h3>

            <p style="
                color:#ccc;
                line-height:1.7;
                white-space:pre-line;
            ">
                ${escapeHtml(
                    results.battlePrediction
                )}
            </p>

        `;


        container.appendChild(
            predictionBox
        );

    }


    /* =====================================================
       AUCTION RECOMMENDATION
    ===================================================== */

    if (
        results.auctionRecommendation
    ) {

        const recommendationBox =
            document.createElement(
                "div"
            );


        recommendationBox.style.padding =
            "15px";

        recommendationBox.style.marginTop =
            "15px";

        recommendationBox.style.background =
            "#171717";

        recommendationBox.style.border =
            "1px solid #333";

        recommendationBox.style.borderRadius =
            "12px";


        recommendationBox.innerHTML = `

            <h3 style="
                color:#ff9800;
                margin-bottom:10px;
            ">
                💰 AI AUCTION RECOMMENDATION
            </h3>

            <p style="
                color:#ccc;
                line-height:1.7;
                white-space:pre-line;
            ">
                ${escapeHtml(
                    typeof results.auctionRecommendation ===
                    "string"

                        ? results.auctionRecommendation

                        : JSON.stringify(
                            results.auctionRecommendation,
                            null,
                            2
                        )
                )}
            </p>

        `;


        container.appendChild(
            recommendationBox
        );

    }


    /* =====================================================
       FINISHED
    ===================================================== */

    const finished =
        document.createElement(
            "div"
        );


    finished.style.textAlign =
        "center";

    finished.style.marginTop =
        "25px";

    finished.style.padding =
        "15px";


    finished.innerHTML = `

        <div style="
            font-size:28px;
        ">
            🎉
        </div>

        <strong>
            AI analysis complete
        </strong>

    `;


    container.appendChild(
        finished
    );


    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   SERVER ERROR
========================================================= */

socket.on(
    "errorMessage",
    text => {

        showMessage(
            text
        );

    }
);


/* =========================================================
   SOCKET CONNECTED
========================================================= */

socket.on(
    "connect",
    () => {

        myPlayerId =
            socket.id;


        console.log(
            "Connected:",
            socket.id
        );

    }
);


/* =========================================================
   SOCKET DISCONNECTED
========================================================= */

socket.on(
    "disconnect",
    () => {

        showMessage(
            "Connection lost. Reconnecting..."
        );

    }
);


/* =========================================================
   CONNECTION ERROR
========================================================= */

socket.on(
    "connect_error",
    error => {

        console.error(
            "Socket connection error:",
            error
        );


        showMessage(
            "Unable to connect to game server."
        );

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

showScreen(
    homeScreen
);


/* =========================================================
   DEBUG
========================================================= */

console.log(
    "Naruto Character Battle loaded."
);

console.log(
    "Characters:",
    SERVER_CHARACTERS.length
);

console.log(
    "Rank categories:",
    RANK_CATEGORIES.length
);

console.log(
    "Auction:",
    `₹${BID_INCREMENT} / ${AUCTION_TIME}s / Team ${TEAM_SIZE}`
);
