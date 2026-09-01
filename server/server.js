const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

/* =========================================================
   CHARACTERS
   IDs MUST MATCH game.js
========================================================= */

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
   16 CATEGORIES
========================================================= */

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

/* =========================================================
   ROOMS
========================================================= */

const rooms = new Map();

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

/* =========================================================
   PLAYER DATA
========================================================= */

function publicPlayer(player) {
    return {
        id: player.id,
        name: player.name,
        balance: player.balance,
        team: [...player.team]
    };
}

function broadcastPlayers(room) {
    io.to(room.code).emit("playersUpdated", {
        players: Object.values(room.players).map(publicPlayer)
    });
}

/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {
    const a = room.auction;

    return {
        character: a.character,
        currentBid: a.currentBid,
        highestBidder: a.highestBidder,
        highestBidderName:
            a.highestBidder &&
            room.players[a.highestBidder]
                ? room.players[a.highestBidder].name
                : null,

        timeLeft: a.timeLeft,

        active: a.active,

        index: a.index,

        totalCharacters: CHARACTERS.length,

        players: Object.values(room.players).map(p => ({
            id: p.id,
            name: p.name,
            balance: p.balance,
            team: [...p.team],
            gaveUp: a.giveUps.has(p.id)
        }))
    };
}

/* =========================================================
   AI TEAM ANALYSIS
========================================================= */

async function generateTeamAnalysis(room) {

    const teams = Object.values(room.players).map(player => ({
        playerId: player.id,
        playerName: player.name,
        team: player.team
    }));

    const fallback = buildFallbackAnalysis(teams);

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return fallback;
    }

    try {

        const prompt = `
You are an expert Naruto battle analyst.

Compare these player teams.

Do NOT use numerical points or scores in the response.

For every team:
1. Give its strengths.
2. Give its weaknesses.
3. Explain its best combinations.
4. Explain how balanced the team is.

Then select the BEST OVERALL TEAM and explain clearly why.

Teams:

${teams.map(t =>
    `${t.playerName}: ${t.team.join(", ")}`
).join("\n")}
`;

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-5-mini",
                    input: prompt
                })
            }
        );

        if (!response.ok) {
            console.log("OpenAI error:", await response.text());
            return fallback;
        }

        const data = await response.json();

        let text = "";

        if (Array.isArray(data.output)) {
            for (const item of data.output) {
                if (Array.isArray(item.content)) {
                    for (const content of item.content) {
                        if (content.text) {
                            text += content.text;
                        }
                    }
                }
            }
        }

        if (!text.trim()) {
            return fallback;
        }

        return {
            source: "AI",
            text,
            teams
        };

    } catch (error) {

        console.log("AI analysis failed:", error);

        return fallback;
    }
}

function buildFallbackAnalysis(teams) {

    const powerOrder = [
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
    ];

    function strength(team) {
        let value = 0;

        team.forEach(character => {
            const index = powerOrder.indexOf(character);

            if (index >= 0) {
                value += powerOrder.length - index;
            }
        });

        return value;
    }

    const sorted = [...teams].sort(
        (a, b) => strength(b.team) - strength(a.team)
    );

    const winner = sorted[0];

    let text = "";

    for (const team of teams) {

        text += `\n${team.playerName}\n`;

        text += `Team: ${team.team.join(", ")}\n`;

        text += `Strengths: `;
        text += "This team can combine different combat styles, abilities and roles.\n";

        text += `Weaknesses: `;
        text += "Its effectiveness depends on how well the selected characters complement one another.\n`;

        text += `Team combination: `;
        text += "The strongest combinations come from mixing offensive, defensive and support abilities.\n`;
    }

    text += `\nBEST TEAM: ${winner.playerName}\n`;

    text += `Why: `;
    text += `${winner.playerName}'s team has the strongest overall combination of powerful fighters, combat abilities and useful roles among the teams selected.`;

    return {
        source: "Fallback AI-style analysis",
        text,
        teams
    };
}

/* =========================================================
   RANK FINISH
========================================================= */

async function finishRankGame(room) {

    room.rank.started = false;

    const results = Object.values(room.players).map(player => ({
        playerId: player.id,
        playerName: player.name,
        selections: { ...player.rankSelections }
    }));

    const teams = results.map(player => ({
        playerId: player.playerId,
        playerName: player.playerName,
        team: Object.values(player.selections)
    }));

    const analysis = await generateTeamAnalysis(room);

    io.to(room.code).emit("rankGameFinished", {
        results,
        teams,
        analysis
    });
}

