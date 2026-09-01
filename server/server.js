const express = require("express");
const http = require("http");
const path = require("path");
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

/* =========================================================
   EXPRESS
========================================================= */

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        game: "Naruto Character Rank"
    });
});

/* =========================================================
   CHARACTERS
   These names MUST match Game.js
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

    "Guy",
    "Lee",
    "Duy",

    "Shikamaru",
    "Neji",
    "Gaara",
    "Kisame",
    "Sakura",
    "Nagato",
    "Obito",
    "Tsunade",
    "KillerB",
    "Kabuto",
    "Shisui",
    "Sakumo",
    "Hanzo",
    "ThirdRaikage",
    "FourthRaikage",
    "Onoki",
    "Mei",
    "Sasori",
    "Deidara",
    "Mu",
    "Gengetsu",
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
   CATEGORIES
========================================================= */

const CATEGORIES = [
    "Speed",
    "Strength",
    "Battle IQ",
    "Durability",
    "Chakra",
    "Ninjutsu",
    "Taijutsu",
    "Genjutsu",
    "Defense",
    "Attack",
    "Stamina",
    "Leadership",
    "Versatility",
    "Experience",
    "Teamwork",
    "Overall Power"
];

/* =========================================================
   ROOMS
========================================================= */

const rooms = new Map();

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

function getRoom(socket) {
    if (!socket.roomCode) {
        return null;
    }

    return rooms.get(socket.roomCode) || null;
}

function getPlayer(room, id) {
    if (!room) return null;

    return room.players[id] || null;
}

function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] =
            [result[j], result[i]];
    }

    return result;
}

/* =========================================================
   PUBLIC PLAYER DATA
========================================================= */

function getRoomPlayers(room) {
    return Object.values(room.players).map(player => ({
        id: player.id,
        name: player.name,

        balance: player.balance,
        spent: player.spent,

        team: [...player.team]
    }));
}

function broadcastPlayers(room) {
    io.to(room.code).emit("playersUpdated", {
        players: getRoomPlayers(room)
    });
}

/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {
    if (!room.auction) {
        return null;
    }

    const auction = room.auction;

    let remainingTime = 0;

    if (auction.endTime > 0) {
        remainingTime = Math.max(
            0,
            Math.ceil(
                (auction.endTime - Date.now()) / 1000
            )
        );
    }

    let highestBidderName = null;

    if (auction.highestBidder) {
        const player =
            room.players[auction.highestBidder];

        if (player) {
            highestBidderName = player.name;
        }
    }

    return {
        active: auction.active,

        character: auction.character,

        characterNumber:
            auction.index + 1,

        totalCharacters:
            auction.characters.length,

        currentBid:
            auction.currentBid,

        nextBid:
            auction.currentBid +
            room.settings.bidAmount,

        highestBidder:
            auction.highestBidder,

        highestBidderName,

        remainingTime,

        bidAmount:
            room.settings.bidAmount,

        bidTime:
            room.settings.bidTime
    };
}

/* =========================================================
   PERSONAL AUCTION DATA
========================================================= */

function sendPersonalAuctionState(room) {
    if (!room.auction) return;

    const auction = room.auction;

    Object.values(room.players).forEach(player => {

        const nextBid =
            auction.currentBid +
            room.settings.bidAmount;

        const hasGivenUp =
            auction.givenUp.has(player.id);

        const teamFull =
            player.team.length >=
            room.settings.teamSize;

        const isHighest =
            auction.highestBidder ===
            player.id;

        const canBid =
            auction.active &&
            !hasGivenUp &&
            !teamFull &&
            !isHighest &&
            player.balance >= nextBid;

        io.to(player.id).emit(
            "auctionMoneyUpdated",
            {
                balance: player.balance,

                remainingMoney:
                    player.balance,

                spent: player.spent,

                currentBid:
                    auction.currentBid,

                nextBid,

                canBid,

                gaveUp:
                    hasGivenUp
            }
        );
    });
}

/* =========================================================
   AUCTION TIMER
========================================================= */

function clearAuctionTimer(room) {
    if (
        room.auction &&
        room.auction.timer
    ) {
        clearTimeout(
            room.auction.timer
        );

        room.auction.timer = null;
    }
}

