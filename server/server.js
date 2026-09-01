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

/* =========================================================
   16 RANKING CATEGORIES
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
    "Might Duy",
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

function getRoom(roomCode) {
    return rooms.get(roomCode);
}

function getPlayer(room, socketId) {
    return room?.players?.[socketId];
}

function getPublicPlayers(room) {

    return Object.values(room.players).map(player => ({
        id: player.id,
        name: player.name,
        balance: player.balance,
        team: player.team.map(item => ({
            character: item.character,
            price: item.price
        })),
        teamSize: room.settings.teamSize,
        rankCompleted:
            Object.keys(player.rankSelections).length
    }));
}

function broadcastPlayers(room) {

    io.to(room.code).emit(
        "playersUpdated",
        {
            players: getPublicPlayers(room)
        }
    );
}

/* =========================================================
   PRIVATE RANKING STATE
========================================================= */

function broadcastRankProgress(room) {

    const totalPlayers =
        Object.keys(room.players).length;

    const progress =
        Object.values(room.players).map(player => ({
            id: player.id,
            name: player.name,
            selected:
                Object.keys(
                    player.rankSelections
                ).length
        }));

    io.to(room.code).emit(
        "rankProgress",
        {
            categoryIndex:
                room.rank.categoryIndex,

            totalCategories:
                CATEGORIES.length,

            players:
                progress,

            totalPlayers
        }
    );
}

/* =========================================================
   RANK CATEGORY CHECK
========================================================= */

function checkRankCategoryComplete(room) {

    const category =
        room.rank.categoryIndex;

    const players =
        Object.values(room.players);

    if (!players.length) return;

    const allSelected =
        players.every(player =>
            Object.prototype.hasOwnProperty.call(
                player.rankSelections,
                category
            )
        );

    broadcastRankProgress(room);

    if (!allSelected) {
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
            categoryName:
                CATEGORIES[category]
        }
    );

    setTimeout(() => {

        if (!rooms.has(room.code)) {
            return;
        }

        if (
            room.rank.categoryIndex !==
            category
        ) {
            return;
        }

        if (
            category >=
            CATEGORIES.length - 1
        ) {

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

                categoryName:
                    CATEGORIES[
                        room.rank.categoryIndex
                    ],

                totalCategories:
                    CATEGORIES.length
            }
        );

        broadcastRankProgress(room);

    }, 1000);
}

/* =========================================================
   RANK GAME FINISH
========================================================= */

async function finishRankGame(room) {

    room.rank.started = false;

    const results =
        Object.values(room.players).map(player => ({
            playerId: player.id,
            playerName: player.name,
            selections: {
                ...player.rankSelections
            }
        }));

    io.to(room.code).emit(
        "rankGameFinished",
        {
            categories: CATEGORIES,
            results
        }
    );

    const ai =
        await getAIAnalysis({
            type: "rank",
            players: results,
            categories: CATEGORIES
        });

    io.to(room.code).emit(
        "rankAIResult",
        {
            analysis: ai
        }
    );
}

/* =========================================================
   AUCTION PUBLIC STATE
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
                ? getPlayer(
                    room,
                    auction.highestBidder
                )?.name || null
                : null,

        timer:
            auction.remainingTime,

        bidTime:
            room.settings.bidTime,

        active:
            auction.active,

        givenUp:
            Array.from(
                auction.givenUp
            ),

        players:
            getPublicPlayers(room)

    };
}

/* =========================================================
   AUCTION TIMER
========================================================= */

function stopAuctionTimer(room) {

    if (
        room.auction.timer
    ) {

        clearInterval(
            room.auction.timer
        );

        room.auction.timer =
            null;
    }
}

