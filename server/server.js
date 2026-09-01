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

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "index.html")
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
    "Sakumo Hatake",
    "Hanzo",
    "Third Raikage",
    "Fourth Raikage",
    "Onoki",
    "Mei Terumi",
    "Sasori",
    "Deidara",
    "Mū",
    "Gengetsu Hozuki",
    "Danzō",
    "Kakuzu",
    "Hidan",
    "Konan",
    "Zabuza",
    "Kimimaro",
    "Suigetsu",
    "Jūgo",
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
    "Kurotsuchi",
    "Mifune",
    "Fū",
    "Utakata",
    "Rōshi",
    "Chiyo",
    "Rasa",
    "Darui",
    "Chōjūrō"
];

/* =========================================================
   16 CATEGORIES
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
   ROOM CODE
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

/* =========================================================
   ROOM PLAYERS
========================================================= */

function getRoomPlayers(room) {

    return Object.values(room.players).map(
        player => ({
            id: player.id,
            name: player.name,
            balance: player.balance,
            team: player.team,
            hasSelected:
                room.gameMode === "rank"
                    ? player.rankSelections[
                          room.rank.categoryIndex
                      ] !== undefined
                    : false
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

/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {

    const auction =
        room.auction;

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

        timeLeft:
            auction.timeLeft,

        active:
            auction.active,

        index:
            auction.index,

        total:
            CHARACTERS.length,

        givenUp:
            Array.from(
                auction.givenUp
            )
    };
}

/* =========================================================
   SEND PRIVATE AUCTION STATE
========================================================= */

function sendPrivateAuctionState(room) {

    Object.values(room.players).forEach(
        player => {

            const canBid =
                room.auction.active &&
                !room.auction.givenUp.has(
                    player.id
                ) &&
                room.auction.highestBidder !==
                    player.id &&
                player.team.length <
                    room.settings.teamSize;

            io.to(player.id).emit(
                "auctionPrivateState",
                {
                    balance:
                        player.balance,

                    canBid,

                    givenUp:
                        room.auction.givenUp.has(
                            player.id
                        )
                }
            );
        }
    );
}

/* =========================================================
   RANK CATEGORY CHECK
========================================================= */

function checkRankCategoryComplete(room) {

    if (!room.rank.started) {
        return;
    }

    const players =
        Object.values(room.players);

    if (players.length < 2) {
        return;
    }

    const category =
        room.rank.categoryIndex;

    const complete =
        players.every(
            player =>
                player.rankSelections[
                    category
                ] !== undefined
        );

    if (!complete) {
        broadcastPlayers(room);
        return;
    }

    if (
        room.rank.completedCategories.has(
            category
        )
    ) {
        return;
    }

    room.rank.completedCategories.add(
        category
    );

    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex: category,
            categoryNumber: category + 1,
            totalCategories:
                CATEGORIES.length
        }
    );

    setTimeout(() => {

        if (!rooms.has(room.code)) {
            return;
        }

        if (!room.rank.started) {
            return;
        }

        if (
            room.rank.categoryIndex !==
            category
        ) {
            return;
        }

        if (category >=
            CATEGORIES.length - 1) {

            finishRankGame(room);
            return;
        }

        room.rank.categoryIndex =
            category + 1;

        room.rank.completedCategories =
            new Set();

        io.to(room.code).emit(
            "rankNextCategory",
            {
                categoryIndex:
                    room.rank.categoryIndex,

                categoryNumber:
                    room.rank.categoryIndex + 1,

                totalCategories:
                    CATEGORIES.length,

                category:
                    CATEGORIES[
                        room.rank.categoryIndex
                    ]
            }
        );

        broadcastPlayers(room);

    }, 1500);
}

/* =========================================================
   FINISH RANK GAME
========================================================= */

function finishRankGame(room) {

    room.rank.started = false;

    const results =
        Object.values(room.players).map(
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
            categories:
                CATEGORIES,

            results
        }
    );
}

/* =========================================================
   AUCTION TIMER
========================================================= */

function clearAuctionTimer(room) {

    if (room.auction.timer) {

        clearInterval(
            room.auction.timer
        );

        room.auction.timer = null;
    }
}

