const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 10000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/* =========================================================
   GAME DATA
========================================================= */

const rooms = new Map();

const CATEGORIES = [
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

/*
 * IMPORTANT:
 * These are the canonical character IDs.
 * Frontend may send Guy / Lee / Duy.
 */
const CHARACTERS = [
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
    "Obito",
    "Tsunade",
    "KillerB",
    "Kabuto",
    "Shisui",
    "Sakumo",
    "Hanzo",
    "ThirdRaikage",
    "FourthRaikage",
    "Onoki",
    "Mei",
    "Sasori",
    "Deidara",
    "Mu",
    "Gengetsu",
    "Danzo",
    "Kakuzu",
    "Hidan",
    "Konan",
    "Zabuza",
    "Kimimaro",
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
    "Tenten",
    "Iruka",
    "Anko",
    "Duy",
    "Shizune",
    "Asuma",
    "Kurenai",
    "Yamato",
    "Sai",
    "Konohamaru",
    "Kurotsuchi",
    "Mifune",
    "Fu",
    "Utakata",
    "Roshi",
    "Rasa",
    "Chiyo",
    "Darui",
    "Chojuro"
];

/* =========================================================
   CHARACTER ALIASES
========================================================= */

const CHARACTER_ALIASES = {
    "Might Guy": "Guy",
    "MightGuy": "Guy",
    "Guy": "Guy",

    "Rock Lee": "Lee",
    "RockLee": "Lee",
    "Lee": "Lee",

    "Might Duy": "Duy",
    "MightDuy": "Duy",
    "Duy": "Duy",

    "Killer B": "KillerB",
    "KillerBee": "KillerB",

    "Third Raikage": "ThirdRaikage",
    "Fourth Raikage": "FourthRaikage",

    "Mū": "Mu",
    "Mu": "Mu",

    "Gengetsu Hōzuki": "Gengetsu",
    "Gengetsu Hozuki": "Gengetsu",

    "Danzō": "Danzo",

    "Jūgo": "Jugo",

    "Fū": "Fu",

    "Rōshi": "Roshi",

    "Chōjūrō": "Chojuro"
};

function normalizeCharacter(value) {
    if (!value) return null;

    const text = String(value).trim();

    if (CHARACTERS.includes(text)) {
        return text;
    }

    if (CHARACTER_ALIASES[text]) {
        return CHARACTER_ALIASES[text];
    }

    return null;
}

/* =========================================================
   DEFAULT RANKINGS
========================================================= */

const RANKINGS = {
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
        "Obito"
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
        "Lee",
        "Naruto",
        "Sasuke",
        "Neji",
        "ThirdRaikage",
        "FourthRaikage",
        "KillerB",
        "Sakura",
        "Kakashi",
        "Duy"
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
   HELPERS
========================================================= */

function generateRoomCode() {
    let code;

    do {
        code = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
    } while (rooms.has(code));

    return code;
}

function getRoom(socket) {
    if (!socket.roomCode) return null;
    return rooms.get(socket.roomCode);
}

function getPublicPlayers(room) {
    return Object.values(room.players).map(player => ({
        id: player.id,
        name: player.name,
        balance: player.balance,
        spent: player.spent,
        team: player.team.map(item => ({
            character: item.character,
            price: item.price
        })),
        gaveUp: player.gaveUp
    }));
}

function broadcastPlayers(room) {
    io.to(room.code).emit("playersUpdated", {
        players: getPublicPlayers(room),
        host: room.host
    });
}

function clearAuctionTimer(room) {
    if (room.auction.timer) {
        clearTimeout(room.auction.timer);
        room.auction.timer = null;
    }

    if (room.auction.interval) {
        clearInterval(room.auction.interval);
        room.auction.interval = null;
    }
}

function getAuctionState(room) {
    const auction = room.auction;

    return {
        character: auction.character,
        currentBid: auction.currentBid,
        bidAmount: room.settings.bidAmount,
        highestBidder: auction.highestBidder,
        highestBidderName:
            auction.highestBidder &&
            room.players[auction.highestBidder]
                ? room.players[auction.highestBidder].name
                : null,

        timeLeft: auction.timeLeft,

        auctionNumber: auction.index + 1,
        totalCharacters: auction.order.length,

        remainingPlayers: Object.values(room.players)
            .filter(player => !player.gaveUpForCurrent)
            .map(player => ({
                id: player.id,
                name: player.name,
                balance: player.balance,
                gaveUpForCurrent: player.gaveUpForCurrent
            }))
    };
}

function sendAuctionState(room) {
    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    broadcastPlayers(room);
}

/* =========================================================
   AUCTION RANDOM ORDER
========================================================= */

function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] =
            [result[j], result[i]];
    }

    return result;
}

