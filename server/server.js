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

/* =========================================================
   EXPRESS
========================================================= */

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
   GAME STORAGE
========================================================= */

const rooms = new Map();


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


/* =========================================================
   RANK CATEGORIES - 16
========================================================= */

const RANK_CATEGORIES = [
    "Speed",
    "Strength",
    "Battle IQ",
    "Chakra",
    "Taijutsu",
    "Ninjutsu",
    "Genjutsu",
    "Durability",
    "Stamina",
    "Leadership",
    "Intelligence",
    "Sealing",
    "Healing",
    "Defense",
    "Attack",
    "Overall"
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


function getRoomPlayers(room) {

    return Object.values(room.players).map(player => ({
        id: player.id,
        name: player.name,
        balance: player.balance,
        team: player.team
    }));
}


function broadcastPlayers(room) {

    io.to(room.code).emit(
        "playersUpdated",
        {
            players: getRoomPlayers(room)
        }
    );
}


function getAuctionState(room) {

    const auction = room.auction;

    return {
        index: auction.index,
        character: auction.character,
        currentBid: auction.currentBid,
        highestBidder: auction.highestBidder,
        highestBidderName:
            auction.highestBidder &&
            room.players[auction.highestBidder]
                ? room.players[auction.highestBidder].name
                : null,

        bidTime: room.settings.bidTime,

        teamSize: room.settings.teamSize,

        players: getRoomPlayers(room)
    };
}


/* =========================================================
   SOCKET CONNECTION
========================================================= */

io.on("connection", socket => {

    console.log(
        "Connected:",
        socket.id
    );


    /* =====================================================
       CREATE ROOM
    ===================================================== */

    socket.on("createRoom", data => {

        data = data || {};

        const roomCode =
            generateRoomCode();

        const playerName =
            String(data.name || "Player 1")
                .trim()
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
                Number(data.bidTime) || 10,
                60
            )
        );


        const settings = {
            maxPlayers,
            teamSize,
            startingBalance,
            bidAmount,
            bidTime
        };


        const room = {

            code: roomCode,

            host: socket.id,

            gameMode,

            settings,

            players: {},

            rank: {
                categoryIndex: 0,
                started: false,
                categoryLocks: {}
            },

            auction: {
                index: 0,
                character: null,
                currentBid: 0,
                highestBidder: null,
                timer: null,
                active: false,
                finishing: false
            }
        };


        room.players[socket.id] = {

            id: socket.id,

            name: playerName,

            balance:
                startingBalance,

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


        socket.isHost = true;


        socket.emit(
            "roomCreated",
            {
                roomCode,
                isHost: true,
                gameMode,
                settings
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


        const playerCount =
            Object.keys(room.players).length;


        if (
            playerCount >=
            room.settings.maxPlayers
        ) {

            socket.emit(
                "errorMessage",
                "Room is full."
            );

            return;
        }


        const playerName =
            String(
                data.name ||
                `Player ${playerCount + 1}`
            )
            .trim()
            .substring(0, 30);


        room.players[socket.id] = {

            id: socket.id,

            name: playerName,

            balance:
                room.settings.startingBalance,

            team: [],

            rankSelections: {}
        };


        socket.join(roomCode);

        socket.roomCode =
            roomCode;


        socket.isHost = false;


        socket.emit(
            "roomJoined",
            {
                roomCode,
                isHost: false,
                gameMode:
                    room.gameMode,
                settings:
                    room.settings
            }
        );


        broadcastPlayers(room);


        io.to(room.code).emit(
            "playerJoined",
            {
                player:
                    room.players[socket.id]
            }
        );
    });


    /* =====================================================
       START GAME
    ===================================================== */

    socket.on("startGame", () => {

        const room =
            rooms.get(socket.roomCode);


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


        const playerCount =
            Object.keys(room.players).length;


        if (playerCount < 2) {

            socket.emit(
                "errorMessage",
                "At least 2 players are required."
            );

            return;
        }


        if (
            room.gameMode ===
            "rank"
        ) {

            startRankGame(room);

        } else {

            startAuction(room);
        }
    });


    /* =====================================================
       RANK SELECTION
    ===================================================== */

    socket.on("rankSelect", data => {

        data = data || {};

        const room =
            rooms.get(socket.roomCode);


        if (!room) return;


        if (!room.rank.started) {

            socket.emit(
                "errorMessage",
                "Rank game has not started."
            );

            return;
        }


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
            category >= RANK_CATEGORIES.length
        ) {

            return;
        }


        if (
            !CHARACTERS.includes(character)
        ) {

            return;
        }


        if (
            category !==
            room.rank.categoryIndex
        ) {

            socket.emit(
                "errorMessage",
                "This category is not active."
            );

            return;
        }


        /*
         * IMPORTANT:
         *
         * Different players ARE allowed
         * to select the same character.
         */

        player.rankSelections[category] =
            character;


        io.to(room.code).emit(
            "rankSelectionMade",
            {
                playerId:
                    socket.id,

                playerName:
                    player.name,

                categoryIndex:
                    category,

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
            rooms.get(socket.roomCode);


        if (!room) return;


        const auction =
            room.auction;


        if (
            !auction.active ||
            auction.finishing
        ) {

            return;
        }


        const player =
            room.players[socket.id];


        if (!player) return;


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
                "Not enough balance."
            );

            return;
        }


        auction.currentBid =
            newBid;


        auction.highestBidder =
            socket.id;


        resetAuctionTimer(room);


        io.to(room.code).emit(
            "auctionUpdated",
            getAuctionState(room)
        );
    });


    /* =====================================================
       MANUAL UNSOLD
    ===================================================== */

    socket.on("auctionUnsold", () => {

        const room =
            rooms.get(socket.roomCode);


        if (!room) return;


        if (
            socket.id !== room.host
        ) {

            socket.emit(
                "errorMessage",
                "Only the host can mark a player UNSOLD."
            );

            return;
        }


        if (
            !room.auction.active ||
            room.auction.finishing
        ) {

            return;
        }


        finishAuctionCharacter(
            room,
            true
        );
    });


    /* =====================================================
       HOST CHANGE
    ===================================================== */

    socket.on("claimHost", () => {

        const room =
            rooms.get(socket.roomCode);


        if (!room) return;


        if (!room.players[socket.id]) {
            return;
        }


        room.host =
            socket.id;


        io.to(room.code).emit(
            "hostChanged",
            {
                host:
                    socket.id
            }
        );
    });


    /* =====================================================
       DISCONNECT
    ===================================================== */

    socket.on("disconnect", () => {

        console.log(
            "Disconnected:",
            socket.id
        );


        const roomCode =
            socket.roomCode;


        if (!roomCode) return;


        const room =
            rooms.get(roomCode);


        if (!room) return;


        delete room.players[
            socket.id
        ];


        /*
         * If nobody remains,
         * delete the room.
         */

        if (
            Object.keys(room.players).length === 0
        ) {

            if (room.auction.timer) {

                clearTimeout(
                    room.auction.timer
                );
            }


            rooms.delete(roomCode);

            return;
        }


        /*
         * If host leaves,
         * automatically choose another host.
         */

        if (
            room.host ===
            socket.id
        ) {

            const remainingPlayers =
                Object.keys(room.players);


            room.host =
                remainingPlayers[0];


            io.to(room.code).emit(
                "hostChanged",
                {
                    host:
                        room.host
                }
            );
        }


        /*
         * If the disconnected player was
         * highest bidder, cancel that bid.
         */

        if (
            room.auction.highestBidder ===
            socket.id
        ) {

            room.auction.highestBidder =
                null;

            room.auction.currentBid =
                0;


            if (room.auction.active) {

                resetAuctionTimer(
                    room
                );
            }
        }


        broadcastPlayers(room);
    });
});


/* =========================================================
   START RANK GAME
========================================================= */

function startRankGame(room) {

    room.rank.started =
        true;

    room.rank.categoryIndex =
        0;

    room.rank.categoryLocks =
        {};


    Object.values(room.players).forEach(
        player => {

            player.rankSelections =
                {};
        }
    );


    io.to(room.code).emit(
        "rankGameStarted",
        {
            categoryIndex: 0,

            categoryName:
                RANK_CATEGORIES[0],

            totalCategories:
                RANK_CATEGORIES.length,

            categories:
                RANK_CATEGORIES
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
        room.rank.categoryLocks[category]
    ) {

        return;
    }


    const players =
        Object.values(room.players);


    const complete =
        players.length >= 2 &&
        players.every(
            player =>
                player.rankSelections[
                    category
                ]
        );


    if (!complete) {

        broadcastPlayers(room);

        return;
    }


    room.rank.categoryLocks[category] =
        true;


    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex:
                category,

            categoryName:
                RANK_CATEGORIES[category]
        }
    );


    setTimeout(() => {

        if (!room.rank.started) {
            return;
        }


        if (
            category >=
            RANK_CATEGORIES.length - 1
        ) {

            finishRankGame(room);

            return;
        }


        const nextCategory =
            category + 1;


        room.rank.categoryIndex =
            nextCategory;


        io.to(room.code).emit(
            "rankNextCategory",
            {
                categoryIndex:
                    nextCategory,

                categoryName:
                    RANK_CATEGORIES[
                        nextCategory
                    ],

                totalCategories:
                    RANK_CATEGORIES.length
            }
        );

    }, 1000);
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

                playerId:
                    player.id,

                playerName:
                    player.name,

                selections:
                    player.rankSelections
            }));


    /*
     * Frontend can use these selections
     * to calculate/display the AI-style
     * best overall team.
     */

    io.to(room.code).emit(
        "rankGameFinished",
        {
            results,

            categories:
                RANK_CATEGORIES
        }
    );
}


