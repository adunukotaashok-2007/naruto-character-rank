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

/*
Room:

{
    code,
    host,
    gameMode,

    settings: {
        maxPlayers,
        teamSize,
        startingBalance,
        bidAmount,
        bidTime
    },

    players: {
        socketId: {
            id,
            name,
            balance,
            team: [],
            rankSelections: {}
        }
    },

    auction: {
        index,
        character,
        currentBid,
        highestBidder,
        timer
    }
}
*/

/* =========================================================
   CHARACTER LIST
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

    return Object.values(room.players)
        .map(player => ({
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


function getHost(room) {

    return room.players[room.host];
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

    socket.on(
        "createRoom",
        data => {

            const roomCode =
                generateRoomCode();


            const playerName =
                data.name ||
                "Player 1";


            const gameMode =
                data.gameMode ||
                "rank";


            const settings = {

                maxPlayers:
                    Math.max(
                        2,
                        Math.min(
                            Number(
                                data.maxPlayers
                            ) || 6,
                            25
                        )
                    ),

                teamSize:
                    Math.max(
                        1,
                        Number(
                            data.teamSize
                        ) || 5
                    ),

                startingBalance:
                    Math.max(
                        0,
                        Number(
                            data.startingBalance
                        ) || 1000
                    ),

                bidAmount:
                    Math.max(
                        1,
                        Number(
                            data.bidAmount
                        ) || 50
                    ),

                bidTime:
                    Math.max(
                        1,
                        Number(
                            data.bidTime
                        ) || 10
                    )
            };


            const room = {

                code: roomCode,

                host: socket.id,

                gameMode,

                settings,

                players: {},

                rank: {

                    categoryIndex: 0,

                    selections: {},

                    started: false

                },

                auction: {

                    index: 0,

                    currentBid: 0,

                    highestBidder: null,

                    character: null,

                    timer: null,

                    active: false

                }
            };


            room.players[socket.id] = {

                id: socket.id,

                name: playerName,

                balance:
                    settings.startingBalance,

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
                    settings
                }
            );


            broadcastPlayers(room);


            console.log(
                "Room created:",
                roomCode
            );
        }
    );


    /* =====================================================
       JOIN ROOM
    ===================================================== */

    socket.on(
        "joinRoom",
        data => {

            const roomCode =
                String(
                    data.roomCode || ""
                ).toUpperCase();


            const room =
                rooms.get(roomCode);


            if (!room) {

                socket.emit(
                    "errorMessage",
                    "Room not found."
                );

                return;
            }


            const playerCount =
                Object.keys(
                    room.players
                ).length;


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
                data.name ||
                `Player ${playerCount + 1}`;


            room.players[socket.id] = {

                id: socket.id,

                name: playerName,

                balance:
                    room.settings
                        .startingBalance,

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
                    gameMode:
                        room.gameMode,
                    settings:
                        room.settings
                }
            );


            broadcastPlayers(room);
        }
    );


    /* =====================================================
       START GAME
    ===================================================== */

    socket.on(
        "startGame",
        () => {

            const room =
                rooms.get(
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
                Object.keys(
                    room.players
                ).length;


            if (
                count < 2
            ) {

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

                room.rank.started =
                    true;

                room.rank.categoryIndex =
                    0;

                io.to(room.code).emit(
                    "rankGameStarted",
                    {
                        categoryIndex: 0
                    }
                );

            } else {

                startAuction(room);

            }
        }
    );


    /* =====================================================
       CHARACTER RANK SELECTION
    ===================================================== */

    socket.on(
        "rankSelect",
        data => {

            const room =
                rooms.get(
                    socket.roomCode
                );


            if (!room) return;


            if (
                !room.rank.started
            ) return;


            const player =
                room.players[
                    socket.id
                ];


            if (!player) return;


            const category =
                Number(
                    data.categoryIndex
                );


            const character =
                data.character;


            if (
                !Number.isInteger(
                    category
                )
            ) return;


            if (
                !CHARACTERS.includes(
                    character
                )
            ) {

                return;
            }


            /*
             * Same character CAN be selected
             * by multiple players.
             */


            player.rankSelections[
                category
            ] = character;


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
        }
    );


    /* =====================================================
       AUCTION BID
    ===================================================== */

    socket.on(
        "auctionBid",
        () => {

            const room =
                rooms.get(
                    socket.roomCode
                );


            if (!room) return;


            const auction =
                room.auction;


            if (
                !auction.active
            ) return;


            const player =
                room.players[
                    socket.id
                ];


            if (!player) return;


            /*
             * Highest bidder cannot bid again
             * until somebody else bids.
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
                    "Not enough balance."
                );

                return;
            }


            auction.currentBid =
                newBid;


            auction.highestBidder =
                socket.id;


            /*
             * Reset the timer.
             */

            resetAuctionTimer(
                room
            );


            io.to(room.code).emit(
                "auctionUpdated",
                getAuctionState(room)
            );
        }
    );


    /* =====================================================
       UNSOLD
    ===================================================== */

    socket.on(
        "auctionUnsold",
        () => {

            const room =
                rooms.get(
                    socket.roomCode
                );


            if (!room) return;


            if (
                !room.auction.active
            ) return;


            finishAuctionCharacter(
                room,
                true
            );
        }
    );


    /* =====================================================
       DISCONNECT
    ===================================================== */

    socket.on(
        "disconnect",
        () => {

            const roomCode =
                socket.roomCode;


            if (!roomCode) return;


            const room =
                rooms.get(
                    roomCode
                );


            if (!room) return;


            delete room.players[
                socket.id
            ];


            if (
                room.host ===
                socket.id
            ) {

                const remaining =
                    Object.keys(
                        room.players
                    );


                if (
                    remaining.length
                ) {

                    room.host =
                        remaining[0];

                    io.to(room.code).emit(
                        "hostChanged",
                        {
                            host:
                                room.host
                        }
                    );

                } else {

                    if (
                        room.auction.timer
                    ) {

                        clearTimeout(
                            room.auction.timer
                        );

                    }

                    rooms.delete(
                        roomCode
                    );

                    return;
                }
            }


            broadcastPlayers(room);
        }
    );

});