/* =========================================================
   SOCKET CONNECTION
========================================================= */

io.on("connection", socket => {

    console.log("Connected:", socket.id);

    /* =====================================================
       CREATE ROOM
    ===================================================== */

    socket.on("createRoom", data => {

        data = data || {};

        const roomCode = generateRoomCode();

        const name =
            String(data.name || "Player 1").trim()
            .substring(0, 30);

        const gameMode =
            data.gameMode === "auction"
                ? "auction"
                : "rank";

        const maxPlayers = Math.max(
            2,
            Math.min(
                Number(data.maxPlayers) || 6,
                25
            )
        );

        const teamSize = Math.max(
            1,
            Math.min(
                Number(data.teamSize) || 5,
                CHARACTERS.length
            )
        );

        const startingBalance = Math.max(
            1,
            Number(data.startingBalance) || 1000
        );

        const bidAmount = Math.max(
            1,
            Number(data.bidAmount) || 50
        );

        const bidTime = Math.max(
            3,
            Math.min(
                Number(data.bidTime) || 10,
                60
            )
        );

        const room = {

            code: roomCode,

            host: socket.id,

            gameMode,

            settings: {
                maxPlayers,
                teamSize,
                startingBalance,
                bidAmount,
                bidTime
            },

            players: {},

            rank: {
                started: false,
                categoryIndex: 0,
                advancing: false
            },

            auction: {
                order: [],
                index: 0,
                character: null,
                currentBid: 0,
                highestBidder: null,
                timeLeft: bidTime,
                active: false,
                timer: null,
                interval: null,
                finishing: false
            }
        };

        room.players[socket.id] = {
            id: socket.id,
            name,
            balance: startingBalance,
            spent: 0,
            team: [],
            rankSelections: {},
            gaveUpForCurrent: false
        };

        rooms.set(roomCode, room);

        socket.join(roomCode);
        socket.roomCode = roomCode;

        socket.emit("roomCreated", {
            roomCode,
            isHost: true,
            gameMode,
            settings: room.settings
        });

        broadcastPlayers(room);

        console.log("Room created:", roomCode);
    });

    /* =====================================================
       JOIN ROOM
    ===================================================== */

    socket.on("joinRoom", data => {

        data = data || {};

        const roomCode =
            String(data.roomCode || "")
                .trim()
                .toUpperCase();

        const room = rooms.get(roomCode);

        if (!room) {
            socket.emit(
                "errorMessage",
                "Room not found."
            );
            return;
        }

        if (
            Object.keys(room.players).length >=
            room.settings.maxPlayers
        ) {
            socket.emit(
                "errorMessage",
                "Room is full."
            );
            return;
        }

        if (
            room.rank.started ||
            room.auction.active
        ) {
            socket.emit(
                "errorMessage",
                "Game has already started."
            );
            return;
        }

        const count =
            Object.keys(room.players).length;

        const name =
            String(
                data.name ||
                `Player ${count + 1}`
            )
                .trim()
                .substring(0, 30);

        room.players[socket.id] = {
            id: socket.id,
            name,
            balance: room.settings.startingBalance,
            spent: 0,
            team: [],
            rankSelections: {},
            gaveUpForCurrent: false
        };

        socket.join(roomCode);
        socket.roomCode = roomCode;

        socket.emit("roomJoined", {
            roomCode,
            isHost: socket.id === room.host,
            gameMode: room.gameMode,
            settings: room.settings
        });

        broadcastPlayers(room);
    });

    /* =====================================================
       START GAME
    ===================================================== */

    socket.on("startGame", () => {

        const room = getRoom(socket);

        if (!room) return;

        if (socket.id !== room.host) {
            socket.emit(
                "errorMessage",
                "Only the host can start the game."
            );
            return;
        }

        const count =
            Object.keys(room.players).length;

        if (count < 2) {
            socket.emit(
                "errorMessage",
                "At least 2 players are required."
            );
            return;
        }

        if (room.gameMode === "rank") {
            startRankGame(room);
        } else {
            startAuction(room);
        }
    });

    /* =====================================================
       RANK SELECTION
    ===================================================== */

    socket.on("rankSelect", data => {

        const room = getRoom(socket);

        if (!room) return;

        if (!room.rank.started) return;

        const player =
            room.players[socket.id];

        if (!player) return;

        const category =
            Number(data && data.categoryIndex);

        if (
            !Number.isInteger(category) ||
            category < 0 ||
            category >= CATEGORIES.length
        ) {
            return;
        }

        /*
         * Only the current category is accepted.
         */
        if (
            category !==
            room.rank.categoryIndex
        ) {
            socket.emit(
                "errorMessage",
                "This category is no longer active."
            );
            return;
        }

        const character =
            normalizeCharacter(
                data && data.character
            );

        /*
         * This fixes Guy / Lee / Duy.
         */
        if (!character) {
            socket.emit(
                "errorMessage",
                "Invalid character."
            );
            return;
        }

        /*
         * Same character is allowed
         * for different players.
         */
        player.rankSelections[category] =
            character;

        /*
         * IMPORTANT:
         * Do NOT broadcast the selected character
         * to everybody.
         *
         * Only send confirmation to the player
         * who selected it.
         */
        socket.emit(
            "rankSelectionAccepted",
            {
                categoryIndex: category,
                character
            }
        );

        checkRankCategoryComplete(
            room
        );
    });

    /* =====================================================
       AUCTION BID
    ===================================================== */

    socket.on("auctionBid", () => {

        const room = getRoom(socket);

        if (!room) return;

        const auction = room.auction;

        if (!auction.active) {
            socket.emit(
                "errorMessage",
                "There is no active auction."
            );
            return;
        }

        const player =
            room.players[socket.id];

        if (!player) return;

        if (player.gaveUpForCurrent) {
            socket.emit(
                "errorMessage",
                "You gave up on this character."
            );
            return;
        }

        if (
            auction.highestBidder ===
            socket.id
        ) {
            socket.emit(
                "errorMessage",
                "You are already the highest bidder."
            );
            return;
        }

        const newBid =
            auction.currentBid === 0
                ? room.settings.bidAmount
                : auction.currentBid +
                  room.settings.bidAmount;

        if (player.balance < newBid) {
            socket.emit(
                "errorMessage",
                "Not enough money."
            );
            return;
        }

        /*
         * Successful bid.
         */
        auction.currentBid = newBid;
        auction.highestBidder = socket.id;

        /*
         * A successful bid resets the timer.
         */
        resetAuctionTimer(room);

        sendAuctionState(room);
    });

    /* =====================================================
       AUCTION GIVE UP
    ===================================================== */

    socket.on("auctionGiveUp", () => {

        const room = getRoom(socket);

        if (!room) return;

        const auction = room.auction;

        if (!auction.active) return;

        const player =
            room.players[socket.id];

        if (!player) return;

        player.gaveUpForCurrent = true;

        /*
         * If this player was highest bidder,
         * remove their bid.
         */
        if (
            auction.highestBidder ===
            socket.id
        ) {
            auction.highestBidder = null;
            auction.currentBid = 0;
        }

        /*
         * Count players who can still bid.
         */
        const eligiblePlayers =
            Object.values(room.players)
                .filter(
                    p =>
                        !p.gaveUpForCurrent &&
                        p.balance >=
                            (
                                auction.currentBid === 0
                                    ? room.settings.bidAmount
                                    : auction.currentBid +
                                      room.settings.bidAmount
                            )
                );

        /*
         * Special 2-player case:
         *
         * If one gives up and the other is still
         * participating, immediately sell to the
         * remaining player at the current bid.
         */
        const activePlayers =
            Object.values(room.players)
                .filter(
                    p =>
                        !p.gaveUpForCurrent
                );

        if (
            activePlayers.length === 1 &&
            Object.keys(room.players).length === 2
        ) {

            const winner =
                activePlayers[0];

            const price =
                auction.currentBid > 0
                    ? auction.currentBid
                    : room.settings.bidAmount;

            if (winner.balance >= price) {

                auction.currentBid = price;
                auction.highestBidder =
                    winner.id;

                finishAuctionCharacter(
                    room,
                    false
                );

                return;
            }
        }

        /*
         * If nobody remains, unsold.
         */
        if (activePlayers.length === 0) {

            finishAuctionCharacter(
                room,
                true
            );

            return;
        }

        /*
         * If nobody can afford the next bid,
         * finish current character.
         */
        if (
            auction.highestBidder &&
            eligiblePlayers.length === 0
        ) {
            finishAuctionCharacter(
                room,
                false
            );
            return;
        }

        sendAuctionState(room);
    });

    /* =====================================================
       OLD UNSOLD EVENT
       Keep compatibility with existing game.js
    ===================================================== */

    socket.on("auctionUnsold", () => {

        /*
         * Treat old Unsold button as Give Up.
         */
        const room = getRoom(socket);

        if (!room) return;

        const player =
            room.players[socket.id];

        if (!player) return;

        player.gaveUpForCurrent = true;

        const activePlayers =
            Object.values(room.players)
                .filter(
                    p => !p.gaveUpForCurrent
                );

        if (
            activePlayers.length === 1 &&
            Object.keys(room.players).length === 2
        ) {

            const winner =
                activePlayers[0];

            const price =
                room.auction.currentBid ||
                room.settings.bidAmount;

            if (winner.balance >= price) {

                room.auction.currentBid =
                    price;

                room.auction.highestBidder =
                    winner.id;

                finishAuctionCharacter(
                    room,
                    false
                );

                return;
            }
        }

        if (activePlayers.length === 0) {
            finishAuctionCharacter(
                room,
                true
            );
            return;
        }

        sendAuctionState(room);
    });

    /* =====================================================
       DISCONNECT
    ===================================================== */

    socket.on("disconnect", () => {

        const roomCode =
            socket.roomCode;

        if (!roomCode) return;

        const room =
            rooms.get(roomCode);

        if (!room) return;

        delete room.players[socket.id];

        if (room.host === socket.id) {

            const remaining =
                Object.keys(room.players);

            if (remaining.length > 0) {

                room.host =
                    remaining[0];

                io.to(room.code).emit(
                    "hostChanged",
                    {
                        host: room.host
                    }
                );

            } else {

                clearAuctionTimer(room);

                rooms.delete(roomCode);

                return;
            }
        }

        /*
         * If only one player remains during
         * an auction, don't automatically sell
         * unless it is a real 2-player give-up
         * situation.
         */
        if (
            room.auction.active &&
            Object.keys(room.players).length === 0
        ) {
            clearAuctionTimer(room);
        }

        broadcastPlayers(room);
    });
});