function clearAuctionTick(room) {
    if (
        room.auction &&
        room.auction.tickInterval
    ) {
        clearInterval(
            room.auction.tickInterval
        );

        room.auction.tickInterval = null;
    }
}

function sendAuctionTimer(room) {
    if (
        !room.auction ||
        !room.auction.active
    ) {
        return;
    }

    const seconds = Math.max(
        0,
        Math.ceil(
            (
                room.auction.endTime -
                Date.now()
            ) / 1000
        )
    );

    io.to(room.code).emit(
        "auctionTimer",
        {
            seconds
        }
    );
}

function resetAuctionTimer(room) {
    if (!room.auction) return;

    clearAuctionTimer(room);

    room.auction.endTime =
        Date.now() +
        room.settings.bidTime * 1000;

    sendAuctionTimer(room);

    room.auction.timer =
        setTimeout(() => {

            if (
                !room.auction ||
                !room.auction.active
            ) {
                return;
            }

            if (
                room.auction.highestBidder
            ) {
                finishAuctionCharacter(
                    room,
                    false
                );
            } else {
                finishAuctionCharacter(
                    room,
                    true
                );
            }

        }, room.settings.bidTime * 1000);
}

function startAuctionTick(room) {
    clearAuctionTick(room);

    room.auction.tickInterval =
        setInterval(() => {

            if (!rooms.has(room.code)) {
                clearAuctionTick(room);
                return;
            }

            if (
                !room.auction ||
                !room.auction.active
            ) {
                return;
            }

            sendAuctionTimer(room);

        }, 250);
}

/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    clearAuctionTimer(room);
    clearAuctionTick(room);

    Object.values(room.players).forEach(player => {

        player.balance =
            room.settings.startingBalance;

        player.spent = 0;
        player.team = [];
    });

    room.auction = {

        index: 0,

        characters:
            shuffle(CHARACTERS),

        character: null,

        currentBid: 0,

        highestBidder: null,

        active: false,

        endTime: 0,

        timer: null,

        tickInterval: null,

        givenUp: new Set()
    };

    io.to(room.code).emit(
        "auctionStarted",
        {
            settings: room.settings
        }
    );

    broadcastPlayers(room);

    startAuctionTick(room);

    startAuctionCharacter(room);
}

/* =========================================================
   START NEXT CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    clearAuctionTimer(room);

    const auction =
        room.auction;

    if (!auction) return;

    /* Finished all characters */

    if (
        auction.index >=
        auction.characters.length
    ) {
        finishAuction(room);
        return;
    }

    /* Check whether all teams are full */

    const allFull =
        Object.values(room.players)
            .every(player =>
                player.team.length >=
                room.settings.teamSize
            );

    if (allFull) {
        finishAuction(room);
        return;
    }

    auction.character =
        auction.characters[
            auction.index
        ];

    auction.currentBid = 0;

    auction.highestBidder = null;

    auction.givenUp = new Set();

    auction.active = true;

    auction.endTime = 0;

    /* Every new character resets give-up */

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    io.to(room.code).emit(
        "auctionNewCharacter",
        {
            character:
                auction.character,

            characterNumber:
                auction.index + 1,

            totalCharacters:
                auction.characters.length
        }
    );

    io.to(room.code).emit(
        "auctionReady",
        getAuctionState(room)
    );

    sendPersonalAuctionState(room);

    resetAuctionTimer(room);
}

/* =========================================================
   BID
========================================================= */

