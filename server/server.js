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
    },
    transports: ["websocket", "polling"]
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
        game: "Naruto Character Rank",
        rooms: rooms.size
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

/*
 * Set makes validation extremely reliable.
 * Guy, Lee and Duy are explicitly included.
 */

const CHARACTER_SET = new Set(CHARACTERS);

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
   CATEGORY RANKINGS
========================================================= */

const RANKINGS = {

    "Speed": [
        "Minato",
        "Naruto",
        "Tobirama",
        "FourthRaikage",
        "Sasuke",
        "Kakashi",
        "Shisui",
        "Guy",
        "Lee",
        "Duy",
        "Obito"
    ],

    "Strength": [
        "Madara",
        "Hashirama",
        "Naruto",
        "Sasuke",
        "Guy",
        "Tsunade",
        "Minato",
        "Itachi",
        "Obito",
        "KillerB",
        "Duy",
        "Lee"
    ],

    "Battle IQ": [
        "Shikamaru",
        "Itachi",
        "Kakashi",
        "Minato",
        "Tobirama",
        "Madara",
        "Sasuke",
        "Orochimaru",
        "Jiraiya",
        "Obito"
    ],

    "Durability": [
        "Hashirama",
        "Naruto",
        "Madara",
        "Kisame",
        "KillerB",
        "Tsunade",
        "Obito",
        "Sakura",
        "Gaara",
        "ThirdRaikage"
    ],

    "Chakra": [
        "Naruto",
        "Hashirama",
        "Madara",
        "Kisame",
        "Nagato",
        "KillerB",
        "Minato",
        "Tobirama",
        "Jiraiya",
        "Orochimaru"
    ],

    "Ninjutsu": [
        "Madara",
        "Naruto",
        "Sasuke",
        "Hashirama",
        "Orochimaru",
        "Kakashi",
        "Minato",
        "Tobirama",
        "Jiraiya",
        "Itachi"
    ],

    "Taijutsu": [
        "Guy",
        "Duy",
        "Lee",
        "Naruto",
        "Sasuke",
        "Neji",
        "ThirdRaikage",
        "FourthRaikage",
        "KillerB",
        "Sakura",
        "Kakashi"
    ],

    "Genjutsu": [
        "Itachi",
        "Shisui",
        "Sasuke",
        "Madara",
        "Kurenai",
        "Obito",
        "Orochimaru",
        "Kakashi",
        "Sakura",
        "Ino"
    ],

    "Defense": [
        "Gaara",
        "Hashirama",
        "Madara",
        "Naruto",
        "Kakashi",
        "Tsunade",
        "Sasuke",
        "Obito",
        "ThirdRaikage",
        "Kisame"
    ],

    "Attack": [
        "Madara",
        "Naruto",
        "Sasuke",
        "Hashirama",
        "Guy",
        "Minato",
        "Itachi",
        "KillerB",
        "Nagato",
        "Obito"
    ],

    "Stamina": [
        "Naruto",
        "Hashirama",
        "Kisame",
        "KillerB",
        "Madara",
        "Tsunade",
        "Sakura",
        "Jiraiya",
        "Orochimaru",
        "ThirdRaikage"
    ],

    "Leadership": [
        "Hashirama",
        "Naruto",
        "Minato",
        "Tobirama",
        "Madara",
        "Kakashi",
        "Gaara",
        "Tsunade",
        "Jiraiya",
        "Itachi"
    ],

    "Versatility": [
        "Kakashi",
        "Naruto",
        "Sasuke",
        "Orochimaru",
        "Itachi",
        "Madara",
        "Jiraiya",
        "Minato",
        "Tobirama",
        "Obito"
    ],

    "Experience": [
        "Hiruzen",
        "Madara",
        "Orochimaru",
        "Jiraiya",
        "Tobirama",
        "Hashirama",
        "Kakashi",
        "Itachi",
        "Onoki",
        "Tsunade"
    ],

    "Teamwork": [
        "Naruto",
        "Kakashi",
        "Shikamaru",
        "Minato",
        "Sakura",
        "Gaara",
        "Hinata",
        "Choji",
        "Kiba",
        "Shino"
    ],

    "Overall Power": [
        "Madara",
        "Naruto",
        "Sasuke",
        "Hashirama",
        "Minato",
        "Itachi",
        "Obito",
        "Nagato",
        "Guy",
        "Tobirama"
    ]
};

