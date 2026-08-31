const express = require("express");
const http = require("http");
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

// --------------------------------------------------
// BASIC SERVER
// --------------------------------------------------

app.get("/", (req, res) => {
res.send("🍥 Naruto Character Games Server is running!");
});

// --------------------------------------------------
// GAME DATA
// --------------------------------------------------

const characters = [
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

const categories = [
"Talent",
"Body",
"Mind / IQ",
"Clan",
"Chakra",
"Sensei",
"Taijutsu",
"Ninjutsu",
"Kekkei Genkai",
"Speed",
"Strength",
"Battle IQ",
"Genjutsu",
"Chakra Nature",
"Tailed Beast",
"Healing"
];

// --------------------------------------------------
// ROOMS
// --------------------------------------------------

const rooms = {};

// --------------------------------------------------
// ROOM CODE
// --------------------------------------------------

function createRoomCode() {

const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let code;

do {

    code = "";

    for (let i = 0; i < 6; i++) {

        code += chars[
            Math.floor(
                Math.random() * chars.length
            )
        ];

    }

} while (rooms[code]);

return code;

}

// --------------------------------------------------
// PUBLIC PLAYER DATA
// --------------------------------------------------

function getPublicPlayers(room) {

return room.players.map(player => ({
    id: player.id,
    name: player.name,
    balance: player.balance,
    team: player.team,
    teamCount: player.team.length
}));

}

// --------------------------------------------------
// SEND ROOM STATE
// --------------------------------------------------

function sendPlayers(roomCode) {

const room = rooms[roomCode];

if (!room) return;

io.to(roomCode).emit(
    "playersUpdated",
    {
        players: getPublicPlayers(room)
    }
);

}

// --------------------------------------------------
// CONNECTION
// --------------------------------------------------

io.on("connection", socket => {

console.log(
    "Connected:",
    socket.id
);


// ==================================================
// CREATE ROOM
// ==================================================

socket.on("createRoom", data => {

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
            "Please enter your name."
        );

        return;

    }


    const roomCode =
        createRoomCode();


    rooms[roomCode] = {

        game,

        host: socket.id,

        players: [],

        rankCategory: 0,

        rankAnswers: {},

        auctionIndex: 0,

        auction: null,

        auctionTimer: null

    };


    addPlayer(
        roomCode,
        socket,
        name
    );


    socket.emit(
        "roomCreated",
        {
            roomCode,
            game,
            players:
                getPublicPlayers(
                    rooms[roomCode]
                )
        }
    );


    console.log(
        "Room created:",
        roomCode
    );

});


// ==================================================
// JOIN ROOM
// ==================================================

socket.on("joinRoom", data => {

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
            "Please enter your name."
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


    if (
        room.players.some(
            player =>
                player.name.toLowerCase() ===
                name.toLowerCase()
        )
    ) {

        socket.emit(
            "roomError",
            "That player name is already used."
        );

        return;

    }


    if (
        room.rankCategory > 0 ||
        room.auction
    ) {

        socket.emit(
            "roomError",
            "The game has already started."
        );

        return;

    }


    addPlayer(
        roomCode,
        socket,
        name
    );


    socket.emit(
        "roomJoined",
        {
            roomCode,
            game: room.game,
            players:
                getPublicPlayers(room)
        }
    );


    sendPlayers(roomCode);

});


// ==================================================
// START GAME
// ==================================================

socket.on("startGame", data => {

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
        socket.id !== room.host
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


    if (
        room.game === "auction"
    ) {

        startAuction(
            roomCode
        );

    } else {

        startRankGame(
            roomCode
        );

    }

});


// ==================================================
// RANK ANSWER
// ==================================================

socket.on("submitRank", data => {

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
        room.players.find(
            p =>
                p.id === socket.id
        );


    if (!player) return;


    const category =
        Number(
            data?.category
        );


    if (
        category !==
        room.rankCategory
    ) return;


    if (
        room.rankAnswers[
            socket.id
        ]
    ) {

        return;

    }


    const option =
        String(
            data?.option || ""
        ).trim();


    if (!option) return;


    room.rankAnswers[
        socket.id
    ] = {

        player:
            player.name,

        option

    };


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
        submitted ===
        room.players.length
    ) {

        showRankResult(
            roomCode
        );

    }

});


