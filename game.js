/* =========================================================
   NARUTO CHARACTER GAMES
   GAME.JS
   Character Rank + Multiplayer Auction
   ========================================================= */

const socket = io();


/* =========================================================
   CHARACTER PHOTOS
   CHANGE THESE FILENAMES TO YOUR ACTUAL FILES
   ========================================================= */

const CHARACTER_IMAGES = {

    Minato: "assets/characters/minato.jpg",
    Tobirama: "assets/characters/tobirama.jpg",
    Naruto: "assets/characters/naruto.jpg",
    Kakashi: "assets/characters/kakashi.jpg",
    "Rock Lee": "assets/characters/rock-lee.jpg",

    Hashirama: "assets/characters/hashirama.jpg",
    Madara: "assets/characters/madara.jpg",
    "Might Guy": "assets/characters/might-guy.jpg",
    Sakura: "assets/characters/sakura.jpg",

    Itachi: "assets/characters/itachi.jpg",
    Shikamaru: "assets/characters/shikamaru.jpg",

    Jiraiya: "assets/characters/jiraiya.jpg",
    Orochimaru: "assets/characters/orochimaru.jpg",

    Pain: "assets/characters/pain.jpg"
};


/* =========================================================
   TOP 5 FOR EVERY CATEGORY
   ========================================================= */

const RANKINGS = {

    speed: [
        "Minato",
        "Tobirama",
        "Naruto",
        "Kakashi",
        "Rock Lee"
    ],

    strength: [
        "Hashirama",
        "Madara",
        "Naruto",
        "Might Guy",
        "Sakura"
    ],

    intelligence: [
        "Shikamaru",
        "Itachi",
        "Kakashi",
        "Tobirama",
        "Minato"
    ],

    chakra: [
        "Naruto",
        "Hashirama",
        "Madara",
        "Minato",
        "Pain"
    ],

    battle: [
        "Madara",
        "Naruto",
        "Hashirama",
        "Itachi",
        "Kakashi"
    ]
};


/* =========================================================
   CATEGORY INFORMATION
   ========================================================= */

const CATEGORY_INFO = {

    speed: {
        title: "⚡ SPEED",
        emoji: "⚡",
        description: "Fastest Naruto characters"
    },

    strength: {
        title: "💪 STRENGTH",
        emoji: "💪",
        description: "Strongest Naruto characters"
    },

    intelligence: {
        title: "🧠 INTELLIGENCE",
        emoji: "🧠",
        description: "Smartest Naruto characters"
    },

    chakra: {
        title: "🔵 CHAKRA",
        emoji: "🔵",
        description: "Characters with the greatest chakra"
    },

    battle: {
        title: "⚔️ BATTLE SKILL",
        emoji: "⚔️",
        description: "Best battle-skilled characters"
    }
};


/* =========================================================
   STATE
   ========================================================= */

let roomCode = "";

let playerName = "";

let currentGame = "";

let currentCategory = "";

let isHost = false;


/* =========================================================
   DOM HELPER
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(text) {

    const message =
        $("message");

    if (!message) {

        alert(text);

        return;
    }

    message.textContent = text;

    message.style.display = "block";


    setTimeout(() => {

        message.style.display =
            "none";

    }, 2500);
}


/* =========================================================
   SHOW SECTION
   ========================================================= */

function showSection(id) {

    document
        .querySelectorAll("section")
        .forEach(section => {

            section.classList.add(
                "hidden"
            );

        });


    const section =
        $(id);

    if (section) {

        section.classList.remove(
            "hidden"
        );
    }
}


/* =========================================================
   HOME
   ========================================================= */

function showHome() {

    showSection("home");

    currentGame = "";
}


/* =========================================================
   CREATE ROOM
   ========================================================= */

function createRoom(game) {

    const input =
        $("playerName");

    if (!input) return;


    playerName =
        input.value.trim();


    if (!playerName) {

        showMessage(
            "Enter your name."
        );

        return;
    }


    currentGame =
        game;


    socket.emit(
        "createRoom",
        {
            playerName,
            game
        }
    );
}


/* =========================================================
   JOIN ROOM
   ========================================================= */