function handleBid(socket) {

    const room =
        getRoom(socket);

    if (!room) {
        socket.emit(
            "errorMessage",
            "You are not in a room."
        );

        return;
    }

    if (
        !room.auction ||
        !room.auction.active
    ) {
        socket.emit(
            "errorMessage",
            "Auction is not active."
        );

        return;
    }

    const auction =
        room.auction;

    const player =
        getPlayer(
            room,
            socket.id
        );

    if (!player) {
        return;
    }

    /* Already gave up */

    if (
        auction.givenUp.has(
            player.id
        )
    ) {
        socket.emit(
            "errorMessage",
            "You gave up on this character."
        );

        return;
    }

    /* Team full */

    if (
        player.team.length >=
        room.settings.teamSize
    ) {
        socket.emit(
            "errorMessage",
            "Your team is full."
        );

        return;
    }

    /* Already highest */

    if (
        auction.highestBidder ===
        player.id
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

    /* Money check */

    if (
        player.balance <
        newBid
    ) {
        socket.emit(
            "errorMessage",
            `Not enough money. Remaining: ${player.balance}`
        );

        return;
    }

    /* =====================================================
       ACCEPT BID
    ===================================================== */

    auction.currentBid =
        newBid;

    auction.highestBidder =
        player.id;

    /* If they had given up, remove it */

    auction.givenUp.delete(
        player.id
    );

    /* Send bid to EVERYONE */

    io.to(room.code).emit(
        "auctionBidMade",
        {
            playerId:
                player.id,

            playerName:
                player.name,

            character:
                auction.character,

            bid:
                newBid
        }
    );

    /* Update auction screen */

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    /* Update money */

    sendPersonalAuctionState(room);

    broadcastPlayers(room);

    /* IMPORTANT:
       Timer resets after EVERY valid bid.
    */

    resetAuctionTimer(room);

    /* Send current state again */

    sendPersonalAuctionState(room);
}

/* =========================================================
   GIVE UP
========================================================= */

function handleGiveUp(socket) {

    const room =
        getRoom(socket);

    if (!room) return;

    if (
        !room.auction ||
        !room.auction.active
    ) {
        return;
    }

    const auction =
        room.auction;

    const player =
        getPlayer(
            room,
            socket.id
        );

    if (!player) return;

    /* Already gave up */

    if (
        auction.givenUp.has(
            player.id
        )
    ) {
        return;
    }

    /* Add player to give-up list */

    auction.givenUp.add(
        player.id
    );

    io.to(room.code).emit(
        "auctionPlayerGaveUp",
        {
            playerId:
                player.id,

            playerName:
                player.name,

            character:
                auction.character
        }
    );

    sendPersonalAuctionState(room);

    /* =====================================================
       FIND PLAYERS STILL ALLOWED TO BID
    ===================================================== */

    const eligiblePlayers =
        Object.values(room.players)
            .filter(other => {

                const full =
                    other.team.length >=
                    room.settings.teamSize;

                const gaveUp =
                    auction.givenUp.has(
                        other.id
                    );

                return !full && !gaveUp;
            });

    /* =====================================================
       NOBODY LEFT
    ===================================================== */

    if (
        eligiblePlayers.length === 0
    ) {

        finishAuctionCharacter(
            room,
            true
        );

        return;
    }

    /* =====================================================
       ONLY ONE PLAYER LEFT
    =====================================================

       This fixes the 2-player situation.

       Example:

       Player 1 bids 100.
       Player 2 gives up.

       Player 1 immediately wins at 100.

       If nobody bid yet and Player 1 gives up,
       the remaining player does NOT pay anything.
    */

    if (
        eligiblePlayers.length === 1 &&
        auction.highestBidder
    ) {

        const highest =
            auction.highestBidder;

        const remaining =
            eligiblePlayers[0].id;

        /*
         * The remaining player must be
         * the highest bidder.
         *
         * If highest bidder is someone
         * who gave up, find the remaining
         * player only if they have actually
         * bid.
         */

        if (highest === remaining) {

            finishAuctionCharacter(
                room,
                false
            );

            return;
        }
    }

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    sendPersonalAuctionState(room);
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

    if (
        !auction ||
        !auction.active
    ) {
        return;
    }

    auction.active = false;

    clearAuctionTimer(room);

    let winner = null;

    if (
        !unsold &&
        auction.highestBidder
    ) {
        winner =
            room.players[
                auction.highestBidder
            ];
    }

    /* =====================================================
       SOLD
    ===================================================== */

    if (winner) {

        const price =
            auction.currentBid;

        /* Safety */

        if (
            winner.balance <
            price
        ) {
            winner = null;
        } else {

            winner.balance -= price;

            winner.spent += price;

            winner.team.push(
                auction.character
            );

            io.to(room.code).emit(
                "auctionSold",
                {
                    character:
                        auction.character,

                    winnerId:
                        winner.id,

                    winnerName:
                        winner.name,

                    price,

                    balance:
                        winner.balance,

                    remainingMoney:
                        winner.balance,

                    spent:
                        winner.spent,

                    team:
                        [...winner.team]
                }
            );
        }
    }

    /* =====================================================
       UNSOLD
    ===================================================== */

    if (!winner) {

        io.to(room.code).emit(
            "auctionUnsold",
            {
                character:
                    auction.character
            }
        );
    }

    /* Update EVERYONE */

    broadcastPlayers(room);

    sendPersonalAuctionState(room);

    /* =====================================================
       NEXT CHARACTER
    ===================================================== */

    setTimeout(() => {

        if (!rooms.has(room.code)) {
            return;
        }

        if (!room.auction) {
            return;
        }

        room.auction.index++;

        startAuctionCharacter(room);

    }, 1500);
}

/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    if (!room.auction) return;

    clearAuctionTimer(room);
    clearAuctionTick(room);

    room.auction.active = false;

    const teams =
        Object.values(room.players)
            .map(player => ({
                playerId:
                    player.id,

                playerName:
                    player.name,

                team:
                    [...player.team],

                balance:
                    player.balance,

                remainingMoney:
                    player.balance,

                spent:
                    player.spent
            }));

    io.to(room.code).emit(
        "auctionFinished",
        {
            teams
        }
    );

    broadcastPlayers(room);
}