// ==================================================
// NEXT RANK CATEGORY
// ==================================================

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
            socket.id !== room.host
        ) return;


        room.rankCategory++;

        room.rankAnswers = {};


        if (
            room.rankCategory >=
            categories.length
        ) {

            finishRankGame(
                roomCode
            );

            return;

        }


        io.to(roomCode).emit(
            "nextRankCategory",
            {
                category:
                    room.rankCategory,

                categoryName:
                    categories[
                        room.rankCategory
                    ]
            }
        );

    }
);


// ==================================================
// AUCTION +50 BID
// ==================================================

socket.on("auctionBid", data => {

    const roomCode =
        String(
            data?.roomCode || ""
        )
        .trim()
        .toUpperCase();


    const room =
        rooms[roomCode];


    if (!room) return;


    if (!room.auction) return;


    const bidder =
        room.players.find(
            p =>
                p.id === socket.id
        );


    if (!bidder) return;


    // ----------------------------------------------
    // MAX TEAM SIZE
    // ----------------------------------------------

    if (
        bidder.team.length >= 5
    ) {

        socket.emit(
            "roomError",
            "You already have 5 characters."
        );

        return;

    }


    // ----------------------------------------------
    // HIGHEST BIDDER CANNOT BID AGAIN
    // ----------------------------------------------

    if (
        room.auction.highestBidder ===
        socket.id
    ) {

        socket.emit(
            "roomError",
            "You are already the highest bidder."
        );

        return;

    }


    // ----------------------------------------------
    // BID ALWAYS +50
    // ----------------------------------------------

    const newBid =
        room.auction.currentBid +
        50;


    // ----------------------------------------------
    // PLAYER MUST AFFORD NEW BID
    // ----------------------------------------------

    if (
        bidder.balance <
        newBid
    ) {

        socket.emit(
            "roomError",
            "You do not have enough balance."
        );

        return;

    }


    // ----------------------------------------------
    // UPDATE AUCTION
    // ----------------------------------------------

    room.auction.currentBid =
        newBid;

    room.auction.highestBidder =
        socket.id;

    room.auction.highestBidderName =
        bidder.name;


    // ----------------------------------------------
    // RESET TIMER TO 15 SECONDS
    // ----------------------------------------------

    room.auction.timeLeft =
        15;


    broadcastAuction(
        roomCode
    );

});


// ==================================================
// DISCONNECT
// ==================================================

socket.on("disconnect", () => {

    const roomCode =
        socket.data.roomCode;


    if (!roomCode) return;


    const room =
        rooms[roomCode];


    if (!room) return;


    room.players =
        room.players.filter(
            player =>
                player.id !== socket.id
        );


    if (
        room.players.length === 0
    ) {

        stopAuctionTimer(room);

        delete rooms[
            roomCode
        ];

        return;

    }


    if (
        room.host === socket.id
    ) {

        room.host =
            room.players[0].id;

    }


    sendPlayers(roomCode);

});

});

// ======================================================
// ADD PLAYER
// ======================================================

