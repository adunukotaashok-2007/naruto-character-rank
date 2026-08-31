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

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "..",
            "index.html"
        )
    );

});


/* =========================================================
   GAME STORAGE
========================================================= */

const rooms = new Map();


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

        code =
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

    } while (rooms.has(code));

    return code;
}


function getRoomPlayers(room) {

    return Object.values(room.players).map(
        player => ({

            id: player.id,

            name: player.name,

            balance: player.balance,

            team: player.team

        })
    );
}


function broadcastPlayers(room) {

    io.to(room.code).emit(
        "playersUpdated",
        {
            players:
                getRoomPlayers(room)
        }
    );
}


function getRoom(socket) {

    if (!socket.roomCode) {
        return null;
    }

    return rooms.get(
        socket.roomCode
    );
}


/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {

    const auction =
        room.auction;

    let highestBidderName = null;

    if (
        auction.highestBidder &&
        room.players[
            auction.highestBidder
        ]
    ) {

        highestBidderName =
            room.players[
                auction.highestBidder
            ].name;
    }


    return {

        index:
            auction.index,

        character:
            auction.character,

        currentBid:
            auction.currentBid,

        highestBidder:
            auction.highestBidder,

        highestBidderName,

        timeLeft:
            auction.timeLeft,

        active:
            auction.active,

        settings:
            room.settings

    };
}


/* =========================================================
   SEND AUCTION STATE
========================================================= */

function broadcastAuction(room) {

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

}


/* =========================================================
   SOCKET CONNECTION
========================================================= */

io.on(
    "connection",
    socket => {

        console.log(
            "Connected:",
            socket.id
        );


        /* =================================================
           CREATE ROOM
        ================================================= */

        socket.on(
            "createRoom",
            data => {

                data =
                    data || {};


                const roomCode =
                    generateRoomCode();


                const playerName =
                    String(
                        data.name ||
                        "Player 1"
                    ).trim();


                const gameMode =
                    data.gameMode ||
                    "rank";


                const maxPlayers =
                    Math.max(
                        2,
                        Math.min(
                            25,
                            Number(
                                data.maxPlayers
                            ) || 6
                        )
                    );


                const teamSize =
                    Math.max(
                        1,
                        Number(
                            data.teamSize
                        ) || 5
                    );


                const startingBalance =
                    Math.max(
                        0,
                        Number(
                            data.startingBalance
                        ) || 1000
                    );


                const bidAmount =
                    Math.max(
                        1,
                        Number(
                            data.bidAmount
                        ) || 50
                    );


                /*
                 * Auction is always 10 seconds.
                 */

                const bidTime = 10;


                const settings = {

                    maxPlayers,

                    teamSize,

                    startingBalance,

                    bidAmount,

                    bidTime

                };


                const room = {

                    code:
                        roomCode,

                    host:
                        socket.id,

                    gameMode,

                    settings,

                    players: {},

                    rank: {

                        categoryIndex: 0,

                        started: false

                    },

                    auction: {

                        index: 0,

                        character: null,

                        currentBid: 0,

                        highestBidder: null,

                        timeLeft: 10,

                        timer: null,

                        active: false,

                        roundId: 0

                    }

                };


                room.players[
                    socket.id
                ] = {

                    id:
                        socket.id,

                    name:
                        playerName,

                    balance:
                        startingBalance,

                    team: [],

                    rankSelections: {}

                };


                rooms.set(
                    roomCode,
                    room
                );


                socket.join(
                    roomCode
                );


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


                broadcastPlayers(
                    room
                );


                console.log(
                    "Room created:",
                    roomCode
                );

            }
        );


        /* =================================================
           JOIN ROOM
        ================================================= */

        socket.on(
            "joinRoom",
            data => {

                data =
                    data || {};


                const roomCode =
                    String(
                        data.roomCode ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                const room =
                    rooms.get(
                        roomCode
                    );


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
                    String(
                        data.name ||
                        `Player ${playerCount + 1}`
                    ).trim();


                room.players[
                    socket.id
                ] = {

                    id:
                        socket.id,

                    name:
                        playerName,

                    balance:
                        room.settings
                            .startingBalance,

                    team: [],

                    rankSelections: {}

                };


                socket.join(
                    roomCode
                );


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


                broadcastPlayers(
                    room
                );


                console.log(
                    playerName,
                    "joined",
                    roomCode
                );

            }
        );


        /* =================================================
           START GAME
        ================================================= */

        socket.on(
            "startGame",
            () => {

                const room =
                    getRoom(socket);


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


                if (count < 2) {

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

                    startRankGame(
                        room
                    );

                } else {

                    startAuction(
                        room
                    );

                }

            }
        );


        /* =================================================
           RANK CHARACTER SELECTION
        ================================================= */

        socket.on(
            "rankSelect",
            data => {

                const room =
                    getRoom(socket);


                if (!room) return;


                if (
                    !room.rank.started
                ) return;


                data =
                    data || {};


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
                ) {

                    return;
                }


                if (
                    category < 0 ||
                    category > 15
                ) {

                    return;
                }


                if (
                    !CHARACTERS.includes(
                        character
                    )
                ) {

                    return;
                }


                const player =
                    room.players[
                        socket.id
                    ];


                if (!player) return;


                /*
                 * SAME CHARACTER CAN BE
                 * SELECTED BY MULTIPLE PLAYERS.
                 */

                player.rankSelections[
                    category
                ] =
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

            }
        );


        /* =================================================
           AUCTION BID
        ================================================= */

        socket.on(
            "auctionBid",
            () => {

                const room =
                    getRoom(socket);


                if (!room) return;


                const auction =
                    room.auction;


                if (
                    !auction.active
                ) {

                    return;
                }


                const player =
                    room.players[
                        socket.id
                    ];


                if (!player) return;


                /*
                 * Player already has a full team.
                 */

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


                /*
                 * Highest bidder must wait for
                 * another player.
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


                /*
                 * Every valid bid creates a new
                 * auction round.
                 *
                 * This prevents an old timer from
                 * making the character unsold.
                 */

                auction.roundId++;


                auction.currentBid =
                    newBid;


                auction.highestBidder =
                    socket.id;


                auction.timeLeft =
                    room.settings.bidTime;


                broadcastAuction(
                    room
                );


                startAuctionTimer(
                    room
                );

            }
        );


        /* =================================================
           MANUAL UNSOLD
        ================================================= */

        socket.on(
            "auctionUnsold",
            () => {

                const room =
                    getRoom(socket);


                if (!room) return;


                if (
                    !room.auction.active
                ) {

                    return;
                }


                /*
                 * ONLY HOST CAN FORCE UNSOLD.
                 */

                if (
                    socket.id !==
                    room.host
                ) {

                    socket.emit(
                        "errorMessage",
                        "Only the host can mark a character unsold."
                    );

                    return;
                }


                finishAuctionCharacter(
                    room,
                    true
                );

            }
        );


        /* =================================================
           DISCONNECT
        ================================================= */

        socket.on(
            "disconnect",
            () => {

                const roomCode =
                    socket.roomCode;


                if (!roomCode) {
                    return;
                }


                const room =
                    rooms.get(
                        roomCode
                    );


                if (!room) {
                    return;
                }


                delete room.players[
                    socket.id
                ];


                /*
                 * If disconnected player was
                 * highest bidder, cancel their bid
                 * and continue safely.
                 */

                if (
                    room.auction
                        .highestBidder ===
                    socket.id
                ) {

                    room.auction
                        .highestBidder =
                        null;

                    room.auction
                        .currentBid =
                        0;

                    room.auction
                        .timeLeft =
                        room.settings
                            .bidTime;

                    room.auction
                        .roundId++;

                    if (
                        room.auction.active
                    ) {

                        broadcastAuction(
                            room
                        );

                        startAuctionTimer(
                            room
                        );

                    }
                }


                /*
                 * Host transfer.
                 */

                if (
                    room.host ===
                    socket.id
                ) {

                    const remaining =
                        Object.keys(
                            room.players
                        );


                    if (
                        remaining.length > 0
                    ) {

                        room.host =
                            remaining[0];


                        io.to(
                            room.code
                        ).emit(
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

                            clearInterval(
                                room.auction.timer
                            );

                            room.auction.timer =
                                null;

                        }


                        rooms.delete(
                            roomCode
                        );


                        return;
                    }
                }


                broadcastPlayers(
                    room
                );

            }
        );

    }
);


