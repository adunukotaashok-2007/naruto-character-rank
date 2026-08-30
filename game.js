const SERVER_URL =
"https://naruto-character-rank.onrender.com";

const socket =
io(SERVER_URL);

// ============================================
// CHARACTERS
// ============================================

const characters = {

Naruto: {
    name: "Naruto",
    image: "assets/characters/images%20%282%29.jpeg"
},

Sasuke: {
    name: "Sasuke",
    image: "assets/characters/images%20%283%29.jpeg"
},

Itachi: {
    name: "Itachi",
    image: "assets/characters/images%20%284%29.jpeg"
},

Madara: {
    name: "Madara",
    image: "assets/characters/images%20%285%29.jpeg"
},

Kakashi: {
    name: "Kakashi",
    image: "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg"
},

Minato: {
    name: "Minato",
    image: "assets/characters/images%20%286%29.jpeg"
},

Tobirama: {
    name: "Tobirama",
    image: "assets/characters/images%20%287%29.jpeg"
},

Hashirama: {
    name: "Hashirama",
    image: "assets/characters/images%20%288%29.jpeg"
},

Jiraiya: {
    name: "Jiraiya",
    image: "assets/characters/images%20%289%29.jpeg"
},

Hiruzen: {
    name: "Hiruzen",
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
    name: "Shikamaru",
    image: "assets/characters/images%20%2814%29.jpeg"
},

Neji: {
    name: "Neji",
    image: "assets/characters/images%20%2815%29.jpeg"
},

Gaara: {
    name: "Gaara",
    image: "assets/characters/images%20%2816%29.jpeg"
},

Kisame: {
    name: "Kisame",
    image: "assets/characters/images%20%2817%29.jpeg"
},

Sakura: {
    name: "Sakura",
    image: "assets/characters/images%20%2818%29.jpeg"
},

Nagato: {
    name: "Nagato / Pain",
    image: "assets/characters/images%20%2819%29.jpeg"
},

Obito: {
    name: "Obito",
    image: "assets/characters/images%20%2820%29.jpeg"
}

};

// ============================================
// CATEGORIES
// ============================================

const categories = [

{
    name: "🧬 Talent",
    type: "character",
    options: [
        "Naruto",
        "Sasuke",
        "Itachi",
        "Minato",
        "Kakashi"
    ]
},

{
    name: "💪 Body",
    type: "character",
    options: [
        "Guy",
        "Lee",
        "Madara",
        "Hashirama",
        "Naruto"
    ]
},

{
    name: "🧠 Mind / IQ",
    type: "character",
    options: [
        "Shikamaru",
        "Itachi",
        "Tobirama",
        "Minato",
        "Kakashi"
    ]
},

{
    name: "🩸 Clan",
    type: "clan",
    options: [
        "Uzumaki",
        "Senju",
        "Uchiha",
        "Hyuga",
        "Nara"
    ]
},

{
    name: "🔵 Chakra",
    type: "character",
    options: [
        "Naruto",
        "Hashirama",
        "Madara",
        "Nagato",
        "Kisame"
    ]
},

{
    name: "👨‍🏫 Sensei",
    type: "character",
    options: [
        "Jiraiya",
        "Kakashi",
        "Guy",
        "Orochimaru",
        "Hiruzen"
    ]
},

{
    name: "🥋 Taijutsu",
    type: "character",
    options: [
        "Guy",
        "Lee",
        "Neji",
        "Naruto",
        "Sasuke"
    ]
},

{
    name: "🌀 Ninjutsu",
    type: "character",
    options: [
        "Naruto",
        "Sasuke",
        "Minato",
        "Tobirama",
        "Kakashi"
    ]
},

{
    name: "🔥 Kekkei Genkai",
    type: "character",
    options: [
        "Hashirama",
        "Sasuke",
        "Madara",
        "Gaara",
        "Naruto"
    ]
},

{
    name: "⚡ Speed",
    type: "character",
    options: [
        "Minato",
        "Naruto",
        "Tobirama",
        "Sasuke",
        "Guy"
    ]
},

{
    name: "💥 Strength",
    type: "character",
    options: [
        "Guy",
        "Hashirama",
        "Madara",
        "Naruto",
        "Sakura"
    ]
},

{
    name: "🎯 Battle IQ",
    type: "character",
    options: [
        "Itachi",
        "Shikamaru",
        "Minato",
        "Kakashi",
        "Tobirama"
    ]
},

{
    name: "👻 Genjutsu",
    type: "character",
    options: [
        "Itachi",
        "Sasuke",
        "Madara",
        "Obito",
        "Kakashi"
    ]
},

{
    name: "🌪️ Chakra Nature",
    type: "character",
    options: [
        "Naruto",
        "Sasuke",
        "Kakashi",
        "Hashirama",
        "Gaara"
    ]
},

{
    name: "🐉 Tailed Beast",
    type: "character",
    options: [
        "Naruto",
        "Obito",
        "Gaara",
        "Madara",
        "Nagato"
    ]
},

{
    name: "❤️ Healing",
    type: "character",
    options: [
        "Sakura",
        "Naruto",
        "Hashirama",
        "Orochimaru",
        "Kakashi"
    ]
}

];