/* =========================================================
   RANK CATEGORY COMPLETE
========================================================= */

function checkRankCategoryComplete(
    room,
    category
) {

    const players =
        Object.values(
            room.players
        );


    const complete =
        players.every(
            player =>
                player.rankSelections[
                    category
                ]
        );


    if (!complete) {
        return;
    }


    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex:
                category
        }
    );


    setTimeout(
        () => {

            if (
                category >= 15
            ) {

                finishRankGame(
                    room
                );

                return;
            }


            room.rank.categoryIndex =
                category + 1;


            io.to(room.code).emit(
                "rankNextCategory",
                {
                    categoryIndex:
                        category + 1
                }
            );

        },
        1200
    );
}


/* =========================================================
   RANK FINAL
========================================================= */

function finishRankGame(room) {

    room.rank.started =
        false;


    const results =
        Object.values(
            room.players
        )
        .map(
            player => ({

                playerId:
                    player.id,

                playerName:
                    player.name,

                selections:
                    player.rankSelections

            })
        );


    /*
     * This is deliberately sent as raw selections.
     *
     * Your frontend will display the final teams.
     *
     * A real AI API can be connected here later.
     */

    io.to(room.code).emit(
        "rankGameFinished",
        {
            results
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


    Object.values(
        room.players
    ).forEach(
        player => {

            player.balance =
                room.settings
                    .startingBalance;

            player.team = [];

        }
    );


    io.to(room.code).emit(
        "auctionStarted",
        {
            settings:
                room.settings
        }
    );


    startAuctionCharacter(
        room
    );
}


/* =========================================================
   START AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(
    room
) {

    const auction =
        room.auction;


    if (
        auction.index >=
        CHARACTERS.length
    ) {

        finishAuction(
            room
        );

        return;
    }


    /*
     * If every player already has
     * the required number of characters,
     * auction is finished.
     */

    const allFull =
        Object.values(
            room.players
        ).every(
            player =>
                player.team.length >=
                room.settings.teamSize
        );


    if (allFull) {

        finishAuction(
            room
        );

        return;
    }


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


    resetAuctionTimer(
        room
    );


    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );
}


/* =========================================================
   AUCTION TIMER
========================================================= */

function resetAuctionTimer(
    room
) {

    const auction =
        room.auction;


    if (
        auction.timer
    ) {

        clearTimeout(
            auction.timer
        );
    }


    auction.timer =
        setTimeout(
            () => {

                if (
                    !auction.active
                ) return;


                /*
                 * No bid in the time:
                 * UNSOLD.
                 */

                finishAuctionCharacter(
                    room,
                    true
                );

            },
            room.settings.bidTime *
            1000
        );


    io.to(room.code).emit(
        "auctionTimer",
        {
            seconds:
                room.settings
                    .bidTime
        }
    );
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


    if (
        !auction.active
    ) return;


    auction.active =
        false;


    if (
        auction.timer
    ) {

        clearTimeout(
            auction.timer
        );

        auction.timer =
            null;
    }


    if (
        unsold ||
        !auction.highestBidder
    ) {

        io.to(room.code).emit(
            "auctionSold",
            {
                character:
                    auction.character,

                sold: false,

                message:
                    "UNSOLD"
            }
        );

    } else {

        const player =
            room.players[
                auction.highestBidder
            ];


        if (player) {

            player.balance -=
                auction.currentBid;


            player.team.push(
                {
                    character:
                        auction.character,

                    price:
                        auction.currentBid
                }
            );


            io.to(room.code).emit(
                "auctionSold",
                {
                    character:
                        auction.character,

                    sold: true,

                    playerId:
                        player.id,

                    playerName:
                        player.name,

                    price:
                        auction.currentBid
                }
            );
        }
    }


    auction.index++;


    /*
     * Give clients time to display
     * SOLD / UNSOLD.
     */

    setTimeout(
        () => {

            if (
                room &&
                rooms.has(room.code)
            ) {

                startAuctionCharacter(
                    room
                );

            }

        },
        1800
    );
}


/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {

    const auction =
        room.auction;


    return {

        character:
            auction.character,

        index:
            auction.index,

        currentBid:
            auction.currentBid,

        highestBidder:
            auction.highestBidder,

        highestBidderName:
            auction.highestBidder
                ? room.players[
                    auction.highestBidder
                ]?.name || ""
                : "",

        players:
            getRoomPlayers(room),

        settings:
            room.settings

    };
}


/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    room.auction.active =
        false;


    if (
        room.auction.timer
    ) {

        clearTimeout(
            room.auction.timer
        );

        room.auction.timer =
            null;
    }


    const teams =
        Object.values(
            room.players
        )
        .map(
            player => ({

                playerId:
                    player.id,

                playerName:
                    player.name,

                balance:
                    player.balance,

                team:
                    player.team

            })
        );


    /*
     * The frontend receives complete teams.
     * A real AI evaluator can analyze these teams.
     */

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
    "0.0.0.0",
    () => {

        console.log(
            `Naruto server running on port ${PORT}`
        );

    }
);
