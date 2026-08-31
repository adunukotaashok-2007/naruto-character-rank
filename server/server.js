/* =========================================================
   NARUTO CHARACTER GAMES
   COMPLETE MULTIPLAYER SERVER
   ========================================================= */

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


/* =========================================================
   PORT
   ========================================================= */

const PORT = process.env.PORT || 10000;


/* =========================================================
   SERVE WEBSITE
   ========================================================= */

app.use(express.static(path.join(__dirname, "..")));


/* =========================================================
   BASIC ROUTES
   ========================================================= */

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "index.html")
    );
});


app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        game: "Naruto Character Games"
    });
});


/* =========================================================
   CHARACTERS
   ========================================================= */

const characters = [
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
    "Nagato / Pain",
    "Obito"
];


/* =========================================================
   RANK CATEGORIES
   ========================================================= */

const rankCategories = [
    {
        id: "speed",
        name: "⚡ SPEED"
    },
    {
        id: "strength",
        name: "💪 STRENGTH"
    },
    {
        id: "intelligence",
        name: "🧠 INTELLIGENCE"
    },
    {
        id: "chakra",
        name: "🔵 CHAKRA"
    },
    {
        id: "battle",
        name: "⚔️ BATTLE SKILL"
    }
];


/* =========================================================
   ROOMS
   ========================================================= */

const rooms = {};


/* =========================================================
   ROOM CODE
   ========================================================= */

function generateRoomCode() {

    let code;

    do {

        code =
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

    } while (rooms[code]);

    return code;
}


/* =========================================================
   FIND PLAYER
   ========================================================= */

function findPlayer(room, socketId) {

    if (!room) return null;

    return room.players.find(
        player => player.id === socketId
    );
}


/* =========================================================
   PLAYER DATA
   ========================================================= */

function publicPlayer(player) {

    return {
        id: player.id,
        name: player.name,
        balance: player.balance,
        team: player.team,
        teamCount: player.team.length
    };
}


/* =========================================================
   SEND PLAYERS
   ========================================================= */

function sendPlayers(roomCode) {

    const room = rooms[roomCode];

    if (!room) return;

    io.to(roomCode).emit("playersUpdated", {
        players:
            room.players.map(publicPlayer)
    });
}


/* =========================================================
   AUCTION TIMER CLEANUP
   ========================================================= */

function stopAuctionTimer(room) {

    if (!room || !room.auction) return;

    if (room.auction.timer) {

        clearInterval(
            room.auction.timer
        );

        room.auction.timer = null;
    }
}


/* =========================================================
   AUCTION UPDATE
   ========================================================= */

function sendAuctionUpdate(roomCode) {

    const room = rooms[roomCode];

    if (!room || !room.auction) return;

    room.players.forEach(player => {

        const canBid =
            player.team.length < 5 &&
            player.balance >=
                room.auction.currentBid + 50 &&
            player.id !==
                room.auction.highestBidder;

        io.to(player.id).emit(
            "auctionUpdate",
            {
                character:
                    room.auction.character,

                currentBid:
                    room.auction.currentBid,

                highestBidder:
                    room.auction.highestBidder
                        ? (
                            room.players.find(
                                p =>
                                    p.id ===
                                    room.auction.highestBidder
                            ) || {}
                        ).name || null
                        : null,

                highestBidderId:
                    room.auction.highestBidder,

                timeLeft:
                    room.auction.timeLeft,

                myBalance:
                    player.balance,

                myTeamCount:
                    player.team.length,

                canBid,

                players:
                    room.players.map(
                        publicPlayer
                    )
            }
        );
    });
}


/* =========================================================
   START NEXT AUCTION
   ========================================================= */