// ============================================
// STATE
// ============================================

let gameType = "";

let playerName = "";

let roomCode = "";

let host = false;

let categoryIndex = 0;

let selectedChoice = null;

// ============================================
// SCREENS
// ============================================

function screen(id) {

document
    .querySelectorAll(".screen")
    .forEach(
        element =>
            element.classList
                .add("hidden")
    );

document
    .getElementById(id)
    .classList
    .remove("hidden");

}

// ============================================
// HOME
// ============================================

document
.getElementById("rankButton")
.onclick = () => {

    gameType = "rank";

    document
        .getElementById("gameTitle")
        .textContent =
        "🏆 CHARACTER RANK";

    screen("lobby");

};

document
.getElementById("auctionButton")
.onclick = () => {

    gameType = "auction";

    document
        .getElementById("gameTitle")
        .textContent =
        "🔨 NARUTO AUCTION";

    screen("lobby");

};

document
.getElementById("homeButton")
.onclick = () => {

    screen("home");

};

// ============================================
// SOCKET
// ============================================

socket.on(
"connect",
() => {

    document
        .getElementById(
            "connectionStatus"
        )
        .textContent =
        "🟢 Server connected";

}

);

socket.on(
"connect_error",
() => {

    document
        .getElementById(
            "connectionStatus"
        )
        .textContent =
        "🔴 Server connection failed";

}

);

// ============================================
// CREATE ROOM
// ============================================

document
.getElementById("createButton")
.onclick = () => {

    playerName =
        document
            .getElementById(
                "nameInput"
            )
            .value
            .trim();

    if (!playerName) {

        alert(
            "Enter your name first."
        );

        return;

    }

    socket.emit(
        "createRoom",
        {
            playerName,
            game: gameType
        }
    );

};

// ============================================
// JOIN ROOM
// ============================================

document
.getElementById("joinButton")
.onclick = () => {

    playerName =
        document
            .getElementById(
                "nameInput"
            )
            .value
            .trim();

    roomCode =
        document
            .getElementById(
                "codeInput"
            )
            .value
            .trim()
            .toUpperCase();

    if (!playerName) {

        alert(
            "Enter your name first."
        );

        return;

    }

    if (roomCode.length !== 6) {

        alert(
            "Enter a 6-character room code."
        );

        return;

    }

    socket.emit(
        "joinRoom",
        {
            playerName,
            roomCode,
            game: gameType
        }
    );

};

// ============================================
// ROOM CREATED
// ============================================

socket.on(
"roomCreated",
data => {

    roomCode =
        data.roomCode;

    host = true;

    updatePlayers(
        data.players
    );

    screen("room");

}

);

// ============================================
// ROOM JOINED
// ============================================

socket.on(
"roomJoined",
data => {

    roomCode =
        data.roomCode;

    host = false;

    updatePlayers(
        data.players
    );

    screen("room");

}

);

// ============================================
// ROOM ERROR
// ============================================

