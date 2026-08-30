const SERVER_URL =
"https://naruto-character-rank.onrender.com";

const socket = io(SERVER_URL);

// ==========================================
// CATEGORIES
// ==========================================

const categories = [

"🧬 Talent",
"💪 Body",
"🧠 Mind / IQ",
"🩸 Clan",
"🔵 Chakra",
"👨‍🏫 Sensei",
"🥋 Taijutsu",
"🌀 Ninjutsu",
"🔥 Kekkei Genkai",
"⚡ Speed",
"💥 Strength",
"🎯 Battle IQ",
"👻 Genjutsu",
"🌪️ Chakra Nature",
"🐉 Tailed Beast",
"❤️ Healing"

];

// ==========================================
// CHARACTERS
// ==========================================

const characters = {

Naruto: {
    name: "Naruto Uzumaki",
    image: "assets/characters/images%20%282%29.jpeg"
},

Sasuke: {
    name: "Sasuke Uchiha",
    image: "assets/characters/images%20%283%29.jpeg"
},

Itachi: {
    name: "Itachi Uchiha",
    image: "assets/characters/images%20%284%29.jpeg"
},

Madara: {
    name: "Madara Uchiha",
    image: "assets/characters/images%20%285%29.jpeg"
},

Kakashi: {
    name: "Kakashi Hatake",
    image: "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg"
},

Minato: {
    name: "Minato Namikaze",
    image: "assets/characters/images%20%286%29.jpeg"
},

Tobirama: {
    name: "Tobirama Senju",
    image: "assets/characters/images%20%287%29.jpeg"
},

Hashirama: {
    name: "Hashirama Senju",
    image: "assets/characters/images%20%288%29.jpeg"
},

Jiraiya: {
    name: "Jiraiya",
    image: "assets/characters/images%20%289%29.jpeg"
},

Hiruzen: {
    name: "Hiruzen Sarutobi",
    image: "assets/characters/images%20%2810%29.jpeg"
},

Orochimaru: {
    name: "Orochimaru",
    image: "assets/characters/images%20%2811%29.jpeg"
},

Guy: {
    name: "Might Guy",
    image: "assets/characters/images%20%2812%29.jpeg"
},

Lee: {
    name: "Rock Lee",
    image: "assets/characters/images%20%2813%29.jpeg"
},

Shikamaru: {
    name: "Shikamaru Nara",
    image: "assets/characters/images%20%2814%29.jpeg"
},

Neji: {
    name: "Neji Hyuga",
    image: "assets/characters/images%20%2815%29.jpeg"
},

Gaara: {
    name: "Gaara",
    image: "assets/characters/images%20%2816%29.jpeg"
},

Kisame: {
    name: "Kisame Hoshigaki",
    image: "assets/characters/images%20%2817%29.jpeg"
},

Sakura: {
    name: "Sakura Haruno",
    image: "assets/characters/images%20%2818%29.jpeg"
},

Nagato: {
    name: "Nagato / Pain",
    image: "assets/characters/images%20%2819%29.jpeg"
},

Obito: {
    name: "Obito Uchiha",
    image: "assets/characters/images%20%2820%29.jpeg"
}

};

// ==========================================
// CHARACTER OPTIONS FOR EACH CATEGORY
// ==========================================

const categoryPools = [

["Naruto", "Sasuke", "Itachi", "Minato", "Kakashi"],

["Guy", "Lee", "Madara", "Hashirama", "Naruto"],

["Shikamaru", "Itachi", "Tobirama", "Minato", "Kakashi"],

["Sasuke", "Itachi", "Madara", "Hashirama", "Neji"],

["Naruto", "Hashirama", "Madara", "Nagato", "Kisame"],

["Jiraiya", "Kakashi", "Guy", "Orochimaru", "Hiruzen"],

["Guy", "Lee", "Neji", "Naruto", "Sasuke"],

["Naruto", "Sasuke", "Minato", "Tobirama", "Kakashi"],

["Hashirama", "Sasuke", "Madara", "Gaara", "Naruto"],

["Minato", "Naruto", "Sasuke", "Tobirama", "Guy"],

["Guy", "Hashirama", "Madara", "Naruto", "Sakura"],

["Itachi", "Shikamaru", "Minato", "Kakashi", "Tobirama"],

["Itachi", "Sasuke", "Madara", "Obito", "Kakashi"],

["Naruto", "Sasuke", "Kakashi", "Hashirama", "Gaara"],

["Naruto", "Gaara", "Obito", "Madara", "Nagato"],

["Sakura", "Naruto", "Hashirama", "Orochimaru", "Kakashi"]

];

