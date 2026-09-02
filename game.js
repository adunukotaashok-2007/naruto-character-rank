/* =========================================================
   NARUTO CHARACTER BATTLE
   GAME.JS
   ========================================================= */

const socket = io({
    transports: ["websocket", "polling"]
});


/* =========================================================
   CHARACTER IMAGE DATABASE
   EXACT SERVER CHARACTER NAMES
========================================================= */

const CHARACTER_IMAGES = {

    "Naruto": "assets/characters/images%20%282%29.jpeg",
    "Sasuke": "assets/characters/images%20%283%29.jpeg",
    "Itachi": "assets/characters/images%20%284%29.jpeg",
    "Madara": "assets/characters/images%20%285%29.jpeg",

    "Kakashi":
        "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg",

    "Minato": "assets/characters/images%20%286%29.jpeg",
    "Tobirama": "assets/characters/images%20%287%29.jpeg",
    "Hashirama": "assets/characters/images%20%288%29.jpeg",
    "Jiraiya": "assets/characters/images%20%289%29.jpeg",
    "Hiruzen": "assets/characters/images%20%2810%29.jpeg",
    "Orochimaru": "assets/characters/images%20%2811%29.jpeg",

    "Might Guy": "assets/characters/images%20%2812%29.jpeg",
    "Rock Lee": "assets/characters/images%20%2813%29.jpeg",
    "Shikamaru": "assets/characters/images%20%2814%29.jpeg",
    "Neji": "assets/characters/images%20%2815%29.jpeg",
    "Gaara": "assets/characters/images%20%2816%29.jpeg",
    "Kisame": "assets/characters/images%20%2817%29.jpeg",
    "Sakura": "assets/characters/images%20%2818%29.jpeg",
    "Nagato": "assets/characters/images%20%2819%29.jpeg",
    "Obito": "assets/characters/images%20%2820%29.jpeg",

    "Killer B": "assets/characters/download%20%281%29.jpeg",
    "Sasori": "assets/characters/download%20%2810%29.jpeg",
    "Deidara": "assets/characters/download%20%2811%29.jpeg",
    "Mu": "assets/characters/download%20%2812%29.jpeg",
    "Gengetsu Hōzuki": "assets/characters/download%20%2813%29.jpeg",
    "Danzo": "assets/characters/download%20%2814%29.jpeg",
    "Kakuzu": "assets/characters/download%20%2815%29.jpeg",
    "Hidan": "assets/characters/download%20%2816%29.jpeg",
    "Konan": "assets/characters/download%20%2817%29.jpeg",
    "Zabuza": "assets/characters/download%20%2818%29.jpeg",
    "Kimimaro": "assets/characters/download%20%2819%29.jpeg",
    "Kabuto": "assets/characters/download%20%282%29.jpeg",
    "Suigetsu": "assets/characters/download%20%2820%29.jpeg",
    "Jugo": "assets/characters/download%20%2821%29.jpeg",
    "Karin": "assets/characters/download%20%2822%29.jpeg",
    "Yahiko": "assets/characters/download%20%2823%29.jpeg",
    "Zetsu": "assets/characters/download%20%2824%29.jpeg",
    "Hinata": "assets/characters/download%20%2825%29.jpeg",
    "Ino": "assets/characters/download%20%2826%29.jpeg",
    "Choji": "assets/characters/download%20%2827%29.jpeg",
    "Kiba": "assets/characters/download%20%2828%29.jpeg",
    "Shino": "assets/characters/download%20%2829%29.jpeg",
    "Shisui": "assets/characters/download%20%283%29.jpeg",
    "Tenten": "assets/characters/download%20%2830%29.jpeg",
    "Iruka": "assets/characters/download%20%2831%29.jpeg",
    "Anko": "assets/characters/download%20%2832%29.jpeg",
    "Duy": "assets/characters/download%20%2833%29.jpeg",
    "Shizune": "assets/characters/download%20%2834%29.jpeg",
    "Asuma": "assets/characters/download%20%2835%29.jpeg",
    "Kurenai": "assets/characters/download%20%2836%29.jpeg",
    "Yamato": "assets/characters/download%20%2837%29.jpeg",
    "Sai": "assets/characters/download%20%2838%29.jpeg",
    "Konohamaru": "assets/characters/download%20%2839%29.jpeg",
    "Sakumo": "assets/characters/download%20%284%29.jpeg",
    "Kurotsuchi": "assets/characters/download%20%2840%29.jpeg",
    "Mifune": "assets/characters/download%20%2841%29.jpeg",
    "Fu": "assets/characters/download%20%2842%29.jpeg",
    "Utakata": "assets/characters/download%20%2843%29.jpeg",
    "Hanzo": "assets/characters/download%20%285%29.jpeg",
    "Four Tails Jinchuriki": "assets/characters/download%20%2844%29.jpeg",
    "Third Raikage": "assets/characters/download%20%286%29.jpeg",
    "Fourth Raikage": "assets/characters/download%20%287%29.jpeg",
    "Onoki": "assets/characters/download%20%288%29.jpeg",
    "Mei": "assets/characters/download%20%289%29.jpeg",
    "Tsunade": "assets/characters/download.jpeg",

    "Chiyo": "assets/characters/images%20%2821%29.jpeg",
    "Rasa": "assets/characters/images%20%2822%29.jpeg",
    "Masashi Kishimoto": "assets/characters/images%20%2823%29.jpeg",
    "Darui": "assets/characters/images%20%2824%29.jpeg",
    "Chōjūrō": "assets/characters/images%20%2825%29.jpeg"
};


