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
    res.sendFile(
        path.join(__dirname, "..", "index.html")
    );
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        game: "Naruto Character Rank",
        statusCode: 200
    });
});

/* =========================================================
   CHARACTERS
   IMPORTANT:
   These keys MUST match Game.js exactly.
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

    /* ---------------------------------------------------------
       TAIJUTSU
       GUY + DUY + LEE are valid.
    --------------------------------------------------------- */

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
   HELPERS
========================================================= */

function getRoom(socket) {

    if (!socket.roomCode) {
        return null;
    }

    return rooms.get(socket.roomCode) || null;
}

function getPlayer(room, socketId) {

    if (!room) {
        return null;
    }

    return room.players[socketId] || null;
}

function shuffle(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

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
   PLAYER DATA
========================================================= */

function getRoomPlayers(room) {

    return Object.values(room.players)
        .map(player => ({

            id: player.id,

            name: player.name,

            balance:
                player.balance,

            spent:
                player.spent,

            team:
                [...player.team]

        }));
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
   RANKING STATE
========================================================= */

function getRankState(room) {

    const category =
        room.rank.categoryIndex;

    const selections = {};

    Object.values(room.players)
        .forEach(player => {

            selections[player.id] =
                Object.prototype.hasOwnProperty.call(
                    player.rankSelections,
                    category
                );

        });

    return {

        categoryIndex:
            category,

        categoryName:
            CATEGORIES[category],

        categoryNumber:
            category + 1,

        totalCategories:
            CATEGORIES.length,

        selections

    };
}

/* =========================================================
   SEND PRIVATE RANK STATUS
========================================================= */

function sendPrivateRankStatus(room) {

    const category =
        room.rank.categoryIndex;

    Object.values(room.players)
        .forEach(player => {

            const selected =
                Object.prototype.hasOwnProperty.call(
                    player.rankSelections,
                    category
                );

            io.to(player.id).emit(
                "myRankStatus",
                {

                    categoryIndex:
                        category,

                    selected,

                    character:
                        selected
                            ? player.rankSelections[category]
                            : null

                }
            );

        });
}

/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {

    const auction =
        room.auction;

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

    const highestPlayer =
        auction.highestBidder
            ? room.players[
                auction.highestBidder
            ]
            : null;

    return {

        character:
            auction.character,

        currentBid:
            auction.currentBid,

        highestBidder:
            auction.highestBidder,

        highestBidderName:
            highestPlayer
                ? highestPlayer.name
                : null,

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
   PERSONAL AUCTION MONEY
========================================================= */

function sendPersonalAuctionState(room) {

    const auction =
        room.auction;

    Object.values(room.players)
        .forEach(player => {

            const nextBid =
                auction.currentBid +
                room.settings.bidAmount;

            const canBid =
                auction.active &&
                !auction.givenUp.has(
                    player.id
                ) &&
                player.team.length <
                    room.settings.teamSize &&
                player.balance >= nextBid &&
                auction.highestBidder !==
                    player.id;

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
                        auction.givenUp.has(
                            player.id
                        )

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

function sendAuctionTick(room) {

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

function resetAuctionTimer(room) {

    clearAuctionTimer(room);

    const auction =
        room.auction;

    auction.endTime =
        Date.now() +
        room.settings.bidTime * 1000;

    sendAuctionTick(room);

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    sendPersonalAuctionState(room);

    auction.timer =
        setTimeout(
            () => {

                if (
                    !auction.active
                ) {
                    return;
                }

                if (
                    auction.highestBidder
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

            },
            room.settings.bidTime * 1000
        );
}

/* =========================================================
   TIMER TICK LOOP
========================================================= */

function startAuctionTickLoop(room) {

    if (room.auction.tickInterval) {

        clearInterval(
            room.auction.tickInterval
        );
    }

    room.auction.tickInterval =
        setInterval(
            () => {

                if (
                    !rooms.has(
                        room.code
                    )
                ) {
                    clearInterval(
                        room.auction.tickInterval
                    );

                    return;
                }

                if (
                    !room.auction.active
                ) {
                    return;
                }

                sendAuctionTick(room);

            },
            250
        );
}

/* =========================================================
   STOP AUCTION TICK LOOP
========================================================= */

function stopAuctionTickLoop(room) {

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
   START AUCTION
========================================================= */

function startAuction(room) {

    clearAuctionTimer(room);

    stopAuctionTickLoop(room);

    Object.values(room.players)
        .forEach(player => {

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

    startAuctionTickLoop(room);

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

    /*
     * Tell frontend the auction is ready.
     */

    io.to(room.code).emit(
        "auctionReady",
        getAuctionState(room)
    );

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
            `Not enough money. You have ${player.balance}.`
        );

        return;
    }

    /*
     * VALID BID
     */

    auction.currentBid =
        newBid;

    auction.highestBidder =
        socket.id;

    /*
     * A player who bids again is obviously
     * participating in this character.
     */

    auction.givenUp.delete(
        socket.id
    );

    /*
     * Reset timer after every valid bid.
     */

    resetAuctionTimer(room);

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

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    broadcastPlayers(room);

    sendPersonalAuctionState(room);
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

    const auction =
        room.auction;

    if (
        !auction ||
        !auction.active
    ) {
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

    /*
     * Give up only for THIS character.
     */

    auction.givenUp.add(
        socket.id
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
     * Find players still allowed to bid.
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
     * Nobody left.
     */

    if (
        eligible.length === 0
    ) {

        finishAuctionCharacter(
            room,
            true
        );

        return;
    }

    /*
     * Exactly one player remains.
     *
     * If a bid already exists, sell immediately.
     *
     * This fixes the 2-player case:
     *
     * Player 1 bids.
     * Player 2 gives up.
     * Player 1 immediately wins.
     */

    if (
        eligible.length === 1 &&
        auction.highestBidder
    ) {

        const remaining =
            eligible[0];

        /*
         * Make sure the highest bidder is
         * actually still eligible.
         */

        if (
            auction.highestBidder ===
            remaining.id
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

    sendPersonalAuctionState(room);
}

/* =========================================================
   FINISH CHARACTER
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

            winner = null;

        } else {

            winner.balance -= price;

            winner.spent += price;

            winner.team.push(
                auction.character
            );
        }
    }

    if (winner) {

        io.to(room.code).emit(
            "auctionSold",
            {

                character:
                    auction.character,

                winnerId:
                    winner.id,

                winnerName:
                    winner.name,

                price:
                    winner.spent > 0
                        ? auction.currentBid
                        : 0,

                balance:
                    winner.balance,

                spent:
                    winner.spent,

                team:
                    [...winner.team]

            }
        );

    } else {

        io.to(room.code).emit(
            "auctionUnsold",
            {

                character:
                    auction.character,

                reason:
                    "No eligible bidder"

            }
        );
    }

    broadcastPlayers(room);

    sendPersonalAuctionState(room);

    /*
     * Next character.
     */

    setTimeout(
        () => {

            if (
                !rooms.has(room.code)
            ) {
                return;
            }

            auction.index++;

            startAuctionCharacter(
                room
            );

        },
        1800
    );
}

/* =========================================================
   FINAL AUCTION TEAMS
========================================================= */

function buildAuctionTeams(room) {

    return Object.values(room.players)
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
                player.spent,

            teamSize:
                player.team.length

        }));
}

/* =========================================================
   TEAM SCORE
========================================================= */

function characterRankScore(
    character,
    category
) {

    const list =
        RANKINGS[category] || [];

    const index =
        list.indexOf(character);

    /*
     * Top ranked = higher score.
     */

    if (index === -1) {
        return 50;
    }

    return Math.max(
        100 - index * 8,
        20
    );
}

function calculateTeamScore(team) {

    if (
        !Array.isArray(team) ||
        team.length === 0
    ) {
        return 0;
    }

    let total = 0;

    team.forEach(character => {

        CATEGORIES.forEach(
            category => {

                total +=
                    characterRankScore(
                        character,
                        category
                    );
            }
        );

    });

    return Math.round(
        total /
        team.length
    );
}

/* =========================================================
   TEAM COMPARISON
========================================================= */

function evaluateTeams(room) {

    const teams =
        buildAuctionTeams(room)
            .map(team => ({

                ...team,

                score:
                    calculateTeamScore(
                        team.team
                    )

            }));

    const sorted =
        [...teams]
            .sort(
                (a, b) =>
                    b.score - a.score
            );

    const strongest =
        sorted.length > 0
            ? sorted[0]
            : null;

    const comparison =
        teams.map(team => {

            let reason =
                "Balanced team.";

            if (
                strongest &&
                team.playerId ===
                    strongest.playerId
            ) {

                reason =
                    "Strongest overall combination across the 16 categories.";

            } else if (
                strongest
            ) {

                const difference =
                    strongest.score -
                    team.score;

                reason =
                    `The strongest team is ahead by approximately ${difference} evaluation points.`;
            }

            return {

                playerId:
                    team.playerId,

                playerName:
                    team.playerName,

                score:
                    team.score,

                reason

            };
        });

    return {

        teams,

        strongestTeam:
            strongest,

        comparison

    };
}

/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    clearAuctionTimer(room);

    stopAuctionTickLoop(room);

    room.auction.active =
        false;

    const evaluation =
        evaluateTeams(room);

    io.to(room.code).emit(
        "auctionFinished",
        {

            teams:
                evaluation.teams,

            strongestTeam:
                evaluation.strongestTeam,

            comparison:
                evaluation.comparison

        }
    );

    /*
     * Also send a simpler event for
     * frontends using this name.
     */

    io.to(room.code).emit(
        "teamEvaluation",
        evaluation
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
        !room.rank.started
    ) {
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

    const category =
        Number(
            data.categoryIndex
        );

    const character =
        String(
            data.character || ""
        ).trim();

    /*
     * Category validation.
     */

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
     * CHARACTER VALIDATION
     *
     * Guy / Lee / Duy are explicitly included.
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

    /*
     * Only current category can be selected.
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
     * Don't allow a second selection
     * for the same category.
     */

    if (
        Object.prototype.hasOwnProperty.call(
            player.rankSelections,
            category
        )
    ) {

        socket.emit(
            "errorMessage",
            "You already selected a character for this category."
        );

        return;
    }

    /*
     * SAVE ONLY TO THIS PLAYER.
     */

    player.rankSelections[
        category
    ] = character;

    /*
     * IMPORTANT:
     *
     * We do NOT send the selected character
     * to everyone.
     *
     * Only send the player name/status.
     */

    io.to(room.code).emit(
        "rankSelectionMade",
        {

            playerId:
                player.id,

            playerName:
                player.name,

            categoryIndex:
                category

        }
    );

    /*
     * Send private selection to the player.
     */

    socket.emit(
        "myRankSelection",
        {

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
     * EVERY player must select.
     *
     * It does NOT require equal characters.
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
            getRankState(room)
        );

        sendPrivateRankStatus(room);

        return;
    }

    /*
     * Category complete.
     */

    io.to(room.code).emit(
        "rankCategoryComplete",
        {

            categoryIndex:
                category,

            categoryNumber:
                category + 1,

            totalCategories:
                CATEGORIES.length

        }
    );

    /*
     * Move to next category after a delay.
     */

    setTimeout(
        () => {

            /*
             * Room may have disappeared.
             */

            if (
                !rooms.has(room.code)
            ) {
                return;
            }

            /*
             * Make sure this is still
             * the same category.
             */

            if (
                room.rank.categoryIndex !==
                category
            ) {
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

            sendPrivateRankStatus(
                room
            );

        },
        1200
    );
}

/* =========================================================
   RANK FINAL RESULT
========================================================= */

function calculateRankTeamScore(
    selections
) {

    let total = 0;
    let count = 0;

    Object.entries(selections)
        .forEach(
            ([categoryIndex, character]) => {

                const category =
                    CATEGORIES[
                        Number(categoryIndex)
                    ];

                if (!category) {
                    return;
                }

                total +=
                    characterRankScore(
                        character,
                        category
                    );

                count++;

            }
        );

    if (count === 0) {
        return 0;
    }

    return Math.round(
        total / count
    );
}

function finishRankGame(room) {

    room.rank.started =
        false;

    const results =
        Object.values(room.players)
            .map(player => {

                const selections =
                    {
                        ...player.rankSelections
                    };

                const team =
                    Object.values(
                        selections
                    );

                return {

                    playerId:
                        player.id,

                    playerName:
                        player.name,

                    selections,

                    team,

                    score:
                        calculateRankTeamScore(
                            selections
                        )

                };
            });

    const sorted =
        [...results]
            .sort(
                (a, b) =>
                    b.score -
                    a.score
            );

    const strongest =
        sorted.length
            ? sorted[0]
            : null;

    const comparison =
        results.map(result => {

            if (
                strongest &&
                result.playerId ===
                    strongest.playerId
            ) {

                return {

                    playerId:
                        result.playerId,

                    playerName:
                        result.playerName,

                    score:
                        result.score,

                    reason:
                        "Strongest overall selection across the 16 categories."

                };
            }

            return {

                playerId:
                    result.playerId,

                playerName:
                    result.playerName,

                score:
                    result.score,

                reason:
                    strongest
                        ? `${strongest.playerName} has the strongest overall selection.`
                        : "Team evaluated."

            };
        });

    io.to(room.code).emit(
        "rankGameFinished",
        {

            results,

            strongestTeam:
                strongest,

            comparison

        }
    );

    io.to(room.code).emit(
        "rankTeamEvaluation",
        {

            results,

            strongestTeam:
                strongest,

            comparison

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
                        Math.min(
                            Number(
                                data.teamSize
                            ) || 5,
                            CHARACTERS.length
                        )
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

                const bidTime =
                    Math.max(
                        3,
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

                        categoryIndex: 0,

                        started: false

                    },

                    auction: null

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

                    spent:
                        0,

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
                    `Room created: ${roomCode}`
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

                /*
                 * Don't allow joining after game starts.
                 */

                if (
                    room.rank.started ||
                    (
                        room.auction &&
                        room.auction.active
                    )
                ) {

                    socket.emit(
                        "errorMessage",
                        "Game already started."
                    );

                    return;
                }

                room.players[
                    socket.id
                ] = {

                    id:
                        socket.id,

                    name:
                        playerName,

                    balance:
                        room.settings.startingBalance,

                    spent:
                        0,

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

                    Object.values(
                        room.players
                    )
                        .forEach(
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

                            categoryName:
                                CATEGORIES[0]

                        }
                    );

                    io.to(room.code).emit(
                        "rankWaiting",
                        getRankState(room)
                    );

                    sendPrivateRankStatus(
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

                handleRankSelect(
                    socket,
                    data || {}
                );

            }
        );

        /*
         * Alternate event name support.
         */

        socket.on(
            "selectRankCharacter",
            data => {

                handleRankSelect(
                    socket,
                    data || {}
                );

            }
        );

        /* =================================================
           AUCTION BID
        ================================================= */

        socket.on(
            "auctionBid",
            () => {

                handleBid(
                    socket
                );

            }
        );

        /*
         * Support common frontend button event.
         */

        socket.on(
            "bid",
            () => {

                handleBid(
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

                handleGiveUp(
                    socket
                );

            }
        );

        socket.on(
            "giveUp",
            () => {

                handleGiveUp(
                    socket
                );

            }
        );

        /*
         * Old unsold event is treated as Give Up.
         * This keeps compatibility with older Game.js.
         */

        socket.on(
            "auctionUnsold",
            () => {

                handleGiveUp(
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

                console.log(
                    "Disconnected:",
                    socket.id
                );

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
                 * If host leaves, transfer host.
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

                        io.to(room.code).emit(
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

                        stopAuctionTickLoop(
                            room
                        );

                        rooms.delete(
                            roomCode
                        );

                        return;
                    }
                }

                /*
                 * If an auction is active and the
                 * highest bidder leaves, remove them.
                 */

                if (
                    room.auction &&
                    room.auction.active
                ) {

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

                        resetAuctionTimer(
                            room
                        );
                    }

                    room.auction
                        .givenUp
                        .delete(
                            socket.id
                        );

                    /*
                     * If nobody remains, unsold.
                     */

                    const eligible =
                        Object.values(
                            room.players
                        )
                            .filter(
                                player =>
                                    player.team.length <
                                    room.settings.teamSize &&
                                    !room.auction.givenUp.has(
                                        player.id
                                    )
                            );

                    if (
                        eligible.length === 0
                    ) {

                        finishAuctionCharacter(
                            room,
                            true
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
   SERVER START
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