function startNextAuction(roomCode) {

    const room = rooms[roomCode];

    if (!room) return;

    stopAuctionTimer(room);

    /*
       If every player already has 5,
       finish immediately.
    */

    const everyoneHasFive =
        room.players.length > 0 &&
        room.players.every(
            player =>
                player.team.length >= 5
        );

    if (everyoneHasFive) {

        finishAuctionGame(roomCode);

        return;
    }


    /*
       Find next character that has not
       already been auctioned.
    */

    if (
        room.auctionIndex >=
        characters.length
    ) {

        finishAuctionGame(roomCode);

        return;
    }


    const character =
        characters[
            room.auctionIndex
        ];


    /* =====================================
       NEW AUCTION
    ===================================== */

    room.auction = {

        character,

        currentBid: 0,

        highestBidder: null,

        timeLeft: 15,

        timer: null
    };


    io.to(roomCode).emit(
        "auctionStarted",
        {
            character,
            index:
                room.auctionIndex,
            total:
                characters.length
        }
    );


    sendAuctionUpdate(roomCode);


    /* =====================================
       15 SECOND TIMER
    ===================================== */

    room.auction.timer =
        setInterval(() => {

            if (
                !room.auction
            ) {

                return;
            }


            room.auction.timeLeft--;


            sendAuctionUpdate(
                roomCode
            );


            if (
                room.auction.timeLeft <= 0
            ) {

                finishAuction(
                    roomCode
                );
            }

        }, 1000);
}


/* =========================================================
   FINISH CURRENT CHARACTER AUCTION
   ========================================================= */

function finishAuction(roomCode) {

    const room = rooms[roomCode];

    if (!room || !room.auction) {
        return;
    }


    stopAuctionTimer(room);


    const auction =
        room.auction;


    /* =====================================
       UNSOLD
    ===================================== */

    if (!auction.highestBidder) {

        io.to(roomCode).emit(
            "auctionResult",
            {
                character:
                    auction.character,

                sold: false,

                winner: null,

                bid: 0
            }
        );

    }


    /* =====================================
       SOLD
    ===================================== */

    else {

        const winner =
            room.players.find(
                player =>
                    player.id ===
                    auction.highestBidder
            );


        if (winner) {

            /*
               Safety check
            */

            if (
                winner.team.length < 5 &&
                winner.balance >=
                    auction.currentBid
            ) {

                winner.balance -=
                    auction.currentBid;

                winner.team.push(
                    auction.character
                );


                io.to(roomCode).emit(
                    "auctionResult",
                    {
                        character:
                            auction.character,

                        sold: true,

                        winner:
                            winner.name,

                        bid:
                            auction.currentBid
                    }
                );

            } else {

                io.to(roomCode).emit(
                    "auctionResult",
                    {
                        character:
                            auction.character,

                        sold: false,

                        winner: null,

                        bid: 0
                    }
                );
            }
        }
    }


    /* =====================================
       CLEAR CURRENT AUCTION
    ===================================== */

    room.auction = null;


    sendPlayers(roomCode);


    /* =====================================
       CHECK 5 PLAYER TEAM LIMIT
    ===================================== */

    const everyoneHasFive =
        room.players.length > 0 &&
        room.players.every(
            player =>
                player.team.length >= 5
        );


    if (everyoneHasFive) {

        finishAuctionGame(
            roomCode
        );

        return;
    }


    /* =====================================
       NEXT CHARACTER
    ===================================== */

    room.auctionIndex++;


    if (
        room.auctionIndex >=
        characters.length
    ) {

        finishAuctionGame(
            roomCode
        );

        return;
    }


    /*
       Small delay before next character
    */

    setTimeout(() => {

        startNextAuction(
            roomCode
        );

    }, 1500);
}


/* =========================================================
   FINISH ENTIRE AUCTION GAME
   ========================================================= */