/* =========================================================
   COMPLETE CHARACTER LIST
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
    "Third Raikage",
    "Fourth Raikage",
    "Onoki",
    "Mei",

    "Tsunade",
    "Chiyo",
    "Rasa",
    "Masashi Kishimoto",
    "Darui",
    "Chōjūrō",

    "Four Tails Jinchuriki"
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

const STARTING_BALANCE = 1000;
const BID_INCREMENT = 50;
const AUCTION_TIME = 15;
const TEAM_SIZE = 5;


/* =========================================================
   STATE
========================================================= */

let myPlayerId = null;
let currentRoomCode = null;
let currentGameMode = "rank";

let currentPlayers = [];

let currentCategory = 0;
let selectedCharacter = null;

let currentAuction = null;

let roomSettings = {
    teamSize: TEAM_SIZE,
    startingBalance: STARTING_BALANCE,
    bidAmount: BID_INCREMENT,
    bidTime: AUCTION_TIME
};


/* =========================================================
   ELEMENTS
========================================================= */

const homeScreen =
    document.getElementById("homeScreen");

const roomScreen =
    document.getElementById("roomScreen");

const rankScreen =
    document.getElementById("rankScreen");

const auctionScreen =
    document.getElementById("auctionScreen");

const playerNameInput =
    document.getElementById("playerName");

const gameModeSelect =
    document.getElementById("gameMode");

const roomCodeInput =
    document.getElementById("roomCodeInput");

const roomCodeDisplay =
    document.getElementById("roomCodeDisplay");

const playersList =
    document.getElementById("playersList");

const playerCount =
    document.getElementById("playerCount");

const startGameButton =
    document.getElementById("startGameButton");

const message =
    document.getElementById("message");

const characterGrid =
    document.getElementById("characterGrid");

const rankStatus =
    document.getElementById("rankStatus");

const auctionImage =
    document.getElementById("auctionCharacterImage");

const auctionCharacter =
    document.getElementById("auctionCharacter");

const auctionTimer =
    document.getElementById("auctionTimer");

const auctionBid =
    document.getElementById("auctionBid");

const auctionHighest =
    document.getElementById("auctionHighest");

const auctionBalance =
    document.getElementById("auctionBalance");

const auctionNextBid =
    document.getElementById("auctionNextBid");

const auctionMoney =
    document.getElementById("auctionMoney");

const bidButton =
    document.getElementById("bidButton");

const giveUpButton =
    document.getElementById("giveUpButton");

const myTeam =
    document.getElementById("myTeam");


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;
}


/* =========================================================
   SCREEN CONTROL
========================================================= */

function showScreen(screen) {

    [
        homeScreen,
        roomScreen,
        rankScreen,
        auctionScreen
    ].forEach(item => {

        if (item) {
            item.classList.add("hidden");
        }

    });

    if (screen) {
        screen.classList.remove("hidden");
    }
}


/* =========================================================
   MESSAGE
========================================================= */

let messageTimer = null;

function showMessage(text) {

    if (!message) {
        return;
    }

    message.textContent = text;

    message.classList.add("show");

    clearTimeout(messageTimer);

    messageTimer =
        setTimeout(() => {

            message.classList.remove("show");

        }, 2500);
}


