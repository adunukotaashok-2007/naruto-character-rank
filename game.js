const SERVER_URL =
"https://naruto-character-rank.onrender.com";

const socket =
io(SERVER_URL);

// ============================================
// CHARACTERS
// ============================================

const characters = {

```
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
```

};

// ============================================
// AUCTION CHARACTERS
// ============================================

const auctionCharacters = [
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
"Guy",
"Lee",
"Shikamaru",
"Neji",
"Gaara",
"Kisame",
"Sakura",
"Nagato",
"Obito"
];

// ============================================
// STATE
// ============================================

let playerName = "";

let roomCode = "";

let selectedGame = "";

let isHost = false;

let selectedOption = null;

let currentCategory = 0;

let myBalance = 1000;

let myTeam = [];

// ============================================
// ELEMENTS
// ============================================

const home =
document.getElementById("home");

const lobby =
document.getElementById("lobby");

const room =
document.getElementById("room");

const rankGame =
document.getElementById("rankGame");

const waiting =
document.getElementById("waiting");

const categoryResult =
document.getElementById(
"categoryResult"
);

const auction =
document.getElementById("auction");

const auctionResult =
document.getElementById(
"auctionResult"
);

const final =
document.getElementById("final");

// ============================================
// NAVIGATION
// ============================================

document.getElementById(
"rankGameBtn"
).onclick = () => {

```
selectedGame = "rank";

document.getElementById(
    "lobbyTitle"
).textContent =
    "🏆 CHARACTER RANK";

show(lobby);
```

};

document.getElementById(
"auctionGameBtn"
).onclick = () => {

```
selectedGame = "auction";

document.getElementById(
    "lobbyTitle"
).textContent =
    "🔨 NARUTO AUCTION";

show(lobby);
```

};

document.getElementById(
"backHome"
).onclick = () => {

```
show(home);
```

};

document.getElementById(
"leaveRoom"
).onclick = () => {

```
location.reload();
```

};

function show(element) {

```
[
    home,
    lobby,
    room,
    rankGame,
    waiting,
    categoryResult,
    auction,
    auctionResult,
    final
].forEach(
    section => {

        section.classList.add(
            "hidden"
        );

    }
);

element.classList.remove(
    "hidden"
);
```

}

// ============================================
// CONNECTION
// ============================================

socket.on("connect", () => {

```
document.getElementById(
    "status"
).textContent =
    "🟢 Server connected";
```

});

socket.on("disconnect", () => {

```
document.getElementById(
    "status"
).textContent =
    "🔴 Server disconnected";
```

});

// ============================================
// CREATE ROOM
// ============================================

document.getElementById(
"createRoom"
).onclick = () => {

```
playerName =
    document.getElementById(
        "playerName"
    ).value.trim();


if (!playerName) {

    alert(
        "Enter your name!"
    );

    return;
}


socket.emit(
    "createRoom",
    {
        playerName,
        game: selectedGame
    }
);
```

};

// ============================================
// JOIN ROOM
// ============================================

document.getElementById(
"joinRoom"
).onclick = () => {

```
playerName =
    document.getElementById(
        "playerName"
    ).value.trim();


roomCode =
    document.getElementById(
        "roomInput"
    ).value
    .trim()
    .toUpperCase();


if (!playerName) {

    alert(
        "Enter your name!"
    );

    return;
}


if (roomCode.length !== 6) {

    alert(
        "Enter a 6-character room code!"
    );

    return;
}


socket.emit(
    "joinRoom",
    {
        roomCode,
        playerName,
        game: selectedGame
    }
);
```

};

// ============================================
// ROOM CREATED
// ============================================

