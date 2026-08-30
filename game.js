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
// CHARACTER POOLS
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
// STATE
// ==========================================

let playerName = "";
let roomCode = "";
let isHost = false;
let currentCategory = 0;
let selectedCharacters = [];
let currentRanking = [];
let players = [];
let gameStarted = false;

// ==========================================
// ELEMENTS
// ==========================================

const lobbySection =
document.getElementById("lobbySection");

const roomSection =
document.getElementById("roomSection");

const categoryCard =
document.getElementById("categoryCard");

const rankingSection =
document.getElementById("rankingSection");

const waitingSection =
document.getElementById("waitingSection");

const resultSection =
document.getElementById("resultSection");

const finalSection =
document.getElementById("finalSection");

const playerNameInput =
document.getElementById("playerName");

const roomCodeInput =
document.getElementById("roomCodeInput");

const connectionStatus =
document.getElementById("connectionStatus");

const roomCodeDisplay =
document.getElementById("roomCode");

const playersList =
document.getElementById("playersList");

const waitingText =
document.getElementById("waitingText");

const characterInputs =
document.getElementById("characterInputs");

const categoryNumber =
document.getElementById("categoryNumber");

const categoryName =
document.getElementById("categoryName");

const rankingList =
document.getElementById("rankingList");

const rankingProgress =
document.getElementById("rankingProgress");

const resultCategory =
document.getElementById("resultCategory");

const resultList =
document.getElementById("resultList");

const nextCategory =
document.getElementById("nextCategory");

const finalList =
document.getElementById("finalList");

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

document.getElementById("createRoom").onclick = () => {

playerName =
    playerNameInput.value.trim();


if (!playerName) {

    alert("Enter your name first!");

    return;
}


socket.emit("createRoom", {
    playerName: playerName
});

};

// ==========================================
// ROOM CREATED
// ==========================================

socket.on("roomCreated", data => {

roomCode = data.roomCode;

players = data.players;

isHost = true;

showRoom();

});

// ==========================================
// JOIN ROOM
// ==========================================

document.getElementById("joinRoom").onclick = () => {

playerName =
    playerNameInput.value.trim();

const code =
    roomCodeInput.value.trim().toUpperCase();


if (!playerName) {

    alert("Enter your name first!");

    return;
}


if (code.length !== 6) {

    alert("Enter the 6-character room code!");

    return;
}


socket.emit("joinRoom", {

    roomCode: code,

    playerName: playerName

});

};

// ==========================================
// ROOM JOINED
// ==========================================

socket.on("roomJoined", data => {

roomCode = data.roomCode;

players = data.players;

isHost = false;

showRoom();

});

// ==========================================
// ROOM ERROR
// ==========================================

socket.on("roomError", message => {

alert(message);

});

// ==========================================
// PLAYERS UPDATED
// ==========================================

socket.on("playersUpdated", data => {

players = data.players;

updatePlayers();

});

// ==========================================
// SHOW ROOM
// ==========================================

function showRoom() {

lobbySection.classList.add("hidden");

roomSection.classList.remove("hidden");

roomCodeDisplay.textContent =
    roomCode;

updatePlayers();

}

// ==========================================
// UPDATE PLAYERS
// ==========================================

function updatePlayers() {

playersList.innerHTML = "";


players.forEach((player, index) => {

    const item =
        document.createElement("div");

    item.className =
        "player-item";

    item.textContent =
        `${index + 1}. ${player.name}` +
        (index === 0
            ? " 👑 HOST"
            : "");

    playersList.appendChild(item);

});


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
// HOST STARTS GAME
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


    socket.emit("startGame", {

        roomCode: roomCode

    });

};

// ==========================================
// IMPORTANT:
// EVERY PLAYER RECEIVES THIS
// ==========================================

socket.on("gameStarted", () => {

gameStarted = true;

currentCategory = 0;

roomSection.classList.add("hidden");

categoryCard.classList.remove("hidden");

loadCategory();

});

// ==========================================
// LOAD CATEGORY
// ==========================================

function loadCategory() {

categoryNumber.textContent =
    currentCategory + 1;

categoryName.textContent =
    categories[currentCategory];

selectedCharacters = [];

createCharacterCards();

}

// ==========================================
// CHARACTER CARDS
// ==========================================

function createCharacterCards() {

characterInputs.innerHTML = "";


const grid =
    document.createElement("div");

grid.className =
    "character-grid";


categoryPools[currentCategory]
    .forEach(key => {

        const character =
            characters[key];


        if (!character) return;


        const card =
            document.createElement("div");

        card.className =
            "character-card";


        const image =
            document.createElement("img");

        image.src =
            character.image;

        image.alt =
            character.name;


        const name =
            document.createElement("div");

        name.className =
            "character-name";

        name.textContent =
            character.name;


        const button =
            document.createElement("button");

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

    });


characterInputs.appendChild(grid);

}

// ==========================================
// SELECT CHARACTER
// ==========================================

function selectCharacter(
key,
card,
button
) {

if (
    selectedCharacters.includes(key)
) {

    selectedCharacters =
        selectedCharacters.filter(
            item => item !== key
        );

    card.classList.remove("selected");

    button.textContent =
        "SELECT";

} else {

    selectedCharacters.push(key);

    card.classList.add("selected");

    button.textContent =
        "✓ SELECTED";

}

}

// ==========================================
// START RANKING
// ==========================================

