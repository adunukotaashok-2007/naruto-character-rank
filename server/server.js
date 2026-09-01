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
    "Duy",
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
   RANKING CATEGORIES
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

function getPlayer(room, socketId) {
    if (!room) return null;
    return room.players[socketId] || null;
}

function getRoomPlayers(room) {
    return Object.values(room.players).map(player => ({
        id: player.id,
        name: player.name,
        balance: player.balance,
        spent: player.spent,
        team: [...player.team],
        gaveUp: player.gaveUp || false
    }));
}

function broadcastPlayers(room) {
    io.to(room.code).emit("playersUpdated", {
        players: getRoomPlayers(room)
    });
}

function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {
    const auction = room.auction;

    let remainingTime = 0;

    if (auction.endTime) {
        remainingTime = Math.max(
            0,
            Math.ceil(
                (auction.endTime - Date.now()) / 1000
            )
        );
    }

    const highestPlayer =
        auction.highestBidder
            ? room.players[auction.highestBidder]
            : null;

    return {
        character: auction.character,
        currentBid: auction.currentBid,
        highestBidder: auction.highestBidder,
        highestBidderName:
            highestPlayer
                ? highestPlayer.name
                : null,

        remainingTime,

        bidAmount: room.settings.bidAmount,

        bidTime: room.settings.bidTime,

        characterNumber:
            auction.index + 1,

        totalCharacters:
            auction.characters.length,

        active:
            auction.active
    };
}

/* =========================================================
   SEND PERSONAL AUCTION MONEY
========================================================= */

function sendPersonalAuctionState(room) {
    Object.values(room.players).forEach(player => {

        io.to(player.id).emit(
            "auctionMoneyUpdated",
            {
                balance: player.balance,
                spent: player.spent,

                currentBid:
                    room.auction.currentBid,

                nextBid:
                    room.auction.currentBid +
                    room.settings.bidAmount,

                canBid:
                    room.auction.active &&
                    !player.gaveUp &&
                    player.balance >=
                        room.auction.currentBid +
                        room.settings.bidAmount
            }
        );
    });
}

/* =========================================================
   AUCTION TIMER
========================================================= */

function clearAuctionTimer(room) {
    if (room.auction.timer) {
        clearTimeout(room.auction.timer);
        room.auction.timer = null;
    }
}

function resetAuctionTimer(room) {

    clearAuctionTimer(room);

    const auction = room.auction;

    auction.endTime =
        Date.now() +
        room.settings.bidTime * 1000;

    io.to(room.code).emit(
        "auctionTimer",
        {
            seconds:
                room.settings.bidTime
        }
    );

    auction.timer = setTimeout(() => {

        if (!auction.active) {
            return;
        }

        finishAuctionCharacter(
            room,
            false
        );

    }, room.settings.bidTime * 1000);

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    sendPersonalAuctionState(room);
}

/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    clearAuctionTimer(room);

    Object.values(room.players).forEach(player => {

        player.balance =
            room.settings.startingBalance;

        player.spent = 0;

        player.team = [];

        player.gaveUp = false;
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

    startAuctionCharacter(room);
}

/* =========================================================
   START ONE CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    clearAuctionTimer(room);

    const auction = room.auction;

    /* -----------------------------------------------------
       CHECK END
    ----------------------------------------------------- */

    if (
        auction.index >=
        auction.characters.length
    ) {
        finishAuction(room);
        return;
    }

    /* -----------------------------------------------------
       CHECK IF ALL TEAMS ARE FULL
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       NEW CHARACTER
    ----------------------------------------------------- */

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
       PLAYERS WHO ALREADY HAVE FULL TEAM
       CANNOT BID
    ----------------------------------------------------- */

    Object.values(room.players).forEach(player => {

        player.gaveUp =
            player.team.length >=
            room.settings.teamSize;
    });

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

    resetAuctionTimer(room);
}

/* =========================================================
   BID
========================================================= */