/* =========================================================
   RANK CATEGORY CHECK
========================================================= */

function checkRankCategoryComplete(room, category) {

    if (!room.rank.started) return;

    if (category !== room.rank.categoryIndex) {
        return;
    }

    const players = Object.values(room.players);

    const complete = players.every(
        player =>
            player.rankSelections[category] !== undefined
    );

    if (!complete) {
        return;
    }

    if (room.rank.completedCategories.has(category)) {
        return;
    }

    room.rank.completedCategories.add(category);

    io.to(room.code).emit("rankCategoryComplete", {
        categoryIndex: category
    });

    setTimeout(() => {

        if (!room.rank.started) {
            return;
        }

        if (category === CATEGORIES.length - 1) {

            finishRankGame(room);
            return;
        }

        room.rank.categoryIndex = category + 1;

        io.to(room.code).emit("rankNextCategory", {
            categoryIndex: category + 1,
            totalCategories: CATEGORIES.length
        });

    }, 1000);
}

/* =========================================================
   AUCTION TIMER
========================================================= */

function stopAuctionTimer(room) {

    if (room.auction.timer) {
        clearInterval(room.auction.timer);
        room.auction.timer = null;
    }
}

function startAuctionTimer(room) {

    stopAuctionTimer(room);

    room.auction.timeLeft = room.settings.bidTime;

    io.to(room.code).emit(
        "auctionTimer",
        getAuctionState(room)
    );

    room.auction.timer = setInterval(() => {

        if (!room.auction.active) {
            stopAuctionTimer(room);
            return;
        }

        room.auction.timeLeft--;

        io.to(room.code).emit(
            "auctionTimer",
            getAuctionState(room)
        );

        if (room.auction.timeLeft <= 0) {

            stopAuctionTimer(room);

            finishAuctionCharacter(room);
        }

    }, 1000);
}

/* =========================================================
   AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    stopAuctionTimer(room);

    const auction = room.auction;

    const players = Object.values(room.players);

    if (!players.length) {
        return;
    }

    const everyoneFull = players.every(
        player =>
            player.team.length >= room.settings.teamSize
    );

    if (
        auction.index >= CHARACTERS.length ||
        everyoneFull
    ) {
        finishAuction(room);
        return;
    }

    auction.character = CHARACTERS[auction.index];

    auction.currentBid = 0;

    auction.highestBidder = null;

    auction.active = true;

    auction.giveUps = new Set();

    auction.timeLeft = room.settings.bidTime;

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    startAuctionTimer(room);
}

/* =========================================================
   FINISH AUCTION CHARACTER
========================================================= */

function finishAuctionCharacter(room, forceUnsold = false) {

    const auction = room.auction;

    if (!auction.active) {
        return;
    }

    stopAuctionTimer(room);

    auction.active = false;

    const character = auction.character;

    const bidder = auction.highestBidder;

    if (
        !forceUnsold &&
        bidder &&
        room.players[bidder]
    ) {

        const player = room.players[bidder];

        const price = auction.currentBid;

        if (
            player.balance >= price &&
            player.team.length < room.settings.teamSize
        ) {

            player.balance -= price;

            player.team.push(character);

            io.to(room.code).emit(
                "auctionSold",
                {
                    character,
                    buyerId: player.id,
                    buyerName: player.name,
                    price,
                    remainingMoney: player.balance,
                    teams: Object.values(room.players).map(p => ({
                        id: p.id,
                        name: p.name,
                        balance: p.balance,
                        team: [...p.team]
                    }))
                }
            );

            broadcastPlayers(room);

        } else {

            io.to(room.code).emit(
                "auctionUnsoldResult",
                {
                    character
                }
            );
        }

    } else {

        io.to(room.code).emit(
            "auctionUnsoldResult",
            {
                character
            }
        );
    }

    auction.index++;

    setTimeout(() => {

        if (rooms.has(room.code)) {
            startAuctionCharacter(room);
        }

    }, 1500);
}

/* =========================================================
   FINISH AUCTION
========================================================= */