function startAuctionTimer(room) {

    clearAuctionTimer(room);

    room.auction.timeLeft =
        room.settings.bidTime;

    io.to(room.code).emit(
        "auctionTimer",
        {
            timeLeft:
                room.auction.timeLeft
        }
    );

    room.auction.timer =
        setInterval(() => {

            if (
                !room.auction.active
            ) {
                clearAuctionTimer(room);
                return;
            }

            room.auction.timeLeft--;

            io.to(room.code).emit(
                "auctionTimer",
                {
                    timeLeft:
                        room.auction.timeLeft
                }
            );

            if (
                room.auction.timeLeft <=
                0
            ) {

                clearAuctionTimer(room);

                finishAuctionCharacter(
                    room
                );
            }

        }, 1000);
}

/* =========================================================
   RESET AUCTION TIMER AFTER BID
========================================================= */

function resetAuctionTimer(room) {

    startAuctionTimer(room);
}

/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    room.auction = {

        index: 0,

        character: null,

        currentBid: 0,

        highestBidder: null,

        timeLeft:
            room.settings.bidTime,

        timer: null,

        active: true,

        givenUp: new Set()

    };

    Object.values(room.players).forEach(
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
                room.settings,

            totalCharacters:
                CHARACTERS.length
        }
    );

    broadcastPlayers(room);

    startAuctionCharacter(room);
}

/* =========================================================
   START AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    const auction =
        room.auction;

    if (
        auction.index >=
        CHARACTERS.length
    ) {

        finishAuction(room);
        return;
    }

    const allFull =
        Object.values(room.players).every(
            player =>
                player.team.length >=
                room.settings.teamSize
        );

    if (allFull) {

        finishAuction(room);
        return;
    }

    auction.character =
        CHARACTERS[
            auction.index
        ];

    auction.currentBid = 0;

    auction.highestBidder = null;

    auction.timeLeft =
        room.settings.bidTime;

    auction.givenUp =
        new Set();

    auction.active = true;

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    sendPrivateAuctionState(room);

    broadcastPlayers(room);

    startAuctionTimer(room);
}

/* =========================================================
   AUCTION BID
========================================================= */

function auctionBid(socket) {

    const room =
        rooms.get(socket.roomCode);

    if (!room) {
        return;
    }

    const auction =
        room.auction;

    if (!auction.active) {
        return;
    }

    const player =
        room.players[socket.id];

    if (!player) {
        return;
    }

    if (
        auction.givenUp.has(
            socket.id
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
            "Not enough money."
        );

        return;
    }

    auction.currentBid =
        newBid;

    auction.highestBidder =
        socket.id;

    /*
     * IMPORTANT:
     * Timer resets after every successful bid.
     */

    resetAuctionTimer(room);

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    sendPrivateAuctionState(room);
}

/* =========================================================
   GIVE UP
========================================================= */

function auctionGiveUp(socket) {

    const room =
        rooms.get(socket.roomCode);

    if (!room) {
        return;
    }

    const auction =
        room.auction;

    if (!auction.active) {
        return;
    }

    if (
        auction.highestBidder ===
        socket.id
    ) {

        socket.emit(
            "errorMessage",
            "You cannot give up while you are the highest bidder."
        );

        return;
    }

    auction.givenUp.add(
        socket.id
    );

    socket.emit(
        "auctionGivenUp",
        {
            character:
                auction.character
        }
    );

    sendPrivateAuctionState(room);

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    /*
     * If nobody is still willing to bid,
     * automatically make character UNSOLD.
     */

    const possibleBidders =
        Object.values(room.players)
            .filter(
                player =>
                    !auction.givenUp.has(
                        player.id
                    ) &&
                    player.team.length <
                        room.settings.teamSize &&
                    player.balance >=
                        auction.currentBid +
                        room.settings.bidAmount
            );

    if (
        possibleBidders.length === 0 &&
        auction.highestBidder === null
    ) {

        finishAuctionCharacter(
            room
        );
    }
}

/* =========================================================
   UNSOLD
========================================================= */

function auctionUnsold(socket) {

    const room =
        rooms.get(socket.roomCode);

    if (!room) {
        return;
    }

    const auction =
        room.auction;

    if (!auction.active) {
        return;
    }

    /*
     * Only the host can force UNSOLD.
     */

    if (
        socket.id !== room.host
    ) {

        socket.emit(
            "errorMessage",
            "Only the host can mark a character unsold."
        );

        return;
    }

    if (
        auction.highestBidder
    ) {

        socket.emit(
            "errorMessage",
            "Character already has a bidder."
        );

        return;
    }

    finishAuctionCharacter(
        room
    );
}