/* =========================================================
   RANK GAME
========================================================= */

function startRankGame(room) {

    room.rank.started = true;
    room.rank.categoryIndex = 0;
    room.rank.advancing = false;

    Object.values(room.players)
        .forEach(player => {
            player.rankSelections = {};
        });

    io.to(room.code).emit(
        "rankGameStarted",
        {
            categoryIndex: 0,
            categoryName: CATEGORIES[0],
            totalCategories: CATEGORIES.length
        }
    );
}

function checkRankCategoryComplete(room) {

    if (!room.rank.started) return;

    if (room.rank.advancing) return;

    const category =
        room.rank.categoryIndex;

    const players =
        Object.values(room.players);

    /*
     * EVERY player must select.
     *
     * It does NOT compare the characters.
     */
    const allSelected =
        players.length > 0 &&
        players.every(
            player =>
                Object.prototype.hasOwnProperty.call(
                    player.rankSelections,
                    category
                )
        );

    if (!allSelected) {
        return;
    }

    room.rank.advancing = true;

    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex: category,
            categoryName: CATEGORIES[category]
        }
    );

    setTimeout(() => {

        if (!room.rank.started) return;

        if (
            category >=
            CATEGORIES.length - 1
        ) {

            finishRankGame(room);

            return;
        }

        room.rank.categoryIndex =
            category + 1;

        room.rank.advancing = false;

        /*
         * Send the new category number
         * to everyone.
         */
        io.to(room.code).emit(
            "rankNextCategory",
            {
                categoryIndex:
                    room.rank.categoryIndex,

                categoryName:
                    CATEGORIES[
                        room.rank.categoryIndex
                    ],

                totalCategories:
                    CATEGORIES.length
            }
        );

    }, 1000);
}