/* =========================================================
   START RANK GAME
========================================================= */

function startRankGame(room) {

    room.rank.started =
        true;


    room.rank.categoryIndex =
        0;


    Object.values(
        room.players
    ).forEach(
        player => {

            player.rankSelections =
                {};

        }
    );


    io.to(room.code).emit(
        "rankGameStarted",
        {

            categoryIndex: 0,

            totalCategories: 16

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
                !room.rank.started
            ) {

                return;
            }


            /*
             * 16 CATEGORIES
             *
             * 0 - 15
             */

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
   FINISH RANK GAME
========================================================= */

function finishRankGame(room) {

    room.rank.started =
        false;


    const results =
        Object.values(
            room.players
        ).map(
            player => ({

                playerId:
                    player.id,

                playerName:
                    player.name,

                selections:
                    player.rankSelections

            })
        );


    io.to(room.code).emit(
        "rankGameFinished",
        {

            results,

            totalCategories:
                16

        }
    );

}


/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    /*
     * Reset player money and teams.
     */

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


    room.auction.index =
        0;


    room.auction.active =
        true;


    room.auction.roundId++;


    io.to(room.code).emit(
        "auctionStarted",
        {

            settings:
                room.settings,

            totalCharacters:
                CHARACTERS.length

        }
    );


    broadcastPlayers(
        room
    );


    startAuctionCharacter(
        room
    );

}


/* =========================================================
   START NEXT AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(
    room
) {

    const auction =
        room.auction;


    /*
     * Stop old timer.
     */

    if (
        auction.timer
    ) {

        clearInterval(
            auction.timer
        );

        auction.timer =
            null;

    }


    /*
     * Check if all teams are full.
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


    /*
     * No more characters.
     */

    if (
        auction.index >=
        CHARACTERS.length
    ) {

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


    auction.timeLeft =
        room.settings.bidTime;


    auction.active =
        true;


    /*
     * New round ID.
     */

    auction.roundId++;


    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );


    /*
     * Start the 10 second timer.
     */

    startAuctionTimer(
        room
    );

}