/* =========================================================
   NORMALIZE CHARACTER
========================================================= */

function normalizeCharacterName(character) {

    if (!character) {
        return "";
    }

    const aliases = {

        "Guy": "Might Guy",
        "Lee": "Rock Lee",

        "Killer Bee": "Killer B",
        "KillerB": "Killer B",

        "Nagato/Pain": "Nagato",
        "Pain": "Nagato",

        "Gengetsu": "Gengetsu Hōzuki",

        "Danzō": "Danzo",

        "Mū": "Mu",

        "Jūgo": "Jugo",

        "Chōji": "Choji",

        "Chojuro": "Chōjūrō",

        "Ōnoki": "Onoki",

        "3rd Raikage": "Third Raikage",
        "ThirdRaikage": "Third Raikage",

        "4th Raikage": "Fourth Raikage",
        "FourthRaikage": "Fourth Raikage",

        "Roshi": "Four Tails Jinchuriki",

        "Konahamaru": "Konohamaru"
    };

    return aliases[String(character).trim()]
        || String(character).trim();
}


/* =========================================================
   GET CHARACTER IMAGE
========================================================= */

function getCharacterImage(character) {

    const normalized =
        normalizeCharacterName(character);

    return (
        CHARACTER_IMAGES[normalized] ||
        CHARACTER_IMAGES[character] ||
        ""
    );
}


/* =========================================================
   SAFE IMAGE
========================================================= */

function createImage(character) {

    const image =
        getCharacterImage(character);

    if (!image) {

        const fallback =
            document.createElement("div");

        fallback.className =
            "image-fallback";

        fallback.textContent =
            "Image unavailable";

        return fallback;
    }

    const img =
        document.createElement("img");

    img.src = image;

    img.alt = character;

    img.loading = "lazy";

    img.addEventListener(
        "error",
        () => {

            const fallback =
                document.createElement("div");

            fallback.className =
                "image-fallback";

            fallback.textContent =
                "Image unavailable";

            img.replaceWith(fallback);

        }
    );

    return img;
}


/* =========================================================
   CREATE ROOM
========================================================= */

document
    .getElementById("createButton")
    .addEventListener("click", () => {

        const name =
            playerNameInput.value.trim();

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
                name,
                gameMode,

                maxPlayers: 25,

                teamSize: 5,

                startingBalance: 1000,

                bidAmount: 50,

                bidTime: 15
            }
        );

    });


/* =========================================================
   SHOW JOIN BOX
========================================================= */

document
    .getElementById("showJoinButton")
    .addEventListener("click", () => {

        document
            .getElementById("joinBox")
            .classList
            .toggle("hidden");

    });


/* =========================================================
   JOIN ROOM
========================================================= */

document
    .getElementById("joinButton")
    .addEventListener("click", () => {

        const name =
            playerNameInput.value.trim();

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
                name,
                roomCode
            }
        );

    });


/* =========================================================
   ROOM CREATED
========================================================= */

socket.on(
    "roomCreated",
    data => {

        myPlayerId = socket.id;

        currentRoomCode =
            data.roomCode;

        currentGameMode =
            data.gameMode;

        roomCodeDisplay.textContent =
            data.roomCode;

        updateRoomModeText();

        startGameButton.classList.remove(
            "hidden"
        );

        showScreen(roomScreen);

    }
);


/* =========================================================
   ROOM JOINED
========================================================= */

socket.on(
    "roomJoined",
    data => {

        myPlayerId = socket.id;

        currentRoomCode =
            data.roomCode;

        currentGameMode =
            data.gameMode;

        roomCodeDisplay.textContent =
            data.roomCode;

        updateRoomModeText();

        if (data.isHost) {

            startGameButton.classList.remove(
                "hidden"
            );

        } else {

            startGameButton.classList.add(
                "hidden"
            );

        }

        showScreen(roomScreen);

    }
);


/* =========================================================
   ROOM MODE TEXT
========================================================= */