function startAuctionTimer(room) {

    stopAuctionTimer(room);

    const auction =
        room.auction;

    auction.remainingTime =
        room.settings.bidTime;

    io.to(room.code).emit(
        "auctionTimer",
        {
            time:
                auction.remainingTime
        }
    );

    auction.timer =
        setInterval(() => {

            if (!auction.active) {
                stopAuctionTimer(room);
                return;
            }

            auction.remainingTime--;

            io.to(room.code).emit(
                "auctionTimer",
                {
                    time:
                        auction.remainingTime
                }
            );

            if (
                auction.remainingTime <= 0
            ) {

                stopAuctionTimer(room);

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

    room.auction.index = 0;

    room.auction.active = true;

    Object.values(room.players)
        .forEach(player => {

            player.balance =
                room.settings
                    .startingBalance;

            player.team = [];

        });

    io.to(room.code).emit(
        "auctionStarted",
        {
            settings:
                room.settings,

            totalCharacters:
                CHARACTERS.length
        }
    );

    startAuctionCharacter(room);
}

/* =========================================================
   START AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    const auction =
        room.auction;

    stopAuctionTimer(room);

    const players =
        Object.values(room.players);

    const everyoneFull =
        players.every(player =>
            player.team.length >=
            room.settings.teamSize
        );

    if (everyoneFull) {

        finishAuction(room);

        return;
    }

    if (
        auction.index >=
        CHARACTERS.length
    ) {

        finishAuction(room);

        return;
    }

    auction.character =
        CHARACTERS[
            auction.index
        ];

    auction.currentBid = 0;

    auction.highestBidder = null;

    auction.givenUp =
        new Set();

    auction.active = true;

    auction.remainingTime =
        room.settings.bidTime;

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    startAuctionTimer(room);
}

/* =========================================================
   AUCTION BID
========================================================= */

function handleAuctionBid(
    room,
    socket
) {

    const auction =
        room.auction;

    const player =
        getPlayer(
            room,
            socket.id
        );

    if (!player) return;

    if (!auction.active) {
        return;
    }

    if (
        auction.givenUp.has(
            socket.id
        )
    ) {

        socket.emit(
            "errorMessage",
            "You gave up this character."
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

    resetAuctionTimer(room);

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );
}

/* =========================================================
   AUCTION GIVE UP
========================================================= */

function handleAuctionGiveUp(
    room,
    socket
) {

    const auction =
        room.auction;

    if (!auction.active) {
        return;
    }

    const player =
        getPlayer(
            room,
            socket.id
        );

    if (!player) return;

    auction.givenUp.add(
        socket.id
    );

    /*
     * If this player was the highest bidder,
     * remove them from the highest bidder position.
     */

    if (
        auction.highestBidder ===
        socket.id
    ) {

        auction.highestBidder =
            null;

        auction.currentBid = 0;
    }

    /*
     * Check players who are still allowed
     * to bid.
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
     * Special 2-player situation:
     *
     * Player A gives up.
     * Player B already bid.
     * Immediately sell to Player B.
     */

    if (
        auction.highestBidder === null
    ) {

        const previousBidder =
            findPreviousBidder(
                room,
                socket.id
            );

        if (
            previousBidder
        ) {

            auction.highestBidder =
                previousBidder.id;

            /*
             * Restore the current bid
             * using the bidder's last bid.
             */

            auction.currentBid =
                previousBidder.lastBid ||
                room.settings.bidAmount;

            finishAuctionCharacter(
                room
            );

            return;
        }
    }

    /*
     * If only one eligible player remains
     * and there is already a bid,
     * sell immediately.
     */

    if (
        auction.currentBid > 0 &&
        auction.highestBidder &&
        eligible.length <= 1
    ) {

        finishAuctionCharacter(
            room
        );

        return;
    }

    /*
     * Nobody wants it.
     */

    if (
        eligible.length === 0 &&
        auction.currentBid === 0
    ) {

        finishAuctionCharacter(
            room,
            true
        );

        return;
    }

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );
}

/* =========================================================
   FIND PREVIOUS BIDDER
========================================================= */

function findPreviousBidder(
    room,
    givingUpId
) {

    const auction =
        room.auction;

    if (
        auction.highestBidder &&
        auction.highestBidder !==
        givingUpId
    ) {

        return getPlayer(
            room,
            auction.highestBidder
        );
    }

    return null;
}

/* =========================================================
   FINISH ONE AUCTION CHARACTER
========================================================= */

function finishAuctionCharacter(
    room,
    forcedUnsold = false
) {

    const auction =
        room.auction;

    if (!auction.active) {
        return;
    }

    stopAuctionTimer(room);

    auction.active = false;

    const character =
        auction.character;

    const bidderId =
        auction.highestBidder;

    const bidder =
        bidderId
            ? getPlayer(
                room,
                bidderId
            )
            : null;

    /*
     * UNSOLD
     */

    if (
        forcedUnsold ||
        !bidder ||
        auction.currentBid <= 0
    ) {

        io.to(room.code).emit(
            "auctionSold",
            {
                character,
                sold: false,
                unsold: true,
                buyerId: null,
                buyerName: null,
                price: 0,
                players:
                    getPublicPlayers(room)
            }
        );

        auction.index++;

        setTimeout(() => {

            startAuctionCharacter(room);

        }, 1200);

        return;
    }

    /*
     * SELL CHARACTER
     */

    const price =
        auction.currentBid;

    if (
        bidder.balance <
        price
    ) {

        io.to(room.code).emit(
            "auctionSold",
            {
                character,
                sold: false,
                unsold: true,
                buyerId: null,
                buyerName: null,
                price: 0,
                players:
                    getPublicPlayers(room)
            }
        );

        auction.index++;

        setTimeout(() => {

            startAuctionCharacter(room);

        }, 1200);

        return;
    }

    bidder.balance -= price;

    bidder.team.push({
        character,
        price
    });

    io.to(room.code).emit(
        "auctionSold",
        {
            character,

            sold: true,

            unsold: false,

            buyerId:
                bidder.id,

            buyerName:
                bidder.name,

            price,

            remainingBalance:
                bidder.balance,

            players:
                getPublicPlayers(room)
        }
    );

    broadcastPlayers(room);

    auction.index++;

    setTimeout(() => {

        startAuctionCharacter(room);

    }, 1500);
}

/* =========================================================
   FINISH AUCTION
========================================================= */

async function finishAuction(room) {

    stopAuctionTimer(room);

    room.auction.active =
        false;

    const teams =
        Object.values(room.players)
            .map(player => ({
                playerId: player.id,
                playerName: player.name,
                balance: player.balance,
                team: player.team
            }));

    io.to(room.code).emit(
        "auctionFinished",
        {
            teams
        }
    );

    const ai =
        await getAIAnalysis({
            type: "auction",
            teams,
            settings:
                room.settings
        });

    io.to(room.code).emit(
        "auctionAIResult",
        {
            analysis: ai
        }
    );
}

/* =========================================================
   OPENAI AI ANALYSIS
========================================================= */

async function getAIAnalysis(data) {

    const apiKey =
        process.env.OPENAI_API_KEY;

    /*
     * If API key isn't configured,
     * return a useful fallback.
     */

    if (!apiKey) {

        return {
            available: false,

            message:
                "AI analysis is not configured. Add OPENAI_API_KEY in Render environment variables.",

            bestTeam: null,

            explanation:
                "The game completed successfully, but the AI recommendation requires an OpenAI API key."
        };
    }

    try {

        const prompt = `
You are an expert Naruto team analyst.

Analyze the following multiplayer Naruto game.

GAME DATA:
${JSON.stringify(data, null, 2)}

Give a clear analysis.

For CHARACTER RANK mode:
- Analyze every player's selections.
- Identify each player's strongest choices.
- Identify weaknesses.
- Give an overall team strength assessment.
- Decide which player's team is strongest.
- Explain WHY.

For AUCTION mode:
- Analyze every completed team.
- Consider character abilities, balance, synergy,
  offense, defense, speed, chakra, ninjutsu,
  taijutsu, genjutsu, battle IQ, leadership,
  versatility and teamwork.
- Consider remaining money.
- Decide which team is strongest.
- Explain WHY.
- Give the best combination/synergy.
- Mention the runner-up.

Return concise but useful results.
Do not invent characters that aren't present in the supplied data.
`;

        const response =
            await fetch(
                "https://api.openai.com/v1/responses",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${apiKey}`
                    },

                    body: JSON.stringify({

                        model:
                            "gpt-5.6-luna",

                        input:
                            prompt

                    })
                }
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "OpenAI error:",
                errorText
            );

            return {
                available: false,
                message:
                    "AI analysis failed.",
                error:
                    errorText
            };
        }

        const result =
            await response.json();

        const text =
            result.output_text ||
            extractOutputText(result);

        return {
            available: true,
            text:
                text ||
                "AI returned no analysis."
        };

    } catch (error) {

        console.error(
            "AI request error:",
            error
        );

        return {
            available: false,
            message:
                "Could not connect to AI.",
            error:
                error.message
        };
    }
}

/* =========================================================
   EXTRACT RESPONSE TEXT
========================================================= */

function extractOutputText(result) {

    try {

        if (
            !result.output ||
            !Array.isArray(
                result.output
            )
        ) {

            return "";
        }

        let text = "";

        result.output.forEach(item => {

            if (
                item.type ===
                "message" &&
                Array.isArray(
                    item.content
                )
            ) {

                item.content.forEach(
                    content => {

                        if (
                            content.type ===
                            "output_text"
                        ) {

                            text +=
                                content.text ||
                                "";
                        }

                    }
                );
            }

        });

        return text;

    } catch {

        return "";
    }
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

                const roomCode =
                    generateRoomCode();

                const name =
                    String(
                        data?.name ||
                        "Player 1"
                    ).trim();

                const gameMode =
                    data?.gameMode ===
                    "auction"
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
                        Math.min(
                            60,
                            Number(
                                data?.bidTime
                            ) || 10
                        )
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

                        remainingTime:
                            bidTime,

                        givenUp:
                            new Set(),

                        active: false,

                        timer: null
                    }
                };

                room.players[
                    socket.id
                ] = {

                    id:
                        socket.id,

                    name,

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

        /* =================================================
           JOIN ROOM
        ================================================= */

        socket.on(
            "joinRoom",
            data => {

                const roomCode =
                    String(
                        data?.roomCode ||
                        ""
                    )
                    .trim()
                    .toUpperCase();

                const room =
                    getRoom(
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

                const name =
                    String(
                        data?.name ||
                        `Player ${count + 1}`
                    ).trim();

                room.players[
                    socket.id
                ] = {

                    id:
                        socket.id,

                    name,

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

                broadcastPlayers(room);
            }
        );

        /* =================================================
           START GAME
        ================================================= */

        socket.on(
            "startGame",
            () => {

                const room =
                    getRoom(
                        socket.roomCode
                    );

                if (!room) return;

                if (
                    room.host !==
                    socket.id
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
                            categoryIndex: 0,

                            categoryName:
                                CATEGORIES[0],

                            totalCategories:
                                CATEGORIES.length
                        }
                    );

                    broadcastRankProgress(room);

                } else {

                    startAuction(room);
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
                    getRoom(
                        socket.roomCode
                    );

                if (!room) return;

                if (
                    !room.rank.started
                ) return;

                const player =
                    getPlayer(
                        room,
                        socket.id
                    );

                if (!player) return;

                const category =
                    Number(
                        data?.categoryIndex
                    );

                const character =
                    String(
                        data?.character ||
                        ""
                    );

                if (
                    !Number.isInteger(
                        category
                    )
                ) return;

                if (
                    category !==
                    room.rank.categoryIndex
                ) {

                    return;
                }

                if (
                    category < 0 ||
                    category >=
                    CATEGORIES.length
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
                 * Same character can be selected
                 * by multiple players.
                 */

                player.rankSelections[
                    category
                ] = character;

                /*
                 * IMPORTANT:
                 *
                 * Do NOT send the character
                 * to everybody.
                 *
                 * Only tell everybody that
                 * this player selected.
                 */

                io.to(room.code).emit(
                    "rankPlayerSelected",
                    {
                        playerId:
                            socket.id,

                        playerName:
                            player.name,

                        categoryIndex:
                            category
                    }
                );

                socket.emit(
                    "rankSelectionConfirmed",
                    {
                        categoryIndex:
                            category,

                        categoryName:
                            CATEGORIES[
                                category
                            ],

                        character
                    }
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

                const room =
                    getRoom(
                        socket.roomCode
                    );

                if (!room) return;

                handleAuctionBid(
                    room,
                    socket
                );
            }
        );

        /* =================================================
           AUCTION GIVE UP
        ================================================= */

        socket.on(
            "auctionGiveUp",
            () => {

                const room =
                    getRoom(
                        socket.roomCode
                    );

                if (!room) return;

                handleAuctionGiveUp(
                    room,
                    socket
                );
            }
        );

        /*
         * Keep old button/event working too.
         */

        socket.on(
            "auctionUnsold",
            () => {

                const room =
                    getRoom(
                        socket.roomCode
                    );

                if (!room) return;

                handleAuctionGiveUp(
                    room,
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

                if (!roomCode) return;

                const room =
                    getRoom(
                        roomCode
                    );

                if (!room) return;

                if (
                    room.auction.active &&
                    room.auction.highestBidder ===
                    socket.id
                ) {

                    room.auction.highestBidder =
                        null;

                    room.auction.currentBid =
                        0;
                }

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

                        stopAuctionTimer(
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

                if (
                    room.rank.started
                ) {

                    checkRankCategoryComplete(
                        room
                    );
                }
            }
        );
    }
);

/* =========================================================
   SERVER
========================================================= */

server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);