function addPlayer(
roomCode,
socket,
name
) {

const room =
    rooms[roomCode];


if (!room) return;


const player = {

    id: socket.id,

    name,

    balance: 1000,

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

socket.data.playerName =
    name;

}

// ======================================================
// RANK GAME
// ======================================================

function startRankGame(roomCode) {

const room =
    rooms[roomCode];


room.rankCategory = 0;

room.rankAnswers = {};


io.to(roomCode).emit(
    "gameStarted",
    {
        game: "rank",

        category: 0,

        categoryName:
            categories[0]
    }
);

}

function showRankResult(roomCode) {

const room =
    rooms[roomCode];


if (!room) return;


const results =
    Object.values(
        room.rankAnswers
    );


io.to(roomCode).emit(
    "rankResult",
    {
        category:
            categories[
                room.rankCategory
            ],

        players:
            results
    }
);

}

function finishRankGame(roomCode) {

const room =
    rooms[roomCode];


if (!room) return;


io.to(roomCode).emit(
    "rankFinished",
    {
        players:
            getPublicPlayers(room)
    }
);

}

// ======================================================
// AUCTION
// ======================================================

function startAuction(roomCode) {

const room =
    rooms[roomCode];


if (!room) return;


room.auctionIndex = 0;


startNextAuction(
    roomCode
);

}

// ======================================================
// NEXT CHARACTER
// ======================================================

function startNextAuction(roomCode) {

const room =
    rooms[roomCode];


if (!room) return;


stopAuctionTimer(room);


// ----------------------------------------------
// ALL CHARACTERS FINISHED
// ----------------------------------------------

if (
    room.auctionIndex >=
    characters.length
) {

    finishAuctionGame(
        roomCode
    );

    return;

}


const character =
    characters[
        room.auctionIndex
    ];


// ----------------------------------------------
// NEW AUCTION
// ----------------------------------------------

room.auction = {

    character,

    currentBid: 0,

    highestBidder: null,

    highestBidderName: null,

    timeLeft: 15

};


broadcastAuction(
    roomCode
);


// ----------------------------------------------
// START 15 SECOND TIMER
// ----------------------------------------------

room.auctionTimer =
    setInterval(
        () => {

            if (
                !room.auction
            ) {

                stopAuctionTimer(
                    room
                );

                return;

            }


            room.auction.timeLeft--;


            broadcastAuction(
                roomCode
            );


            if (
                room.auction.timeLeft <=
                0
            ) {

                finishCurrentAuction(
                    roomCode
                );

            }

        },
        1000
    );

}

// ======================================================
// BROADCAST AUCTION
// ======================================================

function broadcastAuction(roomCode) {

const room =
    rooms[roomCode];


if (
    !room ||
    !room.auction
) return;


room.players.forEach(
    player => {

        io.to(
            player.id
        ).emit(
            "auctionUpdate",
            {

                character:
                    room.auction.character,

                currentBid:
                    room.auction.currentBid,

                highestBidder:
                    room.auction
                        .highestBidderName,

                highestBidderId:
                    room.auction
                        .highestBidder,

                timeLeft:
                    room.auction.timeLeft,

                myBalance:
                    player.balance,

                myTeam:
                    player.team,

                myTeamCount:
                    player.team.length,

                canBid:
                    player.id !==
                    room.auction
                        .highestBidder &&
                    player.team.length < 5 &&
                    player.balance >=
                    room.auction.currentBid +
                    50,

                players:
                    getPublicPlayers(
                        room
                    )

            }
        );

    }
);

}

// ======================================================
// FINISH CURRENT AUCTION
// ======================================================

function finishCurrentAuction(
roomCode
) {

const room =
    rooms[roomCode];


if (!room) return;


if (!room.auction) return;


stopAuctionTimer(room);


const auction =
    room.auction;


const character =
    auction.character;


// ----------------------------------------------
// UNSOLD
// ----------------------------------------------

if (
    !auction.highestBidder
) {

    io.to(roomCode).emit(
        "auctionResult",
        {

            character,

            sold: false,

            winner: null,

            bid: 0

        }
    );

}

// ----------------------------------------------
// SOLD
// ----------------------------------------------

else {

    const winner =
        room.players.find(
            player =>
                player.id ===
                auction.highestBidder
        );


    if (
        winner &&
        winner.team.length < 5 &&
        winner.balance >=
            auction.currentBid
    ) {

        winner.balance -=
            auction.currentBid;

        winner.team.push(
            character
        );


        io.to(roomCode).emit(
            "auctionResult",
            {

                character,

                sold: true,

                winner:
                    winner.name,

                bid:
                    auction.currentBid

            }
        );

    }

}


room.auction = null;


room.auctionIndex++;


// ----------------------------------------------
// NEXT CHARACTER
// ----------------------------------------------

setTimeout(
    () => {

        startNextAuction(
            roomCode
        );

    },
    2000
);

}

// ======================================================
// STOP TIMER
// ======================================================

function stopAuctionTimer(room) {

if (
    room &&
    room.auctionTimer
) {

    clearInterval(
        room.auctionTimer
    );

    room.auctionTimer =
        null;

}

}

// ======================================================
// FINISH AUCTION GAME
// ======================================================

function finishAuctionGame(
roomCode
) {

const room =
    rooms[roomCode];


if (!room) return;


stopAuctionTimer(room);


const ranking =
    room.players
        .map(
            player => ({

                name:
                    player.name,

                balance:
                    player.balance,

                team:
                    player.team,

                teamCount:
                    player.team.length

            })
        )
        .sort(
            (a, b) =>
                b.teamCount -
                a.teamCount
        );


io.to(roomCode).emit(
    "auctionFinished",
    {
        ranking
    }
);

}

// ======================================================
// SERVER
// ======================================================

server.listen(
PORT,
"0.0.0.0",
() => {

    console.log(
        `🍥 Naruto Character Games running on port ${PORT}`
    );

}

);