function updateRoomModeText() {

    const roomMode =
        document.getElementById("roomMode");

    if (!roomMode) {
        return;
    }

    if (currentGameMode === "auction") {

        roomMode.textContent =
            "🔥 Auction Mode — ₹50 increment — 15 seconds";

    } else {

        roomMode.textContent =
            "🏆 Character Rank Mode — 16 Categories";

    }
}


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

        playersList.innerHTML = "";

        currentPlayers.forEach(player => {

            const card =
                document.createElement("div");

            card.className =
                "player-card";

            if (
                player.id ===
                myPlayerId
            ) {

                card.classList.add("me");

            }

            const teamCount =
                Array.isArray(player.team)
                    ? player.team.length
                    : 0;

            card.innerHTML = `

                <div class="player-name">

                    ${escapeHtml(player.name)}

                    ${
                        player.id === myPlayerId
                            ? " (YOU)"
                            : ""
                    }

                </div>

                <div class="player-balance">

                    💰 Balance:
                    ₹${Number(
                        player.balance ??
                        STARTING_BALANCE
                    ).toLocaleString("en-IN")}

                </div>

                <div class="player-team">

                    🏆 Team:
                    ${teamCount}/${TEAM_SIZE}

                </div>

            `;

            playersList.appendChild(card);

        });

    }
);


/* =========================================================
   START GAME
========================================================= */

startGameButton.addEventListener(
    "click",
    () => {

        socket.emit("startGame");

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

            showScreen(auctionScreen);

        } else {

            showScreen(rankScreen);

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
                data.categoryIndex || 0
            );

        selectedCharacter = null;

        renderRankCategory(data);

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
                data.categoryIndex || 0
            );

        selectedCharacter = null;

        renderRankCategory(data);

    }
);


/* =========================================================
   RENDER RANK CATEGORY
========================================================= */

function renderRankCategory(data) {

    showScreen(rankScreen);

    const title =
        document.getElementById(
            "categoryTitle"
        );

    const number =
        document.getElementById(
            "categoryNumber"
        );

    if (title) {

        title.textContent =
            data.categoryName ||
            RANK_CATEGORIES[currentCategory] ||
            "Character Rank";

    }

    if (number) {

        number.textContent =
            `Category ${
                Number(
                    data.categoryNumber ||
                    currentCategory + 1
                )
            } / ${
                Number(
                    data.totalCategories ||
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

    characterGrid.innerHTML = "";

    SERVER_CHARACTERS.forEach(
        (character, index) => {

            const card =
                document.createElement("div");

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
                document.createElement("div");

            rankNumber.className =
                "rank-number";

            rankNumber.textContent =
                `#${index + 1}`;

            card.appendChild(rankNumber);

            card.appendChild(
                createImage(character)
            );

            const name =
                document.createElement("div");

            name.className =
                "character-name";

            name.textContent =
                character;

            card.appendChild(name);

            characterGrid.appendChild(card);

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
            `⏳ Selected ${character}. Waiting for other players...`;

        socket.emit(
            "rankSelect",
            {
                categoryIndex:
                    currentCategory,

                character
            }
        );

    }
);


/* =========================================================
   PRIVATE RANK SELECTION ACCEPTED
   IMPORTANT:
   DO NOT SHOW OTHER PLAYER'S SELECTION
========================================================= */

socket.on(
    "rankSelectionAccepted",
    data => {

        if (
            Number(data.categoryIndex) !==
            currentCategory
        ) {
            return;
        }

        selectedCharacter =
            data.character;

        rankStatus.textContent =
            `✅ You selected ${data.character}. Waiting for other players...`;

        showMessage(
            `✅ ${data.character} selected`
        );

    }
);


/* =========================================================
   MY RANK STATUS
========================================================= */

socket.on(
    "myRankStatus",
    data => {

        if (!data.selected) {
            return;
        }

        selectedCharacter =
            data.character;

        rankStatus.textContent =
            `✅ You selected ${data.character} — waiting...`;

    }
);


/* =========================================================
   RANK WAITING
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
                `⏳ ${selected}/${total} players selected`;

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
   RANK FINISHED
========================================================= */

socket.on(
    "rankFinished",
    data => {

        const title =
            document.getElementById(
                "categoryTitle"
            );

        const number =
            document.getElementById(
                "categoryNumber"
            );

        if (title) {

            title.textContent =
                "🏆 CHARACTER RANK COMPLETE";

        }

        if (number) {

            number.textContent =
                "16 / 16 Categories Completed";

        }

        rankStatus.textContent =
            "🎉 All categories completed! AI is analyzing the results...";

        showScreen(rankScreen);

        if (data && data.results) {

            renderBasicRankResults(
                data.results
            );

        }

    }
);