/* =========================================================
   ROOMS
========================================================= */

const rooms = new Map();

/* =========================================================
   ROOM CODE
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

/* =========================================================
   SAFE VALUES
========================================================= */

function cleanName(name) {

    return String(name || "")
        .trim()
        .substring(0, 30);
}

function getRoom(socket) {

    if (!socket.roomCode) {
        return null;
    }

    return rooms.get(socket.roomCode) || null;
}

function getPlayer(room, id) {

    if (!room) {
        return null;
    }

    return room.players[id] || null;
}

/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}

/* =========================================================
   PLAYER PUBLIC DATA
========================================================= */

function publicPlayer(player) {

    return {
        id: player.id,
        name: player.name,
        balance: player.balance,
        spent: player.spent,
        team: [...player.team],
        gaveUp: !!player.gaveUp
    };
}

function broadcastPlayers(room) {

    io.to(room.code).emit(
        "playersUpdated",
        {
            players: Object.values(room.players)
                .map(publicPlayer)
        }
    );
}

/* =========================================================
   ROOM SETTINGS
========================================================= */

function normalizeSettings(data) {

    let maxPlayers =
        Number(data.maxPlayers);

    if (!Number.isFinite(maxPlayers)) {
        maxPlayers = 6;
    }

    maxPlayers =
        Math.max(2, Math.min(25, maxPlayers));

    let teamSize =
        Number(data.teamSize);

    if (!Number.isFinite(teamSize)) {
        teamSize = 5;
    }

    teamSize =
        Math.max(1, Math.min(20, teamSize));

    let startingBalance =
        Number(data.startingBalance);

    if (!Number.isFinite(startingBalance)) {
        startingBalance = 1000;
    }

    startingBalance =
        Math.max(100, startingBalance);

    let bidAmount =
        Number(data.bidAmount);

    if (!Number.isFinite(bidAmount)) {
        bidAmount = 50;
    }

    bidAmount =
        Math.max(1, bidAmount);

    let bidTime =
        Number(data.bidTime);

    if (!Number.isFinite(bidTime)) {
        bidTime = 10;
    }

    bidTime =
        Math.max(3, Math.min(60, bidTime));

    return {
        maxPlayers,
        teamSize,
        startingBalance,
        bidAmount,
        bidTime
    };
}

/* =========================================================
   RANKING
========================================================= */

function createRankState() {

    return {
        started: false,
        categoryIndex: 0,
        selections: {},
        results: []
    };
}

function sendRankState(room) {

    const categoryIndex =
        room.rank.categoryIndex;

    const category =
        CATEGORIES[categoryIndex];

    const selected =
        {};

    Object.values(room.players)
        .forEach(player => {

            selected[player.id] =
                Object.prototype.hasOwnProperty.call(
                    player.rankSelections,
                    categoryIndex
                );
        });

    io.to(room.code).emit(
        "rankState",
        {
            categoryIndex,
            categoryName: category,
            categoryNumber: categoryIndex + 1,
            totalCategories: CATEGORIES.length,
            selected
        }
    );
}

function sendPrivateRankStatus(room) {

    const categoryIndex =
        room.rank.categoryIndex;

    Object.values(room.players)
        .forEach(player => {

            const hasSelection =
                Object.prototype.hasOwnProperty.call(
                    player.rankSelections,
                    categoryIndex
                );

            io.to(player.id).emit(
                "myRankStatus",
                {
                    categoryIndex,
                    selected: hasSelection,
                    character: hasSelection
                        ? player.rankSelections[categoryIndex]
                        : null
                }
            );
        });
}

/* =========================================================
   RANK CATEGORY CHECK
========================================================= */