function handleBid(socket) {

    const room = getRoom(socket);

    if (!room) {
        socket.emit(
            "errorMessage",
            "You are not in a room."
        );
        return;
    }

    const auction = room.auction;

    if (!auction || !auction.active) {
        socket.emit(
            "errorMessage",
            "Auction is not active."
        );
        return;
    }

    const player =
        getPlayer(room, socket.id);

    if (!player) {
        return;
    }

    /* Player gave up for this character */

    if (auction.givenUp.has(socket.id)) {

        socket.emit(
            "errorMessage",
            "You gave up on this character."
        );

        return;
    }

    /* Team already full */

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

    /* Highest bidder cannot bid again */

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

    /* Not enough money */

    if (
        player.balance <
        newBid
    ) {

        socket.emit(
            "errorMessage",
            `You need ${newBid}. You have ${player.balance}.`
        );

        return;
    }

    /* -----------------------------------------------------
       ACCEPT BID
    ----------------------------------------------------- */

    auction.currentBid =
        newBid;

    auction.highestBidder =
        socket.id;

    /* -----------------------------------------------------
       VERY IMPORTANT:
       A PLAYER WHO WAS HIGHEST BEFORE CAN BID AGAIN
       IF THEY ARE NOT CURRENT HIGHEST.
       GIVE-UP ONLY APPLIES TO CURRENT CHARACTER.
    ----------------------------------------------------- */

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    io.to(room.code).emit(
        "auctionBidMade",
        {
            playerId:
                socket.id,

            playerName:
                player.name,

            character:
                auction.character,

            bid:
                newBid
        }
    );

    sendPersonalAuctionState(room);

    broadcastPlayers(room);

    /* Timer resets after EVERY valid bid */

    resetAuctionTimer(room);
}

/* =========================================================
   GIVE UP
========================================================= */

function handleGiveUp(socket) {

    const room = getRoom(socket);

    if (!room) return;

    const auction = room.auction;

    if (!auction || !auction.active) {
        return;
    }

    const player =
        getPlayer(room, socket.id);

    if (!player) return;

    /*
     * Give up only applies to THIS character.
     * It does NOT permanently remove the player
     * from the entire auction.
     */

    auction.givenUp.add(socket.id);

    player.gaveUp = true;

    io.to(room.code).emit(
        "auctionPlayerGaveUp",
        {
            playerId:
                socket.id,

            playerName:
                player.name,

            character:
                auction.character
        }
    );

    sendPersonalAuctionState(room);

    /*
     * Count players still participating.
     */

    const eligiblePlayers =
        Object.values(room.players)
            .filter(other => {

                if (
                    other.team.length >=
                    room.settings.teamSize
                ) {
                    return false;
                }

                return !auction.givenUp.has(
                    other.id
                );
            });

    /*
     * If nobody remains:
     * UNSOLD.
     */

    if (
        eligiblePlayers.length === 0
    ) {

        finishAuctionCharacter(
            room,
            true
        );

        return;
    }

    /*
     * If exactly ONE player remains,
     * immediately sell the character to them
     * IF there is already a bid.
     *
     * For a 2-player game:
     * Player A gives up after Player B bids.
     * Player B immediately wins.
     */

    if (
        eligiblePlayers.length === 1 &&
        auction.highestBidder
    ) {

        finishAuctionCharacter(
            room,
            false
        );

        return;
    }

    /*
     * If nobody has bid yet and only one player
     * remains, don't automatically charge them.
     * Continue until timer expires or they bid.
     */

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );
}

/* =========================================================
   FINISH ONE CHARACTER
========================================================= */