/* =========================================================
   BASIC RANK RESULTS
========================================================= */

function renderBasicRankResults(results) {

    if (!Array.isArray(results)) {
        return;
    }

    let box =
        document.getElementById(
            "basicRankResults"
        );

    if (!box) {

        box =
            document.createElement("div");

        box.id =
            "basicRankResults";

        box.style.marginTop =
            "25px";

        characterGrid.parentNode.appendChild(
            box
        );

    }

    box.innerHTML = `
        <div class="panel">

            <h2>🏆 Rank Results</h2>

            <p style="color:#aaa;text-align:center;">
                All player selections are now revealed.
            </p>

            ${results.map(item => `

                <div
                    style="
                        margin-top:12px;
                        padding:12px;
                        background:#171717;
                        border:1px solid #333;
                        border-radius:10px;
                    "
                >

                    <strong>
                        ${escapeHtml(
                            item.playerName ||
                            "Player"
                        )}
                    </strong>

                </div>

            `).join("")}

        </div>
    `;

}


/* =========================================================
   AUCTION STARTED
========================================================= */

socket.on(
    "auctionStarted",
    data => {

        showScreen(auctionScreen);

        roomSettings.teamSize =
            Number(
                data.teamSize ||
                TEAM_SIZE
            );

        roomSettings.startingBalance =
            Number(
                data.startingBalance ||
                STARTING_BALANCE
            );

        roomSettings.bidAmount =
            BID_INCREMENT;

        roomSettings.bidTime =
            AUCTION_TIME;

        bidButton.textContent =
            "💰 BID ₹50";

        showMessage(
            "🔥 Auction started! ₹50 increments — 15 seconds."
        );

    }
);


/* =========================================================
   AUCTION NEW CHARACTER
========================================================= */