function checkRankCategory(room) {

    const categoryIndex =
        room.rank.categoryIndex;

    const playerList =
        Object.values(room.players);

    if (playerList.length < 2) {
        return;
    }

    const allSelected =
        playerList.every(player =>
            Object.prototype.hasOwnProperty.call(
                player.rankSelections,
                categoryIndex
            )
        );

    if (!allSelected) {

        sendRankState(room);
        sendPrivateRankStatus(room);

        return;
    }

    /*
     * Build category result.
     */

    const category =
        CATEGORIES[categoryIndex];

    const rankedList =
        RANKINGS[category] || [];

    const categoryResults =
        playerList.map(player => {

            const character =
                player.rankSelections[categoryIndex];

            let rank =
                rankedList.indexOf(character);

            /*
             * Characters not explicitly present in a
             * ranking are placed after the listed ones.
             */

            if (rank === -1) {
                rank = rankedList.length + 50;
            }

            return {
                playerId: player.id,
                playerName: player.name,
                character,
                rank: rank + 1
            };
        });

    /*
     * Best character between players.
     */

    const sorted =
        [...categoryResults]
            .sort((a, b) => a.rank - b.rank);

    let winner = null;

    if (sorted.length > 0) {

        const bestRank =
            sorted[0].rank;

        const best =
            sorted.filter(
                item => item.rank === bestRank
            );

        if (best.length === 1) {
            winner = best[0];
        }
    }

    const result = {
        categoryIndex,
        categoryName: category,
        selections: categoryResults,
        winner
    };

    room.rank.results.push(result);

    /*
     * Send complete result to everyone.
     */

    io.to(room.code).emit(
        "rankCategoryResult",
        result
    );

    /*
     * Wait briefly, then move EVERY player together.
     */

    setTimeout(() => {

        if (!rooms.has(room.code)) {
            return;
        }

        if (!room.rank.started) {
            return;
        }

        /*
         * Make sure the same category hasn't already
         * been advanced.
         */

        if (
            room.rank.categoryIndex !==
            categoryIndex
        ) {
            return;
        }

        if (
            categoryIndex >=
            CATEGORIES.length - 1
        ) {

            finishRanking(room);

            return;
        }

        room.rank.categoryIndex++;

        sendRankState(room);
        sendPrivateRankStatus(room);

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

    }, 1800);
}

/* =========================================================
   FINAL RANKING
========================================================= */

function finishRanking(room) {

    room.rank.started = false;

    const players =
        Object.values(room.players);

    const scores = {};

    players.forEach(player => {
        scores[player.id] = {
            playerId: player.id,
            playerName: player.name,
            score: 0,
            categoriesWon: 0,
            selections: []
        };
    });

    room.rank.results.forEach(result => {

        result.selections.forEach(selection => {

            if (!scores[selection.playerId]) {
                return;
            }

            scores[
                selection.playerId
            ].selections.push({
                category:
                    result.categoryName,
                character:
                    selection.character,
                rank:
                    selection.rank
            });
        });

        if (result.winner) {

            const id =
                result.winner.playerId;

            if (scores[id]) {
                scores[id].score++;
                scores[id].categoriesWon++;
            }
        }
    });

    const finalTeams =
        Object.values(scores)
            .sort((a, b) => {

                if (
                    b.score !==
                    a.score
                ) {
                    return b.score - a.score;
                }

                return a.playerName
                    .localeCompare(
                        b.playerName
                    );
            });

    let bestPlayer = null;

    if (finalTeams.length > 0) {
        bestPlayer = finalTeams[0];
    }

    io.to(room.code).emit(
        "rankingFinished",
        {
            teams: finalTeams,
            bestPlayer,
            totalCategories:
                CATEGORIES.length
        }
    );
}

/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {

    const auction =
        room.auction;

    if (!auction) {
        return null;
    }

    let remainingTime = 0;

    if (auction.endTime > 0) {

        remainingTime =
            Math.max(
                0,
                Math.ceil(
                    (
                        auction.endTime -
                        Date.now()
                    ) / 1000
                )
            );
    }

    let highestBidderName = null;

    if (auction.highestBidder) {

        const player =
            room.players[
                auction.highestBidder
            ];

        if (player) {
            highestBidderName =
                player.name;
        }
    }

    return {

        character:
            auction.character,

        currentBid:
            auction.currentBid,

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
            auction.characters.length,

        active:
            auction.active

    };
}

/* =========================================================
   PERSONAL AUCTION INFORMATION
========================================================= */