socket.on(
"roomError",
message => {

    alert(message);

}

);

// ============================================
// PLAYERS
// ============================================

socket.on(
"playersUpdated",
data => {

    updatePlayers(
        data.players
    );

}

);

function updatePlayers(players) {

document
    .getElementById(
        "roomCode"
    )
    .textContent =
    roomCode;


const list =
    document.getElementById(
        "playerList"
    );

list.innerHTML = "";


players.forEach(
    (player, index) => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "player";

        div.innerHTML = `

            <span>
                ${index + 1}.
                ${player.name}
            </span>

            <b>
                ${
                    index === 0
                        ? "👑 HOST"
                        : "👤"
                }
            </b>

        `;

        list.appendChild(div);

    }
);


document
    .getElementById(
        "playerCount"
    )
    .textContent =
    `${players.length} / 6 players`;

}

// ============================================
// START
// ============================================

document
.getElementById("startButton")
.onclick = () => {

    socket.emit(
        "startGame",
        {
            roomCode
        }
    );

};

socket.on(
"gameStarted",
data => {

    gameType =
        data.game ||
        gameType;

    if (
        gameType === "rank"
    ) {

        categoryIndex = 0;

        screen("rankGame");

        loadCategory();

    }

    else {

        screen("auction");

    }

}

);

// ============================================
// LOAD CATEGORY
// ============================================

function loadCategory() {

selectedChoice = null;


const category =
    categories[
        categoryIndex
    ];


document
    .getElementById(
        "categoryName"
    )
    .textContent =
    category.name;


document
    .getElementById(
        "categoryNumber"
    )
    .textContent =
    `${categoryIndex + 1} / ${categories.length}`;


const grid =
    document
        .getElementById(
            "characterGrid"
        );


grid.innerHTML = "";


category.options.forEach(
    option => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "character";


        if (
            category.type ===
            "clan"
        ) {

            div.classList.add(
                "clan"
            );

            div.textContent =
                option;

        }

        else {

            div.innerHTML = `

                <img
                    src="${
                        characters[
                            option
                        ].image
                    }"
                    alt="${
                        characters[
                            option
                        ].name
                    }"
                >

                <div
                    class="characterName"
                >
                    ${
                        characters[
                            option
                        ].name
                    }
                </div>

            `;

        }


        div.onclick = () => {

            document
                .querySelectorAll(
                    ".character"
                )
                .forEach(
                    element =>
                        element.classList
                            .remove(
                                "selected"
                            )
                );


            div.classList.add(
                "selected"
            );


            selectedChoice =
                option;

        };


        grid.appendChild(div);

    }
);

}

// ============================================
// CONFIRM
// ============================================

document
.getElementById(
"confirmButton"
)
.onclick = () => {

    if (!selectedChoice) {

        alert(
            "Select ONE choice."
        );

        return;

    }


    screen("waiting");


    socket.emit(
        "submitRank",
        {
            roomCode,
            category:
                categoryIndex,
            option:
                selectedChoice
        }
    );

};

// ============================================
// WAITING
// ============================================

socket.on(
"rankProgress",
data => {

    document
        .getElementById(
            "waitingText"
        )
        .textContent =
        `${data.submitted} / ${data.total} players answered`;

}

);

// ============================================
// RESULT
// ============================================

socket.on(
"rankResult",
data => {

    screen("result");


    document
        .getElementById(
            "resultTitle"
        )
        .textContent =
        `🏆 ${data.category}`;


    const list =
        document
            .getElementById(
                "resultList"
            );


    list.innerHTML = "";


    data.players.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "resultRow";


            let image = "";


            if (
                characters[
                    player.option
                ]
            ) {

                image = `

                    <img
                        src="${
                            characters[
                                player.option
                            ].image
                        }"
                    >

                `;

            }


            div.innerHTML = `

                <div class="rank">
                    #${index + 1}
                </div>

                ${image}

                <div
                    class="resultInfo"
                >

                    <b>
                        ${player.player}
                    </b>

                    <div
                        class="resultChoice"
                    >
                        Selected:
                        ${player.option}
                    </div>

                </div>

            `;


            list.appendChild(div);

        }
    );

}

);