document.getElementById("startRanking").onclick = () => {

if (selectedCharacters.length < 2) {

    alert(
        "Select at least 2 characters!"
    );

    return;
}


categoryCard.classList.add("hidden");

rankingSection.classList.remove("hidden");

createRanking();

};

// ==========================================
// CREATE RANKING
// ==========================================

function createRanking() {

rankingList.innerHTML = "";


selectedCharacters.forEach(
    (key, index) => {

        const character =
            characters[key];


        const item =
            document.createElement("div");

        item.className =
            "rank-item";

        item.draggable = true;

        item.dataset.key = key;


        const number =
            document.createElement("div");

        number.className =
            "rank-number";

        number.textContent =
            index + 1;


        const image =
            document.createElement("img");

        image.src =
            character.image;

        image.className =
            "rank-image";


        const name =
            document.createElement("div");

        name.className =
            "rank-name";

        name.textContent =
            character.name;


        item.appendChild(number);

        item.appendChild(image);

        item.appendChild(name);

        rankingList.appendChild(item);


        item.addEventListener(
            "dragstart",
            () => {

                item.classList.add(
                    "dragging"
                );

            }
        );


        item.addEventListener(
            "dragend",
            () => {

                item.classList.remove(
                    "dragging"
                );

                updateNumbers();

            }
        );

    }
);

}

// ==========================================
// DRAG & DROP
// ==========================================

rankingList.addEventListener(
"dragover",
event => {

    event.preventDefault();

    const dragging =
        document.querySelector(
            ".dragging"
        );


    if (!dragging) return;


    const items =
        [
            ...rankingList.querySelectorAll(
                ".rank-item:not(.dragging)"
            )
        ];


    const next =
        items.find(item => {

            const rect =
                item.getBoundingClientRect();

            return (
                event.clientY <
                rect.top +
                rect.height / 2
            );

        });


    if (next) {

        rankingList.insertBefore(
            dragging,
            next
        );

    } else {

        rankingList.appendChild(
            dragging
        );

    }

}

);

// ==========================================
// UPDATE NUMBERS
// ==========================================

function updateNumbers() {

const items =
    rankingList.querySelectorAll(
        ".rank-item"
    );


items.forEach(
    (item, index) => {

        item.querySelector(
            ".rank-number"
        ).textContent =
            index + 1;

    }
);

}

// ==========================================
// CONFIRM RANKING
// ==========================================

document
.getElementById("confirmRanking")
.onclick = () => {

    const items =
        rankingList.querySelectorAll(
            ".rank-item"
        );


    currentRanking = [];


    items.forEach(
        (item, index) => {

            const key =
                item.dataset.key;

            currentRanking.push({

                character:
                    characters[key].name,

                image:
                    characters[key].image,

                rank:
                    index + 1

            });

        }
    );


    rankingSection.classList.add(
        "hidden"
    );

    waitingSection.classList.remove(
        "hidden"
    );


    socket.emit(
        "submitRanking",
        {

            roomCode:
                roomCode,

            category:
                categories[currentCategory],

            ranking:
                currentRanking

        }
    );

};

// ==========================================
// RANKING PROGRESS
// ==========================================

socket.on(
"rankingProgress",
data => {

    rankingProgress.textContent =
        `${data.submittedPlayers}/${data.totalPlayers} players finished`;

}

);

// ==========================================
// ROUND RESULTS
// ==========================================

socket.on(
"roundResults",
data => {

    waitingSection.classList.add(
        "hidden"
    );

    resultSection.classList.remove(
        "hidden"
    );

    resultCategory.textContent =
        data.category;

    resultList.innerHTML = "";


    data.results.forEach(
        playerResult => {

            const box =
                document.createElement("div");

            box.className =
                "result-player";


            const title =
                document.createElement("h3");

            title.textContent =
                "👤 " +
                playerResult.player;


            box.appendChild(title);


            playerResult.ranking.forEach(
                (item, index) => {

                    const row =
                        document.createElement("div");

                    row.className =
                        "result-character";


                    const image =
                        document.createElement("img");

                    image.src =
                        item.image;


                    const text =
                        document.createElement("span");

                    text.textContent =
                        `${index + 1}. ${item.character}`;


                    row.appendChild(image);

                    row.appendChild(text);

                    box.appendChild(row);

                }
            );


            resultList.appendChild(box);

        }
    );


    if (
        currentCategory ===
        categories.length - 1
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
// NEXT CATEGORY
// ==========================================

nextCategory.onclick = () => {

currentCategory++;


if (
    currentCategory >=
    categories.length
) {

    showFinalResults();

    return;
}


resultSection.classList.add(
    "hidden"
);

categoryCard.classList.remove(
    "hidden"
);

loadCategory();

};

// ==========================================
// FINAL RESULTS
// ==========================================

function showFinalResults() {

resultSection.classList.add(
    "hidden"
);

finalSection.classList.remove(
    "hidden"
);


finalList.innerHTML = `

    <div class="final-player">

        <h3>👑 GAME COMPLETE</h3>

        <p style="margin-top:10px;">
            All 16 categories have been completed.
        </p>

        <p style="margin-top:10px;">
            Players: ${players.length}
        </p>

    </div>

`;

}

// ==========================================
// PLAY AGAIN
// ==========================================

document
.getElementById("playAgain")
.onclick = () => {

    location.reload();

};