/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    room.auction.index =
        0;

    room.auction.active =
        true;

    room.auction.finishing =
        false;


    Object.values(room.players).forEach(
        player => {

            player.balance =
                room.settings.startingBalance;

            player.team =
                [];
        }
    );


    io.to(room.code).emit(
        "auctionStarted",
        {
            settings:
                room.settings,

            characters:
                CHARACTERS.length
        }
    );


    startAuctionCharacter(room);
}


/* =========================================================
   START NEXT AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    const auction =
        room.auction;


    /*
     * Stop old timer.
     */

    if (auction.timer) {

        clearTimeout(
            auction.timer
        );

        auction.timer =
            null;
    }


    /*
     * Check if all teams are full.
     */

    const allTeamsFull =
        Object.values(room.players).every(
            player =>
                player.team.length >=
                room.settings.teamSize
        );


    if (allTeamsFull) {

        finishAuction(room);

        return;
    }


    /*
     * Check character list finished.
     */

    if (
        auction.index >=
        CHARACTERS.length
    ) {

        finishAuction(room);

        return;
    }


    /*
     * Find next character.
     */

    auction.character =
        CHARACTERS[
            auction.index
        ];


    auction.currentBid =
        0;

    auction.highestBidder =
        null;

    auction.active =
        true;

    auction.finishing =
        false;


    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );


    /*
     * 10 second countdown.
     */

    resetAuctionTimer(room);
}