/* =========================================================
   RANKING
========================================================= */

function handleRankSelect(socket, data) {

    const room =
        getRoom(socket);

    if (!room) return;

    if (!room.rank.started) {
        return;
    }

    const player =
        getPlayer(
            room,
            socket.id
        );

    if (!player) return;

    const categoryIndex =
        Number(data.categoryIndex);

    const character =
        String(data.character || "");

    /* Category check */

    if (
        !Number.isInteger(
            categoryIndex
        ) ||
        categoryIndex < 0 ||
        categoryIndex >=
            CATEGORIES.length
    ) {

        socket.emit(
            "errorMessage",
            "Invalid category."
        );

        return;
    }

    /* Character check */

    if (
        !CHARACTERS.includes(
            character
        )
    ) {

        socket.emit(
            "errorMessage",
            `Invalid character: ${character}`
        );

        return;
    }

    /* Current category only */

    if (
        categoryIndex !==
        room.rank.categoryIndex
    ) {

        socket.emit(
            "errorMessage",
            "Please wait for the current category."
        );

        return;
    }

    /* Save only this player's selection */

    player.rankSelections[
        categoryIndex
    ] = character;

    /* Notify everyone */

    io.to(room.code).emit(
        "rankSelectionMade",
        {
            playerId:
                player.id,

            playerName:
                player.name,

            categoryIndex,

            character
        }
    );

    checkRankCategoryComplete(room);
}

/* =========================================================
   CHECK RANK CATEGORY
========================================================= */

function checkRankCategoryComplete(room) {

    const category =
        room.rank.categoryIndex;

    const playerList =
        Object.values(room.players);

    const complete =
        playerList.length >= 2 &&
        playerList.every(player =>
            Object.prototype.hasOwnProperty.call(
                player.rankSelections,
                category
            )
        );

    if (!complete) {

        io.to(room.code).emit(
            "rankWaiting",
            {
                categoryIndex:
                    category,

                categoryNumber:
                    category + 1,

                totalCategories:
                    CATEGORIES.length,

                selectedPlayers:
                    playerList.filter(
                        player =>
                            Object.prototype.hasOwnProperty.call(
                                player.rankSelections,
                                category
                            )
                    ).length,

                totalPlayers:
                    playerList.length
            }
        );

        return;
    }

    /* =====================================================
       CATEGORY COMPLETE
    ===================================================== */

    const selections =
        playerList.map(player => ({
            playerId:
                player.id,

            playerName:
                player.name,

            character:
                player.rankSelections[
                    category
                ]
        }));

    /*
     * Determine the strongest character according
     * to the server ranking list.
     */

    const ranking =
        RANKINGS[
            CATEGORIES[category]
        ] || [];

    let bestIndex =
        Infinity;

    let bestSelection = null;

    selections.forEach(selection => {

        const index =
            ranking.indexOf(
                selection.character
            );

        const actualIndex =
            index === -1
                ? 9999
                : index;

        if (
            actualIndex <
            bestIndex
        ) {

            bestIndex =
                actualIndex;

            bestSelection =
                selection;
        }
    });

    io.to(room.code).emit(
        "rankCategoryResult",
        {
            categoryIndex:
                category,

            categoryName:
                CATEGORIES[category],

            selections,

            winner:
                bestSelection
                    ? {
                        playerId:
                            bestSelection.playerId,

                        playerName:
                            bestSelection.playerName,

                        character:
                            bestSelection.character
                    }
                    : null
        }
    );

    /* =====================================================
       NEXT CATEGORY
    ===================================================== */

    if (
        category + 1 >=
        CATEGORIES.length
    ) {

        finishRanking(room);

        return;
    }

    setTimeout(() => {

        if (!rooms.has(room.code)) {
            return;
        }

        room.rank.categoryIndex++;

        io.to(room.code).emit(
            "rankCategoryChanged",
            {
                categoryIndex:
                    room.rank.categoryIndex,

                categoryNumber:
                    room.rank.categoryIndex + 1,

                totalCategories:
                    CATEGORIES.length,

                categoryName:
                    CATEGORIES[
                        room.rank.categoryIndex
                    ]
            }
        );

        sendPrivateRankStatus(room);

    }, 1200);
}

