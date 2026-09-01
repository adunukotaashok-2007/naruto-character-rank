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
    if (!socket.roomCode) return null;
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
   PLAYER BROADCAST
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
   AUCTION PUBLIC STATE
========================================================= */

function getAuctionState(room) {

    const auction = room.auction;

    if (!auction) {
        return {
            active: false
        };
    }

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
        const winner =
            room.players[auction.highestBidder];

        if (winner) {
            highestBidderName =
                winner.name;
        }
    }

    return {
        active: auction.active,

        character: auction.character,

        currentBid: auction.currentBid,

        highestBidder:
            auction.highestBidder,

        highestBidderName,

        remainingTime,

        bidAmount:
            room.settings.bidAmount,

        bidTime:
            room.settings.bidTime,

        characterNumber:
            auction.index + 1,

        totalCharacters:
            auction.characters.length
    };
}

/* =========================================================
   PERSONAL AUCTION STATE
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

        const enoughMoney =
            player.balance >= nextBid;

        const canBid =
            auction.active &&
            !hasGivenUp &&
            !teamFull &&
            !isHighest &&
            enoughMoney;

        io.to(player.id).emit(
            "auctionMoneyUpdated",
            {
                balance: player.balance,

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

function clearAuctionInterval(room) {

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

/* =========================================================
   SEND TIMER
========================================================= */

function sendTimer(room) {

    if (
        !room.auction ||
        !room.auction.active
    ) {
        return;
    }

    const seconds =
        Math.max(
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

/* =========================================================
   START TIMER
========================================================= */

function resetAuctionTimer(room) {

    clearAuctionTimer(room);

    if (
        !room.auction ||
        !room.auction.active
    ) {
        return;
    }

    room.auction.endTime =
        Date.now() +
        room.settings.bidTime * 1000;

    sendTimer(room);

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    sendPersonalAuctionState(room);

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

/* =========================================================
   TIMER LOOP
========================================================= */

function startTimerLoop(room) {

    clearAuctionInterval(room);

    room.auction.tickInterval =
        setInterval(() => {

            if (!rooms.has(room.code)) {
                clearAuctionInterval(room);
                return;
            }

            if (
                !room.auction ||
                !room.auction.active
            ) {
                return;
            }

            sendTimer(room);

        }, 250);
}

/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    clearAuctionTimer(room);
    clearAuctionInterval(room);

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
            settings:
                room.settings
        }
    );

    broadcastPlayers(room);

    startTimerLoop(room);

    startAuctionCharacter(room);
}

/* =========================================================
   START CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    clearAuctionTimer(room);

    const auction =
        room.auction;

    if (
        auction.index >=
        auction.characters.length
    ) {
        finishAuction(room);
        return;
    }

    const allFull =
        Object.values(room.players)
            .every(
                player =>
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

    /* -----------------------------------------------------
       CHARACTER NAME
    ----------------------------------------------------- */

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
        "auctionCharacter",
        getAuctionState(room)
    );

    io.to(room.code).emit(
        "auctionReady",
        getAuctionState(room)
    );

    /*
     * Start timer only after character has
     * been sent to every player.
     */

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

    const auction =
        room.auction;

    if (
        !auction ||
        !auction.active
    ) {
        socket.emit(
            "errorMessage",
            "Auction is not active."
        );
        return;
    }

    const player =
        getPlayer(
            room,
            socket.id
        );

    if (!player) {
        socket.emit(
            "errorMessage",
            "Player not found."
        );
        return;
    }

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

    /* -----------------------------------------------------
       VALID BID
    ----------------------------------------------------- */

    auction.currentBid =
        newBid;

    auction.highestBidder =
        player.id;

    /*
     * If player previously gave up by mistake,
     * a valid bid brings them back.
     */

    auction.givenUp.delete(
        player.id
    );

    /* -----------------------------------------------------
       BROADCAST BID FIRST
    ----------------------------------------------------- */

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
                auction.currentBid
        }
    );

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    /*
     * IMPORTANT:
     * Update everyone with the new bid.
     */

    sendPersonalAuctionState(room);

    broadcastPlayers(room);

    /*
     * Every valid bid resets the timer.
     */

    resetAuctionTimer(room);
}

/* =========================================================
   GIVE UP
========================================================= */