function joinRoom(game) {

    const nameInput =
        $("playerName");

    const roomInput =
        $("roomCode");


    if (!nameInput ||
        !roomInput) {

        return;
    }


    playerName =
        nameInput.value.trim();


    roomCode =
        roomInput.value
            .trim()
            .toUpperCase();


    if (!playerName) {

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


    currentGame =
        game;


    socket.emit(
        "joinRoom",
        {
            playerName,
            roomCode,
            game
        }
    );
}


/* =========================================================
   ROOM CREATED
   ========================================================= */

socket.on(
    "roomCreated",
    data => {

        roomCode =
            data.roomCode;

        isHost = true;


        openWaitingRoom(
            data.players
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

        isHost = false;


        openWaitingRoom(
            data.players
        );
    }
);


/* =========================================================
   OPEN WAITING ROOM
   ========================================================= */

function openWaitingRoom(
    players
) {

    showSection(
        "room"
    );


    const code =
        $("displayRoomCode");

    if (code) {

        code.textContent =
            roomCode;
    }


    updatePlayers(
        players
    );


    const startButton =
        $("startGameButton");

    if (startButton) {

        startButton.style.display =
            isHost
                ? "block"
                : "none";
    }
}


/* =========================================================
   PLAYERS UPDATED
   ========================================================= */

socket.on(
    "playersUpdated",
    data => {

        updatePlayers(
            data.players
        );
    }
);


/* =========================================================
   UPDATE PLAYER LIST
   ========================================================= */

function updatePlayers(
    players
) {

    const list =
        $("playersList");

    if (!list) return;


    list.innerHTML = "";


    players.forEach(
        (player, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "player";


            const crown =
                index === 0
                    ? " 👑"
                    : "";


            div.innerHTML =
                `
                <span>
                    ${escapeHtml(
                        player.name
                    )}
                    ${crown}
                </span>

                <span>
                    ${player.teamCount || 0}/5
                </span>
                `;


            list.appendChild(
                div
            );
        }
    );
}


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

    socket.emit(
        "startGame",
        {
            roomCode
        }
    );
}


/* =========================================================
   SERVER ERROR
   ========================================================= */

socket.on(
    "roomError",
    message => {

        showMessage(
            message
        );
    }
);


/* =========================================================
   RANK GAME STARTED
   ========================================================= */

socket.on(
    "gameStarted",
    data => {

        if (
            data.game !==
            "rank"
        ) {

            return;
        }


        currentGame =
            "rank";


        currentCategory =
            data.category;


        showRankCategory(
            data.category
        );
    }
);


/* =========================================================
   SHOW RANK CATEGORY
   ========================================================= */

function showRankCategory(
    category
) {

    showSection(
        "rankGame"
    );


    currentCategory =
        category;


    const info =
        CATEGORY_INFO[
            category
        ];


    if (!info) return;


    const title =
        $("rankCategoryTitle");

    if (title) {

        title.textContent =
            info.title;
    }


    const description =
        $("rankDescription");

    if (description) {

        description.textContent =
            info.description;
    }


    renderTopFive(
        category
    );


    const nextButton =
        $("nextCategoryButton");

    if (nextButton) {

        nextButton.style.display =
            isHost
                ? "block"
                : "none";
    }
}


/* =========================================================
   RENDER TOP 5
   ========================================================= */

function renderTopFive(
    category
) {

    const container =
        $("rankCharacterList");


    if (!container) {

        console.warn(
            "rankCharacterList not found"
        );

        return;
    }


    container.innerHTML = "";


    const topFive =
        RANKINGS[
            category
        ] || [];


    topFive.forEach(
        (character, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "rank-character-card";


            const position =
                index + 1;


            let medal =
                "";


            if (position === 1) {

                medal = "🥇";

            } else if (
                position === 2
            ) {

                medal = "🥈";

            } else if (
                position === 3
            ) {

                medal = "🥉";

            } else {

                medal = "⭐";
            }


            const image =
                CHARACTER_IMAGES[
                    character
                ] ||
                "assets/characters/default.jpg";


            card.innerHTML =
                `
                <div class="rank-position">
                    ${medal} ${position}
                </div>

                <img
                    src="${image}"
                    alt="${escapeHtml(
                        character
                    )}"
                    onerror="this.src='assets/characters/default.jpg'"
                >

                <div class="rank-character-name">
                    ${escapeHtml(
                        character
                    )}
                </div>
                `;


            container.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   NEXT CATEGORY
   ========================================================= */

function nextRankCategory() {

    if (!isHost) return;


    socket.emit(
        "nextRankCategory",
        {
            roomCode
        }
    );
}


/* =========================================================
   RANK RESULT FROM SERVER
   ========================================================= */

socket.on(
    "rankResult",
    data => {

        /*
           We don't show player selections.
           The game displays only the
           fixed top 5 characters for
           the category.
        */

        const nextButton =
            $("nextCategoryButton");


        if (nextButton) {

            nextButton.style.display =
                isHost
                    ? "block"
                    : "none";
        }
    }
);


/* =========================================================
   RANK GAME FINISHED
   ========================================================= */

socket.on(
    "rankFinished",
    () => {

        showRankFinished();
    }
);


/* =========================================================
   RANK FINISHED
   ========================================================= */

function showRankFinished() {

    showSection(
        "rankFinished"
    );


    const container =
        $("finalRankings");


    if (!container) return;


    container.innerHTML =
        `
        <div class="final-player">
            🏆 Character Rank Complete
        </div>

        <div class="final-player">
            All categories have been completed.
        </div>
        `;
}


/* =========================================================
   AUCTION GAME STARTED
   ========================================================= */

socket.on(
    "auctionGameStarted",
    () => {

        currentGame =
            "auction";


        showSection(
            "auctionGame"
        );
    }
);


/* =========================================================
   AUCTION STARTED
   ========================================================= */

socket.on(
    "auctionStarted",
    data => {

        showSection(
            "auctionGame"
        );


        const name =
            $("auctionCharacter");


        if (name) {

            name.textContent =
                data.character;
        }


        const auctionName =
            $("auctionCharacterName");


        if (auctionName) {

            auctionName.textContent =
                data.character;
        }


        const image =
            $("auctionCharacterImage");


        if (image) {

            image.src =
                CHARACTER_IMAGES[
                    data.character
                ] ||
                "assets/characters/default.jpg";
        }
    }
);


/* =========================================================
   AUCTION UPDATE
   ========================================================= */

socket.on(
    "auctionUpdate",
    data => {

        showSection(
            "auctionGame"
        );


        const character =
            $("auctionCharacter");


        if (character) {

            character.textContent =
                data.character;
        }


        const characterName =
            $("auctionCharacterName");


        if (characterName) {

            characterName.textContent =
                data.character;
        }


        const image =
            $("auctionCharacterImage");


        if (image) {

            image.src =
                CHARACTER_IMAGES[
                    data.character
                ] ||
                "assets/characters/default.jpg";
        }


        const bid =
            $("currentBid");


        if (bid) {

            bid.textContent =
                `₹${data.currentBid}`;
        }


        const bidder =
            $("highestBidder");


        if (bidder) {

            bidder.textContent =
                data.highestBidder
                    ? `Highest bidder: ${data.highestBidder}`
                    : "No bids yet";
        }


        const balance =
            $("auctionBalance");


        if (balance) {

            balance.textContent =
                `₹${data.myBalance}`;
        }


        const timer =
            $("auctionTimer");


        if (timer) {

            timer.textContent =
                data.timeLeft;
        }


        const teamCount =
            $("auctionTeamCount");


        if (teamCount) {

            teamCount.textContent =
                `${data.myTeamCount}/5`;
        }


        const bidButton =
            $("bidButton");


        if (bidButton) {

            /*
               Highest bidder cannot
               click again.

               Other players can click
               the ₹50 button.
            */

            bidButton.disabled =
                !data.canBid;

            bidButton.textContent =
                "💰 BID ₹50";
        }


        updateAuctionPlayers(
            data.players
        );
    }
);


/* =========================================================
   AUCTION PLAYERS
   ========================================================= */

function updateAuctionPlayers(
    players
) {

    const list =
        $("auctionPlayersList");


    if (!list) return;


    list.innerHTML = "";


    players.forEach(
        player => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "auction-player";


            div.innerHTML =
                `
                <div class="auction-player-left">

                    <div class="auction-player-avatar">
                        👤
                    </div>

                    <span>
                        ${escapeHtml(
                            player.name
                        )}
                    </span>

                </div>

                <div>
                    ₹${player.balance}
                    <br>
                    ${player.teamCount}/5
                </div>
                `;


            list.appendChild(
                div
            );
        }
    );
}


/* =========================================================
   BID
   ========================================================= */

function placeBid() {

    if (
        !roomCode ||
        currentGame !==
            "auction"
    ) {

        return;
    }


    socket.emit(
        "auctionBid",
        {
            roomCode
        }
    );
}


/* =========================================================
   AUCTION RESULT
   ========================================================= */

socket.on(
    "auctionResult",
    data => {

        const message =
            $("auctionMessage");


        if (message) {

            if (data.sold) {

                message.textContent =
                    `🔨 ${data.character} SOLD to ${data.winner} for ₹${data.bid}`;

            } else {

                message.textContent =
                    `❌ ${data.character} UNSOLD`;
            }


            message.classList.remove(
                "hidden"
            );
        }


        setTimeout(() => {

            if (message) {

                message.classList.add(
                    "hidden"
                );
            }

        }, 1400);
    }
);


/* =========================================================
   AUCTION FINISHED
   ========================================================= */

socket.on(
    "auctionFinished",
    data => {

        showSection(
            "auctionFinished"
        );


        const container =
            $("auctionFinalResults");


        if (!container) return;


        container.innerHTML = "";


        data.ranking.forEach(
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
                        ${index + 1}.
                        ${escapeHtml(
                            player.name
                        )}
                    </h3>

                    <p>
                        Balance:
                        ₹${player.balance}
                    </p>

                    <p>
                        Characters:
                        ${player.teamCount}
                    </p>

                    <div class="team-characters">

                        ${
                            player.team
                                .map(
                                    character =>
                                        `
                                        <span class="team-character">
                                            ${escapeHtml(
                                                character
                                            )}
                                        </span>
                                        `
                                )
                                .join("")
                        }

                    </div>
                    `;


                container.appendChild(
                    div
                );
            }
        );
    }
);


/* =========================================================
   BACK TO HOME
   ========================================================= */

function backToHome() {

    location.reload();
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(
    text
) {

    return String(text)
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
   GLOBAL FUNCTIONS
   ========================================================= */

window.showHome =
    showHome;

window.createRoom =
    createRoom;

window.joinRoom =
    joinRoom;

window.startGame =
    startGame;

window.nextRankCategory =
    nextRankCategory;

window.placeBid =
    placeBid;

window.backToHome =
    backToHome;


/* =========================================================
   CONNECTION STATUS
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