/* =========================================================
   FINISH ONE AUCTION CHARACTER
========================================================= */

function finishAuctionCharacter(
    room
) {

    const auction =
        room.auction;

    if (!auction.active) {
        return;
    }

    auction.active = false;

    clearAuctionTimer(room);

    /*
     * SOLD
     */

    if (
        auction.highestBidder
    ) {

        const buyer =
            room.players[
                auction.highestBidder
            ];

        if (!buyer) {
            return;
        }

        const price =
            auction.currentBid;

        buyer.balance -= price;

        buyer.team.push(
            auction.character
        );

        io.to(room.code).emit(
            "auctionSold",
            {
                character:
                    auction.character,

                buyerId:
                    buyer.id,

                buyerName:
                    buyer.name,

                price,

                balance:
                    buyer.balance,

                team:
                    buyer.team
            }
        );

    } else {

        /*
         * UNSOLD
         */

        io.to(room.code).emit(
            "auctionUnsoldResult",
            {
                character:
                    auction.character,

                message:
                    `${auction.character} was UNSOLD`
            }
        );
    }

    broadcastPlayers(room);

    sendPrivateAuctionState(room);

    setTimeout(() => {

        if (!rooms.has(room.code)) {
            return;
        }

        auction.index++;

        startAuctionCharacter(
            room
        );

    }, 1200);
}

