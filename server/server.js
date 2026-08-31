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

app.get("/", (req, res) => {
res.send("Naruto Character Rank Server is running!");
});

const rooms = {};

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

const categoryNames = [
"🧬 Talent",
"💪 Body",
"🧠 Mind / IQ",
"🩸 Clan",
"🔵 Chakra",
"👨‍🏫 Sensei",
"🥋 Taijutsu",
"🌀 Ninjutsu",
"🔥 Kekkei Genkai",
"⚡ Speed",
"💥 Strength",
"🎯 Battle IQ",
"👻 Genjutsu",
"🌪️ Chakra Nature",
"🐉 Tailed Beast",
"❤️ Healing"
];

// ============================================
// ROOM CODE
// ============================================

function makeRoomCode() {

const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let code = "";

do {

    code = "";

    for (let i = 0; i < 6; i++) {

        code +=
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];

    }

} while (rooms[code]);

return code;

}

// ============================================
// PLAYER DATA
// ============================================

function publicPlayers(room) {

return room.players.map(player => ({
    id: player.id,
    name: player.name,
    balance: player.balance,
    teamCount: player.team.length
}));

}

function sendPlayers(roomCode) {

const room =
    rooms[roomCode];

if (!room) return;

io.to(roomCode).emit(
    "playersUpdated",
    {
        players:
            publicPlayers(room)
    }
);

}

// ============================================
// CREATE ROOM
// ============================================

io.on("connection", socket => {

console.log(
    "Player connected:",
    socket.id
);


socket.on(
    "createRoom",
    data => {

        const name =
            String(
                data.playerName || ""
            ).trim();

        const game =
            data.game === "auction"
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
            makeRoomCode();


        rooms[roomCode] = {

            game,

            host: socket.id,

            players: [],

            category: 0,

            answers: {},

            auctionIndex: 0,

            auction: null

        };


        const player = {

            id: socket.id,

            name,

            balance: 5000,

            team: []

        };


        rooms[
            roomCode
        ].players.push(player);


        socket.join(roomCode);


        socket.data.roomCode =
            roomCode;


        socket.data.playerName =
            name;


        socket.emit(
            "roomCreated",
            {
                roomCode,

                players:
                    publicPlayers(
                        rooms[roomCode]
                    )
            }
        );


        console.log(
            "Room created:",
            roomCode
        );

    }
);


// ========================================
// JOIN ROOM
// ========================================

socket.on(
    "joinRoom",
    data => {

        const name =
            String(
                data.playerName || ""
            ).trim();

        const roomCode =
            String(
                data.roomCode || ""
            ).trim().toUpperCase();


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
                "That name is already used."
            );

            return;

        }


        if (
            room.category > 0 ||
            room.auction
        ) {

            socket.emit(
                "roomError",
                "Game has already started."
            );

            return;

        }


        const player = {

            id: socket.id,

            name,

            balance: 5000,

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


        socket.emit(
            "roomJoined",
            {
                roomCode,

                players:
                    publicPlayers(
                        room
                    )
            }
        );


        sendPlayers(
            roomCode
        );

    }
);


// ========================================
// START GAME
// ========================================

socket.on(
    "startGame",
    data => {

        const roomCode =
            String(
                data.roomCode || ""
            ).toUpperCase();

        const room =
            rooms[roomCode];


        if (!room) return;


        if (
            room.host !== socket.id
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


        room.category = 0;

        room.answers = {};


        if (
            room.game === "rank"
        ) {

            io.to(roomCode).emit(
                "gameStarted",
                {
                    game: "rank"
                }
            );

        } else {

            startAuction(
                roomCode
            );

        }

    }
);


// ========================================
// RANK ANSWER
// ========================================

socket.on(
    "submitRank",
    data => {

        const roomCode =
            String(
                data.roomCode || ""
            ).toUpperCase();

        const room =
            rooms[roomCode];


        if (!room) return;


        const player =
            room.players.find(
                p =>
                    p.id ===
                    socket.id
            );


        if (!player) return;


        const category =
            Number(
                data.category
            );


        if (
            category !==
            room.category
        ) return;


        if (
            room.answers[
                socket.id
            ]
        ) return;


        room.answers[
            socket.id
        ] = {

            player:
                player.name,

            option:
                String(
                    data.option || ""
                )

        };


        const submitted =
            Object.keys(
                room.answers
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

    }
);


// ========================================
// NEXT CATEGORY
// ========================================

socket.on(
    "nextRankCategory",
    data => {

        const roomCode =
            String(
                data.roomCode || ""
            ).toUpperCase();

        const room =
            rooms[roomCode];


        if (!room) return;


        if (
            socket.id !==
            room.host
        ) {

            return;

        }


        room.category++;

        room.answers = {};


        if (
            room.category >=
            categoryNames.length
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
                    room.category
            }
        );

    }
);


// ========================================
// BID
// ========================================

socket.on(
    "bid",
    data => {

        const roomCode =
            String(
                data.roomCode || ""
            ).toUpperCase();

        const room =
            rooms[roomCode];


        if (!room) return;


        if (!room.auction) return;


        const player =
            room.players.find(
                p =>
                    p.id ===
                    socket.id
            );


        if (!player) return;


        const amount =
            Number(
                data.amount
            );


        if (
            !Number.isFinite(
                amount
            ) ||
            amount <= 0
        ) {

            return;

        }


        if (
            player.team.length >= 5
        ) {

            socket.emit(
                "roomError",
                "Your team already has 5 characters."
            );

            return;

        }


        const newBid =
            room.auction.currentBid +
            amount;


        if (
            newBid >
            player.balance
        ) {

            socket.emit(
                "roomError",
                "Not enough balance."
            );

            return;

        }


        room.auction.currentBid =
            newBid;

        room.auction.highestBidder =
            player.id;

        room.auction.highestBidderName =
            player.name;


        broadcastAuction(
            roomCode
        );

    }
);


// ========================================
// NEXT AUCTION
// ========================================

socket.on(
    "nextAuction",
    data => {

        const roomCode =
            String(
                data.roomCode || ""
            ).toUpperCase();

        const room =
            rooms[roomCode];


        if (!room) return;


        if (
            socket.id !==
            room.host
        ) return;


        finishAuction(
            roomCode
        );

    }
);


// ========================================
// DISCONNECT
// ========================================

socket.on(
    "disconnect",
    () => {

        console.log(
            "Player disconnected:",
            socket.id
        );


        const roomCode =
            socket.data.roomCode;


        if (!roomCode) return;


        const room =
            rooms[roomCode];


        if (!room) return;


        room.players =
            room.players.filter(
                player =>
                    player.id !==
                    socket.id
            );


        if (
            room.players.length === 0
        ) {

            delete rooms[
                roomCode
            ];

            return;

        }


        if (
            room.host ===
            socket.id
        ) {

            room.host =
                room.players[0].id;

        }


        sendPlayers(
            roomCode
        );

    }
);

});

