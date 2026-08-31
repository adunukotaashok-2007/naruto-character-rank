/* =========================================================
   NARUTO CHARACTER RANK + AUCTION
   COMPLETE SERVER.JS
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
   ROOMS
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

/* ---------------------------------------------------------
   ROOM PLAYERS
--------------------------------------------------------- */

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

/* ---------------------------------------------------------
   BROADCAST PLAYERS
--------------------------------------------------------- */

function broadcastPlayers(room) {

    io.to(room.code).emit(
        "playersUpdated",
        {
            players:
                getRoomPlayers(room)
        }
    );
}

/* ---------------------------------------------------------
   AUCTION STATE
--------------------------------------------------------- */

function getAuctionState(room) {

    const auction =
        room.auction;

    let timeLeft = 0;

    if (
        auction.timerEndsAt
    ) {

        timeLeft = Math.max(
            0,
            Math.ceil(
                (
                    auction.timerEndsAt -
                    Date.now()
                ) / 1000
            )
        );

    }

    return {

        character:
            auction.character,

        currentBid:
            auction.currentBid,

        highestBidder:
            auction.highestBidder,

        highestBidderName:
            auction.highestBidder
                ? room.players[
                    auction.highestBidder
                ]?.name || null
                : null,

        timeLeft,

        index:
            auction.index,

        active:
            auction.active
    };
}