// ==========================================
// GAME STATE
// ==========================================

let playerName = "";

let roomCode = "";

let isHost = false;

let currentCategory = 0;

let selectedCharacter = null;

let players = [];

let gameStarted = false;

// ==========================================
// HTML ELEMENTS
// ==========================================

const lobbySection =
document.getElementById(
"lobbySection"
);

const roomSection =
document.getElementById(
"roomSection"
);

const categoryCard =
document.getElementById(
"categoryCard"
);

const waitingSection =
document.getElementById(
"waitingSection"
);

const resultSection =
document.getElementById(
"resultSection"
);

const finalSection =
document.getElementById(
"finalSection"
);

const playerNameInput =
document.getElementById(
"playerName"
);

const roomCodeInput =
document.getElementById(
"roomCodeInput"
);

const connectionStatus =
document.getElementById(
"connectionStatus"
);

const roomCodeDisplay =
document.getElementById(
"roomCode"
);

const playersList =
document.getElementById(
"playersList"
);

const waitingText =
document.getElementById(
"waitingText"
);

const characterInputs =
document.getElementById(
"characterInputs"
);

const categoryNumber =
document.getElementById(
"categoryNumber"
);

const categoryName =
document.getElementById(
"categoryName"
);

const selectionProgress =
document.getElementById(
"selectionProgress"
);

const resultCategory =
document.getElementById(
"resultCategory"
);

const resultList =
document.getElementById(
"resultList"
);

const winnerBox =
document.getElementById(
"winnerBox"
);

const nextCategory =
document.getElementById(
"nextCategory"
);

const finalList =
document.getElementById(
"finalList"
);

// ==========================================
// CONNECTION
// ==========================================

socket.on("connect", () => {

connectionStatus.textContent =
    "🟢 Server connected";

});

socket.on("disconnect", () => {

connectionStatus.textContent =
    "🔴 Server disconnected";

});

socket.on("connect_error", () => {

connectionStatus.textContent =
    "🔴 Server connection failed";

});

// ==========================================
// CREATE ROOM
// ==========================================

document
.getElementById("createRoom")
.onclick = () => {

    playerName =
        playerNameInput.value.trim();


    if (!playerName) {

        alert(
            "Enter your name first!"
        );

        return;
    }


    socket.emit(
        "createRoom",
        {
            playerName:
                playerName
        }
    );

};

// ==========================================
// ROOM CREATED
// ==========================================

socket.on(
"roomCreated",
data => {

    roomCode =
        data.roomCode;

    players =
        data.players;

    isHost = true;

    showRoom();

}

);

// ==========================================
// JOIN ROOM
// ==========================================

document
.getElementById("joinRoom")
.onclick = () => {

    playerName =
        playerNameInput.value.trim();

    const code =
        roomCodeInput.value
            .trim()
            .toUpperCase();


    if (!playerName) {

        alert(
            "Enter your name first!"
        );

        return;
    }


    if (code.length !== 6) {

        alert(
            "Enter the 6-character room code!"
        );

        return;
    }


    socket.emit(
        "joinRoom",
        {

            roomCode:
                code,

            playerName:
                playerName

        }
    );

};

// ==========================================
// ROOM JOINED
// ==========================================

socket.on(
"roomJoined",
data => {

    roomCode =
        data.roomCode;

    players =
        data.players;

    isHost = false;

    showRoom();

}

);

// ==========================================
// ROOM ERROR
// ==========================================

socket.on(
"roomError",
message => {

    alert(message);

}

);

// ==========================================
// PLAYERS UPDATED
// ==========================================

socket.on(
"playersUpdated",
data => {

    players =
        data.players;

    updatePlayers();

}

);

// ==========================================
// SHOW ROOM
// ==========================================

function showRoom() {

lobbySection
    .classList
    .add("hidden");

roomSection
    .classList
    .remove("hidden");

roomCodeDisplay.textContent =
    roomCode;

updatePlayers();

}

// ==========================================
// UPDATE PLAYERS
// ==========================================