/* =========================================================
   RANK FINAL RESULT
========================================================= */

async function finishRankGame(room) {

    room.rank.started = false;
    room.rank.advancing = false;

    const results =
        Object.values(room.players)
            .map(player => ({
                playerId: player.id,
                playerName: player.name,
                selections:
                    player.rankSelections
            }));

    /*
     * Send complete teams first.
     */
    io.to(room.code).emit(
        "rankGameFinished",
        {
            results,
            categories: CATEGORIES
        }
    );

    /*
     * Then generate AI comparison.
     */
    const aiResult =
        await evaluateRankTeamsWithAI(
            results
        );

    io.to(room.code).emit(
        "rankAIEvaluation",
        aiResult
    );
}

/* =========================================================
   OPENAI TEAM EVALUATION
========================================================= */

async function evaluateRankTeamsWithAI(results) {

    /*
     * If the OpenAI key is missing, the game
     * still works and uses local evaluation.
     */
    if (!OPENAI_API_KEY) {

        return localTeamEvaluation(
            results,
            "OpenAI API key is not configured."
        );
    }

    try {

        const prompt = `
You are evaluating teams in a Naruto character ranking game.

There are 16 categories:
${CATEGORIES.join(", ")}

Each player selected one Naruto character for each category.

Teams:

${JSON.stringify(results, null, 2)}

Determine:
1. Which player/team is strongest overall.
2. Rank all teams from strongest to weakest.
3. Explain why the winning team is strongest.
4. Mention important strengths and weaknesses of each team.
5. Do not use numeric points.
6. Use Naruto canon knowledge.
7. Keep the explanation understandable.

Return ONLY valid JSON in this exact structure:

{
  "winnerPlayerId": "id",
  "winnerPlayerName": "name",
  "winnerReason": "reason",
  "ranking": [
    {
      "playerId": "id",
      "playerName": "name",
      "summary": "summary"
    }
  ]
}
`;

        const response =
            await fetch(
                "https://api.openai.com/v1/responses",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${OPENAI_API_KEY}`
                    },

                    body: JSON.stringify({
                        model: "gpt-5.6-luna",

                        input: prompt
                    })
                }
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "OpenAI error:",
                errorText
            );

            return localTeamEvaluation(
                results,
                "OpenAI evaluation failed."
            );
        }

        const data =
            await response.json();

        let text =
            data.output_text || "";

        if (!text && Array.isArray(data.output)) {

            text =
                data.output
                    .flatMap(item =>
                        item.content || []
                    )
                    .filter(item =>
                        item.type ===
                        "output_text"
                    )
                    .map(item =>
                        item.text
                    )
                    .join("");
        }

        /*
         * Remove accidental markdown fences.
         */
        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        const parsed =
            JSON.parse(text);

        return {
            source: "openai",
            winnerPlayerId:
                parsed.winnerPlayerId,
            winnerPlayerName:
                parsed.winnerPlayerName,
            winnerReason:
                parsed.winnerReason,
            ranking:
                Array.isArray(parsed.ranking)
                    ? parsed.ranking
                    : []
        };

    } catch (error) {

        console.error(
            "AI evaluation error:",
            error
        );

        return localTeamEvaluation(
            results,
            "AI evaluation temporarily unavailable."
        );
    }
}

/* =========================================================
   LOCAL FALLBACK EVALUATION
========================================================= */

function localTeamEvaluation(
    results,
    note
) {

    /*
     * No points are displayed to users.
     * This is only a fallback when OpenAI
     * isn't available.
     */

    const priorityCategories = [
        "Overall Power",
        "Battle IQ",
        "Versatility",
        "Speed",
        "Strength",
        "Ninjutsu",
        "Taijutsu",
        "Defense",
        "Chakra",
        "Stamina",
        "Leadership",
        "Experience",
        "Teamwork",
        "Attack",
        "Durability",
        "Genjutsu"
    ];

    const rankingData =
        results.map(team => {

            let strength = 0;

            Object.entries(
                team.selections || {}
            ).forEach(
                ([index, character]) => {

                    const category =
                        CATEGORIES[
                            Number(index)
                        ];

                    const list =
                        RANKINGS[
                            category
                        ] || [];

                    const position =
                        list.indexOf(
                            character
                        );

                    if (position >= 0) {
                        strength +=
                            Math.max(
                                1,
                                11 - position
                            );
                    }
                }
            );

            return {
                ...team,
                strength
            };
        });

    rankingData.sort(
        (a, b) =>
            b.strength - a.strength
    );

    const winner =
        rankingData[0];

    return {
        source: "local-fallback",

        winnerPlayerId:
            winner
                ? winner.playerId
                : null,

        winnerPlayerName:
            winner
                ? winner.playerName
                : null,

        winnerReason:
            winner
                ? `${winner.playerName} has the strongest overall combination across the selected categories, especially in overall power, combat ability, versatility and other major categories.`
                : "No winner could be determined.",

        ranking:
            rankingData.map(team => ({
                playerId:
                    team.playerId,

                playerName:
                    team.playerName,

                summary:
                    `${team.playerName} has a balanced selection across the ranking categories.`
            })),

        note
    };
}

/* =========================================================
   AUCTION START
========================================================= */

function startAuction(room) {

    room.auction.order =
        shuffle(CHARACTERS);

    room.auction.index = 0;
    room.auction.character = null;
    room.auction.currentBid = 0;
    room.auction.highestBidder = null;
    room.auction.active = true;
    room.auction.finishing = false;

    Object.values(room.players)
        .forEach(player => {

            player.balance =
                room.settings.startingBalance;

            player.spent = 0;

            player.team = [];

            player.gaveUpForCurrent = false;
        });

    io.to(room.code).emit(
        "auctionStarted",
        {
            settings: room.settings,
            totalCharacters:
                room.auction.order.length
        }
    );

    broadcastPlayers(room);

    startAuctionCharacter(room);
}

/* =========================================================
   START AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    const auction = room.auction;

    clearAuctionTimer(room);

    auction.finishing = false;

    /*
     * Finish if no more characters.
     */
    if (
        auction.index >=
        auction.order.length
    ) {
        finishAuction(room);
        return;
    }

    /*
     * Finish if every player has full team.
     */
    const allFull =
        Object.values(room.players)
            .every(
                player =>
                    player.team.length >=
                    room.settings.teamSize
            );

    if (allFull) {
        finishAuction(room);
        return;
    }

    auction.character =
        auction.order[
            auction.index
        ];

    auction.currentBid = 0;

    auction.highestBidder = null;

    auction.timeLeft =
        room.settings.bidTime;

    auction.active = true;

    /*
     * Reset give-up status for NEW character.
     */
    Object.values(room.players)
        .forEach(player => {
            player.gaveUpForCurrent = false;
        });

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    broadcastPlayers(room);

    startAuctionTimer(room);
}

/* =========================================================
   AUCTION TIMER
========================================================= */

function startAuctionTimer(room) {

    const auction = room.auction;

    clearAuctionTimer(room);

    auction.timeLeft =
        room.settings.bidTime;

    /*
     * Send immediately.
     */
    sendAuctionState(room);

    /*
     * Client doesn't have to calculate
     * the official time. Server sends it.
     */
    auction.interval =
        setInterval(() => {

            if (!auction.active) {
                clearAuctionTimer(room);
                return;
            }

            auction.timeLeft--;

            io.to(room.code).emit(
                "auctionTimer",
                {
                    timeLeft:
                        auction.timeLeft
                }
            );

            if (
                auction.timeLeft <= 0
            ) {

                clearAuctionTimer(room);

                /*
                 * No bidder = UNSOLD.
                 *
                 * Existing highest bidder =
                 * SOLD.
                 */
                finishAuctionCharacter(
                    room,
                    !auction.highestBidder
                );
            }

        }, 1000);

    auction.timer =
        setTimeout(() => {

            if (!auction.active) return;

            clearAuctionTimer(room);

            finishAuctionCharacter(
                room,
                !auction.highestBidder
            );

        }, room.settings.bidTime * 1000 + 100);
}

/* =========================================================
   RESET TIMER AFTER BID
========================================================= */

function resetAuctionTimer(room) {

    const auction = room.auction;

    if (!auction.active) return;

    clearAuctionTimer(room);

    auction.timeLeft =
        room.settings.bidTime;

    /*
     * Tell everyone immediately that
     * the timer restarted.
     */
    io.to(room.code).emit(
        "auctionTimer",
        {
            timeLeft:
                auction.timeLeft
        }
    );

    auction.interval =
        setInterval(() => {

            if (!auction.active) {
                clearAuctionTimer(room);
                return;
            }

            auction.timeLeft--;

            io.to(room.code).emit(
                "auctionTimer",
                {
                    timeLeft:
                        auction.timeLeft
                }
            );

            if (
                auction.timeLeft <= 0
            ) {

                clearAuctionTimer(room);

                finishAuctionCharacter(
                    room,
                    !auction.highestBidder
                );
            }

        }, 1000);

    auction.timer =
        setTimeout(() => {

            if (!auction.active) return;

            clearAuctionTimer(room);

            finishAuctionCharacter(
                room,
                !auction.highestBidder
            );

        }, room.settings.bidTime * 1000 + 100);
}

/* =========================================================
   FINISH ONE AUCTION CHARACTER
========================================================= */

function finishAuctionCharacter(
    room,
    unsold = false
) {

    const auction = room.auction;

    if (!auction.active) return;

    if (auction.finishing) return;

    auction.finishing = true;

    clearAuctionTimer(room);

    auction.active = false;

    const character =
        auction.character;

    /*
     * UNSOLD
     */
    if (
        unsold ||
        !auction.highestBidder
    ) {

        io.to(room.code).emit(
            "auctionSold",
            {
                character,
                sold: false,
                unsold: true,
                buyerId: null,
                buyerName: null,
                price: 0
            }
        );

        auction.index++;

        setTimeout(() => {
            startAuctionCharacter(room);
        }, 1200);

        return;
    }

    const buyer =
        room.players[
            auction.highestBidder
        ];

    if (!buyer) {

        auction.index++;

        setTimeout(() => {
            startAuctionCharacter(room);
        }, 500);

        return;
    }

    const price =
        auction.currentBid;

    /*
     * Safety check.
     */
    if (
        price <= 0 ||
        buyer.balance < price
    ) {

        io.to(room.code).emit(
            "auctionSold",
            {
                character,
                sold: false,
                unsold: true,
                buyerId: null,
                buyerName: null,
                price: 0
            }
        );

        auction.index++;

        setTimeout(() => {
            startAuctionCharacter(room);
        }, 1200);

        return;
    }

    /*
     * Deduct actual money.
     */
    buyer.balance -= price;

    buyer.spent += price;

    buyer.team.push({
        character,
        price
    });

    /*
     * Send COMPLETE information to everyone.
     *
     * This fixes:
     * "sold to undefined"
     * and everyone seeing 0 money.
     */
    io.to(room.code).emit(
        "auctionSold",
        {
            character,

            sold: true,

            unsold: false,

            buyerId:
                buyer.id,

            buyerName:
                buyer.name,

            price,

            remainingMoney:
                buyer.balance,

            spent:
                buyer.spent,

            teamSize:
                buyer.team.length,

            maxTeamSize:
                room.settings.teamSize
        }
    );

    /*
     * Update every player's money/team display.
     */
    broadcastPlayers(room);

    auction.index++;

    setTimeout(() => {
        startAuctionCharacter(room);
    }, 1500);
}

/* =========================================================
   AUCTION FINISH
========================================================= */

async function finishAuction(room) {

    clearAuctionTimer(room);

    room.auction.active = false;

    room.auction.character = null;

    const teams =
        Object.values(room.players)
            .map(player => ({
                playerId: player.id,
                playerName: player.name,
                balance: player.balance,
                spent: player.spent,
                team: player.team
            }));

    io.to(room.code).emit(
        "auctionFinished",
        {
            teams
        }
    );

    /*
     * AI recommendation.
     */
    const ai =
        await evaluateAuctionTeamsWithAI(
            teams
        );

    io.to(room.code).emit(
        "auctionAIEvaluation",
        ai
    );
}

/* =========================================================
   AUCTION AI
========================================================= */

async function evaluateAuctionTeamsWithAI(
    teams
) {

    if (!OPENAI_API_KEY) {

        return {
            source: "local-fallback",

            winnerPlayerId:
                teams[0]
                    ? teams[0].playerId
                    : null,

            winnerPlayerName:
                teams[0]
                    ? teams[0].playerName
                    : null,

            winnerReason:
                "OpenAI API key is not configured. The teams are displayed, but AI evaluation is unavailable.",

            ranking:
                teams.map(team => ({
                    playerId:
                        team.playerId,

                    playerName:
                        team.playerName,

                    summary:
                        "Team evaluation requires OpenAI."
                }))
        };
    }

    try {

        const prompt = `
You are the AI analyst for a Naruto character auction game.

Evaluate these completed teams:

${JSON.stringify(teams, null, 2)}

Determine:
- strongest team
- ranking of all teams
- why the strongest team wins
- strengths and weaknesses
- synergy between characters
- balance of offense, defense, speed, ninjutsu, taijutsu, intelligence, leadership and versatility

Do not use a simple money-based ranking.
Do not assign visible points.
Use Naruto canon knowledge.

Return ONLY JSON:

{
  "winnerPlayerId": "id",
  "winnerPlayerName": "name",
  "winnerReason": "detailed reason",
  "ranking": [
    {
      "playerId": "id",
      "playerName": "name",
      "summary": "team analysis"
    }
  ]
}
`;

        const response =
            await fetch(
                "https://api.openai.com/v1/responses",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${OPENAI_API_KEY}`
                    },

                    body: JSON.stringify({
                        model: "gpt-5.6-luna",
                        input: prompt
                    })
                }
            );

        if (!response.ok) {

            const text =
                await response.text();

            console.error(
                "Auction OpenAI error:",
                text
            );

            return {
                source: "fallback",
                error: "OpenAI request failed."
            };
        }

        const data =
            await response.json();

        let text =
            data.output_text || "";

        if (!text && Array.isArray(data.output)) {

            text =
                data.output
                    .flatMap(item =>
                        item.content || []
                    )
                    .filter(item =>
                        item.type ===
                        "output_text"
                    )
                    .map(item =>
                        item.text
                    )
                    .join("");
        }

        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        const parsed =
            JSON.parse(text);

        return {
            source: "openai",

            winnerPlayerId:
                parsed.winnerPlayerId,

            winnerPlayerName:
                parsed.winnerPlayerName,

            winnerReason:
                parsed.winnerReason,

            ranking:
                parsed.ranking || []
        };

    } catch (error) {

        console.error(
            "Auction AI error:",
            error
        );

        return {
            source: "fallback",

            winnerPlayerId:
                teams[0]
                    ? teams[0].playerId
                    : null,

            winnerPlayerName:
                teams[0]
                    ? teams[0].playerName
                    : null,

            winnerReason:
                "AI evaluation could not be completed.",

            ranking:
                teams.map(team => ({
                    playerId:
                        team.playerId,

                    playerName:
                        team.playerName,

                    summary:
                        "AI analysis unavailable."
                }))
        };
    }
}