/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    clearAuctionTimer(room);

    room.auction.active =
        false;

    const teams =
        Object.values(room.players)
            .map(player => ({
                playerId:
                    player.id,

                playerName:
                    player.name,

                balance:
                    player.balance,

                team:
                    player.team
            }));

    /*
     * Simple built-in AI-style evaluation.
     * This does NOT use external API credits.
     */

    const powerMap = {

        "Madara": 100,
        "Naruto": 99,
        "Sasuke": 98,
        "Hashirama": 97,
        "Minato": 96,
        "Itachi": 95,
        "Obito": 94,
        "Nagato": 93,
        "Might Guy": 92,
        "Tobirama": 91,
        "Kakashi": 90,
        "Might Duy": 89,
        "Jiraiya": 88,
        "Orochimaru": 87,
        "Killer B": 86,
        "Third Raikage": 85,
        "Fourth Raikage": 84,
        "Sakura": 80,
        "Tsunade": 80,
        "Gaara": 82,
        "Shikamaru": 78,
        "Rock Lee": 82
    };

    const teamScores =
        teams.map(team => {

            let score = 0;

            team.team.forEach(
                character => {

                    score +=
                        powerMap[
                            character
                        ] || 60;
                }
            );

            /*
             * Team balance bonus.
             */

            const unique =
                new Set(
                    team.team
                ).size;

            score +=
                unique * 2;

            return {
                ...team,
                aiScore:
                    Math.round(score)
            };
        });

    teamScores.sort(
        (a, b) =>
            b.aiScore -
            a.aiScore
    );

    io.to(room.code).emit(
        "auctionFinished",
        {
            teams:
                teamScores,

            bestTeam:
                teamScores[0] || null
        }
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

                const name =
                    String(
                        data.name || "Player 1"
                    ).trim();

                const gameMode =
                    data.gameMode ===
                    "auction"
                        ? "auction"
                        : "rank";

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

                const bidTime =
                    Math.max(
                        1,
                        Number(
                            data.bidTime
                        ) || 10
                    );

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

                        started: false,

                        categoryIndex: 0,

                        completedCategories:
                            new Set()

                    },

                    auction: {

                        index: 0,

                        character: null,

                        currentBid: 0,

                        highestBidder: null,

                        timeLeft:
                            bidTime,

                        timer: null,

                        active: false,

                        givenUp:
                            new Set()

                    }

                };

                room.players[
                    socket.id
                ] = {

                    id:
                        socket.id,

                    name:
                        name ||
                        "Player 1",

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
                            room.settings,

                        categories:
                            CATEGORIES,

                        characters:
                            CHARACTERS
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
                        data.roomCode || ""
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

                const count =
                    Object.keys(
                        room.players
                    ).length;

                if (
                    count >=
                    room.settings.maxPlayers
                ) {

                    socket.emit(
                        "errorMessage",
                        "Room is full."
                    );

                    return;
                }

                if (
                    room.rank.started ||
                    room.auction.active
                ) {

                    socket.emit(
                        "errorMessage",
                        "Game has already started."
                    );

                    return;
                }

                const name =
                    String(
                        data.name ||
                        `Player ${count + 1}`
                    ).trim();

                room.players[
                    socket.id
                ] = {

                    id:
                        socket.id,

                    name:
                        name ||
                        `Player ${count + 1}`,

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
                            room.settings,

                        categories:
                            CATEGORIES,

                        characters:
                            CHARACTERS
                    }
                );

                io.to(room.code).emit(
                    "playerJoined",
                    {
                        player:
                            {
                                id:
                                    socket.id,

                                name:
                                    room.players[
                                        socket.id
                                    ].name
                            }
                    }
                );

                broadcastPlayers(
                    room
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
                    rooms.get(
                        socket.roomCode
                    );

                if (!room) {
                    return;
                }

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

                    room.rank.started =
                        true;

                    room.rank.categoryIndex =
                        0;

                    room.rank.completedCategories =
                        new Set();

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
                            categoryIndex:
                                0,

                            categoryNumber:
                                1,

                            totalCategories:
                                CATEGORIES.length,

                            category:
                                CATEGORIES[0]
                        }
                    );

                    broadcastPlayers(
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
           RANK SELECT
        ================================================= */

        socket.on(
            "rankSelect",
            data => {

                const room =
                    rooms.get(
                        socket.roomCode
                    );

                if (!room) {
                    return;
                }

                if (
                    !room.rank.started
                ) {
                    return;
                }

                const player =
                    room.players[
                        socket.id
                    ];

                if (!player) {
                    return;
                }

                const category =
                    Number(
                        data?.categoryIndex
                    );

                const character =
                    data?.character;

                if (
                    !Number.isInteger(
                        category
                    )
                ) {
                    return;
                }

                if (
                    category !==
                    room.rank.categoryIndex
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

                /*
                 * SAME CHARACTER IS ALLOWED
                 * FOR MULTIPLE PLAYERS.
                 */

                player.rankSelections[
                    category
                ] = character;

                /*
                 * Send selection information
                 * WITHOUT changing other players'
                 * local selection.
                 */

                socket.emit(
                    "myRankSelection",
                    {
                        categoryIndex:
                            category,

                        character
                    }
                );

                socket.broadcast
                    .to(room.code)
                    .emit(
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

                broadcastPlayers(
                    room
                );

                checkRankCategoryComplete(
                    room
                );
            }
        );

        /* =================================================
           AUCTION BID
        ================================================= */

        socket.on(
            "auctionBid",
            () => {

                auctionBid(
                    socket
                );

            }
        );

        /* =================================================
           GIVE UP
        ================================================= */

        socket.on(
            "auctionGiveUp",
            () => {

                auctionGiveUp(
                    socket
                );

            }
        );

        /*
         * Keep old event working too.
         */

        socket.on(
            "auctionUnsold",
            () => {

                auctionUnsold(
                    socket
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
                 * If the player was the current
                 * highest bidder, remove that bid.
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

                    if (
                        room.auction.active
                    ) {

                        resetAuctionTimer(
                            room
                        );

                        io.to(room.code).emit(
                            "auctionUpdated",
                            getAuctionState(
                                room
                            )
                        );
                    }
                }

                /*
                 * Give up/disconnected players
                 * should not be considered bidders.
                 */

                room.auction.givenUp.add(
                    socket.id
                );

                /*
                 * Host migration.
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
                        remaining.length >
                        0
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

                        clearAuctionTimer(
                            room
                        );

                        rooms.delete(
                            roomCode
                        );

                        return;
                    }
                }

                broadcastPlayers(
                    room
                );

                sendPrivateAuctionState(
                    room
                );
            }
        );
    }
);

/* =========================================================
   SERVER START
========================================================= */

server.listen(
    PORT,
    () => {

        console.log(
            `Naruto multiplayer server running on port ${PORT}`
        );

    }
);