function updatePlayers() {

playersList.innerHTML = "";


players.forEach(
    (player, index) => {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "player-item";


        item.textContent =
            `${index + 1}. ${player.name}` +
            (
                index === 0
                    ? " 👑 HOST"
                    : ""
            );


        playersList.appendChild(
            item
        );

    }
);


waitingText.textContent =
    `${players.length}/6 players`;


const startButton =
    document.getElementById(
        "startMultiplayer"
    );


if (isHost) {

    startButton.style.display =
        "block";

} else {

    startButton.style.display =
        "none";

}

}

// ==========================================
// START GAME - HOST ONLY
// ==========================================

document
.getElementById("startMultiplayer")
.onclick = () => {

    if (!isHost) {

        alert(
            "Only the host can start the game."
        );

        return;
    }


    if (players.length < 2) {

        alert(
            "At least 2 players are required."
        );

        return;
    }


    socket.emit(
        "startGame",
        {
            roomCode:
                roomCode
        }
    );

};

// ==========================================
// GAME STARTED
// IMPORTANT:
// SERVER SENDS THIS TO EVERY PLAYER
// ==========================================

socket.on(
"gameStarted",
data => {

    gameStarted = true;

    currentCategory =
        data.category || 0;

    roomSection
        .classList
        .add("hidden");

    waitingSection
        .classList
        .add("hidden");

    resultSection
        .classList
        .add("hidden");

    categoryCard
        .classList
        .remove("hidden");

    loadCategory();

}

);

// ==========================================
// LOAD CATEGORY
// ==========================================

function loadCategory() {

selectedCharacter = null;


categoryNumber.textContent =
    currentCategory + 1;


categoryName.textContent =
    categories[
        currentCategory
    ];


createCharacterCards();

}

// ==========================================
// CREATE CHARACTER CARDS
// ==========================================

function createCharacterCards() {

characterInputs.innerHTML = "";


const grid =
    document.createElement(
        "div"
    );

grid.className =
    "character-grid";


categoryPools[
    currentCategory
].forEach(
    key => {

        const character =
            characters[key];


        if (!character) {
            return;
        }


        const card =
            document.createElement(
                "div"
            );

        card.className =
            "character-card";


        const image =
            document.createElement(
                "img"
            );

        image.src =
            character.image;

        image.alt =
            character.name;


        const name =
            document.createElement(
                "div"
            );

        name.className =
            "character-name";

        name.textContent =
            character.name;


        const button =
            document.createElement(
                "button"
            );

        button.className =
            "select-character";

        button.textContent =
            "SELECT";


        button.onclick = () => {

            selectCharacter(
                key,
                card,
                button
            );

        };


        card.appendChild(image);

        card.appendChild(name);

        card.appendChild(button);

        grid.appendChild(card);

    }
);


characterInputs.appendChild(
    grid
);

}

// ==========================================
// SELECT EXACTLY ONE
// ==========================================

function selectCharacter(
key,
card,
button
) {

document
    .querySelectorAll(
        ".character-card"
    )
    .forEach(
        otherCard => {

            otherCard
                .classList
                .remove("selected");


            const otherButton =
                otherCard.querySelector(
                    ".select-character"
                );


            if (otherButton) {

                otherButton.textContent =
                    "SELECT";

            }

        }
    );


selectedCharacter =
    key;


card
    .classList
    .add("selected");


button.textContent =
    "✓ SELECTED";

}

// ==========================================
// SUBMIT ONE CHARACTER
// ==========================================

document
.getElementById("submitCharacter")
.onclick = () => {

    if (!selectedCharacter) {

        alert(
            "Select exactly ONE character!"
        );

        return;
    }


    categoryCard
        .classList
        .add("hidden");


    waitingSection
        .classList
        .remove("hidden");


    selectionProgress.textContent =
        "Waiting for everyone to select...";


    socket.emit(
        "submitCharacter",
        {

            roomCode:
                roomCode,

            category:
                currentCategory,

            character:
                selectedCharacter

        }
    );

};

// ==========================================
// SELECTION PROGRESS
// ==========================================

socket.on(
"selectionProgress",
data => {

    selectionProgress.textContent =
        `${data.submittedPlayers}/${data.totalPlayers} players selected`;

}

);

// ==========================================
// CATEGORY RESULT
// ==========================================