socket.on(
    "auctionNewCharacter",
    data => {

        showScreen(auctionScreen);

        const character =
            data.character;

        auctionCharacter.textContent =
            character;

        const number =
            document.getElementById(
                "auctionCharacterNumber"
            );

        if (number) {

            number.textContent =
                `Character ${
                    data.characterNumber || 1
                } / ${
                    data.totalCharacters ||
                    SERVER_CHARACTERS.length
                }`;

        }

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

        updateAuctionCharacter(
            character
        );

        bidButton.disabled =
            false;

        giveUpButton.disabled =
            false;

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
        getCharacterImage(character);

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
   AUCTION UPDATE
========================================================= */

socket.on(
    "auctionUpdated",
    data => {

        currentAuction =
            data;

        if (data.character) {

            updateAuctionCharacter(
                data.character
            );

        }

        const current =
            Number(
                data.currentBid || 0
            );

        const next =
            current + BID_INCREMENT;

        auctionBid.textContent =
            `₹${current.toLocaleString("en-IN")}`;

        auctionHighest.textContent =
            data.highestBidderName ||
            "Nobody";

        auctionNextBid.textContent =
            `Next Bid: ₹${next.toLocaleString("en-IN")}`;

        const seconds =
            Number(
                data.remainingTime ?? AUCTION_TIME
            );

        auctionTimer.textContent =
            seconds;

        updateTimerStyle(seconds);

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
                data.seconds || 0
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

function updateTimerStyle(seconds) {

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
                data.balance || 0
            );

        const spent =
            Number(
                data.spent || 0
            );

        const current =
            Number(
                data.currentBid || 0
            );

        const nextBid =
            current + BID_INCREMENT;

        auctionBalance.textContent =
            `₹${balance.toLocaleString("en-IN")}`;

        auctionMoney.textContent =
            `Balance: ₹${balance.toLocaleString("en-IN")} | Spent: ₹${spent.toLocaleString("en-IN")}`;

        auctionNextBid.textContent =
            `Next Bid: ₹${nextBid.toLocaleString("en-IN")}`;

        bidButton.disabled =
            !data.canBid;

        giveUpButton.disabled =
            !!data.gaveUp;

    }
);


/* =========================================================
   BID BUTTON
========================================================= */

bidButton.addEventListener(
    "click",
    () => {

        if (bidButton.disabled) {
            return;
        }

        socket.emit("bid");

    }
);


/* =========================================================
   GIVE UP BUTTON
========================================================= */

giveUpButton.addEventListener(
    "click",
    () => {

        if (giveUpButton.disabled) {
            return;
        }

        socket.emit("giveUp");

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
            `💰 ${data.playerName} bid ₹${amount.toLocaleString("en-IN")}`
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
            `🔥 ${data.character} sold to ${data.winnerName} for ₹${price.toLocaleString("en-IN")}`
        );

        if (
            data.winnerId ===
            myPlayerId
        ) {

            updateTeam(
                data.team
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
            `❌ ${data.character} was UNSOLD`
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
            "🏆 AUCTION FINISHED! AI is analyzing all teams..."
        );

        if (data.teams) {

            const myResult =
                data.teams.find(
                    team =>
                        team.playerId ===
                        myPlayerId
                );

            if (myResult) {

                updateTeam(
                    myResult.team
                );

            }

        }

        renderAuctionFinalTeams(
            data.teams || []
        );

        showScreen(roomScreen);

    }
);


/* =========================================================
   RENDER FINAL AUCTION TEAMS
========================================================= */

function renderAuctionFinalTeams(teams) {

    if (!Array.isArray(teams)) {
        return;
    }

    let box =
        document.getElementById(
            "finalAuctionTeams"
        );

    if (!box) {

        box =
            document.createElement("div");

        box.id =
            "finalAuctionTeams";

        box.className =
            "panel";

        box.style.maxWidth =
            "1100px";

        box.style.margin =
            "20px auto";

        roomScreen.appendChild(box);

    }

    box.innerHTML = `
        <h2 style="text-align:center;">
            🏆 FINAL AUCTION TEAMS
        </h2>

        <div class="players">

            ${teams.map(team => `

                <div class="player-card">

                    <div class="player-name">

                        ${escapeHtml(
                            team.playerName ||
                            "Player"
                        )}

                    </div>

                    <div class="player-team">

                        Team:
                        ${
                            Array.isArray(team.team)
                                ? team.team.length
                                : 0
                        }/${TEAM_SIZE}

                    </div>

                    <div
                        class="team-list"
                        style="margin-top:10px;"
                    >

                        ${
                            Array.isArray(team.team)
                                ? team.team.map(character => `

                                    <div
                                        class="team-character"
                                    >

                                        <img
                                            src="${getCharacterImage(character)}"
                                            alt="${escapeHtml(character)}"
                                            style="
                                                width:100%;
                                                height:100px;
                                                object-fit:cover;
                                                border-radius:7px;
                                            "
                                            onerror="
                                                this.style.display='none';
                                            "
                                        >

                                        <div
                                            class="team-character-name"
                                        >
                                            ${escapeHtml(character)}
                                        </div>

                                    </div>

                                `).join("")
                                : ""
                        }

                    </div>

                </div>

            `).join("")}

        </div>
    `;

}


/* =========================================================
   UPDATE MY TEAM
========================================================= */

function updateTeam(team) {

    if (!Array.isArray(team)) {
        return;
    }

    myTeam.innerHTML = "";

    if (team.length === 0) {

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

    team.forEach(character => {

        const item =
            document.createElement("div");

        item.className =
            "team-character";

        item.appendChild(
            createImage(character)
        );

        const name =
            document.createElement("div");

        name.className =
            "team-character-name";

        name.textContent =
            character;

        item.appendChild(name);

        myTeam.appendChild(item);

    });

}


/* =========================================================
   AI FINAL RESULTS LOADING
========================================================= */

socket.on(
    "finalResultsLoading",
    data => {

        showAIResultsLoading(
            data?.message ||
            "AI is analyzing the complete game..."
        );

    }
);


/* =========================================================
   AI FINAL RESULTS
========================================================= */

socket.on(
    "finalAIResults",
    data => {

        if (!data) {
            return;
        }

        renderFinalAIResults(
            data.results,
            data.gameMode
        );

    }
);


/* =========================================================
   CREATE AI RESULTS SCREEN
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
        document.createElement("div");

    container.id =
        "aiFinalResults";

    container.style.maxWidth =
        "1100px";

    container.style.margin =
        "20px auto";

    container.style.padding =
        "15px";

    document.body.appendChild(
        container
    );

    return container;
}


/* =========================================================
   AI LOADING
========================================================= */

function showAIResultsLoading(messageText) {

    const container =
        getAIResultsContainer();

    container.innerHTML = `

        <div
            class="panel"
            style="
                text-align:center;
                padding:35px 20px;
            "
        >

            <div
                style="
                    font-size:50px;
                    margin-bottom:15px;
                "
            >
                🤖
            </div>

            <h2>
                AI ANALYZING RESULTS
            </h2>

            <p
                style="
                    margin-top:12px;
                    color:#aaa;
                "
            >
                ${escapeHtml(messageText)}
            </p>

            <p
                style="
                    margin-top:12px;
                    color:#ff9800;
                    font-weight:bold;
                "
            >
                Please wait...
            </p>

        </div>

    `;

    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   AI FINAL RESULTS RENDER
========================================================= */

function renderFinalAIResults(
    results,
    gameMode
) {

    const container =
        getAIResultsContainer();

    if (!results) {

        container.innerHTML = `

            <div class="panel">

                <h2>
                    🤖 AI RESULTS
                </h2>

                <p>
                    AI result data was not available.
                </p>

            </div>

        `;

        return;
    }

    const winner =
        results.winner || {};

    const rankings =
        Array.isArray(results.rankings)
            ? results.rankings
            : [];

    const bestCharacter =
        results.bestCharacter || {};

    const bestTeam =
        results.bestTeam || {};

    container.innerHTML = `

        <div class="panel">

            <div
                style="
                    text-align:center;
                    padding:10px;
                "
            >

                <div
                    style="
                        font-size:50px;
                    "
                >
                    🏆
                </div>

                <h1
                    style="
                        color:#ff9800;
                        margin-top:10px;
                    "
                >
                    AI FINAL RESULTS
                </h1>

                <p
                    style="
                        color:#999;
                        margin-top:8px;
                    "
                >
                    ${
                        gameMode === "auction"
                            ? "Character Auction Analysis"
                            : "Character Rank Analysis"
                    }
                </p>

            </div>


            <div
                style="
                    margin-top:25px;
                    padding:20px;
                    background:#111;
                    border:2px solid #ff9800;
                    border-radius:15px;
                    text-align:center;
                "
            >

                <div
                    style="
                        color:#aaa;
                        font-size:13px;
                    "
                >
                    🥇 BEST PLAYER / TEAM
                </div>

                <div
                    style="
                        margin-top:8px;
                        font-size:28px;
                        font-weight:bold;
                        color:#ff9800;
                    "
                >
                    ${escapeHtml(
                        winner.playerName ||
                        bestTeam.playerName ||
                        "Unknown"
                    )}
                </div>

                ${
                    winner.score !== undefined
                        ? `
                            <div
                                style="
                                    margin-top:8px;
                                    font-size:20px;
                                "
                            >
                                Score:
                                ${escapeHtml(
                                    winner.score
                                )}
                            </div>
                        `
                        : ""
                }

                <p
                    style="
                        margin-top:12px;
                        color:#ccc;
                        line-height:1.6;
                    "
                >
                    ${escapeHtml(
                        winner.reason ||
                        bestTeam.reason ||
                        ""
                    )}
                </p>

            </div>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(220px,1fr)
                        );
                    gap:15px;
                    margin-top:20px;
                "
            >

                <div
                    style="
                        background:#171717;
                        border:1px solid #333;
                        border-radius:12px;
                        padding:18px;
                    "
                >

                    <h3>
                        ⭐ Best Character
                    </h3>

                    <p
                        style="
                            color:#ff9800;
                            font-size:20px;
                            font-weight:bold;
                            margin-top:8px;
                        "
                    >
                        ${escapeHtml(
                            bestCharacter.character ||
                            "Unknown"
                        )}
                    </p>

                    <p
                        style="
                            color:#aaa;
                            margin-top:7px;
                        "
                    >
                        Owner:
                        ${escapeHtml(
                            bestCharacter.owner ||
                            "Unknown"
                        )}
                    </p>

                    <p
                        style="
                            margin-top:10px;
                            line-height:1.5;
                        "
                    >
                        ${escapeHtml(
                            bestCharacter.reason ||
                            ""
                        )}
                    </p>

                </div>


                <div
                    style="
                        background:#171717;
                        border:1px solid #333;
                        border-radius:12px;
                        padding:18px;
                    "
                >

                    <h3>
                        🏆 Best Team
                    </h3>

                    <p
                        style="
                            color:#ff9800;
                            font-size:20px;
                            font-weight:bold;
                            margin-top:8px;
                        "
                    >
                        ${escapeHtml(
                            bestTeam.playerName ||
                            winner.playerName ||
                            "Unknown"
                        )}
                    </p>

                    <p
                        style="
                            margin-top:10px;
                            line-height:1.5;
                        "
                    >
                        ${escapeHtml(
                            bestTeam.reason ||
                            ""
                        )}
                    </p>

                </div>

            </div>


            <div style="margin-top:25px;">

                <h2>
                    📊 PLAYER RANKINGS
                </h2>

                ${
                    rankings.length
                        ? rankings.map(rank => `

                            <div
                                style="
                                    margin-top:12px;
                                    padding:17px;
                                    background:#171717;
                                    border:1px solid #333;
                                    border-radius:12px;
                                "
                            >

                                <div
                                    style="
                                        display:flex;
                                        justify-content:space-between;
                                        gap:10px;
                                        flex-wrap:wrap;
                                    "
                                >

                                    <strong
                                        style="
                                            color:#ff9800;
                                            font-size:18px;
                                        "
                                    >
                                        #${escapeHtml(
                                            rank.position ??
                                            ""
                                        )}
                                        ${escapeHtml(
                                            rank.playerName ||
                                            "Player"
                                        )}
                                    </strong>

                                    <strong>
                                        Score:
                                        ${escapeHtml(
                                            rank.score ??
                                            ""
                                        )}
                                    </strong>

                                </div>


                                <p
                                    style="
                                        margin-top:10px;
                                        line-height:1.5;
                                    "
                                >
                                    ${escapeHtml(
                                        rank.reason ||
                                        ""
                                    )}
                                </p>


                                ${
                                    Array.isArray(
                                        rank.strengths
                                    ) &&
                                    rank.strengths.length
                                        ? `
                                            <div
                                                style="
                                                    margin-top:10px;
                                                    color:#7cff9b;
                                                "
                                            >
                                                <strong>
                                                    Strengths:
                                                </strong>

                                                ${rank.strengths
                                                    .map(
                                                        item =>
                                                            escapeHtml(item)
                                                    )
                                                    .join(", ")
                                                }
                                            </div>
                                        `
                                        : ""
                                }


                                ${
                                    Array.isArray(
                                        rank.weaknesses
                                    ) &&
                                    rank.weaknesses.length
                                        ? `
                                            <div
                                                style="
                                                    margin-top:7px;
                                                    color:#ff8585;
                                                "
                                            >
                                                <strong>
                                                    Weaknesses:
                                                </strong>

                                                ${rank.weaknesses
                                                    .map(
                                                        item =>
                                                            escapeHtml(item)
                                                    )
                                                    .join(", ")
                                                }
                                            </div>
                                        `
                                        : ""
                                }

                            </div>

                        `).join("")
                        : `
                            <p
                                style="
                                    margin-top:12px;
                                    color:#888;
                                "
                            >
                                No ranking details available.
                            </p>
                        `
                }

            </div>


            <div
                style="
                    margin-top:25px;
                    padding:20px;
                    background:#171717;
                    border:1px solid #333;
                    border-radius:12px;
                "
            >

                <h2>
                    🧠 AI ANALYSIS
                </h2>

                <p
                    style="
                        margin-top:12px;
                        color:#ccc;
                        line-height:1.7;
                        white-space:pre-line;
                    "
                >
                    ${escapeHtml(
                        results.analysis ||
                        "No analysis available."
                    )}
                </p>

            </div>


            <div
                style="
                    margin-top:20px;
                    padding:20px;
                    background:#171717;
                    border:1px solid #333;
                    border-radius:12px;
                "
            >

                <h2>
                    ⚔️ BATTLE PREDICTION
                </h2>

                <p
                    style="
                        margin-top:12px;
                        color:#ccc;
                        line-height:1.7;
                        white-space:pre-line;
                    "
                >
                    ${escapeHtml(
                        results.battlePrediction ||
                        "No battle prediction available."
                    )}
                </p>

            </div>


            <button
                id="backToRoomButton"
                class="main-button"
                style="
                    margin-top:25px;
                "
            >
                🔄 BACK TO GAME ROOM
            </button>

        </div>

    `;

    const backButton =
        document.getElementById(
            "backToRoomButton"
        );

    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                container.remove();

                showScreen(
                    roomScreen
                );

            }
        );

    }

    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

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
   ERROR MESSAGE
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
   INITIAL
========================================================= */

showScreen(
    homeScreen
);
