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

    "Might Guy": {
        name: "Might Guy",
        image: "assets/characters/images%20(12).jpeg"
    },

    "Might Duy": {
        name: "Might Duy",
        image: "assets/characters/download%20(33).jpeg"
    },

    "Rock Lee": {
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

    "Killer B": {
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

    "Third Raikage": {
        name: "Third Raikage",
        image: "assets/characters/download%20(6).jpeg"
    },

    "Fourth Raikage": {
        name: "Fourth Raikage",
        image: "assets/characters/download%20(7).jpeg"
    },

    Onoki: {
        name: "Onoki",
        image: "assets/characters/download%20(8).jpeg"
    },

    "Mei Terumi": {
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

    "Mū": {
        name: "Mū",
        image: "assets/characters/download%20(12).jpeg"
    },

    "Gengetsu Hozuki": {
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
   RANKINGS
========================================================= */

const rankings = {

    Speed: [
        "Minato",
        "Naruto",
        "Tobirama",
        "Fourth Raikage",
        "Sasuke",
        "Shisui",
        "Kakashi",
        "Might Guy",
        "Rock Lee",
        "Obito"
    ],

    Strength: [
        "Madara",
        "Hashirama",
        "Naruto",
        "Sasuke",
        "Might Guy",
        "Tsunade",
        "Minato",
        "Itachi",
        "Obito",
        "Killer B"
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

    Durability: [
        "Hashirama",
        "Naruto",
        "Madara",
        "Kisame",
        "Killer B",
        "Tsunade",
        "Obito",
        "Sakura",
        "Gaara",
        "Third Raikage"
    ],

    Chakra: [
        "Naruto",
        "Hashirama",
        "Madara",
        "Kisame",
        "Nagato",
        "Killer B",
        "Minato",
        "Tobirama",
        "Jiraiya",
        "Orochimaru"
    ],

    Ninjutsu: [
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

    Taijutsu: [
        "Might Guy",
        "Might Duy",
        "Rock Lee",
        "Naruto",
        "Sasuke",
        "Neji",
        "Third Raikage",
        "Fourth Raikage",
        "Killer B",
        "Sakura",
        "Kakashi"
    ],

    Genjutsu: [
        "Itachi",
        "Shisui",
        "Sasuke",
        "Madara",
        "Kurenai",
        "Obito",
        "Orochimaru",
        "Kakashi",
        "Ino",
        "Sakura"
    ],

    Defense: [
        "Gaara",
        "Hashirama",
        "Madara",
        "Naruto",
        "Kakashi",
        "Tsunade",
        "Sasuke",
        "Obito",
        "Third Raikage",
        "Kisame"
    ],

    Attack: [
        "Madara",
        "Naruto",
        "Sasuke",
        "Hashirama",
        "Might Guy",
        "Minato",
        "Itachi",
        "Killer B",
        "Nagato",
        "Obito"
    ],

    Stamina: [
        "Naruto",
        "Hashirama",
        "Kisame",
        "Killer B",
        "Madara",
        "Tsunade",
        "Sakura",
        "Jiraiya",
        "Orochimaru",
        "Third Raikage"
    ],

    Leadership: [
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

    Versatility: [
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

    Experience: [
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

    Teamwork: [
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
let totalCategories = 16;

let selectedCharacter = null;

let auctionTimerInterval = null;
let auctionSeconds = 0;
let currentAuctionState = null;

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

function showMessage(text) {

    const message =
        $("message");

    if (!message) return;

    message.textContent =
        text;

    message.style.display =
        "block";

    clearTimeout(
        window.messageTimeout
    );

    window.messageTimeout =
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
        $("playerName")
            ?.value
            .trim();

    if (!name) {
        showMessage(
            "Enter your name."
        );
        return;
    }

    myName = name;

    const mode =
        $("gameMode")
            ?.value ||
        "rank";

    let maxPlayers =
        Number(
            $("maxPlayers")
                ?.value
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

            gameMode: mode,

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

            bidAmount:
                Number(
                    $("bidAmount")
                        ?.value
                ) || 50,

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
            ?.value
            .trim();

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

    socket.emit(
        "joinRoom",
        {
            name,
            roomCode: code
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
   ROOM CREATED
========================================================= */

socket.on(
    "roomCreated",
    data => {

        roomCode =
            data.roomCode;

        isHost =
            data.isHost;

        gameMode =
            data.gameMode;

        showMessage(
            `Room created: ${roomCode}`
        );

        /*
         * If your index has these IDs,
         * display room information.
         */

        const room =
            $("roomCodeDisplay");

        if (room) {
            room.textContent =
                roomCode;
        }
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
            data.isHost;

        gameMode =
            data.gameMode;

        showMessage(
            `Joined room ${roomCode}`
        );
    }
);

/* =========================================================
   HOST CHANGED
========================================================= */

socket.on(
    "hostChanged",
    data => {

        isHost =
            data.host ===
            socket.id;

        if (isHost) {
            showMessage(
                "You are now the host."
            );
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

        if (!list) return;

        list.innerHTML = "";

        data.players.forEach(
            player => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "player-item";

                div.innerHTML = `
                    <strong>
                        ${escapeHTML(player.name)}
                    </strong>
                    <span>
                        ₹${Number(player.balance).toLocaleString()}
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
   RANK SCREEN
========================================================= */

function updateCategoryDisplay() {

    const number =
        currentCategory + 1;

    const title =
        $("categoryTitle");

    if (title) {
        title.textContent =
            categories[
                currentCategory
            ];
    }

    const counter =
        $("categoryCounter");

    if (counter) {

        counter.textContent =
            `${number}/${totalCategories}`;
    }

    const categoryNumber =
        $("categoryNumber");

    if (categoryNumber) {

        categoryNumber.textContent =
            `${number} / ${totalCategories}`;
    }
}

/* =========================================================
   BUILD RANK SCREEN
========================================================= */

function buildRankScreen() {

    updateCategoryDisplay();

    selectedCharacter =
        null;

    const status =
        $("selectionStatus");

    if (status) {

        status.textContent =
            "Select one character.";
    }

    const grid =
        $("characterGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const category =
        categories[
            currentCategory
        ];

    /*
     * Make a COPY.
     *
     * IMPORTANT:
     * Do not modify the rankings array.
     */

    const ranked =
        [
            ...(rankings[
                category
            ] || [])
        ];

    const rankedSet =
        new Set(ranked);

    /*
     * Add all other characters.
     */

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

            if (!char) return;

            const card =
                document.createElement(
                    "button"
                );

            card.type =
                "button";

            card.className =
                "character-card";

            card.innerHTML = `

                <div class="rank-number">
                    #${index + 1}
                </div>

                <img
                    src="${char.image}"
                    alt="${escapeHTML(char.name)}"
                    onerror="this.style.display='none'"
                >

                <strong>
                    ${escapeHTML(char.name)}
                </strong>

            `;

            card.onclick =
                () => {

                    selectRankCharacter(
                        key,
                        card
                    );

                };

            grid.appendChild(
                card
            );
        }
    );
}

/* =========================================================
   SELECT RANK CHARACTER
========================================================= */

function selectRankCharacter(
    character,
    card
) {

    if (
        selectedCharacter
    ) {

        showMessage(
            "You already selected a character for this category."
        );

        return;
    }

    selectedCharacter =
        character;

    socket.emit(
        "rankSelect",
        {
            categoryIndex:
                currentCategory,

            character
        }
    );

    document
        .querySelectorAll(
            ".character-card"
        )
        .forEach(
            item => {
                item.disabled =
                    true;
            }
        );

    if (card) {
        card.classList.add(
            "selected"
        );
    }

    const status =
        $("selectionStatus");

    if (status) {

        status.textContent =
            `You selected ${characters[character].name}`;
    }

    showMessage(
        `Selected ${characters[character].name}`
    );
}

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

        totalCategories =
            Number(
                data.totalCategories
            ) || 16;

        showScreen(
            "rankScreen"
        );

        buildRankScreen();
    }
);

/* =========================================================
   PRIVATE RANK SELECTION ACCEPTED
========================================================= */

socket.on(
    "rankSelectionAccepted",
    data => {

        /*
         * This event is sent ONLY to
         * the player who selected.
         */

        const char =
            characters[
                data.character
            ];

        if (char) {

            showMessage(
                `Your selection: ${char.name}`
            );
        }
    }
);

/* =========================================================
   RANK WAITING
========================================================= */

socket.on(
    "rankWaiting",
    data => {

        /*
         * Do NOT reveal the selected
         * character of another player.
         */

        const status =
            $("selectionStatus");

        if (!status) return;

        const mine =
            selectedCharacter
                ? "You have selected."
                : "You haven't selected yet.";

        status.textContent =
            `${mine} Waiting for all players... ` +
            `${data.selectedCount}/${data.totalPlayers}`;
    }
);

/* =========================================================
   CATEGORY COMPLETE
========================================================= */

socket.on(
    "rankCategoryComplete",
    data => {

        showMessage(
            "Everyone selected. Moving to the next category..."
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
            Number(
                data.categoryIndex
            );

        totalCategories =
            Number(
                data.totalCategories
            ) || 16;

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

        container.innerHTML = "";

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
                        ${escapeHTML(player.playerName)}
                    </h3>
                `;

                Object.entries(
                    player.selections
                ).forEach(
                    ([index, key]) => {

                        const char =
                            characters[key];

                        const category =
                            categories[
                                Number(index)
                            ];

                        html += `

                            <div class="team-character">

                                <strong>
                                    ${escapeHTML(category)}
                                </strong>

                                <span>
                                    ${
                                        char
                                            ? escapeHTML(char.name)
                                            : escapeHTML(key)
                                    }
                                </span>

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

        updateAuctionMoney(
            data.settings
                ?.startingBalance
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

        stopAuctionTimer();

        updateAuctionCharacter(
            data
        );

        updateAuctionState(
            data
        );

        startLocalAuctionTimer(
            data.bidTime || 10
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

        updateAuctionState(
            data
        );

        /*
         * Timer is reset by server after
         * every bid.
         */

        startLocalAuctionTimer(
            data.bidTime || 10
        );
    }
);

/* =========================================================
   AUCTION TIMER
========================================================= */

socket.on(
    "auctionTimer",
    data => {

        auctionSeconds =
            Number(
                data.seconds
            );

        updateTimerDisplay(
            auctionSeconds
        );
    }
);

/* =========================================================
   START LOCAL TIMER DISPLAY
========================================================= */

function startLocalAuctionTimer(
    seconds
) {

    stopAuctionTimer();

    auctionSeconds =
        Number(seconds) || 10;

    updateTimerDisplay(
        auctionSeconds
    );

    auctionTimerInterval =
        setInterval(() => {

            auctionSeconds--;

            if (
                auctionSeconds < 0
            ) {

                auctionSeconds =
                    0;
            }

            updateTimerDisplay(
                auctionSeconds
            );

        }, 1000);
}

/* =========================================================
   STOP TIMER
========================================================= */

function stopAuctionTimer() {

    if (
        auctionTimerInterval
    ) {

        clearInterval(
            auctionTimerInterval
        );

        auctionTimerInterval =
            null;
    }
}

/* =========================================================
   TIMER DISPLAY
========================================================= */

function updateTimerDisplay(
    seconds
) {

    const timer =
        $("auctionTimer");

    if (timer) {

        timer.textContent =
            `${seconds}s`;
    }

    const timer2 =
        $("timer");

    if (timer2) {

        timer2.textContent =
            `${seconds}s`;
    }

    const countdown =
        $("countdown");

    if (countdown) {

        countdown.textContent =
            `${seconds}`;
    }
}

/* =========================================================
   AUCTION CHARACTER DISPLAY
========================================================= */

function updateAuctionCharacter(
    data
) {

    const name =
        data.character;

    const char =
        characters[name];

    const title =
        $("auctionCharacterName");

    if (title) {

        title.textContent =
            char
                ? char.name
                : name;
    }

    const image =
        $("auctionCharacterImage");

    if (image) {

        image.src =
            char
                ? char.image
                : "";

        image.alt =
            char
                ? char.name
                : name;
    }
}

/* =========================================================
   AUCTION STATE
========================================================= */

function updateAuctionState(
    data
) {

    const bid =
        $("currentBid");

    if (bid) {

        bid.textContent =
            `₹${Number(
                data.currentBid || 0
            ).toLocaleString()}`;
    }

    const highest =
        $("highestBidder");

    if (highest) {

        highest.textContent =
            data.highestBidderName
                ? `Highest: ${data.highestBidderName}`
                : "No bids yet";
    }

    /*
     * Remaining money for EVERY player.
     */

    const money =
        $("auctionPlayers");

    if (money) {

        money.innerHTML = "";

        data.players.forEach(
            player => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "auction-player";

                div.innerHTML = `

                    <strong>
                        ${escapeHTML(player.name)}
                    </strong>

                    <span>
                        ₹${Number(
                            player.balance
                        ).toLocaleString()}
                    </span>

                    <small>
                        Team:
                        ${player.team?.length || 0}
                    </small>
                `;

                money.appendChild(
                    div
                );
            }
        );
    }

    /*
     * Update Give Up button.
     */

    const giveUp =
        $("auctionGiveUpButton");

    if (giveUp) {

        const passed =
            data.passedPlayers
                ?.includes(
                    socket.id
                );

        const highestMe =
            data.highestBidder ===
            socket.id;

        if (passed) {

            giveUp.textContent =
                "GAVE UP";

            giveUp.disabled =
                true;

        } else if (highestMe) {

            giveUp.textContent =
                "HIGHEST BIDDER";

            giveUp.disabled =
                true;

        } else {

            giveUp.textContent =
                "GIVE UP";

            giveUp.disabled =
                false;
        }
    }

    /*
     * Also support old Unsold button ID.
     */

    const unsold =
        $("auctionUnsoldButton");

    if (unsold) {

        const hasBid =
            Boolean(
                data.highestBidder
            );

        unsold.textContent =
            hasBid
                ? "GIVE UP"
                : "GIVE UP";

        unsold.disabled =
            data.highestBidder ===
            socket.id ||
            data.passedPlayers
                ?.includes(socket.id);
    }
}

/* =========================================================
   BID BUTTON
========================================================= */

window.placeBid = function () {

    if (
        !currentAuctionState
    ) {
        return;
    }

    const passed =
        currentAuctionState
            .passedPlayers
            ?.includes(
                socket.id
            );

    if (passed) {

        showMessage(
            "You gave up on this character."
        );

        return;
    }

    socket.emit(
        "auctionBid"
    );
};

/* =========================================================
   GIVE UP BUTTON
========================================================= */

window.giveUpBid = function () {

    if (
        !currentAuctionState
    ) {
        return;
    }

    socket.emit(
        "auctionGiveUp"
    );
};

/*
 * Support an HTML button that
 * already calls auctionUnsold().
 */

window.auctionUnsold = function () {

    giveUpBid();
};

/* =========================================================
   PLAYER PASSED
========================================================= */

socket.on(
    "auctionPlayerPassed",
    data => {

        showMessage(
            `You gave up on ${data.character}`
        );
    }
);

/* =========================================================
   AUCTION SOLD / UNSOLD
========================================================= */

socket.on(
    "auctionSold",
    data => {

        stopAuctionTimer();

        if (
            data.sold
        ) {

            showMessage(
                `${data.character} SOLD TO ${data.winnerName} for ₹${data.price}`
            );

            const result =
                $("auctionResult");

            if (result) {

                result.textContent =
                    `${data.character} SOLD TO ${data.winnerName} — ₹${data.price}`;
            }

        } else {

            showMessage(
                `${data.character} is UNSOLD`
            );

            const result =
                $("auctionResult");

            if (result) {

                result.textContent =
                    `${data.character} — UNSOLD`;
            }
        }

        if (
            data.winnerId ===
            socket.id
        ) {

            updateAuctionMoney(
                data.remainingMoney
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

        stopAuctionTimer();

        showScreen(
            "auctionResultScreen"
        );

        const container =
            $("auctionResults");

        if (!container)
            return;

        container.innerHTML = "";

        data.teams.forEach(
            player => {

                const box =
                    document.createElement(
                        "div"
                    );

                box.className =
                    "final-team";

                let html = `
                    <h3>
                        ${escapeHTML(player.playerName)}
                    </h3>

                    <p>
                        Money left:
                        ₹${Number(
                            player.balance
                        ).toLocaleString()}
                    </p>
                `;

                player.team.forEach(
                    member => {

                        html += `
                            <div>
                                ${escapeHTML(member.character)}
                                — ₹${member.price}
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
   MONEY DISPLAY
========================================================= */

function updateAuctionMoney(
    amount
) {

    if (
        amount === undefined ||
        amount === null
    ) {
        return;
    }

    const money =
        $("myMoney");

    if (money) {

        money.textContent =
            `Money: ₹${Number(
                amount
            ).toLocaleString()}`;
    }

    const balance =
        $("playerBalance");

    if (balance) {

        balance.textContent =
            `₹${Number(
                amount
            ).toLocaleString()}`;
    }
}

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
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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