socket.on(
"categoryResults",
data => {

    waitingSection
        .classList
        .add("hidden");


    resultSection
        .classList
        .remove("hidden");


    resultCategory.textContent =
        data.category;


    showWinner(
        data.winner,
        data.votes
    );


    showPlayerSelections(
        data.selections
    );


    if (
        data.lastCategory
    ) {

        nextCategory.textContent =
            "👑 FINAL RESULTS";

    } else {

        nextCategory.textContent =
            "NEXT CATEGORY ➡️";

    }

}

);

// ==========================================
// SHOW WINNER
// ==========================================

function showWinner(
winner,
votes
) {

if (!winner) {

    winnerBox.innerHTML =
        `
        <div class="winner-title">
            No winner
        </div>
        `;

    return;
}


const character =
    characters[winner];


winnerBox.innerHTML =
    `
    <img
        src="${character.image}"
        style="
            width:100px;
            height:100px;
            object-fit:cover;
            border-radius:15px;
            margin-bottom:10px;
        "
    >

    <div class="winner-title">
        🏆 ${character.name}
    </div>

    <div class="winner-votes">
        ${votes[winner] || 0} vote(s)
    </div>
    `;

}

// ==========================================
// SHOW PLAYER SELECTIONS
// ==========================================

function showPlayerSelections(
selections
) {

resultList.innerHTML = "";


selections.forEach(
    (selection, index) => {

        const character =
            characters[
                selection.character
            ];


        const row =
            document.createElement(
                "div"
            );

        row.className =
            "result-player";


        const rank =
            document.createElement(
                "div"
            );

        rank.className =
            "result-rank";

        rank.textContent =
            `#${index + 1}`;


        const image =
            document.createElement(
                "img"
            );

        image.src =
            character.image;


        const info =
            document.createElement(
                "div"
            );

        info.className =
            "result-player-info";


        const player =
            document.createElement(
                "div"
            );

        player.className =
            "result-player-name";

        player.textContent =
            selection.player;


        const characterName =
            document.createElement(
                "div"
            );

        characterName.className =
            "result-character-name";

        characterName.textContent =
            character.name;


        info.appendChild(
            player
        );

        info.appendChild(
            characterName
        );


        row.appendChild(
            rank
        );

        row.appendChild(
            image
        );

        row.appendChild(
            info
        );


        resultList.appendChild(
            row
        );

    }
);

}

// ==========================================
// NEXT CATEGORY
// ==========================================

nextCategory.onclick = () => {

socket.emit(
    "nextCategory",
    {
        roomCode:
            roomCode
    }
);

};

// ==========================================
// NEXT CATEGORY RECEIVED
// ALL PLAYERS MOVE TOGETHER
// ==========================================

socket.on(
"nextCategory",
data => {

    currentCategory =
        data.category;


    if (
        currentCategory >=
        categories.length
    ) {

        showFinalResults();

        return;
    }


    resultSection
        .classList
        .add("hidden");


    categoryCard
        .classList
        .remove("hidden");


    loadCategory();

}

);

// ==========================================
// FINAL RESULTS
// ==========================================

socket.on(
"finalResults",
data => {

    resultSection
        .classList
        .add("hidden");


    categoryCard
        .classList
        .add("hidden");


    finalSection
        .classList
        .remove("hidden");


    finalList.innerHTML = "";


    data.results.forEach(
        (item, index) => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "final-item";


            const number =
                document.createElement(
                    "div"
                );

            number.className =
                "final-number";

            number.textContent =
                `#${index + 1}`;


            const image =
                document.createElement(
                    "img"
                );

            image.className =
                "final-image";

            image.src =
                characters[
                    item.character
                ].image;


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "final-info";


            const name =
                document.createElement(
                    "div"
                );

            name.className =
                "final-name";

            name.textContent =
                characters[
                    item.character
                ].name;


            const score =
                document.createElement(
                    "div"
                );

            score.className =
                "final-score";

            score.textContent =
                `${item.score} total vote(s)`;


            info.appendChild(
                name
            );

            info.appendChild(
                score
            );


            row.appendChild(
                number
            );

            row.appendChild(
                image
            );

            row.appendChild(
                info
            );


            finalList.appendChild(
                row
            );

        }
    );

}

);

// ==========================================
// FALLBACK FINAL
// ==========================================

function showFinalResults() {

finalSection
    .classList
    .remove("hidden");

resultSection
    .classList
    .add("hidden");

}

// ==========================================
// PLAY AGAIN
// ==========================================

document
.getElementById("playAgain")
.onclick = () => {

    location.reload();

};