function finishAuctionGame(roomCode) {

    const room = rooms[roomCode];

    if (!room) return;


    stopAuctionTimer(room);


    /*
       Rank by number of characters first,
       then remaining balance.
    */

    const ranking =
        room.players
            .map(player => ({

                id:
                    player.id,

                name:
                    player.name,

                balance:
                    player.balance,

                team:
                    player.team,

                teamCount:
                    player.team.length
            }))
            .sort((a, b) => {

                if (
                    b.teamCount !==
                    a.teamCount
                ) {

                    return (
                        b.teamCount -
                        a.teamCount
                    );
                }

                return (
                    b.balance -
                    a.balance
                );
            });


    io.to(roomCode).emit(
        "auctionFinished",
        {
            ranking
        }
    );


    room.gameStarted = false;

    room.auction = null;
}


/* =========================================================
   START AUCTION GAME
   ========================================================= */

function startAuctionGame(roomCode) {

    const room = rooms[roomCode];

    if (!room) return;


    room.auctionIndex = 0;

    room.auction = null;


    /*
       Reset all players
    */

    room.players.forEach(
        player => {

            player.balance = 1000;

            player.team = [];
        }
    );


    room.gameStarted = true;


    io.to(roomCode).emit(
        "auctionGameStarted"
    );


    sendPlayers(roomCode);


    setTimeout(() => {

        startNextAuction(
            roomCode
        );

    }, 1000);
}


/* =========================================================
   RANK GAME
   ========================================================= */

function startRankGame(roomCode) {

    const room = rooms[roomCode];

    if (!room) return;


    room.rankIndex = 0;

    room.rankAnswers = {};


    room.gameStarted = true;


    sendRankCategory(
        roomCode
    );
}


/* =========================================================
   SEND RANK CATEGORY
   ========================================================= */

function sendRankCategory(roomCode) {

    const room = rooms[roomCode];

    if (!room) return;


    if (
        room.rankIndex >=
        rankCategories.length
    ) {

        finishRankGame(
            roomCode
        );

        return;
    }


    const category =
        rankCategories[
            room.rankIndex
        ];


    room.rankAnswers = {};


    io.to(roomCode).emit(
        "gameStarted",
        {
            game: "rank",

            category:
                category.id,

            categoryName:
                category.name
        }
    );
}


/* =========================================================
   FINISH RANK CATEGORY
   ========================================================= */

function finishRankCategory(roomCode) {

    const room = rooms[roomCode];

    if (!room) return;


    const category =
        rankCategories[
            room.rankIndex
        ];


    const players =
        room.players.map(player => ({

            player:
                player.name,

            option:
                room.rankAnswers[
                    player.id
                ] || "No answer",

            id:
                player.id
        }));


    io.to(roomCode).emit(
        "rankResult",
        {
            category:
                category.name,

            players
        }
    );
}


/* =========================================================
   FINISH RANK GAME
   ========================================================= */

function finishRankGame(roomCode) {

    const room = rooms[roomCode];

    if (!room) return;


    room.gameStarted = false;


    io.to(roomCode).emit(
        "rankFinished",
        {
            players:
                room.players.map(
                    publicPlayer
                )
        }
    );
}


/* =========================================================
   SOCKET CONNECTION
   ========================================================= */