function handleGiveUp(socket) {

    const room =
        getRoom(socket);

    if (!room) return;

    const auction =
        room.auction;

    if (
        !auction ||
        !auction.active
    ) {
        socket.emit(
            "errorMessage",
            "Auction is not active."
        );
        return;
    }

    const player =
        getPlayer(
            room,
            socket.id
        );

    if (!player) return;

    /*
     * Give up is ONLY for current character.
     */

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

    /*
     * Find players who can still participate.
     */

    const eligible =
        Object.values(room.players)
            .filter(other => {

                if (
                    other.team.length >=
                    room.settings.teamSize
                ) {
                    return false;
                }

                if (
                    auction.givenUp.has(
                        other.id
                    )
                ) {
                    return false;
                }

                return true;
            });

    /*
     * No players left.
     */

    if (eligible.length === 0) {

        finishAuctionCharacter(
            room,
            true
        );

        return;
    }

    /*
     * EXACTLY ONE PLAYER LEFT.
     *
     * If there is already a bid,
     * immediately sell.
     *
     * This fixes the 2-player case.
     */

    if (
        eligible.length === 1 &&
        auction.highestBidder
    ) {

        /*
         * Make sure the highest bidder is
         * still eligible.
         */

        const winner =
            eligible[0];

        if (
            winner.id ===
            auction.highestBidder
        ) {

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
}

/* =========================================================
   FINISH CURRENT CHARACTER
========================================================= */

function finishAuctionCharacter(
    room,
    unsold
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

        /*
         * Safety check.
         */

        if (winner.balance < price) {

            io.to(room.code).emit(
                "auctionUnsold",
                {
                    character:
                        auction.character
                }
            );

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

                    spent:
                        winner.spent,

                    team:
                        [...winner.team]
                }
            );
        }

    } else {

        /* =================================================
           UNSOLD
        ================================================= */

        io.to(room.code).emit(
            "auctionUnsold",
            {
                character:
                    auction.character
            }
        );
    }

    /*
     * Send updated money/team information
     * to ALL players.
     */

    broadcastPlayers(room);

    sendPersonalAuctionState(room);

    /*
     * Next character.
     */

    setTimeout(() => {

        if (!rooms.has(room.code)) {
            return;
        }

        auction.index++;

        startAuctionCharacter(room);

    }, 1500);
}

/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    if (!room.auction) return;

    room.auction.active = false;

    clearAuctionTimer(room);
    clearAuctionInterval(room);

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

    const category =
        Number(data.categoryIndex);

    const character =
        String(
            data.character || ""
        );

    if (
        !Number.isInteger(category) ||
        category < 0 ||
        category >= CATEGORIES.length
    ) {
        socket.emit(
            "errorMessage",
            "Invalid category."
        );
        return;
    }

    /*
     * Guy / Lee / Duy are explicitly valid.
     */

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

    if (
        category !==
        room.rank.categoryIndex
    ) {
        socket.emit(
            "errorMessage",
            "Please wait for the current category."
        );
        return;
    }

    player.rankSelections[
        category
    ] = character;

    /*
     * Only send the notification.
     * Do not force other players to select
     * the same character visually.
     */

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

    checkRankCategoryComplete(room);
}

/* =========================================================
   RANK CATEGORY COMPLETE
========================================================= */

function checkRankCategoryComplete(room) {

    const category =
        room.rank.categoryIndex;

    const allPlayers =
        Object.values(room.players);

    if (allPlayers.length < 2) {
        return;
    }

    const complete =
        allPlayers.every(player =>
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
                    CATEGORIES.length
            }
        );

        return;
    }

    /*
     * Everyone selected.
     */

    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex:
                category,

            categoryName:
                CATEGORIES[category]
        }
    );

    setTimeout(() => {

        if (!rooms.has(room.code)) {
            return;
        }

        room.rank.categoryIndex++;

        if (
            room.rank.categoryIndex >=
            CATEGORIES.length
        ) {

            finishRanking(room);

            return;
        }

        io.to(room.code).emit(
            "rankNextCategory",
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

    }, 1200);
}

/* =========================================================
   FINISH RANKING
========================================================= */

