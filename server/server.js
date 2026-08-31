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

app.use(express.static(
    path.join(__dirname, "..")
));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "index.html")
    );
});

/* =========================================================
   GAME DATA
========================================================= */

const rooms = new Map();

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
    "Might Duy",
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
    "Chiyo",
    "Rasa",
    "Darui",
    "Chojuro"
];

/* =========================================================
   16 RANKING CATEGORIES
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

function getPlayers(room) {
    return Object.values(room.players).map(player => ({
        id: player.id,
        name: player.name,
        balance: player.balance,
        team: player.team
    }));
}

function broadcastPlayers(room) {
    io.to(room.code).emit("playersUpdated", {
        players: getPlayers(room)
    });
}

function getRoom(socket) {
    if (!socket.roomCode) return null;
    return rooms.get(socket.roomCode) || null;
}

function clearAuctionTimer(room) {
    if (
        room.auction &&
        room.auction.timer
    ) {
        clearTimeout(room.auction.timer);
        room.auction.timer = null;
    }
}

function getAuctionState(room) {
    const auction = room.auction;

    return {
        character: auction.character,
        currentBid: auction.currentBid,
        highestBidder: auction.highestBidder,
        highestBidderName:
            auction.highestBidder &&
            room.players[auction.highestBidder]
                ? room.players[auction.highestBidder].name
                : null,

        bidAmount: room.settings.bidAmount,
        bidTime: room.settings.bidTime,

        passedPlayers: [...auction.passedPlayers],

        players: getPlayers(room)
    };
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

        const roomCode =
            generateRoomCode();

        const name =
            String(data.name || "Player 1")
                .trim()
                .substring(0, 30);

        const gameMode =
            data.gameMode === "auction"
                ? "auction"
                : "rank";

        const maxPlayers =
            Math.max(
                2,
                Math.min(
                    Number(data.maxPlayers) || 6,
                    25
                )
            );

        const teamSize =
            Math.max(
                1,
                Math.min(
                    Number(data.teamSize) || 5,
                    CHARACTERS.length
                )
            );

        const startingBalance =
            Math.max(
                0,
                Number(data.startingBalance) || 1000
            );

        const bidAmount =
            Math.max(
                1,
                Number(data.bidAmount) || 50
            );

        const bidTime =
            Math.max(
                1,
                Number(data.bidTime) || 10
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
                timer: null,
                active: false,

                /*
                 * Players who gave up for
                 * CURRENT character only.
                 */
                passedPlayers: new Set()
            }
        };

        room.players[socket.id] = {

            id: socket.id,

            name,

            balance: startingBalance,

            team: [],

            rankSelections: {}
        };

        rooms.set(
            roomCode,
            room
        );

        socket.join(roomCode);

        socket.roomCode =
            roomCode;

        socket.emit(
            "roomCreated",
            {
                roomCode,
                isHost: true,
                gameMode,
                settings: room.settings
            }
        );

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

        const room =
            rooms.get(roomCode);

        if (!room) {
            socket.emit(
                "errorMessage",
                "Room not found."
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
            )
                .trim()
                .substring(0, 30);

        room.players[socket.id] = {

            id: socket.id,

            name,

            balance:
                room.settings.startingBalance,

            team: [],

            rankSelections: {}
        };

        socket.join(roomCode);

        socket.roomCode =
            roomCode;

        socket.emit(
            "roomJoined",
            {
                roomCode,
                isHost: false,
                gameMode: room.gameMode,
                settings: room.settings
            }
        );

        broadcastPlayers(room);
    });

    /* =====================================================
       START GAME
    ===================================================== */

    socket.on("startGame", () => {

        const room =
            getRoom(socket);

        if (!room) return;

        if (
            socket.id !==
            room.host
        ) {
            socket.emit(
                "errorMessage",
                "Only the host can start."
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
       RANK CHARACTER SELECT
    ===================================================== */

    socket.on("rankSelect", data => {

        const room =
            getRoom(socket);

        if (!room) return;

        if (!room.rank.started) return;

        const player =
            room.players[socket.id];

        if (!player) return;

        const category =
            Number(data?.categoryIndex);

        const character =
            data?.character;

        if (
            category !==
            room.rank.categoryIndex
        ) {
            return;
        }

        if (
            category < 0 ||
            category >= CATEGORIES.length
        ) {
            return;
        }

        if (
            !CHARACTERS.includes(character)
        ) {
            return;
        }

        /*
         * Same character can be selected
         * by multiple players.
         */

        player.rankSelections[category] =
            character;

        /*
         * IMPORTANT:
         * Do NOT broadcast the character.
         *
         * Only tell the player who selected it.
         */

        socket.emit(
            "rankSelectionAccepted",
            {
                categoryIndex: category,
                character
            }
        );

        checkRankCategoryComplete(
            room,
            category
        );
    });

    /* =====================================================
       AUCTION BID
    ===================================================== */

    socket.on("auctionBid", () => {

        const room =
            getRoom(socket);

        if (!room) return;

        const auction =
            room.auction;

        if (!auction.active) return;

        const player =
            room.players[socket.id];

        if (!player) return;

        /*
         * Player already gave up for
         * this character.
         */

        if (
            auction.passedPlayers.has(
                socket.id
            )
        ) {
            socket.emit(
                "errorMessage",
                "You already gave up on this character."
            );
            return;
        }

        /*
         * Player cannot bid against themselves.
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

        /*
         * Team already full.
         */

        if (
            player.team.length >=
            room.settings.teamSize
        ) {
            socket.emit(
                "errorMessage",
                "Your team is full."
            );
            return;
        }

        const newBid =
            auction.currentBid === 0
                ? room.settings.bidAmount
                : auction.currentBid +
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
         * A new bid means the player
         * who previously gave up is NOT
         * automatically restored.
         *
         * Their give-up remains for
         * this character.
         */

        resetAuctionTimer(room);

        io.to(room.code).emit(
            "auctionUpdated",
            getAuctionState(room)
        );

        broadcastPlayers(room);
    });

    /* =====================================================
       GIVE UP
    ===================================================== */

    socket.on("auctionGiveUp", () => {

        const room =
            getRoom(socket);

        if (!room) return;

        const auction =
            room.auction;

        if (!auction.active) return;

        const player =
            room.players[socket.id];

        if (!player) return;

        /*
         * Highest bidder cannot give up.
         * They already hold the highest bid.
         */

        if (
            auction.highestBidder ===
            socket.id
        ) {
            socket.emit(
                "errorMessage",
                "You are currently the highest bidder."
            );
            return;
        }

        if (
            auction.passedPlayers.has(
                socket.id
            )
        ) {
            return;
        }

        auction.passedPlayers.add(
            socket.id
        );

        socket.emit(
            "auctionPlayerPassed",
            {
                character:
                    auction.character
            }
        );

        io.to(room.code).emit(
            "auctionUpdated",
            getAuctionState(room)
        );

        /*
         * Check whether everybody
         * still eligible has given up.
         */

        checkAllPlayersPassed(room);
    });

    /* =====================================================
       UNSOLD
    ===================================================== */

    socket.on("auctionUnsold", () => {

        const room =
            getRoom(socket);

        if (!room) return;

        if (!room.auction.active) return;

        /*
         * Only allow explicit UNSOLD
         * when there is no bidder.
         */

        if (
            room.auction.highestBidder
        ) {
            socket.emit(
                "errorMessage",
                "A player is currently bidding."
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
            rooms.get(roomCode);

        if (!room) return;

        delete room.players[
            socket.id
        ];

        room.auction.passedPlayers.delete(
            socket.id
        );

        /*
         * If disconnected player was
         * highest bidder, cancel that
         * highest bid.
         */

        if (
            room.auction.highestBidder ===
            socket.id
        ) {

            room.auction.highestBidder =
                null;

            room.auction.currentBid =
                0;
        }

        if (
            room.host ===
            socket.id
        ) {

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

                rooms.delete(
                    roomCode
                );

                return;
            }
        }

        broadcastPlayers(room);

        if (
            room.auction.active
        ) {
            io.to(room.code).emit(
                "auctionUpdated",
                getAuctionState(room)
            );

            checkAllPlayersPassed(room);
        }
    });
});

/* =========================================================
   RANK GAME
========================================================= */

function startRankGame(room) {

    room.rank.started = true;

    room.rank.categoryIndex = 0;

    room.rank.completedCategories =
        new Set();

    Object.values(
        room.players
    ).forEach(player => {

        player.rankSelections = {};

    });

    io.to(room.code).emit(
        "rankGameStarted",
        {
            categoryIndex: 0,
            totalCategories:
                CATEGORIES.length,
            categoryName:
                CATEGORIES[0]
        }
    );
}

/* =========================================================
   CHECK RANK CATEGORY
========================================================= */

function checkRankCategoryComplete(
    room,
    category
) {

    if (
        category !==
        room.rank.categoryIndex
    ) {
        return;
    }

    if (
        room.rank.completedCategories
            .has(category)
    ) {
        return;
    }

    const players =
        Object.values(room.players);

    /*
     * EVERY player must select.
     */

    const everyoneSelected =
        players.length > 0 &&
        players.every(
            player =>
                player.rankSelections[
                    category
                ]
        );

    if (!everyoneSelected) {

        /*
         * Tell each player only how many
         * selections have been received.
         */

        const selectedCount =
            players.filter(
                player =>
                    player.rankSelections[
                        category
                    ]
            ).length;

        io.to(room.code).emit(
            "rankWaiting",
            {
                categoryIndex: category,
                selectedCount,
                totalPlayers:
                    players.length
            }
        );

        return;
    }

    room.rank.completedCategories.add(
        category
    );

    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex: category
        }
    );

    setTimeout(() => {

        /*
         * Make sure room still exists.
         */

        if (!rooms.has(room.code)) {
            return;
        }

        /*
         * Make sure nobody restarted
         * or changed the category.
         */

        if (
            room.rank.categoryIndex !==
            category
        ) {
            return;
        }

        /*
         * Last category.
         */

        if (
            category ===
            CATEGORIES.length - 1
        ) {

            finishRankGame(room);

            return;
        }

        room.rank.categoryIndex =
            category + 1;

        const next =
            room.rank.categoryIndex;

        io.to(room.code).emit(
            "rankNextCategory",
            {
                categoryIndex: next,
                totalCategories:
                    CATEGORIES.length,
                categoryName:
                    CATEGORIES[next]
            }
        );

    }, 1200);
}

/* =========================================================
   FINISH RANK GAME
========================================================= */

function finishRankGame(room) {

    room.rank.started =
        false;

    const results =
        Object.values(room.players)
            .map(player => ({
                playerId: player.id,
                playerName: player.name,
                selections:
                    player.rankSelections
            }));

    io.to(room.code).emit(
        "rankGameFinished",
        {
            results,
            categories: CATEGORIES
        }
    );
}

/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    room.auction.index = 0;

    room.auction.active = true;

    Object.values(
        room.players
    ).forEach(player => {

        player.balance =
            room.settings.startingBalance;

        player.team = [];

    });

    io.to(room.code).emit(
        "auctionStarted",
        {
            settings: room.settings
        }
    );

    startAuctionCharacter(room);
}

