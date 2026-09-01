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
    "Might Guy",
    "Rock Lee",
    "Shikamaru",
    "Neji",
    "Gaara",
    "Kisame",
    "Sakura",
    "Nagato",
    "Obito",

    "Tsunade",
    "Killer B",
    "Kabuto",
    "Shisui",
    "Sakumo",
    "Hanzo",
    "Third Raikage",
    "Fourth Raikage",
    "Onoki",
    "Mei Terumi",
    "Sasori",
    "Deidara",
    "Mū",
    "Gengetsu Hozuki",
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
    "Might Duy",
    "Shizune",
    "Asuma",
    "Kurenai",
    "Yamato",
    "Sai",
    "Konohamaru",
    "Chiyo",
    "Rasa",
    "Darui",
    "Chojuro",
    "Kurotsuchi",
    "Mifune",
    "Fu",
    "Utakata",
    "Roshi"
];

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
   ROOM STORAGE
========================================================= */

const rooms = new Map();

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

function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function getRoom(roomCode) {
    return rooms.get(roomCode);
}

function getPlayers(room) {
    return Object.values(room.players).map(player => ({
        id: player.id,
        name: player.name,
        balance: player.balance,
        team: [...player.team],
        givenUp: player.givenUp
    }));
}

function broadcastPlayers(room) {
    io.to(room.code).emit("playersUpdated", {
        players: getPlayers(room)
    });
}

function getAuctionState(room) {
    const auction = room.auction;

    let remainingMoney = {};

    Object.values(room.players).forEach(player => {
        remainingMoney[player.id] = player.balance;
    });

    return {
        character: auction.character,
        currentBid: auction.currentBid,
        highestBidder: auction.highestBidder,
        highestBidderName:
            auction.highestBidder &&
            room.players[auction.highestBidder]
                ? room.players[auction.highestBidder].name
                : null,

        timeLeft: auction.timeLeft,

        active: auction.active,

        remainingMoney,

        bidAmount: room.settings.bidAmount,

        teamSize: room.settings.teamSize,

        auctionNumber: auction.position,

        totalCharacters: auction.order.length
    };
}

function clearAuctionTimer(room) {
    if (room.auction.timer) {
        clearInterval(room.auction.timer);
        room.auction.timer = null;
    }
}

function emitAuctionState(room) {
    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );
}

/* =========================================================
   CREATE ROOM
========================================================= */