socket.on(
"roomCreated",
data => {

```
    roomCode =
        data.roomCode;

    isHost = true;

    updateRoom(
        data.players
    );

    show(room);

}
```

);

// ============================================
// ROOM JOINED
// ============================================

socket.on(
"roomJoined",
data => {

```
    roomCode =
        data.roomCode;

    isHost = false;

    updateRoom(
        data.players
    );

    show(room);

}
```

);

// ============================================
// ROOM ERROR
// ============================================

socket.on(
"roomError",
message => {

```
    alert(message);

}
```

);

// ============================================
// PLAYERS UPDATED
// ============================================

socket.on(
"playersUpdated",
data => {

```
    updateRoom(
        data.players
    );

}
```

);

// ============================================
// UPDATE ROOM
// ============================================

function updateRoom(players) {

```
document.getElementById(
    "roomCode"
).textContent =
    roomCode;


const list =
    document.getElementById(
        "players"
    );


list.innerHTML = "";


players.forEach(
    (player, index) => {

        const row =
            document.createElement(
                "div"
            );

        row.className =
            "player-row";


        row.innerHTML =
            `
            <span>
                ${index + 1}. ${player.name}
            </span>

            <strong>
                ${
                    index === 0
                        ? "👑 HOST"
                        : "👤"
                }
            </strong>
            `;


        list.appendChild(row);

    }
);


document.getElementById(
    "playerCount"
).textContent =
    `${players.length}/6 players`;


document.getElementById(
    "startGame"
).style.display =
    isHost
        ? "block"
        : "none";
```

}

// ============================================
// START GAME
// ============================================

document.getElementById(
"startGame"
).onclick = () => {

```
socket.emit(
    "startGame",
    {
        roomCode
    }
);
```

};

// ============================================
// GAME STARTED
// ============================================

socket.on(
"gameStarted",
data => {

```
    if (
        selectedGame === "rank"
    ) {

        currentCategory =
            0;

        show(rankGame);

        loadRankCategory();

    } else {

        show(auction);

        updateAuction(
            data.auction
        );

    }

}
```

);

// ============================================
// RANKING CATEGORIES
// ============================================

const rankCategories = [

```
{
    name: "🧬 Talent",
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
    clans: [
        "Uzumaki",
        "Senju",
        "Uchiha",
        "Hyuga",
        "Nara"
    ]
},

{
    name: "🔵 Chakra",
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
    options: [
        "Sakura",
        "Naruto",
        "Hashirama",
        "Orochimaru",
        "Kakashi"
    ]
}
```

];

// ============================================
// LOAD RANK CATEGORY
// ============================================

function loadRankCategory() {

```
selectedOption = null;


const category =
    rankCategories[
        currentCategory
    ];


document.getElementById(
    "categoryNumber"
).textContent =
    `${currentCategory + 1} / 16`;


document.getElementById(
    "categoryTitle"
).textContent =
    category.name;


const container =
    document.getElementById(
        "rankOptions"
    );


container.innerHTML = "";


const choices =
    category.clans ||
    category.options;


choices.forEach(
    option => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            category.clans
                ? "option clan-option"
                : "option";


        if (
            characters[option]
        ) {

            div.innerHTML =
                `
                <img
                    src="${characters[option].image}"
                >

                <div class="option-name">
                    ${characters[option].name}
                </div>
                `;

        } else {

            div.textContent =
                option;

        }


        div.onclick = () => {

            document
                .querySelectorAll(
                    ".option"
                )
                .forEach(
                    item =>
                        item.classList
                            .remove(
                                "selected"
                            )
                );


            div.classList.add(
                "selected"
            );


            selectedOption =
                option;

        };


        container.appendChild(div);

    }
);
```

}

// ============================================
// SUBMIT RANK ANSWER
// ============================================

document.getElementById(
"submitRank"
).onclick = () => {

```
if (!selectedOption) {

    alert(
        "Select exactly ONE option!"
    );

    return;
}


show(waiting);


socket.emit(
    "submitRank",
    {
        roomCode,
        category:
            currentCategory,
        option:
            selectedOption
    }
);
```

};

// ============================================
// RANK PROGRESS
// ============================================

socket.on(
"rankProgress",
data => {

```
    document.getElementById(
        "waitingMessage"
    ).textContent =
        `${data.submitted}/${data.total} players answered`;

}
```

);

// ============================================
// CATEGORY RESULT
// ============================================

socket.on(
"rankResult",
data => {

```
    show(categoryResult);


    document.getElementById(
        "categoryResultTitle"
    ).textContent =
        data.category;


    const container =
        document.getElementById(
            "categoryRanking"
        );


    container.innerHTML = "";


    data.players.forEach(
        (player, index) => {

            const character =
                characters[
                    player.option
                ];


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "rank-result";


            let image = "";


            if (character) {

                image =
                    `
                    <img
                        class="rank-character-image"
                        src="${character.image}"
                    >
                    `;

            }


            row.innerHTML =
                `
                <div class="rank-number">
                    #${index + 1}
                </div>

                ${image}

                <div class="rank-info">

                    <div class="rank-player">
                        ${player.player}
                    </div>

                    <div class="rank-choice">
                        ${player.option}
                    </div>

                </div>
                `;


            container.appendChild(
                row
            );

        }
    );

}
```

);

// ============================================
// NEXT CATEGORY
// ============================================

document.getElementById(
"nextCategory"
).onclick = () => {

```
socket.emit(
    "nextRankCategory",
    {
        roomCode
    }
);
```

};

socket.on(
"nextRankCategory",
data => {

```
    currentCategory =
        data.category;


    if (
        currentCategory >= 16
    ) {

        showFinal();

        return;
    }


    show(rankGame);

    loadRankCategory();

}
```

);

// ============================================
// AUCTION UPDATE
// ============================================

socket.on(
"auctionUpdate",
data => {

```
    show(auction);

    updateAuction(
        data
    );

}
```

);

function updateAuction(data) {

```
document.getElementById(
    "auctionCharacter"
).textContent =
    characters[
        data.character
    ].name;


document.getElementById(
    "auctionImage"
).src =
    characters[
        data.character
    ].image;


document.getElementById(
    "currentBid"
).textContent =
    data.currentBid;


document.getElementById(
    "highestBidder"
).textContent =
    data.highestBidder
        ? `🔥 Highest bidder: ${data.highestBidder}`
        : "No bids yet";


document.getElementById(
    "balance"
).textContent =
    data.myBalance;


document.getElementById(
    "teamCount"
).textContent =
    `${data.myTeamCount} / 5`;


document.getElementById(
    "auctionTimer"
).textContent =
    data.time;


const players =
    document.getElementById(
        "auctionPlayers"
    );


players.innerHTML = "";


data.players.forEach(
    player => {

        const row =
            document.createElement(
                "div"
            );

        row.className =
            "auction-player";


        row.innerHTML =
            `
            <span>
                ${player.name}
            </span>

            <strong>
                💰 ${player.balance}
                • ${player.teamCount}/5
            </strong>
            `;


        players.appendChild(
            row
        );

    }
);


const buttons =
    document.querySelectorAll(
        ".bid-buttons button"
    );


buttons.forEach(
    button => {

        button.disabled =
            data.myTeamCount >= 5;

    }
);
```

}

// ============================================
// BID
// ============================================

function makeBid(amount) {

```
socket.emit(
    "bid",
    {
        roomCode,
        amount
    }
);
```

}

document.getElementById(
"bid100"
).onclick = () =>
makeBid(100);

document.getElementById(
"bid250"
).onclick = () =>
makeBid(250);

document.getElementById(
"bid500"
).onclick = () =>
makeBid(500);

// ============================================
// AUCTION RESULT
// ============================================

socket.on(
"auctionResult",
data => {

```
    show(auctionResult);


    const winner =
        document.getElementById(
            "auctionWinner"
        );


    if (data.winner) {

        const character =
            characters[
                data.character
            ];


        winner.innerHTML =
            `
            <div class="winner">

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

    } else {

        winner.innerHTML =
            `
            <div class="winner">
                <h3>
                    No one bought this character
                </h3>
            </div>
            `;

    }

}
```

);

// ============================================
// CONTINUE AUCTION
// ============================================

document.getElementById(
"continueAuction"
).onclick = () => {

```
socket.emit(
    "nextAuction",
    {
        roomCode
    }
);
```

};

socket.on(
"nextAuction",
data => {

```
    if (data.finished) {

        showFinal();

        return;
    }


    show(auction);

    updateAuction(
        data
    );

}
```

);

// ============================================
// FINAL
// ============================================

socket.on(
"finalResults",
data => {

```
    show(final);


    const container =
        document.getElementById(
            "finalResults"
        );


    container.innerHTML = "";


    data.players.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "final-player";


            div.innerHTML =
                `
                <h3>
                    #${index + 1}
                    ${player.name}
                </h3>

                <p>
                    💰 Coins:
                    ${player.balance}
                </p>

                <p class="final-team">
                    👥 Team:
                    ${
                        player.team.length
                            ? player.team
                                .map(
                                    c =>
                                        characters[c]
                                            ? characters[c].name
                                            : c
                                )
                                .join(" • ")
                            : "No characters"
                    }
                </p>
                `;


            container.appendChild(
                div
            );

        }
    );

}
```

);

// ============================================
// PLAY AGAIN
// ============================================

document.getElementById(
"playAgain"
).onclick = () => {

```
location.reload();
```

};