/* =========================================================
   RANKING FINAL RESULT
========================================================= */

function finishRanking(room) {

    room.rank.started = false;

    const results =
        Object.values(room.players)
            .map(player => {

                const selections =
                    CATEGORIES.map(
                        (_, index) =>
                            player.rankSelections[
                                index
                            ] || null
                    );

                let score = 0;

                selections.forEach(
                    (character, index) => {

                        const ranking =
                            RANKINGS[
                                CATEGORIES[index]
                            ] || [];

                        const position =
                            ranking.indexOf(
                                character
                            );

                        if (position >= 0) {
                            score +=
                                ranking.length -
                                position;
                        }
                    }
                );

                return {
                    playerId:
                        player.id,

                    playerName:
                        player.name,

                    selections,

                    score
                };
            });

    results.sort(
        (a, b) =>
            b.score - a.score
    );

    let strongestTeam = null;

    if (results.length > 0) {
        strongestTeam =
            results[0];
    }

    io.to(room.code).emit(
        "rankFinished",
        {
            results,

            strongestTeam
        }
    );
}

/* =========================================================
   SOCKET CONNECTION
========================================================= */

io.on("connection", socket => {

    console.log(
        "Player connected:",
        socket.id
    );

    /* =====================================================
       CREATE ROOM
    ===================================================== */

    socket.on(
        "createRoom",
        data => {

            const name =
                String(
                    data?.name || ""
                ).trim();

            if (!name) {
                socket.emit(
                    "errorMessage",
                    "Enter your name."
                );

                return;
            }

            const roomCode =
                generateRoomCode();

            const maxPlayers =
                Math.max(
                    2,
                    Number(
                        data?.maxPlayers
                    ) || 6
                );

            const teamSize =
                Math.max(
                    1,
                    Number(
                        data?.teamSize
                    ) || 5
                );

            const startingBalance =
                Math.max(
                    1,
                    Number(
                        data?.startingBalance
                    ) || 1000
                );

            const bidAmount =
                Math.max(
                    1,
                    Number(
                        data?.bidAmount
                    ) || 50
                );

            const bidTime =
                Math.max(
                    3,
                    Number(
                        data?.bidTime
                    ) || 10
                );

            const room = {

                code:
                    roomCode,

                hostId:
                    socket.id,

                gameMode:
                    data?.gameMode ||
                    "rank",

                maxPlayers,

                settings: {
                    teamSize,
                    startingBalance,
                    bidAmount,
                    bidTime
                },

                players: {},

                rank: {
                    started: false,
                    categoryIndex: 0
                },

                auction: null
            };

            room.players[
                socket.id
            ] = {

                id:
                    socket.id,

                name,

                balance:
                    startingBalance,

                spent: 0,

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

                    gameMode:
                        room.gameMode,

                    maxPlayers,

                    teamSize,

                    startingBalance
                }
            );

            broadcastPlayers(room);
        }
    );

    /* =====================================================
       JOIN ROOM
    ===================================================== */

    socket.on(
        "joinRoom",
        data => {

            const name =
                String(
                    data?.name || ""
                ).trim();

            const roomCode =
                String(
                    data?.roomCode || ""
                )
                    .trim()
                    .toUpperCase();

            if (!name || !roomCode) {

                socket.emit(
                    "errorMessage",
                    "Enter name and room code."
                );

                return;
            }

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
                room.maxPlayers
            ) {

                socket.emit(
                    "errorMessage",
                    "Room is full."
                );

                return;
            }

            if (
                room.rank.started ||
                (
                    room.auction &&
                    room.auction.active
                )
            ) {

                socket.emit(
                    "errorMessage",
                    "Game has already started."
                );

                return;
            }

            room.players[
                socket.id
            ] = {

                id:
                    socket.id,

                name,

                balance:
                    room.settings.startingBalance,

                spent: 0,

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
                        room.hostId ===
                        socket.id,

                    gameMode:
                        room.gameMode,

                    maxPlayers:
                        room.maxPlayers,

                    teamSize:
                        room.settings.teamSize,

                    startingBalance:
                        room.settings.startingBalance
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
                getRoom(socket);

            if (!room) return;

            if (
                room.hostId !==
                socket.id
            ) {

                socket.emit(
                    "errorMessage",
                    "Only the host can start."
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
                "auction"
            ) {

                startAuction(room);

            } else {

                room.rank.started = true;

                room.rank.categoryIndex = 0;

                Object.values(
                    room.players
                ).forEach(player => {
                    player.rankSelections = {};
                });

                io.to(room.code).emit(
                    "rankStarted",
                    {
                        categoryIndex: 0,

                        categoryNumber: 1,

                        totalCategories:
                            CATEGORIES.length,

                        categoryName:
                            CATEGORIES[0]
                    }
                );

                sendPrivateRankStatus(room);
            }
        }
    );

    /* =====================================================
       RANK SELECT
    ===================================================== */

    socket.on(
        "rankSelect",
        data => {

            handleRankSelect(
                socket,
                data
            );
        }
    );

    /* =====================================================
       AUCTION BID
    ===================================================== */

    socket.on(
        "auctionBid",
        () => {

            handleBid(socket);
        }
    );

    /*
     * Also support "bid".
     * This helps if your Game.js uses socket.emit("bid").
     */

    socket.on(
        "bid",
        () => {

            handleBid(socket);
        }
    );

    socket.on(
        "placeBid",
        () => {

            handleBid(socket);
        }
    );

    /* =====================================================
       GIVE UP
    ===================================================== */

    socket.on(
        "auctionGiveUp",
        () => {

            handleGiveUp(socket);
        }
    );

    /*
     * Also support common frontend names.
     */

    socket.on(
        "giveUp",
        () => {

            handleGiveUp(socket);
        }
    );

    socket.on(
        "auctionGiveup",
        () => {

            handleGiveUp(socket);
        }
    );

    /* =====================================================
       DISCONNECT
    ===================================================== */

    socket.on(
        "disconnect",
        () => {

            console.log(
                "Player disconnected:",
                socket.id
            );

            const room =
                getRoom(socket);

            if (!room) {
                return;
            }

            delete room.players[
                socket.id
            ];

            /* No players left */

            if (
                Object.keys(
                    room.players
                ).length === 0
            ) {

                if (room.auction) {
                    clearAuctionTimer(room);
                    clearAuctionTick(room);
                }

                rooms.delete(
                    room.code
                );

                return;
            }

            /* Host left */

            if (
                room.hostId ===
                socket.id
            ) {

                const remaining =
                    Object.values(
                        room.players
                    );

                if (
                    remaining.length > 0
                ) {

                    room.hostId =
                        remaining[0].id;

                    io.to(
                        room.code
                    ).emit(
                        "hostChanged",
                        {
                            hostId:
                                room.hostId
                        }
                    );
                }
            }

            broadcastPlayers(room);
        }
    );
});

/* =========================================================
   SERVER
========================================================= */

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Naruto Character Rank server running on port ${PORT}`
        );
    }
);
