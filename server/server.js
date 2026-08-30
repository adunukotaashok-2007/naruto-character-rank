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
// SERVER TEST
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
// CONNECTION
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

            rankings: {},

            started: false

        };


        socket.join(roomCode);


        socket.emit(
            "roomCreated",
            {

                roomCode:
                    roomCode,

                players:
                    rooms[roomCode].players

            }
        );


        console.log(
            "Room created:",
            roomCode
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
                .trim()
                .toUpperCase();


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
            room.started
        ) {

            socket.emit(
                "roomError",
                "Game already started!"
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

                roomCode:
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


        console.log(
            player.name,
            "joined",
            roomCode
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


        if (!room) {

            return;
        }


        // Only host can start

        if (
            room.host !==
            socket.id
        ) {

            console.log(
                "Non-host tried to start game"
            );

            return;
        }


        // Minimum 2 players

        if (
            room.players.length < 2
        ) {

            socket.emit(
                "roomError",
                "At least 2 players are required."
            );

            return;
        }


        room.started = true;


        console.log(
            "GAME STARTED:",
            roomCode
        );


        // IMPORTANT:
        // Send to EVERY player
        // in the room

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


        if (!room) {

            return;
        }


        room.rankings[
            socket.id
        ] = {

            category:
                category,

            ranking:
                ranking

        };


        const submittedPlayers =
            Object.keys(
                room.rankings
            ).length;


        io.to(roomCode).emit(
            "rankingProgress",
            {

                submittedPlayers:
                    submittedPlayers,

                totalPlayers:
                    room.players.length

            }
        );


        // Everyone submitted

        if (
            submittedPlayers >=
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

                    category:
                        category,

                    results:
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

        console.log(
            "Player disconnected:",
            socket.id
        );


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


                if (
                    index === -1
                ) {

                    return;
                }


                room.players.splice(
                    index,
                    1
                );


                delete room.rankings[
                    socket.id
                ];


                // Delete empty room

                if (
                    room.players.length === 0
                ) {

                    delete rooms[
                        roomCode
                    ];

                    return;
                }


                // Give host to next player

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
// START SERVER
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