function finishAuctionCharacter(
    room,
    unsold = false
) {

    const auction = room.auction;

    if (!auction.active) {
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

    /* -----------------------------------------------------
       SOLD
    ----------------------------------------------------- */

    if (winner) {

        const price =
            auction.currentBid;

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

    } else {

        /* -------------------------------------------------
           UNSOLD
        ------------------------------------------------- */

        io.to(room.code).emit(
            "auctionUnsold",
            {
                character:
                    auction.character
            }
        );
    }

    broadcastPlayers(room);

    sendPersonalAuctionState(room);

    /*
     * Small delay before next character.
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

    clearAuctionTimer(room);

    room.auction.active = false;

    const teams =
        Object.values(room.players)
            .map(player => ({
                playerId: player.id,
                playerName: player.name,
                team: [...player.team],
                balance: player.balance,
                spent: player.spent
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

function handleRankSelect(
    socket,
    data
) {

    const room = getRoom(socket);

    if (!room) return;

    if (!room.rank.started) {
        return;
    }

    const player =
        getPlayer(room, socket.id);

    if (!player) return;

    const category =
        Number(data.categoryIndex);

    const character =
        String(data.character || "");

    /* -----------------------------------------------------
       VALID CATEGORY
    ----------------------------------------------------- */

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
     * IMPORTANT:
     * The server accepts Guy, Lee and Duy.
     */

    if (
        !CHARACTERS.includes(character)
    ) {

        socket.emit(
            "errorMessage",
            `Invalid character: ${character}`
        );

        return;
    }

    /*
     * Player can only select the CURRENT category.
     */

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

    /*
     * Save selection ONLY for this player.
     */

    player.rankSelections[
        category
    ] = character;

    /*
     * Send the selection notification,
     * but frontend should NOT mark the other
     * player's card as selected.
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

    checkRankCategoryComplete(
        room
    );
}

/* =========================================================
   CHECK RANK CATEGORY
========================================================= */

function checkRankCategoryComplete(room) {

    const category =
        room.rank.categoryIndex;

    const playerList =
        Object.values(room.players);

    /*
     * EVERY PLAYER must select.
     *
     * It does NOT matter whether they selected
     * the same character.
     */

    const complete =
        playerList.length >= 2 &&
        playerList.every(
            player =>
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

                selected:
                    playerList.filter(
                        player =>
                            Object.prototype.hasOwnProperty.call(
                                player.rankSelections,
                                category
                            )
                    ).length,

                total:
                    playerList.length
            }
        );

        return;
    }

    /*
     * Category complete.
     */

    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex:
                category
        }
    );

    /*
     * MOVE TO NEXT CATEGORY.
     */

    setTimeout(() => {

        if (!rooms.has(room.code)) {
            return;
        }

        /*
         * Make sure game is still running.
         */

        if (!room.rank.started) {
            return;
        }

        /*
         * LAST CATEGORY
         */

        if (
            category >=
            CATEGORIES.length - 1
        ) {

            finishRankGame(room);

            return;
        }

        /*
         * NEXT CATEGORY
         */

        room.rank.categoryIndex =
            category + 1;

        /*
         * IMPORTANT:
         * Emit the actual new category number.
         */

        io.to(room.code).emit(
            "rankNextCategory",
            {
                categoryIndex:
                    room.rank.categoryIndex,

                categoryName:
                    CATEGORIES[
                        room.rank.categoryIndex
                    ],

                categoryNumber:
                    room.rank.categoryIndex + 1,

                totalCategories:
                    CATEGORIES.length
            }
        );

    }, 1000);
}

/* =========================================================
   RANK FINAL
========================================================= */