io.on("connection", socket => {

    console.log(
        "Connected:",
        socket.id
    );


    /* =====================================
       CREATE ROOM
    ===================================== */

    socket.on(
        "createRoom",
        data => {

            const name =
                String(
                    data?.playerName || ""
                ).trim();

            const game =
                data?.game === "auction"
                    ? "auction"
                    : "rank";


            if (!name) {

                socket.emit(
                    "roomError",
                    "Enter your name."
                );

                return;
            }


            const roomCode =
                generateRoomCode();


            rooms[roomCode] = {

                game,

                hostId:
                    socket.id,

                players: [],

                gameStarted:
                    false,

                auctionIndex:
                    0,

                auction:
                    null,

                rankIndex:
                    0,

                rankAnswers:
                    {}
            };


            const player = {

                id:
                    socket.id,

                name,

                balance:
                    1000,

                team: []
            };


            rooms[roomCode]
                .players
                .push(player);


            socket.join(
                roomCode
            );


            socket.data.roomCode =
                roomCode;


            socket.emit(
                "roomCreated",
                {
                    roomCode,

                    players:
                        rooms[
                            roomCode
                        ].players.map(
                            publicPlayer
                        )
                }
            );


            sendPlayers(
                roomCode
            );


            console.log(
                `${name} created room ${roomCode}`
            );
        }
    );


    /* =====================================
       JOIN ROOM
    ===================================== */

    socket.on(
        "joinRoom",
        data => {

            const name =
                String(
                    data?.playerName || ""
                ).trim();

            const roomCode =
                String(
                    data?.roomCode || ""
                )
                .trim()
                .toUpperCase();


            if (!name) {

                socket.emit(
                    "roomError",
                    "Enter your name."
                );

                return;
            }


            const room =
                rooms[roomCode];


            if (!room) {

                socket.emit(
                    "roomError",
                    "Room not found."
                );

                return;
            }


            if (
                room.players.length >= 6
            ) {

                socket.emit(
                    "roomError",
                    "Room is full. Maximum 6 players."
                );

                return;
            }


            if (room.gameStarted) {

                socket.emit(
                    "roomError",
                    "Game already started."
                );

                return;
            }


            const duplicate =
                room.players.some(
                    player =>
                        player.name
                            .toLowerCase() ===
                        name.toLowerCase()
                );


            if (duplicate) {

                socket.emit(
                    "roomError",
                    "That name is already used."
                );

                return;
            }


            const player = {

                id:
                    socket.id,

                name,

                balance:
                    1000,

                team: []
            };


            room.players.push(
                player
            );


            socket.join(
                roomCode
            );


            socket.data.roomCode =
                roomCode;


            socket.emit(
                "roomJoined",
                {
                    roomCode,

                    players:
                        room.players.map(
                            publicPlayer
                        )
                }
            );


            sendPlayers(
                roomCode
            );


            console.log(
                `${name} joined room ${roomCode}`
            );
        }
    );


    /* =====================================
       START GAME
    ===================================== */

    socket.on(
        "startGame",
        data => {

            const roomCode =
                String(
                    data?.roomCode || ""
                )
                .trim()
                .toUpperCase();

            const room =
                rooms[roomCode];


            if (!room) return;


            if (
                room.hostId !==
                socket.id
            ) {

                socket.emit(
                    "roomError",
                    "Only the host can start the game."
                );

                return;
            }


            if (
                room.players.length < 2
            ) {

                socket.emit(
                    "roomError",
                    "At least 2 players are required."
                );

                return;
            }


            if (room.gameStarted) {

                return;
            }


            if (
                room.game ===
                "auction"
            ) {

                startAuctionGame(
                    roomCode
                );

            } else {

                startRankGame(
                    roomCode
                );
            }
        }
    );


    /* =====================================
       AUCTION BID
    ===================================== */

    socket.on(
        "auctionBid",
        data => {

            const roomCode =
                String(
                    data?.roomCode || ""
                )
                .trim()
                .toUpperCase();

            const room =
                rooms[roomCode];


            if (
                !room ||
                !room.auction ||
                !room.gameStarted
            ) {

                return;
            }


            const player =
                findPlayer(
                    room,
                    socket.id
                );


            if (!player) return;


            /*
               Maximum 5 characters
            */

            if (
                player.team.length >= 5
            ) {

                socket.emit(
                    "roomError",
                    "Your team already has 5 characters."
                );

                return;
            }


            /*
               Highest bidder cannot
               bid again.
            */

            if (
                room.auction
                    .highestBidder ===
                player.id
            ) {

                return;
            }


            /*
               Bid increases by exactly ₹50.
            */

            const newBid =
                room.auction.currentBid +
                50;


            /*
               Player must have enough money.
            */

            if (
                player.balance <
                newBid
            ) {

                socket.emit(
                    "roomError",
                    "Not enough balance."
                );

                return;
            }


            /*
               Save bid
            */

            room.auction.currentBid =
                newBid;


            room.auction.highestBidder =
                player.id;


            /*
               RESET TIMER TO 15 SECONDS
            */

            room.auction.timeLeft =
                15;


            sendAuctionUpdate(
                roomCode
            );


            console.log(
                `${player.name} bid ₹${newBid} for ${room.auction.character}`
            );
        }
    );


    /* =====================================
       RANK ANSWER
    ===================================== */

    socket.on(
        "submitRank",
        data => {

            const roomCode =
                String(
                    data?.roomCode || ""
                )
                .trim()
                .toUpperCase();

            const room =
                rooms[roomCode];


            if (!room) return;


            const player =
                findPlayer(
                    room,
                    socket.id
                );


            if (!player) return;


            if (
                room.game !==
                "rank"
            ) {

                return;
            }


            if (
                room.rankAnswers[
                    socket.id
                ]
            ) {

                return;
            }


            room.rankAnswers[
                socket.id
            ] =
                String(
                    data?.option || ""
                );


            const submitted =
                Object.keys(
                    room.rankAnswers
                ).length;


            io.to(roomCode).emit(
                "rankProgress",
                {
                    submitted,

                    total:
                        room.players.length
                }
            );


            if (
                submitted >=
                room.players.length
            ) {

                finishRankCategory(
                    roomCode
                );
            }
        }
    );


    /* =====================================
       NEXT RANK CATEGORY
    ===================================== */

    socket.on(
        "nextRankCategory",
        data => {

            const roomCode =
                String(
                    data?.roomCode || ""
                )
                .trim()
                .toUpperCase();

            const room =
                rooms[roomCode];


            if (!room) return;


            if (
                room.hostId !==
                socket.id
            ) {

                return;
            }


            room.rankIndex++;


            sendRankCategory(
                roomCode
            );
        }
    );


    /* =====================================
       DISCONNECT
    ===================================== */

    socket.on(
        "disconnect",
        () => {

            console.log(
                "Disconnected:",
                socket.id
            );


            const roomCode =
                socket.data.roomCode;


            if (!roomCode) {
                return;
            }


            const room =
                rooms[roomCode];


            if (!room) {
                return;
            }


            const playerIndex =
                room.players.findIndex(
                    player =>
                        player.id ===
                        socket.id
                );


            if (
                playerIndex === -1
            ) {

                return;
            }


            const leavingPlayer =
                room.players[
                    playerIndex
                ];


            /*
               If auction is running and
               highest bidder leaves,
               remove their bid.
            */

            if (
                room.auction &&
                room.auction
                    .highestBidder ===
                socket.id
            ) {

                room.auction
                    .highestBidder =
                    null;

                room.auction
                    .currentBid = 0;

                room.auction
                    .timeLeft = 15;
            }


            room.players.splice(
                playerIndex,
                1
            );


            /*
               No players left
            */

            if (
                room.players.length === 0
            ) {

                stopAuctionTimer(
                    room
                );

                delete rooms[
                    roomCode
                ];

                return;
            }


            /*
               If host leaves,
               give host to first player.
            */

            if (
                room.hostId ===
                socket.id
            ) {

                room.hostId =
                    room.players[0].id;
            }


            sendPlayers(
                roomCode
            );


            /*
               If auction is running,
               update everybody.
            */

            if (
                room.auction
            ) {

                sendAuctionUpdate(
                    roomCode
                );
            }


            /*
               If fewer than 2 players
               remain during a game,
               stop the game.
            */

            if (
                room.players.length < 2 &&
                room.gameStarted
            ) {

                stopAuctionTimer(
                    room
                );

                room.gameStarted =
                    false;

                room.auction =
                    null;
            }
        }
    );
});


/* =========================================================
   START SERVER
   ========================================================= */

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `🍥 Naruto Character Games server running on port ${PORT}`
        );
    }
);