function finishRanking(room) {

    const result =
        Object.values(room.players)
            .map(player => {

                const selections = {};

                CATEGORIES.forEach(
                    (category, index) => {

                        selections[category] =
                            player.rankSelections[
                                index
                            ] || null;
                    }
                );

                return {
                    playerId:
                        player.id,

                    playerName:
                        player.name,

                    selections
                };
            });

    room.rank.finished = true;

    io.to(room.code).emit(
        "rankFinished",
        {
            results:
                result
        }
    );
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

            const code =
                generateRoomCode();

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
                    100,
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

            const bidTime =
                Math.max(
                    3,
                    Number(
                        data.bidTime
                    ) || 10
                );

            const room = {

                code,

                hostId:
                    socket.id,

                gameMode:
                    data.gameMode ||
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

                    finished: false,

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
                code,
                room
            );

            socket.roomCode =
                code;

            socket.join(code);

            socket.emit(
                "roomCreated",
                {
                    roomCode:
                        code,

                    isHost:
                        true,

                    gameMode:
                        room.gameMode
                }
            );

            broadcastPlayers(room);

            console.log(
                `Room ${code} created by ${name}`
            );
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

            const code =
                String(
                    data?.roomCode || ""
                ).trim().toUpperCase();

            if (!name || !code) {
                socket.emit(
                    "errorMessage",
                    "Name and room code required."
                );
                return;
            }

            const room =
                rooms.get(code);

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
                room.auction?.active
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

            socket.roomCode =
                code;

            socket.join(code);

            socket.emit(
                "roomJoined",
                {
                    roomCode:
                        code,

                    isHost:
                        room.hostId ===
                        socket.id,

                    gameMode:
                        room.gameMode
                }
            );

            broadcastPlayers(room);

            console.log(
                `${name} joined ${code}`
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
                getRoom(socket);

            if (!room) return;

            if (
                room.hostId !==
                socket.id
            ) {
                socket.emit(
                    "errorMessage",
                    "Only host can start."
                );
                return;
            }

            const players =
                Object.keys(
                    room.players
                ).length;

            if (players < 2) {
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

                room.rank.started =
                    true;

                room.rank.finished =
                    false;

                room.rank.categoryIndex =
                    0;

                Object.values(
                    room.players
                ).forEach(player => {
                    player.rankSelections = {};
                });

                io.to(room.code).emit(
                    "gameStarted",
                    {
                        gameMode:
                            "rank"
                    }
                );

                io.to(room.code).emit(
                    "rankNextCategory",
                    {
                        categoryIndex: 0,

                        categoryNumber: 1,

                        totalCategories:
                            CATEGORIES.length,

                        categoryName:
                            CATEGORIES[0]
                    }
                );
            }
        }
    );

    /* =====================================================
       BID EVENTS
    ===================================================== */

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

    socket.on(
        "auctionBid",
        () => {

            handleBid(socket);

        }
    );

    /* =====================================================
       GIVE UP EVENTS
    ===================================================== */

    socket.on(
        "giveUp",
        () => {

            handleGiveUp(socket);

        }
    );

    socket.on(
        "auctionGiveUp",
        () => {

            handleGiveUp(socket);

        }
    );

    /* =====================================================
       RANK SELECTION
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
       DISCONNECT
    ===================================================== */

    socket.on(
        "disconnect",
        () => {

            const room =
                getRoom(socket);

            if (!room) {
                return;
            }

            const wasHost =
                room.hostId ===
                socket.id;

            delete room.players[
                socket.id
            ];

            /*
             * If nobody remains, delete room.
             */

            if (
                Object.keys(
                    room.players
                ).length === 0
            ) {

                clearAuctionTimer(room);
                clearAuctionInterval(room);

                rooms.delete(
                    room.code
                );

                console.log(
                    `Room ${room.code} deleted`
                );

                return;
            }

            /*
             * Change host if host left.
             */

            if (wasHost) {

                const nextHost =
                    Object.keys(
                        room.players
                    )[0];

                room.hostId =
                    nextHost;

                io.to(room.code).emit(
                    "hostChanged",
                    {
                        hostId:
                            nextHost
                    }
                );
            }

            /*
             * If auction is running and the
             * highest bidder disconnected,
             * remove their bid.
             */

            if (
                room.auction &&
                room.auction.active &&
                room.auction.highestBidder ===
                    socket.id
            ) {

                room.auction.highestBidder =
                    null;

                room.auction.currentBid =
                    0;

                io.to(room.code).emit(
                    "auctionUpdated",
                    getAuctionState(room)
                );

                sendPersonalAuctionState(room);

                resetAuctionTimer(room);
            }

            /*
             * Remove disconnected player from
             * give-up list.
             */

            if (
                room.auction
            ) {

                room.auction.givenUp.delete(
                    socket.id
                );
            }

            broadcastPlayers(room);

            console.log(
                `Disconnected: ${socket.id}`
            );
        }
    );
});

/* =========================================================
   START SERVER
========================================================= */

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Naruto game server running on port ${PORT}`
        );

    }
);