async function finishAuction(room) {

    stopAuctionTimer(room);

    room.auction.active = false;

    const teams = Object.values(room.players).map(player => ({
        playerId: player.id,
        playerName: player.name,
        team: [...player.team],
        balance: player.balance
    }));

    const analysis = await generateTeamAnalysis(room);

    io.to(room.code).emit("auctionFinished", {
        teams,
        analysis
    });
}

/* =========================================================
   SOCKET
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
            String(data.name || "Player 1").trim();

        const gameMode =
            data.gameMode === "auction"
                ? "auction"
                : "rank";

        const maxPlayers = Math.max(
            2,
            Math.min(
                25,
                Number(data.maxPlayers) || 6
            )
        );

        const teamSize = Math.max(
            1,
            Math.min(
                CHARACTERS.length,
                Number(data.teamSize) || 5
            )
        );

        const startingBalance = Math.max(
            0,
            Number(data.startingBalance) || 1000
        );

        const bidAmount = Math.max(
            1,
            Number(data.bidAmount) || 50
        );

        const bidTime = Math.max(
            1,
            Math.min(
                60,
                Number(data.bidTime) || 10
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
                completedCategories: new Set()
            },

            auction: {
                index: 0,
                character: null,
                currentBid: 0,
                highestBidder: null,
                timeLeft: bidTime,
                timer: null,
                active: false,
                giveUps: new Set()
            }
        };

        room.players[socket.id] = {
            id: socket.id,
            name,
            balance: startingBalance,
            team: [],
            rankSelections: {}
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
       JOIN
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

        const count =
            Object.keys(room.players).length;

        if (count >= room.settings.maxPlayers) {
            socket.emit(
                "errorMessage",
                "Room is full."
            );
            return;
        }

        const name =
            String(
                data.name ||
                `Player ${count + 1}`
            ).trim();

        room.players[socket.id] = {
            id: socket.id,
            name,
            balance: room.settings.startingBalance,
            team: [],
            rankSelections: {}
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

        /* Send current game state if game already started */

        if (room.gameMode === "auction" &&
            room.auction.active) {

            socket.emit(
                "auctionCharacter",
                getAuctionState(room)
            );

            socket.emit(
                "auctionTimer",
                getAuctionState(room)
            );
        }
    });

    /* =====================================================
       START GAME
    ===================================================== */

    socket.on("startGame", () => {

        const room = rooms.get(socket.roomCode);

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

            room.rank.started = true;

            room.rank.categoryIndex = 0;

            room.rank.completedCategories.clear();

            Object.values(room.players).forEach(player => {
                player.rankSelections = {};
                player.team = [];
            });

            io.to(room.code).emit(
                "rankGameStarted",
                {
                    categoryIndex: 0,
                    totalCategories: CATEGORIES.length,
                    categories: CATEGORIES
                }
            );

        } else {

            startAuction(room);
        }
    });

    /* =====================================================
       RANK SELECT
    ===================================================== */

    socket.on("rankSelect", data => {

        const room = rooms.get(socket.roomCode);

        if (!room) return;

        if (!room.rank.started) return;

        const player = room.players[socket.id];

        if (!player) return;

        const category =
            Number(data?.categoryIndex);

        const character =
            data?.character;

        if (
            !Number.isInteger(category) ||
            category < 0 ||
            category >= CATEGORIES.length
        ) {
            return;
        }

        if (category !== room.rank.categoryIndex) {
            return;
        }

        if (!CHARACTERS.includes(character)) {

            socket.emit(
                "errorMessage",
                `Invalid character: ${character}`
            );

            return;
        }

        /* Same character IS allowed for different players. */

        player.rankSelections[category] = character;

        /*
         * IMPORTANT:
         * Send the selection only to the player who selected it.
         * Other players only receive that someone selected,
         * not the character.
         */

        socket.emit("myRankSelection", {
            categoryIndex: category,
            character
        });

        socket.broadcast
            .to(room.code)
            .emit("playerRankSelected", {
                playerId: player.id,
                playerName: player.name,
                categoryIndex: category
            });

        checkRankCategoryComplete(
            room,
            category
        );
    });

    /* =====================================================
       AUCTION BID
    ===================================================== */

    socket.on("auctionBid", () => {

        const room = rooms.get(socket.roomCode);

        if (!room) return;

        const auction = room.auction;

        if (!auction.active) return;

        const player = room.players[socket.id];

        if (!player) return;

        if (auction.giveUps.has(socket.id)) {

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
                "Wait for another player to bid."
            );

            return;
        }

        if (
            player.team.length >=
            room.settings.teamSize
        ) {

            socket.emit(
                "errorMessage",
                "Your team is already full."
            );

            return;
        }

        const newBid =
            auction.currentBid +
            room.settings.bidAmount;

        if (
            newBid >
            player.balance
        ) {

            socket.emit(
                "errorMessage",
                `You need ${newBid}, but only ${player.balance} remains.`
            );

            return;
        }

        auction.currentBid = newBid;

        auction.highestBidder = socket.id;

        /* A successful bid resets the timer. */

        startAuctionTimer(room);

        io.to(room.code).emit(
            "auctionUpdated",
            getAuctionState(room)
        );
    });

    /* =====================================================
       GIVE UP
    ===================================================== */

    socket.on("auctionGiveUp", () => {

        const room = rooms.get(socket.roomCode);

        if (!room) return;

        const auction = room.auction;

        if (!auction.active) return;

        if (!room.players[socket.id]) return;

        auction.giveUps.add(socket.id);

        /*
         * If the current highest bidder gives up,
         * remove their bid.
         */

        if (auction.highestBidder === socket.id) {

            auction.highestBidder = null;

            auction.currentBid = 0;
        }

        io.to(room.code).emit(
            "auctionGiveUp",
            {
                playerId: socket.id,
                playerName:
                    room.players[socket.id].name
            }
        );

        /*
         * TWO PLAYER SPECIAL CASE:
         *
         * If one player gives up and only one
         * player remains, immediately sell to them.
         */

        const activePlayers =
            Object.values(room.players)
                .filter(player =>
                    !auction.giveUps.has(player.id) &&
                    player.team.length <
                        room.settings.teamSize
                );

        if (activePlayers.length === 1) {

            const remaining =
                activePlayers[0];

            /*
             * If the remaining player already had
             * the highest bid, sell at that bid.
             *
             * Otherwise sell at the current bid
             * if there was one.
             */

            if (
                auction.highestBidder &&
                auction.highestBidder !== remaining.id
            ) {
                auction.highestBidder =
                    remaining.id;
            }

            if (!auction.highestBidder) {

                auction.currentBid =
                    room.settings.bidAmount;

                if (
                    remaining.balance <
                    auction.currentBid
                ) {

                    finishAuctionCharacter(
                        room,
                        true
                    );

                    return;
                }

                auction.highestBidder =
                    remaining.id;
            }

            finishAuctionCharacter(room);

            return;
        }

        /*
         * Nobody active = UNSOLD.
         */

        if (activePlayers.length === 0) {

            finishAuctionCharacter(
                room,
                true
            );

            return;
        }

        startAuctionTimer(room);

        io.to(room.code).emit(
            "auctionUpdated",
            getAuctionState(room)
        );
    });

    /* =====================================================
       UNSOLD BUTTON
    ===================================================== */

    socket.on("auctionUnsold", () => {

        const room = rooms.get(socket.roomCode);

        if (!room) return;

        if (!room.auction.active) return;

        /*
         * UNSOLD is available only when
         * nobody has bid.
         */

        if (room.auction.highestBidder) {

            socket.emit(
                "errorMessage",
                "A bid already exists. Use Give Up instead."
            );

            return;
        }

        finishAuctionCharacter(
            room,
            true
        );
    });

    /* =====================================================
       DISCONNECT
    ===================================================== */

    socket.on("disconnect", () => {

        const roomCode = socket.roomCode;

        if (!roomCode) return;

        const room = rooms.get(roomCode);

        if (!room) return;

        if (room.auction.timer) {
            clearInterval(room.auction.timer);
        }

        delete room.players[socket.id];

        if (room.host === socket.id) {

            const remaining =
                Object.keys(room.players);

            if (remaining.length) {

                room.host = remaining[0];

                io.to(room.code).emit(
                    "hostChanged",
                    {
                        host: room.host
                    }
                );

            } else {

                rooms.delete(roomCode);

                return;
            }
        }

        broadcastPlayers(room);
    });
});

/* =========================================================
   START SERVER
========================================================= */

server.listen(PORT, () => {

    console.log(
        `Naruto Character Rank server running on port ${PORT}`
    );

});