function sendPersonalAuctionState(room) {

    if (!room.auction) {
        return;
    }

    const auction =
        room.auction;

    Object.values(room.players)
        .forEach(player => {

            const nextBid =
                auction.currentBid +
                room.settings.bidAmount;

            const alreadyHighest =
                auction.highestBidder ===
                player.id;

            const hasGivenUp =
                auction.givenUp.has(
                    player.id
                );

            const teamFull =
                player.team.length >=
                room.settings.teamSize;

            const canBid =
                auction.active &&
                !alreadyHighest &&
                !hasGivenUp &&
                !teamFull &&
                player.balance >= nextBid;

            io.to(player.id).emit(
                "auctionMoneyUpdated",
                {
                    balance:
                        player.balance,

                    spent:
                        player.spent,

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

function sendAuctionTimer(room) {

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
   RESET AUCTION TIMER
========================================================= */

function resetAuctionTimer(room) {

    if (
        !room.auction ||
        !room.auction.active
    ) {
        return;
    }

    clearAuctionTimer(room);

    room.auction.endTime =
        Date.now() +
        room.settings.bidTime * 1000;

    sendAuctionTimer(room);

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

            /*
             * If somebody has bid, highest bidder wins.
             */

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
   AUCTION TICK LOOP
========================================================= */

function startAuctionTickLoop(room) {

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

            sendAuctionTimer(room);

        }, 250);
}

/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    clearAuctionTimer(room);
    clearAuctionInterval(room);

    Object.values(room.players)
        .forEach(player => {

            player.balance =
                room.settings.startingBalance;

            player.spent = 0;

            player.team = [];

            player.gaveUp = false;
        });

    room.auction = {

        index: 0,

        /*
         * RANDOM order every game.
         */

        characters:
            shuffle(CHARACTERS),

        character: null,

        currentBid: 0,

        highestBidder: null,

        active: false,

        endTime: 0,

        timer: null,

        tickInterval: null,

        /*
         * Give-up is reset for EVERY character.
         */

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

    startAuctionTickLoop(room);

    startAuctionCharacter(room);
}

/* =========================================================
   START AUCTION CHARACTER
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

    /*
     * If every player has a full team,
     * auction is finished.
     */

    const everyoneFull =
        Object.values(room.players)
            .every(
                player =>
                    player.team.length >=
                    room.settings.teamSize
            );

    if (everyoneFull) {

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

    /*
     * Players with full teams are automatically
     * unable to bid.
     */

    Object.values(room.players)
        .forEach(player => {

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

    io.to(room.code).emit(
        "auctionReady",
        getAuctionState(room)
    );

    resetAuctionTimer(room);
}

/* =========================================================
   VALIDATE BID
========================================================= */

function validateBid(room, player) {

    const auction =
        room.auction;

    if (!auction || !auction.active) {
        return {
            ok: false,
            message: "Auction is not active."
        };
    }

    if (
        !CHARACTER_SET.has(
            auction.character
        )
    ) {
        return {
            ok: false,
            message: "Invalid auction character."
        };
    }

    if (
        auction.givenUp.has(
            player.id
        )
    ) {
        return {
            ok: false,
            message:
                "You gave up on this character."
        };
    }

    if (
        player.team.length >=
        room.settings.teamSize
    ) {
        return {
            ok: false,
            message: "Your team is full."
        };
    }

    if (
        auction.highestBidder ===
        player.id
    ) {
        return {
            ok: false,
            message:
                "You are already the highest bidder."
        };
    }

    const newBid =
        auction.currentBid +
        room.settings.bidAmount;

    if (
        player.balance <
        newBid
    ) {
        return {
            ok: false,
            message:
                `Not enough money. Remaining: ${player.balance}.`
        };
    }

    return {
        ok: true,
        newBid
    };
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
            "You are not inside a room."
        );

        return;
    }

    const player =
        getPlayer(
            room,
            socket.id
        );

    if (!player) {
        return;
    }

    const validation =
        validateBid(
            room,
            player
        );

    if (!validation.ok) {

        socket.emit(
            "errorMessage",
            validation.message
        );

        /*
         * Always refresh player's UI.
         */

        sendPersonalAuctionState(room);

        return;
    }

    const auction =
        room.auction;

    /*
     * ACCEPT BID
     */

    auction.currentBid =
        validation.newBid;

    auction.highestBidder =
        player.id;

    auction.givenUp.delete(
        player.id
    );

    player.gaveUp = false;

    /*
     * Notify EVERYONE.
     */

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

    /*
     * Synchronize current bid to everyone.
     */

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    /*
     * Reset countdown.
     */

    resetAuctionTimer(room);

    /*
     * Send correct remaining money to
     * EACH player individually.
     */

    sendPersonalAuctionState(room);

    broadcastPlayers(room);
}

/* =========================================================
   GIVE UP
========================================================= */

function handleGiveUp(socket) {

    const room =
        getRoom(socket);

    if (!room) {
        return;
    }

    const player =
        getPlayer(
            room,
            socket.id
        );

    if (!player) {
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

    if (
        player.team.length >=
        room.settings.teamSize
    ) {
        return;
    }

    /*
     * Give up only for THIS character.
     */

    auction.givenUp.add(
        player.id
    );

    player.gaveUp = true;

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

    /*
     * IMPORTANT:
     *
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

                return !auction.givenUp.has(
                    other.id
                );
            });

    /*
     * Nobody remains.
     */

    if (eligible.length === 0) {

        finishAuctionCharacter(
            room,
            true
        );

        return;
    }

    /*
     * Exactly one person remains.
     *
     * If there was already a bid,
     * immediately sell to the remaining
     * eligible person.
     *
     * This fixes the 2-player case.
     */

    if (
        eligible.length === 1 &&
        auction.currentBid > 0
    ) {

        /*
         * If the remaining person is already
         * highest bidder, they win.
         *
         * If the previous highest bidder gave up,
         * the remaining person receives the
         * character at the current bid.
         */

        auction.highestBidder =
            eligible[0].id;

        finishAuctionCharacter(
            room,
            false
        );

        return;
    }

    /*
     * If one player remains and nobody has bid,
     * don't charge them automatically.
     */

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    sendPersonalAuctionState(room);
}

/* =========================================================
   FINISH CURRENT AUCTION CHARACTER
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

    /*
     * SOLD
     */

    if (winner) {

        const price =
            auction.currentBid;

        /*
         * Safety check.
         */

        if (
            winner.balance <
            price
        ) {

            io.to(room.code).emit(
                "auctionUnsold",
                {
                    character:
                        auction.character,
                    reason:
                        "Winner no longer has enough money."
                }
            );

        } else {

            winner.balance -= price;

            winner.spent += price;

            winner.team.push(
                auction.character
            );

            /*
             * Reset give-up state for winner.
             */

            winner.gaveUp = false;

            /*
             * EVERYONE gets the SAME sale result.
             */

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

        /*
         * UNSOLD
         */

        io.to(room.code).emit(
            "auctionUnsold",
            {
                character:
                    auction.character
            }
        );
    }

    /*
     * IMPORTANT:
     * Update money/team information immediately.
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

        if (
            !room.auction
        ) {
            return;
        }

        room.auction.index++;

        startAuctionCharacter(room);

    }, 1400);
}

/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    if (!room.auction) {
        return;
    }

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

    /*
     * Determine strongest auction team using
     * the predefined category rankings.
     */

    const teamScores =
        teams.map(team => {

            let score = 0;

            team.team.forEach(character => {

                CATEGORIES.forEach(category => {

                    const list =
                        RANKINGS[category] || [];

                    const index =
                        list.indexOf(character);

                    if (index >= 0) {

                        score +=
                            Math.max(
                                1,
                                20 - index
                            );
                    }
                });
            });

            return {
                ...team,
                aiScore: score
            };
        })
        .sort(
            (a, b) =>
                b.aiScore - a.aiScore
        );

    const bestTeam =
        teamScores.length
            ? teamScores[0]
            : null;

    io.to(room.code).emit(
        "auctionFinished",
        {
            teams,
            rankedTeams:
                teamScores,

            bestTeam
        }
    );

    broadcastPlayers(room);
}

/* =========================================================
   CREATE ROOM
========================================================= */

function createRoom(socket, data) {

    const name =
        cleanName(data.name);

    if (!name) {

        socket.emit(
            "errorMessage",
            "Enter your name."
        );

        return;
    }

    const code =
        generateRoomCode();

    const settings =
        normalizeSettings(data);

    const room = {

        code,

        hostId:
            socket.id,

        gameMode:
            data.gameMode === "auction"
                ? "auction"
                : "rank",

        settings,

        players: {},

        started: false,

        rank:
            createRankState(),

        auction: null
    };

    room.players[socket.id] = {

        id:
            socket.id,

        name,

        balance:
            settings.startingBalance,

        spent: 0,

        team: [],

        gaveUp: false,

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
                room.gameMode,

            settings
        }
    );

    broadcastPlayers(room);
}

/* =========================================================
   JOIN ROOM
========================================================= */

function joinRoom(socket, data) {

    const name =
        cleanName(data.name);

    const code =
        String(data.roomCode || "")
            .trim()
            .toUpperCase();

    if (!name || !code) {

        socket.emit(
            "errorMessage",
            "Name and room code are required."
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

    if (
        Object.keys(room.players).length >=
        room.settings.maxPlayers
    ) {

        socket.emit(
            "errorMessage",
            "Room is full."
        );

        return;
    }

    if (room.started) {

        socket.emit(
            "errorMessage",
            "Game has already started."
        );

        return;
    }

    room.players[socket.id] = {

        id:
            socket.id,

        name,

        balance:
            room.settings.startingBalance,

        spent: 0,

        team: [],

        gaveUp: false,

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
                room.gameMode,

            settings:
                room.settings
        }
    );

    io.to(code).emit(
        "playerJoined",
        {
            player:
                publicPlayer(
                    room.players[
                        socket.id
                    ]
                )
        }
    );

    broadcastPlayers(room);
}

/* =========================================================
   START GAME
========================================================= */

function startGame(socket) {

    const room =
        getRoom(socket);

    if (!room) {

        socket.emit(
            "errorMessage",
            "Room not found."
        );

        return;
    }

    if (
        room.hostId !==
        socket.id
    ) {

        socket.emit(
            "errorMessage",
            "Only the host can start the game."
        );

        return;
    }

    const playerCount =
        Object.keys(room.players).length;

    if (playerCount < 2) {

        socket.emit(
            "errorMessage",
            "At least 2 players are required."
        );

        return;
    }

    if (room.started) {
        return;
    }

    room.started = true;

    if (
        room.gameMode ===
        "auction"
    ) {

        io.to(room.code).emit(
            "gameStarted",
            {
                gameMode:
                    "auction"
            }
        );

        startAuction(room);

    } else {

        room.rank =
            createRankState();

        room.rank.started = true;

        Object.values(room.players)
            .forEach(player => {

                player.rankSelections =
                    {};
            });

        io.to(room.code).emit(
            "gameStarted",
            {
                gameMode:
                    "rank"
            }
        );

        sendRankState(room);
        sendPrivateRankStatus(room);
    }
}

/* =========================================================
   SOCKET CONNECTION
========================================================= */

io.on("connection", socket => {

    console.log(
        "Player connected:",
        socket.id
    );

    /* -----------------------------------------------------
       CREATE
    ----------------------------------------------------- */

    socket.on(
        "createRoom",
        data => {

            try {

                createRoom(
                    socket,
                    data || {}
                );

            } catch (error) {

                console.error(
                    "createRoom error:",
                    error
                );

                socket.emit(
                    "errorMessage",
                    "Could not create room."
                );
            }
        }
    );

    /* -----------------------------------------------------
       JOIN
    ----------------------------------------------------- */

    socket.on(
        "joinRoom",
        data => {

            try {

                joinRoom(
                    socket,
                    data || {}
                );

            } catch (error) {

                console.error(
                    "joinRoom error:",
                    error
                );

                socket.emit(
                    "errorMessage",
                    "Could not join room."
                );
            }
        }
    );

    /* -----------------------------------------------------
       START
    ----------------------------------------------------- */

    socket.on(
        "startGame",
        () => {

            try {

                startGame(socket);

            } catch (error) {

                console.error(
                    "startGame error:",
                    error
                );

                socket.emit(
                    "errorMessage",
                    "Could not start game."
                );
            }
        }
    );

    /* -----------------------------------------------------
       RANK SELECT
    ----------------------------------------------------- */

    socket.on(
        "rankSelect",
        data => {

            const room =
                getRoom(socket);

            if (!room) {
                return;
            }

            if (
                !room.rank ||
                !room.rank.started
            ) {

                socket.emit(
                    "errorMessage",
                    "Ranking game has not started."
                );

                return;
            }

            const player =
                getPlayer(
                    room,
                    socket.id
                );

            if (!player) {
                return;
            }

            const categoryIndex =
                Number(
                    data &&
                    data.categoryIndex
                );

            const character =
                String(
                    data &&
                    data.character ||
                    ""
                );

            /*
             * Character validation.
             *
             * Guy / Lee / Duy are valid.
             */

            if (
                !CHARACTER_SET.has(
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

            /*
             * Only current category.
             */

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

            /*
             * Save privately.
             */

            player.rankSelections[
                categoryIndex
            ] = character;

            /*
             * Tell clients that someone selected.
             *
             * This does NOT expose a player's card
             * selection as another player's own selection.
             */

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

            sendRankState(room);
            sendPrivateRankStatus(room);

            checkRankCategory(room);
        }
    );

    /* -----------------------------------------------------
       BID
    ----------------------------------------------------- */

    socket.on(
        "bid",
        () => {

            try {

                handleBid(socket);

            } catch (error) {

                console.error(
                    "bid error:",
                    error
                );

                socket.emit(
                    "errorMessage",
                    "Bid failed."
                );
            }
        }
    );

    /*
     * Support alternate client event names.
     * This helps if Game.js currently uses
     * auctionBid instead of bid.
     */

    socket.on(
        "auctionBid",
        () => {

            try {

                handleBid(socket);

            } catch (error) {

                console.error(
                    "auctionBid error:",
                    error
                );
            }
        }
    );

    socket.on(
        "placeBid",
        () => {

            try {

                handleBid(socket);

            } catch (error) {

                console.error(
                    "placeBid error:",
                    error
                );
            }
        }
    );

    /* -----------------------------------------------------
       GIVE UP
    ----------------------------------------------------- */

    socket.on(
        "giveUp",
        () => {

            try {

                handleGiveUp(socket);

            } catch (error) {

                console.error(
                    "giveUp error:",
                    error
                );

                socket.emit(
                    "errorMessage",
                    "Give up failed."
                );
            }
        }
    );

    socket.on(
        "auctionGiveUp",
        () => {

            try {

                handleGiveUp(socket);

            } catch (error) {

                console.error(
                    "auctionGiveUp error:",
                    error
                );
            }
        }
    );

    /* -----------------------------------------------------
       DISCONNECT
    ----------------------------------------------------- */

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

            const player =
                room.players[
                    socket.id
                ];

            delete room.players[
                socket.id
            ];

            /*
             * If host leaves, transfer host.
             */

            if (
                room.hostId ===
                socket.id
            ) {

                const remaining =
                    Object.keys(
                        room.players
                    );

                if (remaining.length > 0) {

                    room.hostId =
                        remaining[0];

                    io.to(
                        room.hostId
                    ).emit(
                        "hostChanged",
                        {
                            isHost: true
                        }
                    );
                }
            }

            /*
             * During auction, a disconnected player
             * is treated as giving up on the current
             * character.
             */

            if (
                room.auction &&
                room.auction.active
            ) {

                room.auction.givenUp.add(
                    socket.id
                );

                const eligible =
                    Object.values(room.players)
                        .filter(other => {

                            if (
                                other.team.length >=
                                room.settings.teamSize
                            ) {
                                return false;
                            }

                            return !room.auction.givenUp
                                .has(other.id);
                        });

                if (
                    eligible.length === 1 &&
                    room.auction.currentBid > 0
                ) {

                    room.auction.highestBidder =
                        eligible[0].id;

                    finishAuctionCharacter(
                        room,
                        false
                    );

                } else if (
                    eligible.length === 0
                ) {

                    finishAuctionCharacter(
                        room,
                        true
                    );
                }
            }

            /*
             * During ranking, if a player leaves,
             * check whether remaining players can
             * continue.
             */

            if (
                room.rank &&
                room.rank.started
            ) {

                checkRankCategory(room);
            }

            /*
             * Notify remaining players.
             */

            if (player) {

                io.to(room.code).emit(
                    "playerLeft",
                    {
                        playerId:
                            player.id,

                        playerName:
                            player.name
                    }
                );
            }

            broadcastPlayers(room);

            /*
             * Delete empty room.
             */

            if (
                Object.keys(
                    room.players
                ).length === 0
            ) {

                if (room.auction) {
                    clearAuctionTimer(room);
                    clearAuctionInterval(room);
                }

                rooms.delete(
                    room.code
                );

                console.log(
                    "Room deleted:",
                    room.code
                );
            }
        }
    );
});

/* =========================================================
   SERVER ERROR HANDLING
========================================================= */

server.on(
    "error",
    error => {

        console.error(
            "HTTP server error:",
            error
        );
    }
);

/* =========================================================
   START SERVER
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