/* =========================================================
   CREATE ROOM
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
                data.gameMode ===
                "auction"
                    ? "auction"
                    : "rank";

            /*
             * IMPORTANT:
             * These values come from the host.
             * They are NOT fixed in the game.
             */

            const maxPlayers =
                Math.max(
                    2,
                    Math.min(
                        Number(
                            data.maxPlayers
                        ) || 6,
                        25
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
                    1,
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
             * Auction is 10 seconds by default.
             */

            const bidTime =
                10;

            const room = {

                code:
                    roomCode,

                host:
                    socket.id,

                gameMode,

                settings: {

                    maxPlayers,

                    teamSize,

                    startingBalance,

                    bidAmount,

                    bidTime

                },

                players: {},

                rank: {

                    started:
                        false,

                    categoryIndex:
                        0

                },

                auction: {

                    index:
                        0,

                    character:
                        null,

                    currentBid:
                        0,

                    highestBidder:
                        null,

                    timer:
                        null,

                    timerEndsAt:
                        null,

                    active:
                        false

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

                    isHost:
                        true,

                    gameMode,

                    settings:
                        room.settings

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

    /* =====================================================
       JOIN ROOM
    ===================================================== */

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

                    isHost:
                        false,

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

    /* =====================================================
       RANK CHARACTER SELECTION
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
                String(
                    data.character ||
                    ""
                );

            if (
                !Number.isInteger(
                    category
                )
            ) return;

            if (
                category < 0 ||
                category > 15
            ) return;

            if (
                !CHARACTERS.includes(
                    character
                )
            ) return;

            /*
             * IMPORTANT:
             *
             * Multiple players CAN select
             * the SAME character.
             */

            player.rankSelections[
                category
            ] = character;

            io.to(
                room.code
            ).emit(
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
             * Highest bidder cannot bid twice
             * in a row.
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

            /*
             * Player must have enough money.
             */

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
             * IMPORTANT:
             *
             * Do NOT finish auction here.
             *
             * Only update the bid.
             */

            auction.currentBid =
                newBid;

            auction.highestBidder =
                socket.id;

            /*
             * Every valid bid gives
             * another 10 seconds.
             */

            resetAuctionTimer(
                room
            );

            /*
             * Send the updated auction
             * to EVERY player.
             */

            io.to(
                room.code
            ).emit(
                "auctionUpdated",
                getAuctionState(room)
            );

            /*
             * Also send timer event.
             */

            io.to(
                room.code
            ).emit(
                "auctionTimer",
                {
                    timeLeft:
                        room.settings
                            .bidTime
                }
            );

            console.log(
                "BID:",
                room.code,
                auction.character,
                player.name,
                newBid
            );

        }
    );

    /* =====================================================
       UNSOLD BUTTON
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
                socket.id !==
                room.host
            ) {

                socket.emit(
                    "errorMessage",
                    "Only the host can mark a character UNSOLD."
                );

                return;
            }

            if (
                !room.auction.active
            ) return;

            /*
             * Host can manually press UNSOLD.
             */

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

            /*
             * If this player was
             * highest bidder, remove
             * their reference.
             */

            if (
                room.auction
                    .highestBidder ===
                socket.id
            ) {

                room.auction
                    .highestBidder =
                    null;

            }

            delete room.players[
                socket.id
            ];

            /*
             * Host leaves.
             * Give host position to
             * another player.
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
                        room.auction
                            .timer
                    ) {

                        clearTimeout(
                            room.auction
                                .timer
                        );

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

});

/* =========================================================
   RANK GAME
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

    io.to(
        room.code
    ).emit(
        "rankGameStarted",
        {

            categoryIndex:
                0

        }
    );

}

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

    /*
     * Everyone must select
     * before moving forward.
     */

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

    io.to(
        room.code
    ).emit(
        "rankCategoryComplete",
        {

            categoryIndex:
                category

        }
    );

    setTimeout(
        () => {

            /*
             * Make sure room still exists.
             */

            if (
                !rooms.has(
                    room.code
                )
            ) return;

            /*
             * 16 categories:
             * 0 to 15.
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

            io.to(
                room.code
            ).emit(
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

    io.to(
        room.code
    ).emit(
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

    const auction =
        room.auction;

    /*
     * Reset everything.
     */

    auction.index =
        0;

    auction.character =
        null;

    auction.currentBid =
        0;

    auction.highestBidder =
        null;

    auction.active =
        false;

    auction.timerEndsAt =
        null;

    if (
        auction.timer
    ) {

        clearTimeout(
            auction.timer
        );

        auction.timer =
            null;
    }

    /*
     * Reset every team's
     * balance and characters.
     */

    Object.values(
        room.players
    ).forEach(
        player => {

            player.balance =
                room.settings
                    .startingBalance;

            player.team =
                [];

        }
    );

    io.to(
        room.code
    ).emit(
        "auctionStarted",
        {

            settings:
                room.settings,

            message:
                "Auction is starting..."

        }
    );

    setTimeout(
        () => {

            if (
                rooms.has(
                    room.code
                )
            ) {

                startAuctionCharacter(
                    room
                );

            }

        },
        1000
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

    /*
     * All characters finished.
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

    /*
     * Check whether everyone
     * already has their maximum
     * number of players.
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
     * Current character.
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

    /*
     * Start the 10-second timer.
     */

    resetAuctionTimer(
        room
    );

    /*
     * Send character.
     */

    io.to(
        room.code
    ).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    /*
     * Explicit timer event.
     */

    io.to(
        room.code
    ).emit(
        "auctionTimer",
        {

            timeLeft:
                room.settings.bidTime

        }
    );

    console.log(
        "Auction:",
        room.code,
        auction.character
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

    /*
     * Clear old timer.
     */

    if (
        auction.timer
    ) {

        clearTimeout(
            auction.timer
        );

        auction.timer =
            null;
    }

    /*
     * IMPORTANT:
     * Always exactly 10 seconds.
     */

    const seconds =
        Number(
            room.settings.bidTime
        ) || 10;

    auction.timerEndsAt =
        Date.now() +
        seconds * 1000;

    /*
     * Timer runs on SERVER.
     * Therefore every player gets
     * the same result.
     */

    auction.timer =
        setTimeout(
            () => {

                /*
                 * Make sure auction
                 * is still active.
                 */

                if (
                    !auction.active
                ) return;

                /*
                 * Timer expired.
                 */

                finishAuctionCharacter(
                    room,
                    auction.highestBidder
                        ? false
                        : true
                );

            },
            seconds * 1000
        );

}

/* =========================================================
   FINISH ONE AUCTION CHARACTER
========================================================= */

function finishAuctionCharacter(
    room,
    unsold = false
) {

    const auction =
        room.auction;

    /*
     * Prevent duplicate
     * SOLD / UNSOLD events.
     */

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

    auction.timerEndsAt =
        null;

    /*
     * UNSOLD
     */

    if (
        unsold ||
        !auction.highestBidder
    ) {

        const character =
            auction.character;

        io.to(
            room.code
        ).emit(
            "auctionSold",
            {

                sold:
                    false,

                unsold:
                    true,

                character,

                bidderName:
                    null,

                playerName:
                    null,

                price:
                    0

            }
        );

        io.to(
            room.code
        ).emit(
            "auctionUnsoldResult",
            {

                character

            }
        );

        console.log(
            "UNSOLD:",
            character
        );

    }

    /*
     * SOLD
     */

    else {

        const winner =
            room.players[
                auction.highestBidder
            ];

        if (!winner) {

            /*
             * Safety fallback.
             */

            finishAuctionCharacter(
                room,
                true
            );

            return;
        }

        const character =
            auction.character;

        const price =
            auction.currentBid;

        /*
         * Deduct money.
         */

        winner.balance -=
            price;

        /*
         * Add character
         * to winner's team.
         */

        winner.team.push(
            character
        );

        /*
         * THIS IS THE IMPORTANT PART.
         *
         * bidderName is explicitly sent.
         * Therefore frontend will not
         * receive undefined.
         */

        io.to(
            room.code
        ).emit(
            "auctionSold",
            {

                sold:
                    true,

                unsold:
                    false,

                character,

                bidderId:
                    winner.id,

                bidderName:
                    winner.name,

                playerName:
                    winner.name,

                price,

                balance:
                    winner.balance,

                team:
                    winner.team

            }
        );

        console.log(
            "SOLD:",
            character,
            "->",
            winner.name,
            price
        );

    }

    /*
     * Update player balances.
     */

    broadcastPlayers(
        room
    );

    /*
     * Move to next character.
     */

    auction.index++;

    setTimeout(
        () => {

            if (
                !rooms.has(
                    room.code
                )
            ) return;

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

    auction.timerEndsAt =
        null;

    /*
     * Send final teams.
     */

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

    io.to(
        room.code
    ).emit(
        "auctionFinished",
        {

            teams

        }
    );

    /*
     * Also send a general final event
     * in case your frontend uses it.
     */

    io.to(
        room.code
    ).emit(
        "gameFinished",
        {

            mode:
                "auction",

            teams

        }
    );

    console.log(
        "Auction finished:",
        room.code
    );

}

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
    "/health",
    (req, res) => {

        res.json({

            status:
                "ok",

            rooms:
                rooms.size

        });

    }
);

/* =========================================================
   START SERVER
========================================================= */

server.listen(
    PORT,
    () => {

        console.log(
            `Naruto game server running on port ${PORT}`
        );

    }
);
