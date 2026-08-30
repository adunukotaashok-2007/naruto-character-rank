const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server =
    http.createServer(app);

const io =
    new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });


const rooms = {};


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.send(
        "Naruto Character Rank Multiplayer Server is running!"
    );

});


// ==========================================
// ROOM CODE
// ==========================================

function generateRoomCode() {

    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

}


// ==========================================
// SOCKET CONNECTION
// ==========================================

io.on("connection", socket => {

    console.log(
        "Player connected:",
        socket.id
    );


    // ======================================
    // CREATE ROOM
    // ======================================

    socket.on(
        "createRoom",
        ({ playerName }) => {

            let roomCode =
                generateRoomCode();


            while (rooms[roomCode]) {

                roomCode =
                    generateRoomCode();

            }


            rooms[roomCode] = {

                host:
                    socket.id,

                players: [
                    {
                        id:
                            socket.id,

                        name:
                            playerName ||
                            "Player 1"
                    }
                ],

                rankings: {}

            };


            socket.join(roomCode);


            socket.emit(
                "roomCreated",
                {
                    roomCode,

                    players:
                        rooms[roomCode].players
                }
            );

        }
    );


    // ======================================
    // JOIN ROOM
    // ======================================

    socket.on(
        "joinRoom",
        ({ roomCode, playerName }) => {

            roomCode =
                roomCode
                    .toUpperCase()
                    .trim();


            const room =
                rooms[roomCode];


            if (!room) {

                socket.emit(
                    "roomError",
                    "Room not found!"
                );

                return;

            }


            if (
                room.players.length >= 6
            ) {

                socket.emit(
                    "roomError",
                    "Room is full! Maximum 6 players."
                );

                return;

            }


            const player = {

                id:
                    socket.id,

                name:
                    playerName ||
                    `Player ${room.players.length + 1}`

            };


            room.players.push(player);


            socket.join(roomCode);


            socket.emit(
                "roomJoined",
                {
                    roomCode,

                    players:
                        room.players
                }
            );


            io.to(roomCode).emit(
                "playersUpdated",
                {
                    players:
                        room.players
                }
            );

        }
    );


    // ======================================
    // START GAME
    // ======================================

    socket.on(
        "startGame",
        ({ roomCode }) => {

            const room =
                rooms[roomCode];


            if (!room) return;


            if (
                room.host !==
                socket.id
            ) {

                return;

            }


            io.to(roomCode).emit(
                "gameStarted"
            );

        }
    );


    // ======================================
    // SUBMIT RANKING
    // ======================================

    socket.on(
        "submitRanking",
        ({
            roomCode,
            category,
            ranking
        }) => {

            const room =
                rooms[roomCode];


            if (!room) return;


            room.rankings[
                socket.id
            ] = {

                category,

                ranking

            };


            const submitted =
                Object.keys(
                    room.rankings
                ).length;


            io.to(roomCode).emit(
                "rankingProgress",
                {

                    submittedPlayers:
                        submitted,

                    totalPlayers:
                        room.players.length

                }
            );


            if (
                submitted >=
                room.players.length
            ) {

                const results =
                    room.players.map(
                        player => {

                            return {

                                player:
                                    player.name,

                                ranking:
                                    room.rankings[
                                        player.id
                                    ]?.ranking || []

                            };

                        }
                    );


                io.to(roomCode).emit(
                    "roundResults",
                    {

                        category,

                        results

                    }
                );


                room.rankings = {};

            }

        }
    );


    // ======================================
    // DISCONNECT
    // ======================================

    socket.on(
        "disconnect",
        () => {

            Object.keys(
                rooms
            ).forEach(
                roomCode => {

                    const room =
                        rooms[roomCode];


                    const index =
                        room.players.findIndex(
                            player =>
                                player.id ===
                                socket.id
                        );


                    if (index === -1)
                        return;


                    room.players.splice(
                        index,
                        1
                    );


                    delete room.rankings[
                        socket.id
                    ];


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


                    io.to(roomCode).emit(
                        "playersUpdated",
                        {
                            players:
                                room.players
                        }
                    );

                }
            );

        }
    );

});


// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 3000;


server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);