/* =========================================================
   START AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    const auction =
        room.auction;

    clearAuctionTimer(room);

    /*
     * Check if auction is complete.
     */

    if (
        auction.index >=
        CHARACTERS.length
    ) {

        finishAuction(room);

        return;
    }

    /*
     * If all teams are full,
     * finish auction.
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

    /*
     * NEW CHARACTER:
     *
     * Everyone is allowed to bid again.
     *
     * This is the important fix for
     * Give Up.
     */

    auction.passedPlayers =
        new Set();

    auction.character =
        CHARACTERS[
            auction.index
        ];

    auction.currentBid = 0;

    auction.highestBidder = null;

    auction.active = true;

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    resetAuctionTimer(room);
}

/* =========================================================
   AUCTION TIMER
========================================================= */

function resetAuctionTimer(room) {

    const auction =
        room.auction;

    clearAuctionTimer(room);

    if (!auction.active) {
        return;
    }

    /*
     * Send immediate timer reset.
     */

    io.to(room.code).emit(
        "auctionTimer",
        {
            seconds:
                room.settings.bidTime
        }
    );

    let remaining =
        room.settings.bidTime;

    /*
     * Countdown broadcast.
     */

    auction.timer =
        setTimeout(
            function tick() {

                if (!auction.active) {
                    return;
                }

                remaining--;

                io.to(room.code).emit(
                    "auctionTimer",
                    {
                        seconds:
                            remaining
                    }
                );

                if (remaining <= 0) {

                    /*
                     * Timer finished.
                     */

                    if (
                        auction.highestBidder
                    ) {

                        finishAuctionCharacter(
                            room,
                            false
                        );

                    } else {

                        finishAuctionCharacter(
                            room,
                            true
                        );
                    }

                    return;
                }

                auction.timer =
                    setTimeout(
                        tick,
                        1000
                    );

            },
            1000
        );
}