/* =========================================================
   AUCTION TIMER
========================================================= */

function resetAuctionTimer(room) {

    const auction =
        room.auction;


    if (auction.timer) {

        clearTimeout(
            auction.timer
        );
    }


    const seconds =
        room.settings.bidTime;


    io.to(room.code).emit(
        "auctionTimer",
        {
            seconds
        }
    );


    auction.timer =
        setTimeout(() => {

            if (
                !auction.active ||
                auction.finishing
            ) {

                return;
            }


            /*
             * Nobody bid:
             * character becomes UNSOLD.
             */

            finishAuctionCharacter(
                room,
                true
            );

        }, seconds * 1000);
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


    if (
        auction.finishing
    ) {

        return;
    }


    auction.finishing =
        true;


    auction.active =
        false;


    if (auction.timer) {

        clearTimeout(
            auction.timer
        );

        auction.timer =
            null;
    }


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

                bid: 0,

                playerId: null,

                playerName: null
            }
        );


        auction.index++;


        setTimeout(() => {

            startAuctionCharacter(
                room
            );

        }, 1000);


        return;
    }


    /*
     * SOLD
     */

    const winner =
        room.players[
            auction.highestBidder
        ];


    if (!winner) {

        auction.index++;


        setTimeout(() => {

            startAuctionCharacter(
                room
            );

        }, 500);


        return;
    }


    const price =
        auction.currentBid;


    /*
     * Safety check.
     */

    if (
        winner.balance <
        price
    ) {

        io.to(room.code).emit(
            "auctionSold",
            {
                character,

                sold: false,

                unsold: true,

                bid: 0,

                playerId: null,

                playerName: null
            }
        );


        auction.index++;


        setTimeout(() => {

            startAuctionCharacter(
                room
            );

        }, 1000);


        return;
    }


    /*
     * Deduct money.
     */

    winner.balance -=
        price;


    /*
     * Add character to team.
     */

    winner.team.push({
        name: character,
        price
    });


    io.to(room.code).emit(
        "auctionSold",
        {
            character,

            sold: true,

            unsold: false,

            bid: price,

            playerId:
                winner.id,

            playerName:
                winner.name,

            balance:
                winner.balance,

            team:
                winner.team
        }
    );


    broadcastPlayers(room);


    auction.index++;


    /*
     * If winner's team is full,
     * continue with another character.
     */

    setTimeout(() => {

        startAuctionCharacter(
            room
        );

    }, 1000);
}


/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    const auction =
        room.auction;


    if (auction.timer) {

        clearTimeout(
            auction.timer
        );

        auction.timer =
            null;
    }


    auction.active =
        false;

    auction.finishing =
        false;


    const results =
        Object.values(room.players)
            .map(player => ({

                playerId:
                    player.id,

                playerName:
                    player.name,

                balance:
                    player.balance,

                team:
                    player.team
            }));


    /*
     * Final results.
     */

    io.to(room.code).emit(
        "auctionFinished",
        {
            results,

            teamSize:
                room.settings.teamSize,

            startingBalance:
                room.settings.startingBalance
        }
    );
}


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/health", (req, res) => {

    res.json({
        status: "ok",
        game: "Naruto Character Rank & Auction",
        rooms: rooms.size
    });
});


/* =========================================================
   SERVER START
========================================================= */

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Naruto game server running on port ${PORT}`
        );
    }
);