io.on("connection", socket => {

    console.log("Connected:", socket.id);

    socket.on("createRoom", data => {

        data = data || {};

        const roomCode = generateRoomCode();

        const name =
            String(data.name || "Player 1").trim() ||
            "Player 1";

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

        const bidTime = 10;

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
                started: false,
                active: false,

                order: [],

                position: 0,

                character: null,

                currentBid: 0,

                highestBidder: null,

                timeLeft: 10,

                timer: null,

                sold: false
            }
        };

        room.players[socket.id] = {
            id: socket.id,

            name,

            balance: startingBalance,

            team: [],

            rankSelections: {},

            givenUp: false
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

        console.log(
            "Room created:",
            roomCode
        );
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

        const room = getRoom(roomCode);

        if (!room) {
            socket.emit(
                "errorMessage",
                "Room not found."
            );

            return;
        }

        if (
            room.rank.started ||
            room.auction.started
        ) {
            socket.emit(
                "errorMessage",
                "Game has already started."
            );

            return;
        }

        const count =
            Object.keys(room.players).length;

        if (
            count >=
            room.settings.maxPlayers
        ) {
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

            name:
                name ||
                `Player ${count + 1}`,

            balance:
                room.settings.startingBalance,

            team: [],

            rankSelections: {},

            givenUp: false
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

        const room = getRoom(
            socket.roomCode
        );

        if (!room) return;

        if (
            socket.id !==
            room.host
        ) {
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

        const room =
            getRoom(socket.roomCode);

        if (!room) return;

        if (!room.rank.started) return;

        const player =
            room.players[socket.id];

        if (!player) return;

        const category =
            Number(data.categoryIndex);

        const character =
            String(data.character || "");

        if (
            !Number.isInteger(category) ||
            category < 0 ||
            category >= CATEGORIES.length
        ) {
            return;
        }

        if (
            category !==
            room.rank.categoryIndex
        ) {
            return;
        }

        if (!CHARACTERS.includes(character)) {

            socket.emit(
                "errorMessage",
                "Invalid character."
            );

            return;
        }

        /*
         * IMPORTANT:
         *
         * Different players are allowed
         * to select the same character.
         *
         * We store each player's choice
         * separately.
         */

        player.rankSelections[category] =
            character;

        io.to(room.code).emit(
            "rankSelectionMade",
            {
                playerId: socket.id,
                playerName: player.name,
                categoryIndex: category,
                character
            }
        );

        checkRankComplete(room);
    });

    /* =====================================================
       AUCTION BID
    ===================================================== */

    socket.on("auctionBid", () => {

        const room =
            getRoom(socket.roomCode);

        if (!room) return;

        const auction =
            room.auction;

        const player =
            room.players[socket.id];

        if (!player) return;

        if (!auction.started || !auction.active) {
            socket.emit(
                "errorMessage",
                "Auction is not active."
            );

            return;
        }

        if (player.team.length >= room.settings.teamSize) {
            socket.emit(
                "errorMessage",
                "Your team is already full."
            );

            return;
        }

        /*
         * If player gives up on this character,
         * they cannot bid again for this character.
         */

        if (player.givenUp) {
            socket.emit(
                "errorMessage",
                "You already gave up on this character."
            );

            return;
        }

        /*
         * Highest bidder cannot immediately
         * increase their own bid.
         */

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
            auction.currentBid +
            room.settings.bidAmount;

        if (
            player.balance <
            newBid
        ) {
            socket.emit(
                "errorMessage",
                "Not enough money."
            );

            return;
        }

        auction.currentBid =
            newBid;

        auction.highestBidder =
            socket.id;

        /*
         * New bidder is now active.
         * Other players who previously gave up
         * remain out of THIS character.
         */

        clearAuctionTimer(room);

        auction.timeLeft =
            room.settings.bidTime;

        startAuctionTimer(room);

        emitAuctionState(room);

        broadcastPlayers(room);
    });

    /* =====================================================
       GIVE UP
    ===================================================== */

    socket.on("auctionGiveUp", () => {

        const room =
            getRoom(socket.roomCode);

        if (!room) return;

        const auction =
            room.auction;

        const player =
            room.players[socket.id];

        if (!player) return;

        if (!auction.active) return;

        player.givenUp = true;

        io.to(room.code).emit(
            "auctionPlayerGaveUp",
            {
                playerId: socket.id,
                playerName: player.name,
                character: auction.character
            }
        );

        /*
         * If only one eligible bidder remains,
         * that player wins immediately.
         */

        const eligiblePlayers =
            Object.values(room.players)
                .filter(p =>
                    p.team.length <
                    room.settings.teamSize
                )
                .filter(p =>
                    !p.givenUp
                );

        /*
         * If there is already a bidder and
         * everybody else gives up, sell immediately.
         */

        if (
            auction.highestBidder &&
            eligiblePlayers.length === 1 &&
            eligiblePlayers[0].id ===
                auction.highestBidder
        ) {

            finishAuctionCharacter(
                room,
                false
            );

            return;
        }

        /*
         * If nobody has bid and everybody gives up,
         * character becomes unsold.
         */

        if (
            !auction.highestBidder &&
            eligiblePlayers.length === 0
        ) {

            finishAuctionCharacter(
                room,
                true
            );

            return;
        }

        emitAuctionState(room);
    });

    /* =====================================================
       UNSOLD BUTTON
    ===================================================== */

    socket.on("auctionUnsold", () => {

        const room =
            getRoom(socket.roomCode);

        if (!room) return;

        const auction =
            room.auction;

        if (!auction.active) return;

        /*
         * Unsold is only valid if nobody has bid.
         */

        if (auction.highestBidder) {

            socket.emit(
                "errorMessage",
                "A player has already bid. Use Give Up instead."
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

        const roomCode =
            socket.roomCode;

        if (!roomCode) return;

        const room =
            getRoom(roomCode);

        if (!room) return;

        const wasHost =
            room.host === socket.id;

        delete room.players[socket.id];

        /*
         * If the disconnected player was the
         * current highest bidder, remove them.
         */

        if (
            room.auction.highestBidder ===
            socket.id
        ) {

            room.auction.highestBidder =
                null;

            room.auction.currentBid =
                0;

            room.auction.timeLeft =
                room.settings.bidTime;

            if (room.auction.active) {
                clearAuctionTimer(room);
                startAuctionTimer(room);
            }
        }

        if (wasHost) {

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

        broadcastPlayers(room);

        if (room.auction.active) {
            emitAuctionState(room);
        }
    });
});

/* =========================================================
   START RANK GAME
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
            totalCategories: CATEGORIES.length,
            categoryName: CATEGORIES[0]
        }
    );
}

/* =========================================================
   CHECK RANK COMPLETE
========================================================= */

function checkRankComplete(room) {

    if (!room.rank.started) return;

    if (room.rank.advancing) return;

    const category =
        room.rank.categoryIndex;

    const players =
        Object.values(room.players);

    if (players.length < 2) return;

    /*
     * EVERY player must have selected
     * for the CURRENT category.
     */

    const everyoneSelected =
        players.every(player =>
            Object.prototype.hasOwnProperty.call(
                player.rankSelections,
                category
            )
        );

    if (!everyoneSelected) {

        io.to(room.code).emit(
            "rankWaiting",
            {
                categoryIndex: category,
                selectedCount:
                    players.filter(player =>
                        Object.prototype.hasOwnProperty.call(
                            player.rankSelections,
                            category
                        )
                    ).length,

                totalPlayers: players.length
            }
        );

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

        io.to(room.code).emit(
            "rankNextCategory",
            {
                categoryIndex:
                    room.rank.categoryIndex,

                totalCategories:
                    CATEGORIES.length,

                categoryName:
                    CATEGORIES[
                        room.rank.categoryIndex
                    ]
            }
        );

    }, 1200);
}

/* =========================================================
   FINISH RANK GAME
========================================================= */

function finishRankGame(room) {

    room.rank.started = false;

    room.rank.advancing = false;

    const results =
        Object.values(room.players)
            .map(player => {

                const selections =
                    {};

                CATEGORIES.forEach(
                    (_, index) => {

                        selections[index] =
                            player.rankSelections[index] ||
                            null;

                    }
                );

                return {
                    playerId: player.id,

                    playerName: player.name,

                    selections
                };
            });

    /*
     * Calculate a simple local team score.
     *
     * This gives the frontend a reliable
     * strongest-team result even if OpenAI
     * is not configured.
     */

    const teamScores =
        calculateRankTeamScores(
            results
        );

    let bestPlayerId = null;

    let bestScore = -Infinity;

    teamScores.forEach(team => {

        if (team.score > bestScore) {

            bestScore = team.score;

            bestPlayerId =
                team.playerId;
        }
    });

    const bestTeam =
        teamScores.find(
            team =>
                team.playerId ===
                bestPlayerId
        );

    io.to(room.code).emit(
        "rankGameFinished",
        {
            results,

            teamScores,

            bestTeam: bestTeam || null,

            categories: CATEGORIES
        }
    );
}

/* =========================================================
   LOCAL TEAM SCORE
========================================================= */

function calculateRankTeamScores(results) {

    /*
     * Higher-ranked characters get higher points.
     *
     * These are only used as a fallback score.
     * The frontend can also display AI analysis.
     */

    return results.map(player => {

        let score = 0;

        Object.entries(
            player.selections
        ).forEach(
            ([categoryIndex, character]) => {

                if (!character) return;

                /*
                 * A character selected by a player
                 * is worth a base score.
                 *
                 * Stronger named characters receive
                 * additional points.
                 */

                const categoryNumber =
                    Number(categoryIndex);

                score +=
                    100 +
                    categoryNumber * 2;

                const strongCharacters = [
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
                ];

                if (
                    strongCharacters.includes(
                        character
                    )
                ) {
                    score += 50;
                }
            }
        );

        return {
            playerId: player.playerId,
            playerName: player.playerName,
            score
        };
    });
}

/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    room.auction.started = true;

    room.auction.active = false;

    room.auction.position = 0;

    /*
     * RANDOM ORDER.
     *
     * Characters will NOT always appear
     * Naruto -> Sasuke -> Itachi...
     */

    room.auction.order =
        shuffle(CHARACTERS);

    Object.values(room.players)
        .forEach(player => {

            player.balance =
                room.settings.startingBalance;

            player.team = [];

            player.givenUp = false;

        });

    io.to(room.code).emit(
        "auctionStarted",
        {
            settings: room.settings
        }
    );

    broadcastPlayers(room);

    startAuctionCharacter(room);
}

/* =========================================================
   START NEXT AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    clearAuctionTimer(room);

    const auction =
        room.auction;

    /*
     * Check if everyone has a full team.
     */

    const allFull =
        Object.values(room.players)
            .every(player =>
                player.team.length >=
                room.settings.teamSize
            );

    if (allFull) {

        finishAuction(room);

        return;
    }

    /*
     * Skip finished order.
     */

    if (
        auction.position >=
        auction.order.length
    ) {

        finishAuction(room);

        return;
    }

    /*
     * Find a character that can still
     * be useful to at least one player.
     */

    const character =
        auction.order[
            auction.position
        ];

    auction.character =
        character;

    auction.currentBid = 0;

    auction.highestBidder = null;

    auction.timeLeft =
        room.settings.bidTime;

    auction.active = true;

    auction.sold = false;

    /*
     * Everyone starts as eligible for
     * the new character.
     */

    Object.values(room.players)
        .forEach(player => {
            player.givenUp = false;
        });

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    emitAuctionState(room);

    startAuctionTimer(room);
}

/* =========================================================
   AUCTION TIMER
========================================================= */

function startAuctionTimer(room) {

    clearAuctionTimer(room);

    const auction =
        room.auction;

    if (!auction.active) return;

    auction.timeLeft =
        Math.max(
            1,
            Number(auction.timeLeft) || 10
        );

    emitAuctionState(room);

    auction.timer =
        setInterval(() => {

            if (!auction.active) {

                clearAuctionTimer(room);

                return;
            }

            auction.timeLeft--;

            if (
                auction.timeLeft <= 0
            ) {

                auction.timeLeft = 0;

                emitAuctionState(room);

                clearAuctionTimer(room);

                /*
                 * Timer reaches zero:
                 *
                 * - If someone bid -> SOLD
                 * - If nobody bid -> UNSOLD
                 */

                finishAuctionCharacter(
                    room,
                    !auction.highestBidder
                );

                return;
            }

            emitAuctionState(room);

        }, 1000);
}

/* =========================================================
   FINISH AUCTION CHARACTER
========================================================= */

function finishAuctionCharacter(
    room,
    unsold
) {

    const auction =
        room.auction;

    if (!auction.active) return;

    auction.active = false;

    clearAuctionTimer(room);

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
            "auctionUnsoldResult",
            {
                character,

                characterName: character,

                message:
                    `${character} was UNSOLD.`
            }
        );

        auction.position++;

        setTimeout(() => {

            startAuctionCharacter(room);

        }, 1200);

        return;
    }

    const buyer =
        room.players[
            auction.highestBidder
        ];

    /*
     * Buyer disappeared before sale.
     */

    if (!buyer) {

        auction.currentBid = 0;

        auction.highestBidder = null;

        auction.position++;

        setTimeout(() => {
            startAuctionCharacter(room);
        }, 800);

        return;
    }

    const price =
        auction.currentBid;

    /*
     * IMPORTANT:
     *
     * Deduct the actual winning bid
     * from the buyer.
     */

    buyer.balance -= price;

    buyer.team.push(character);

    auction.sold = true;

    /*
     * Send full sale information to EVERYONE.
     */

    io.to(room.code).emit(
        "auctionSold",
        {
            character,

            characterName: character,

            buyerId: buyer.id,

            buyerName: buyer.name,

            price,

            remainingMoney:
                buyer.balance,

            team:
                [...buyer.team]
        }
    );

    broadcastPlayers(room);

    /*
     * Move to next character.
     */

    auction.position++;

    setTimeout(() => {

        startAuctionCharacter(room);

    }, 1500);
}