/* =========================================================
   CHECK EVERYONE GAVE UP
========================================================= */

function checkAllPlayersPassed(room) {

    const auction =
        room.auction;

    if (!auction.active) {
        return;
    }

    const players =
        Object.values(room.players);

    if (players.length === 0) {
        return;
    }

    /*
     * A player with a full team is not
     * eligible for this auction.
     */

    const eligible =
        players.filter(
            player =>
                player.team.length <
                room.settings.teamSize
        );

    if (eligible.length === 0) {

        finishAuction(room);

        return;
    }

    /*
     * If someone currently has the highest
     * bid, that player is still active.
     */

    const everyonePassed =
        eligible.every(
            player =>
                auction.passedPlayers.has(
                    player.id
                ) ||
                auction.highestBidder ===
                    player.id
        );

    /*
     * If there is no highest bidder and
     * everybody has given up:
     *
     * UNSOLD.
     */

    if (
        !auction.highestBidder &&
        everyonePassed
    ) {

        finishAuctionCharacter(
            room,
            true
        );
    }
}

/* =========================================================
   FINISH ONE AUCTION CHARACTER
========================================================= */

function finishAuctionCharacter(
    room,
    unsold
) {

    const auction =
        room.auction;

    if (!auction.active) {
        return;
    }

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
            "auctionSold",
            {
                character,
                sold: false,
                unsold: true,
                winnerId: null,
                winnerName: null,
                price: 0
            }
        );

        setTimeout(() => {

            if (
                rooms.has(room.code)
            ) {

                auction.index++;

                startAuctionCharacter(
                    room
                );
            }

        }, 1500);

        return;
    }

    const winner =
        room.players[
            auction.highestBidder
        ];

    /*
     * Winner disconnected.
     */

    if (!winner) {

        auction.highestBidder =
            null;

        auction.currentBid =
            0;

        setTimeout(() => {

            if (
                rooms.has(room.code)
            ) {

                startAuctionCharacter(
                    room
                );
            }

        }, 500);

        return;
    }

    const price =
        auction.currentBid;

    /*
     * Deduct money.
     */

    winner.balance -= price;

    /*
     * Add character to team.
     */

    winner.team.push({
        character,
        price
    });

    /*
     * VERY IMPORTANT:
     * Send winner's name directly.
     *
     * This prevents "undefined".
     */

    io.to(room.code).emit(
        "auctionSold",
        {
            character,
            sold: true,
            unsold: false,

            winnerId:
                winner.id,

            winnerName:
                winner.name,

            price,

            remainingMoney:
                winner.balance,

            team:
                winner.team
        }
    );

    broadcastPlayers(room);

    setTimeout(() => {

        if (
            rooms.has(room.code)
        ) {

            auction.index++;

            startAuctionCharacter(
                room
            );
        }

    }, 1800);
}

/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    clearAuctionTimer(room);

    room.auction.active =
        false;

    room.auction.character =
        null;

    /*
     * Send final teams.
     */

    const teams =
        Object.values(room.players)
            .map(player => ({
                playerId: player.id,
                playerName: player.name,
                balance: player.balance,
                team: player.team
            }));

    io.to(room.code).emit(
        "auctionFinished",
        {
            teams
        }
    );
}

/* =========================================================
   SERVER START
========================================================= */

server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);
