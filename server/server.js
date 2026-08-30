const express = require("express");

const http = require("http");

const {
Server
} = require("socket.io");

const app =
express();

const server =
http.createServer(app);

const io =
new Server(
server,
{
cors: {
origin: "*",
methods: [
"GET",
"POST"
]
}
}
);

// ==========================================
// ROOMS
// ==========================================

const rooms = {};

// ==========================================
// SERVER TEST
// ==========================================

app.get(
"/",
(req, res) => {

    res.send(
        "Naruto Character Rank Multiplayer Server is running!"
    );

}

);

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

io.on(
"connection",
socket => {

    console.log(
        "Player connected:",
        socket.id
    );


    // ==================================
    // CREATE ROOM
    // ==================================

    socket.on(
        "createRoom",
        ({ playerName }) => {

            let roomCode =
                generateRoomCode();


            while (
                rooms[roomCode]
            ) {

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

                started:
                    false,

                currentCategory:
                    0,

                selections:
                    {},

                totalScores:
                    {}

            };


            socket.join(
                roomCode
            );


            socket.emit(
                "roomCreated",
                {

                    roomCode:
                        roomCode,

                    players:
                        rooms[
                            roomCode
                        ].players

                }
            );


            console.log(
                "Room created:",
                roomCode
            );

        }
    );


    // ==================================
    // JOIN ROOM
    // ==================================

    socket.on(
        "joinRoom",
        ({
            roomCode,
            playerName
        }) => {

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


            room.players.push(
                player
            );


            socket.join(
                roomCode
            );


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
                "joined room",
                roomCode
            );

        }
    );


    // ==================================
    // START GAME
    // ==================================

    socket.on(
        "startGame",
        ({ roomCode }) => {

            const room =
                rooms[roomCode];


            if (!room) {
                return;
            }


            // HOST ONLY

            if (
                room.host !==
                socket.id
            ) {

                return;
            }


            // MINIMUM 2

            if (
                room.players.length < 2
            ) {

                socket.emit(
                    "roomError",
                    "At least 2 players are required."
                );

                return;
            }


            room.started =
                true;

            room.currentCategory =
                0;

            room.selections =
                {};

            room.totalScores =
                {};


            console.log(
                "GAME STARTED:",
                roomCode
            );


            // IMPORTANT:
            // SEND TO EVERY PLAYER

            io.to(roomCode).emit(
                "gameStarted",
                {
                    category: 0
                }
            );

        }
    );


    // ==================================
    // SUBMIT ONE CHARACTER
    // ==================================

    socket.on(
        "submitCharacter",
        ({
            roomCode,
            category,
            character
        }) => {

            const room =
                rooms[roomCode];


            if (!room) {
                return;
            }


            if (!room.started) {
                return;
            }


            if (
                category !==
                room.currentCategory
            ) {

                return;
            }


            // CREATE CATEGORY

            if (
                !room.selections[
                    category
                ]
            ) {

                room.selections[
                    category
                ] = {};

            }


            // SAVE PLAYER SELECTION

            room.selections[
                category
            ][
                socket.id
            ] = character;


            const submittedPlayers =
                Object.keys(
                    room.selections[
                        category
                    ]
                ).length;


            io.to(roomCode).emit(
                "selectionProgress",
                {

                    submittedPlayers:
                        submittedPlayers,

                    totalPlayers:
                        room.players.length

                }
            );


            // =================================
            // EVERYONE SUBMITTED
            // =================================

            if (
                submittedPlayers >=
                room.players.length
            ) {

                createCategoryResult(
                    roomCode,
                    room,
                    category
                );

            }

        }
    );


    // ==================================
    // CATEGORY RESULT
    // ==================================

    function createCategoryResult(
        roomCode,
        room,
        category
    ) {

        const selections =
            room.selections[
                category
            ] || {};


        const votes = {};


        // COUNT VOTES

        Object.values(
            selections
        ).forEach(
            character => {

                votes[
                    character
                ] =
                    (
                        votes[
                            character
                        ] || 0
                    ) + 1;

            }
        );


        // FIND WINNER

        let winner = null;

        let highestVotes = 0;


        Object.keys(
            votes
        ).forEach(
            character => {

                if (
                    votes[
                        character
                    ] > highestVotes
                ) {

                    highestVotes =
                        votes[
                            character
                        ];

                    winner =
                        character;

                }

            }
        );


        // SAVE TOTAL SCORE

        Object.keys(
            votes
        ).forEach(
            character => {

                room.totalScores[
                    character
                ] =
                    (
                        room.totalScores[
                            character
                        ] || 0
                    ) +
                    votes[
                        character
                    ];

            }
        );


        // PLAYER RESULTS

        const playerSelections =
            room.players.map(
                player => {

                    return {

                        player:
                            player.name,

                        character:
                            selections[
                                player.id
                            ]

                    };

                }
            );


        const lastCategory =
            category >= 15;


        io.to(roomCode).emit(
            "categoryResults",
            {

                category:
                    getCategoryName(
                        category
                    ),

                winner:
                    winner,

                votes:
                    votes,

                selections:
                    playerSelections,

                lastCategory:
                    lastCategory

            }
        );

    }


    // ==================================
    // CATEGORY NAMES
    // ==================================

    function getCategoryName(
        index
    ) {

        const names = [

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


        return names[index];

    }


    // ==================================
    // NEXT CATEGORY
    // ==================================

    socket.on(
        "nextCategory",
        ({ roomCode }) => {

            const room =
                rooms[roomCode];


            if (!room) {
                return;
            }


            // HOST ONLY

            if (
                room.host !==
                socket.id
            ) {

                return;
            }


            const next =
                room.currentCategory + 1;


            // =================================
            // FINAL RESULTS
            // =================================

            if (
                next >= 16
            ) {

                const finalResults =
                    Object.keys(
                        room.totalScores
                    )
                        .map(
                            character => {

                                return {

                                    character:
                                        character,

                                    score:
                                        room.totalScores[
                                            character
                                        ]

                                };

                            }
                        )
                        .sort(
                            (
                                a,
                                b
                            ) =>
                                b.score -
                                a.score
                        );


                io.to(roomCode).emit(
                    "finalResults",
                    {

                        results:
                            finalResults

                    }
                );


                return;
            }


            // =================================
            // NEXT CATEGORY
            // =================================

            room.currentCategory =
                next;


            room.selections[
                next
            ] = {};


            io.to(roomCode).emit(
                "nextCategory",
                {

                    category:
                        next

                }
            );

        }
    );


    // ==================================
    // DISCONNECT
    // ==================================

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
                        rooms[
                            roomCode
                        ];


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


                    room.players.splice(
                        playerIndex,
                        1
                    );


                    // DELETE EMPTY ROOM

                    if (
                        room.players.length === 0
                    ) {

                        delete rooms[
                            roomCode
                        ];

                        return;
                    }


                    // HOST LEFT

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

}

);

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