/* =========================================================
   AUCTION TIMER
========================================================= */

function startAuctionTimer(
    room
) {

    const auction =
        room.auction;


    /*
     * Kill old timer.
     */

    if (
        auction.timer
    ) {

        clearInterval(
            auction.timer
        );

        auction.timer =
            null;

    }


    /*
     * Save this round.
     */

    const thisRound =
        auction.roundId;


    /*
     * Make sure it starts at 10 seconds.
     */

    if (
        auction.timeLeft <= 0
    ) {

        auction.timeLeft =
            room.settings.bidTime;

    }


    /*
     * Send immediately.
     */

    broadcastAuction(
        room
    );


    auction.timer =
        setInterval(
            () => {

                /*
                 * Room disappeared.
                 */

                if (
                    !rooms.has(
                        room.code
                    )
                ) {

                    clearInterval(
                        auction.timer
                    );

                    auction.timer =
                        null;

                    return;
                }


                /*
                 * Old timer?
                 *
                 * Ignore it.
                 */

                if (
                    auction.roundId !==
                    thisRound
                ) {

                    clearInterval(
                        auction.timer
                    );

                    auction.timer =
                        null;

                    return;
                }


                if (
                    !auction.active
                ) {

                    clearInterval(
                        auction.timer
                    );

                    auction.timer =
                        null;

                    return;
                }


                auction.timeLeft--;


                broadcastAuction(
                    room
                );


                /*
                 * TIMER FINISHED
                 */

                if (
                    auction.timeLeft <= 0
                ) {

                    clearInterval(
                        auction.timer
                    );

                    auction.timer =
                        null;


                    /*
                     * Someone bid:
                     * SELL CHARACTER.
                     */

                    if (
                        auction.highestBidder
                    ) {

                        finishAuctionCharacter(
                            room,
                            false
                        );

                    } else {

                        /*
                         * Nobody bid:
                         * UNSOLD.
                         */

                        finishAuctionCharacter(
                            room,
                            true
                        );

                    }

                }

            },
            1000
        );

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
        !auction.active
    ) {

        return;
    }


    /*
     * Stop timer immediately.
     */

    if (
        auction.timer
    ) {

        clearInterval(
            auction.timer
        );

        auction.timer =
            null;

    }


    /*
     * Prevent old timers.
     */

    auction.active =
        false;


    auction.roundId++;


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

                price: 0,

                bidder: null,

                bidderName: null

            }
        );


    } else {

        /*
         * SOLD
         */

        const winner =
            room.players[
                auction.highestBidder
            ];


        if (!winner) {

            auction.currentBid =
                0;

            auction.highestBidder =
                null;


            startNextAuctionAfterDelay(
                room
            );

            return;
        }


        const price =
            auction.currentBid;


        /*
         * Deduct money.
         */

        winner.balance -=
            price;


        /*
         * Add character to team.
         */

        winner.team.push(
            character
        );


        io.to(room.code).emit(
            "auctionSold",
            {

                character,

                sold: true,

                unsold: false,

                price,

                bidder:
                    winner.id,

                bidderName:
                    winner.name

            }
        );


        broadcastPlayers(
            room
        );

    }


    startNextAuctionAfterDelay(
        room
    );

}


/* =========================================================
   NEXT AUCTION CHARACTER
========================================================= */

function startNextAuctionAfterDelay(
    room
) {

    /*
     * Wait a little so users can see
     * SOLD / UNSOLD.
     */

    setTimeout(
        () => {

            if (
                !rooms.has(
                    room.code
                )
            ) {

                return;
            }


            room.auction.index++;


            startAuctionCharacter(
                room
            );

        },
        1500
    );

}


/* =========================================================
   FINISH COMPLETE AUCTION
========================================================= */

function finishAuction(room) {

    const auction =
        room.auction;


    if (
        auction.timer
    ) {

        clearInterval(
            auction.timer
        );

        auction.timer =
            null;

    }


    auction.active =
        false;


    auction.roundId++;


    const teams =
        Object.values(
            room.players
        ).map(
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


    io.to(room.code).emit(
        "auctionFinished",
        {

            teams,

            settings:
                room.settings

        }
    );


    console.log(
        "Auction finished:",
        room.code
    );

}


/* =========================================================
   ERROR HANDLER
========================================================= */

process.on(
    "uncaughtException",
    error => {

        console.error(
            "Server error:",
            error
        );

    }
);


/* =========================================================
   START SERVER
========================================================= */

server.listen(
    PORT,
    () => {

        console.log(
            `Naruto Character Rank server running on port ${PORT}`
        );

    }
);
