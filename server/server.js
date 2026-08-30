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

// ============================================
// ROOMS
// ============================================

const rooms = {};

// ============================================
// AUCTION CHARACTERS
// ============================================

const auctionCharacters = [

```
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
```

];

// ============================================
// SERVER TEST
// ============================================

app.get(
"/",
(req, res) => {

```
    res.send(
        "Naruto Character Games Server is running!"
    );

}
```

);

// ============================================
// ROOM CODE
// ============================================

function createRoomCode() {

```
let code;

do {

    code =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

} while (
    rooms[code]
);


return code;
```

}

// ============================================
// SEND AUCTION STATE
// ============================================

function sendAuctionState(
roomCode
) {

```
const room =
    rooms[roomCode];


if (!room) {
    return;
}


const highestPlayer =
    room.players.find(
        player =>
            player.id ===
            room.highestBidder
    );


room.players.forEach(
    player => {

        io.to(
            player.id
        ).emit(
            "auctionUpdate",
            {

                character:
                    room.auctionCharacter,

                currentBid:
                    room.currentBid,

                highestBidder:
                    highestPlayer
                        ? highestPlayer.name
                        : null,

                time:
                    room.time,

                myBalance:
                    player.balance,

                myTeamCount:
                    player.team.length,

                players:
                    room.players.map(
                        p => ({

                            name:
                                p.name,

                            balance:
                                p.balance,

                            teamCount:
                                p.team.length

                        })
                    )

            }
        );

    }
);
```

}

// ============================================
// START AUCTION ROUND
// ============================================

function startAuction(
roomCode
) {

```
const room =
    rooms[roomCode];


if (!room) {
    return;
}


if (
    room.auctionIndex >=
    auctionCharacters.length
) {

    finishAuction(
        roomCode
    );

    return;
}


room.auctionCharacter =
    auctionCharacters[
        room.auctionIndex
    ];


room.currentBid = 0;

room.highestBidder = null;

room.time = 10;


sendAuctionState(
    roomCode
);


clearInterval(
    room.timer
);


room.timer =
    setInterval(
        () => {

            room.time--;


            sendAuctionState(
                roomCode
            );


            if (
                room.time <= 0
            ) {

                clearInterval(
                    room.timer
                );


                finishAuctionRound(
                    roomCode
                );

            }

        },
        1000
    );
```

}

// ============================================
// FINISH AUCTION ROUND
// ============================================

function finishAuctionRound(
roomCode
) {

```
const room =
    rooms[roomCode];


if (!room) {
    return;
}


const winner =
    room.players.find(
        player =>
            player.id ===
            room.highestBidder
    );


if (winner) {

    winner.balance -=
        room.currentBid;


    winner.team.push(
        room.auctionCharacter
    );

}


io.to(roomCode).emit(
    "auctionResult",
    {

        winner:
            winner
                ? winner.name
                : null,

        character:
            room.auctionCharacter,

        bid:
            room.currentBid

    }
);
```

}

// ============================================
// CONNECTION
// ============================================

io.on(
"connection",
socket => {

```
    console.log(
        "Connected:",
        socket.id
    );


    // ====================================
    // CREATE ROOM
    // ====================================

    socket.on(
        "createRoom",
        ({
            playerName,
            game
        }) => {

            const roomCode =
                createRoomCode();


            rooms[roomCode] = {

                host:
                    socket.id,

                game:
                    game,

                started:
                    false,

                players: [

                    {

                        id:
                            socket.id,

                        name:
                            playerName,

                        balance:
                            1000,

                        team:
                            []

                    }

                ],

                currentCategory:
                    0,

                answers:
                    {},

                auctionIndex:
                    0,

                auctionCharacter:
                    null,

                currentBid:
                    0,

                highestBidder:
                    null,

                timer:
                    null,

                time:
                    10

            };


            socket.join(
                roomCode
            );


            socket.emit(
                "roomCreated",
                {

                    roomCode,

                    players:
                        rooms[
                            roomCode
                        ].players

                }
            );

        }
    );


    // ====================================
    // JOIN ROOM
    // ====================================

    socket.on(
        "joinRoom",
        ({
            roomCode,
            playerName,
            game
        }) => {

            const room =
                rooms[
                    roomCode
                ];


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
                room.game !==
                game
            ) {

                socket.emit(
                    "roomError",
                    "Wrong game mode for this room!"
                );

                return;
            }


            if (
                room.players.length >=
                6
            ) {

                socket.emit(
                    "roomError",
                    "Room is full! Maximum 6 players."
                );

                return;
            }


            room.players.push({

                id:
                    socket.id,

                name:
                    playerName,

                balance:
                    1000,

                team:
                    []

            });


            socket.join(
                roomCode
            );


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


    // ====================================
    // START GAME
    // ====================================

    socket.on(
        "startGame",
        ({
            roomCode
        }) => {

            const room =
                rooms[
                    roomCode
                ];


            if (!room) {
                return;
            }


            if (
                room.host !==
                socket.id
            ) {

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


            room.started =
                true;


            if (
                room.game ===
                "auction"
            ) {

                io.to(roomCode).emit(
                    "gameStarted",
                    {}
                );


                startAuction(
                    roomCode
                );

            } else {

                io.to(roomCode).emit(
                    "gameStarted",
                    {}
                );

            }

        }
    );


    // ====================================
    // RANK ANSWER
    // ====================================

    socket.on(
        "submitRank",
        ({
            roomCode,
            category,
            option
        }) => {

            const room =
                rooms[
                    roomCode
                ];


            if (!room) {
                return;
            }


            if (
                !room.answers[
                    category
                ]
            ) {

                room.answers[
                    category
                ] = {};

            }


            room.answers[
                category
            ][
                socket.id
            ] = option;


            const submitted =
                Object.keys(
                    room.answers[
                        category
                    ]
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

                createRankResult(
                    roomCode,
                    room,
                    category
                );

            }

        }
    );


    // ====================================
    // CATEGORY RESULT
    // ====================================

    function createRankResult(
        roomCode,
        room,
        category
    ) {

        const answers =
            room.answers[
                category
            ];


        const players =
            room.players.map(
                player => ({

                    player:
                        player.name,

                    option:
                        answers[
                            player.id
                        ]

                })
            );


        /*
         * The first option in each
         * category is considered BEST.
         *
         * This creates the player ranking
         * for that category.
         */

        const categoryOptions = {

            0: [
                "Naruto",
                "Sasuke",
                "Itachi",
                "Minato",
                "Kakashi"
            ],

            1: [
                "Guy",
                "Lee",
                "Madara",
                "Hashirama",
                "Naruto"
            ],

            2: [
                "Shikamaru",
                "Itachi",
                "Tobirama",
                "Minato",
                "Kakashi"
            ],

            3: [
                "Uzumaki",
                "Senju",
                "Uchiha",
                "Hyuga",
                "Nara"
            ],

            4: [
                "Naruto",
                "Hashirama",
                "Madara",
                "Nagato",
                "Kisame"
            ],

            5: [
                "Jiraiya",
                "Kakashi",
                "Guy",
                "Orochimaru",
                "Hiruzen"
            ],

            6: [
                "Guy",
                "Lee",
                "Neji",
                "Naruto",
                "Sasuke"
            ],

            7: [
                "Naruto",
                "Sasuke",
                "Minato",
                "Tobirama",
                "Kakashi"
            ],

            8: [
                "Hashirama",
                "Sasuke",
                "Madara",
                "Gaara",
                "Naruto"
            ],

            9: [
                "Minato",
                "Naruto",
                "Tobirama",
                "Sasuke",
                "Guy"
            ],

            10: [
                "Guy",
                "Hashirama",
                "Madara",
                "Naruto",
                "Sakura"
            ],

            11: [
                "Itachi",
                "Shikamaru",
                "Minato",
                "Kakashi",
                "Tobirama"
            ],

            12: [
                "Itachi",
                "Sasuke",
                "Madara",
                "Obito",
                "Kakashi"
            ],

            13: [
                "Naruto",
                "Sasuke",
                "Kakashi",
                "Hashirama",
                "Gaara"
            ],

            14: [
                "Naruto",
                "Obito",
                "Gaara",
                "Madara",
                "Nagato"
            ],

            15: [
                "Sakura",
                "Naruto",
                "Hashirama",
                "Orochimaru",
                "Kakashi"
            ]

        };


        const order =
            categoryOptions[
                category
            ];


        players.sort(
            (a, b) => {

                const aRank =
                    order.indexOf(
                        a.option
                    );

                const bRank =
                    order.indexOf(
                        b.option
                    );


                return (
                    aRank -
                    bRank
                );

            }
        );


        io.to(roomCode).emit(
            "rankResult",
            {

                category:
                    getCategoryName(
                        category
                    ),

                players

            }
        );

    }


    // ====================================
    // NEXT CATEGORY
    // ====================================

    socket.on(
        "nextRankCategory",
        ({
            roomCode
        }) => {

            const room =
                rooms[
                    roomCode
                ];


            if (!room) {
                return;
            }


            if (
                socket.id !==
                room.host
            ) {

                return;
            }


            room.currentCategory++;


            if (
                room.currentCategory >=
                16
            ) {

                const results =
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

                        players:
                            results

                    }
                );


                return;
            }


            io.to(roomCode).emit(
                "nextRankCategory",
                {

                    category:
                        room.currentCategory

                }
            );

        }
    );


    // ====================================
    // AUCTION BID
    // ====================================

    socket.on(
        "bid",
        ({
            roomCode,
            amount
        }) => {

            const room =
                rooms[
                    roomCode
                ];


            if (!room) {
                return;
            }


            const player =
                room.players.find(
                    p =>
                        p.id ===
                        socket.id
                );


            if (!player) {
                return;
            }


            // TEAM LIMIT

            if (
                player.team.length >=
                5
            ) {

                socket.emit(
                    "roomError",
                    "Your team already has 5 characters!"
                );

                return;
            }


            const newBid =
                room.currentBid +
                amount;


            if (
                newBid <=
                room.currentBid
            ) {
                return;
            }


            if (
                newBid >
                player.balance
            ) {

                socket.emit(
                    "roomError",
                    "You don't have enough coins!"
                );

                return;
            }


            room.currentBid =
                newBid;


            room.highestBidder =
                socket.id;


            sendAuctionState(
                roomCode
            );

        }
    );


    // ====================================
    // NEXT AUCTION
    // ====================================

    socket.on(
        "nextAuction",
        ({
            roomCode
        }) => {

            const room =
                rooms[
                    roomCode
                ];


            if (!room) {
                return;
            }


            if (
                socket.id !==
                room.host
            ) {

                return;
            }


            room.auctionIndex++;


            if (
                room.auctionIndex >=
                auctionCharacters.length
            ) {

                finishAuction(
                    roomCode
                );

                return;
            }


            startAuction(
                roomCode
            );

        }
    );


    // ====================================
    // FINISH AUCTION
    // ====================================

    function finishAuction(
        roomCode
    ) {

        const room =
            rooms[
                roomCode
            ];


        if (!room) {
            return;
        }


        clearInterval(
            room.timer
        );


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
                );


        io.to(roomCode).emit(
            "finalResults",
            {

                players

            }
        );

    }


    // ====================================
    // DISCONNECT
    // ====================================

    socket.on(
        "disconnect",
        () => {

            Object.keys(
                rooms
            ).forEach(
                roomCode => {

                    const room =
                        rooms[
                            roomCode
                        ];


                    const index =
                        room.players.findIndex(
                            p =>
                                p.id ===
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


                    if (
                        room.players.length === 0
                    ) {

                        clearInterval(
                            room.timer
                        );

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

}
```

);

// ============================================
// SERVER
// ============================================

const PORT =
process.env.PORT || 3000;

server.listen(
PORT,
() => {

```
    console.log(
        `Server running on port ${PORT}`
    );

}
```

);