function finishRankGame(room) {

    room.rank.started = false;

    const results =
        Object.values(room.players)
            .map(player => {

                const selections = {};

                CATEGORIES.forEach(
                    (_, index) => {

                        selections[index] =
                            player.rankSelections[
                                index
                            ];
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

    /*
     * Simple local team evaluation.
     * This works even without an OpenAI key.
     */

    const evaluations =
        results.map(player => {

            const counts = {};

            Object.values(
                player.selections
            ).forEach(character => {

                if (!character) return;

                counts[character] =
                    (counts[character] || 0) + 1;
            });

            const topCharacters =
                Object.entries(counts)
                    .sort(
                        (a, b) =>
                            b[1] - a[1]
                    )
                    .slice(0, 5)
                    .map(item => item[0]);

            return {
                playerId:
                    player.playerId,

                playerName:
                    player.playerName,

                team:
                    topCharacters,

                score:
                    calculateRankScore(
                        player
                    ),

                explanation:
                    createTeamExplanation(
                        topCharacters
                    )
            };
        });

    /*
     * Find strongest team.
     */

    const sorted =
        [...evaluations].sort(
            (a, b) =>
                b.score - a.score
        );

    const bestTeam =
        sorted.length
            ? sorted[0]
            : null;

    io.to(room.code).emit(
        "rankGameFinished",
        {
            results,

            evaluations,

            bestTeam
        }
    );
}

/* =========================================================
   RANK SCORE
========================================================= */

function calculateRankScore(player) {

    let score = 0;

    Object.entries(
        player.selections
    ).forEach(
        ([categoryIndex, character]) => {

            if (!character) return;

            /*
             * A selection receives a score based
             * on how consistently the player chose
             * high-ranked characters.
             */

            const rank =
                getCharacterRank(
                    Number(categoryIndex),
                    character
                );

            if (rank !== null) {

                score +=
                    Math.max(
                        1,
                        11 - rank
                    );
            }
        }
    );

    return score;
}

function getCharacterRank(
    categoryIndex,
    character
) {

    /*
     * We intentionally keep a simple ranking
     * database on the server.
     */

    const fallbackRank =
        CHARACTERS.indexOf(character);

    if (fallbackRank === -1) {
        return null;
    }

    return (
        fallbackRank % 10
    ) + 1;
}

function createTeamExplanation(team) {

    if (!team.length) {
        return "No complete team was selected.";
    }

    return (
        "This team has a balanced combination of "
        + "speed, strength, battle ability, ninjutsu, "
        + "defense and overall combat potential based "
        + "on the characters selected across the "
        + "16 categories."
    );
}

/* =========================================================
   SOCKET.IO
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

            const name =
                String(
                    data?.name || "Player 1"
                ).trim();

            const gameMode =
                data?.gameMode === "auction"
                    ? "auction"
                    : "rank";

            const maxPlayers =
                Math.max(
                    2,
                    Math.min(
                        25,
                        Number(
                            data?.maxPlayers
                        ) || 6
                    )
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
                    0,
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

                    categoryIndex: 0,

                    started: false
                },

                auction: {

                    index: 0,

                    characters: [],

                    character: null,

                    currentBid: 0,

                    highestBidder: null,

                    active: false,

                    endTime: 0,

                    timer: null,

                    givenUp: new Set()
                }
            };

            room.players[
                socket.id
            ] = {

                id:
                    socket.id,

                name:
                    name || "Player 1",

                balance:
                    startingBalance,

                spent: 0,

                team: [],

                rankSelections: {},

                gaveUp: false
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

                    settings:
                        room.settings
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
                    data?.roomCode || ""
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

            const name =
                String(
                    data?.name ||
                    `Player ${playerCount + 1}`
                ).trim();

            room.players[
                socket.id
            ] = {

                id:
                    socket.id,

                name:
                    name ||
                    `Player ${playerCount + 1}`,

                balance:
                    room.settings.startingBalance,

                spent: 0,

                team: [],

                rankSelections: {},

                gaveUp: false
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
                "auction"
            ) {

                startAuction(room);

                return;
            }

            /* RANK GAME */

            room.rank.started = true;

            room.rank.categoryIndex = 0;

            Object.values(
                room.players
            ).forEach(player => {

                player.rankSelections = {};
            });

            io.to(room.code).emit(
                "rankGameStarted",
                {
                    categoryIndex: 0,

                    categoryName:
                        CATEGORIES[0],

                    categoryNumber: 1,

                    totalCategories:
                        CATEGORIES.length
                }
            );
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
       SUPPORTS BOTH NAMES
    ===================================================== */

    socket.on(
        "auctionBid",
        () => {
            handleBid(socket);
        }
    );

    socket.on(
        "bid",
        () => {
            handleBid(socket);
        }
    );

    /* =====================================================
       GIVE UP
       SUPPORTS BOTH NAMES
    ===================================================== */

    socket.on(
        "auctionGiveUp",
        () => {
            handleGiveUp(socket);
        }
    );

    socket.on(
        "giveUp",
        () => {
            handleGiveUp(socket);
        }
    );

    /* =====================================================
       OLD UNSOLD EVENT
       NOW ACTS AS GIVE UP
    ===================================================== */

    socket.on(
        "auctionUnsold",
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
                "Disconnected:",
                socket.id
            );

            const room =
                getRoom(socket);

            if (!room) return;

            delete room.players[
                socket.id
            ];

            /*
             * If auction is active and the
             * highest bidder leaves, clear them.
             */

            if (
                room.auction &&
                room.auction.highestBidder ===
                socket.id
            ) {

                room.auction.highestBidder =
                    null;

                room.auction.currentBid =
                    0;
            }

            /*
             * Host leaves.
             */

            if (
                room.host ===
                socket.id
            ) {

                const remaining =
                    Object.keys(
                        room.players
                    );

                if (remaining.length > 0) {

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

                    clearAuctionTimer(room);

                    rooms.delete(
                        room.code
                    );

                    return;
                }
            }

            broadcastPlayers(room);

            /*
             * If auction has only one eligible player
             * after someone leaves, finish current bid.
             */

            if (
                room.gameMode === "auction" &&
                room.auction.active
            ) {

                const eligible =
                    Object.values(
                        room.players
                    ).filter(
                        player =>
                            player.team.length <
                                room.settings.teamSize &&
                            !room.auction.givenUp.has(
                                player.id
                            )
                    );

                if (
                    eligible.length === 1 &&
                    room.auction.highestBidder
                ) {

                    finishAuctionCharacter(
                        room,
                        false
                    );
                }
            }
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
            `Naruto game server running on port ${PORT}`
        );
    }
);