/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    clearAuctionTimer(room);

    room.auction.active = false;

    room.auction.started = false;

    const teams =
        Object.values(room.players)
            .map(player => ({
                playerId: player.id,
                playerName: player.name,
                team: [...player.team],
                remainingMoney: player.balance
            }));

    /*
     * Local fallback team score.
     */

    const scoredTeams =
        teams.map(team => {

            const powerCharacters = {
                "Madara": 100,
                "Naruto": 98,
                "Sasuke": 96,
                "Hashirama": 97,
                "Minato": 94,
                "Itachi": 93,
                "Obito": 91,
                "Nagato": 90,
                "Might Guy": 89,
                "Tobirama": 88,
                "Kakashi": 85,
                "Jiraiya": 83,
                "Might Duy": 70,
                "Rock Lee": 82
            };

            let score = 0;

            team.team.forEach(character => {

                score +=
                    powerCharacters[
                        character
                    ] || 60;

            });

            /*
             * Small bonus for remaining money.
             */

            score +=
                team.remainingMoney / 100;

            return {
                ...team,
                score
            };
        });

    scoredTeams.sort(
        (a, b) =>
            b.score - a.score
    );

    const bestTeam =
        scoredTeams[0] || null;

    io.to(room.code).emit(
        "auctionFinished",
        {
            teams: scoredTeams,

            bestTeam,

            message:
                bestTeam
                    ? `${bestTeam.playerName} has the strongest team based on the local evaluation.`
                    : "Auction finished."
        }
    );

    broadcastPlayers(room);
}

/* =========================================================
   SERVER START
========================================================= */

server.listen(PORT, () => {

    console.log(
        `Naruto game server running on port ${PORT}`
    );

});