// ============================================
// NEXT CATEGORY
// ============================================

document
.getElementById(
"nextButton"
)
.onclick = () => {

    socket.emit(
        "nextRankCategory",
        {
            roomCode
        }
    );

};

socket.on(
"nextRankCategory",
data => {

    categoryIndex =
        data.category;

    screen("rankGame");

    loadCategory();

}

);

// ============================================
// AUCTION
// ============================================

socket.on(
"auctionUpdate",
data => {

    screen("auction");


    if (
        characters[
            data.character
        ]
    ) {

        document
            .getElementById(
                "auctionName"
            )
            .textContent =
            characters[
                data.character
            ].name;


        document
            .getElementById(
                "auctionImage"
            )
            .src =
            characters[
                data.character
            ].image;

    }


    document
        .getElementById(
            "auctionTimer"
        )
        .textContent =
        data.time;


    document
        .getElementById(
            "bidValue"
        )
        .textContent =
        data.currentBid;


    document
        .getElementById(
            "bidder"
        )
        .textContent =
        data.highestBidder
            ? `🔥 Highest bidder: ${data.highestBidder}`
            : "No bids yet";


    document
        .getElementById(
            "balance"
        )
        .textContent =
        data.myBalance;


    document
        .getElementById(
            "teamSize"
        )
        .textContent =
        `${data.myTeamCount}/5`;


    const list =
        document
            .getElementById(
                "auctionPlayers"
            );


    list.innerHTML = "";


    data.players.forEach(
        player => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "auctionPlayer";


            div.innerHTML = `

                <span>
                    ${player.name}
                </span>

                <b>
                    💰 ${player.balance}
                    |
                    ${player.teamCount}/5
                </b>

            `;


            list.appendChild(div);

        }
    );

}

);

// ============================================
// BID
// ============================================

function makeBid(amount) {

socket.emit(
    "bid",
    {
        roomCode,
        amount
    }
);

}

document
.getElementById("bid100")
.onclick =
() => makeBid(100);

document
.getElementById("bid250")
.onclick =
() => makeBid(250);

document
.getElementById("bid500")
.onclick =
() => makeBid(500);

// ============================================
// AUCTION RESULT
// ============================================

socket.on(
"auctionResult",
data => {

    screen("auctionResult");


    const container =
        document
            .getElementById(
                "auctionWinner"
            );


    const character =
        characters[
            data.character
        ];


    if (
        data.winner &&
        character
    ) {

        container.innerHTML = `

            <div class="winnerBox">

                <img
                    src="${character.image}"
                >

                <h3>
                    🏆 ${data.winner}
                </h3>

                <p>
                    Won ${character.name}
                </p>

                <p>
                    💰 Final Bid:
                    ${data.bid}
                </p>

            </div>

        `;

    }

    else {

        container.innerHTML = `

            <div class="winnerBox">

                <h3>
                    No one won this auction.
                </h3>

            </div>

        `;

    }

}

);

// ============================================
// NEXT AUCTION
// ============================================

document
.getElementById(
"nextAuctionButton"
)
.onclick = () => {

    socket.emit(
        "nextAuction",
        {
            roomCode
        }
    );

};

// ============================================
// FINAL
// ============================================

socket.on(
"finalResults",
data => {

    screen("final");


    const list =
        document
            .getElementById(
                "finalList"
            );


    list.innerHTML = "";


    data.players.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "finalPlayer";


            const team =
                player.team &&
                player.team.length
                    ? player.team.join(
                        " • "
                      )
                    : "No characters";


            div.innerHTML = `

                <h3>
                    #${index + 1}
                    ${player.name}
                </h3>

                <p>
                    💰 Balance:
                    ${player.balance}
                </p>

                <p>
                    👥 Team:
                    ${team}
                </p>

            `;


            list.appendChild(div);

        }
    );

}

);

// ============================================
// LEAVE
// ============================================

document
.getElementById(
"leaveButton"
)
.onclick = () => {

    location.reload();

};