// ============================================
// SHOW RANK RESULT
// ============================================

function showRankResult(roomCode) {

const room =
    rooms[roomCode];


if (!room) return;


const players =
    Object.values(
        room.answers
    );


/*
   Ranking is based on the Naruto
   character selected by each player.

   For now, the answer order is used
   as the multiplayer ranking.
*/

players.sort(
    () =>
        Math.random() - 0.5
);


io.to(roomCode).emit(
    "rankResult",
    {
        category:
            categoryNames[
                room.category
            ],

        players
    }
);

}

// ============================================
// FINAL RANK
// ============================================

function finishRankGame(roomCode) {

const room =
    rooms[roomCode];


if (!room) return;


const players =
    room.players.map(
        player => ({

            name:
                player.name,

            balance:
                player.balance,

            team:
                player.team

        })
    );


io.to(roomCode).emit(
    "finalResults",
    {
        players
    }
);

}

// ============================================
// START AUCTION
// ============================================

function startAuction(roomCode) {

const room =
    rooms[roomCode];


if (!room) return;


room.auctionIndex = 0;


startCurrentAuction(
    roomCode
);

}

// ============================================
// CURRENT AUCTION
// ============================================

function startCurrentAuction(roomCode) {

const room =
    rooms[roomCode];


if (!room) return;


if (
    room.auctionIndex >=
    auctionCharacters.length
) {

    finishAuctionGame(
        roomCode
    );

    return;

}


room.auction = {

    character:
        auctionCharacters[
            room.auctionIndex
        ],

    currentBid: 0,

    highestBidder: null,

    highestBidderName: null,

    time: 10

};


broadcastAuction(
    roomCode
);


room.auctionTimer =
    setInterval(
        () => {

            if (
                !room.auction
            ) return;


            room.auction.time--;


            broadcastAuction(
                roomCode
            );


            if (
                room.auction.time <=
                0
            ) {

                clearInterval(
                    room.auctionTimer
                );


                finishAuction(
                    roomCode
                );

            }

        },
        1000
    );

}

// ============================================
// AUCTION UPDATE
// ============================================

function broadcastAuction(
roomCode
) {

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

                time:
                    room.auction.time,

                myBalance:
                    player.balance,

                myTeamCount:
                    player.team.length,

                players:
                    publicPlayers(
                        room
                    )

            }
        );

    }
);

}

// ============================================
// FINISH AUCTION
// ============================================

function finishAuction(
roomCode
) {

const room =
    rooms[roomCode];


if (
    !room ||
    !room.auction
) return;


if (
    room.auctionTimer
) {

    clearInterval(
        room.auctionTimer
    );

}


const character =
    room.auction.character;


let winner = null;

let bid = 0;


if (
    room.auction.highestBidder
) {

    winner =
        room.players.find(
            player =>
                player.id ===
                room.auction
                    .highestBidder
        );


    if (winner) {

        bid =
            room.auction
                .currentBid;


        if (
            winner.team.length < 5 &&
            winner.balance >= bid
        ) {

            winner.balance -=
                bid;

            winner.team.push(
                character
            );

        } else {

            winner = null;

            bid = 0;

        }

    }

}


io.to(roomCode).emit(
    "auctionResult",
    {

        character,

        winner:
            winner
                ? winner.name
                : null,

        bid

    }
);


room.auction = null;

room.auctionIndex++;

}

// ============================================
// FINISH AUCTION GAME
// ============================================

function finishAuctionGame(
roomCode
) {

const room =
    rooms[roomCode];


if (!room) return;


const players =
    room.players
        .map(
            player => ({

                name:
                    player.name,

                balance:
                    player.balance,

                team:
                    player.team

            })
        )
        .sort(
            (a, b) =>
                b.team.length -
                a.team.length
        );


io.to(roomCode).emit(
    "finalResults",
    {
        players
    }
);

}

// ============================================
// START SERVER
// ============================================

server.listen(
PORT,
"0.0.0.0",
() => {

    console.log(
        `Naruto Character Rank server running on port ${PORT}`
    );

}

);
