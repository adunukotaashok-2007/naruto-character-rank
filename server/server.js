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
        path.join(__dirname, "..", "index.html")
    );
});

/* =========================================================
   ROOMS
========================================================= */

const rooms = new Map();

/* =========================================================
   CHARACTER KEYS
   IMPORTANT:
   These MUST match game.js exactly.
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

    /* Might Guy's father */
    "Duy",

    "Shizune",
    "Asuma",
    "Kurenai",
    "Yamato",
    "Sai",
    "Konohamaru",
    "Kurotsuchi",
    "Mifune",
    "Fu",
    "Utakata",
    "Roshi",
    "Rasa",
    "Chiyo",
    "Darui",
    "Chojuro"
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


function shuffle(array) {

    const arr = [...array];

    for (
        let i = arr.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            arr[i],
            arr[j]
        ] = [
            arr[j],
            arr[i]
        ];
    }

    return arr;
}


function getRoom(roomCode) {

    if (!roomCode) {
        return null;
    }

    return rooms.get(
        String(roomCode).toUpperCase()
    ) || null;
}


function getPlayers(room) {

    return Object.values(
        room.players
    ).map(player => ({
        id: player.id,
        name: player.name,
        balance: player.balance,
        team: [...player.team],
        givenUp: player.givenUp
    }));
}


function broadcastPlayers(room) {

    io.to(room.code).emit(
        "playersUpdated",
        {
            players:
                getPlayers(room)
        }
    );
}


/* =========================================================
   AI / TEAM EVALUATION
========================================================= */

/*
   Local evaluation is always available.

   If OPENAI_API_KEY exists in Render,
   the server will additionally ask OpenAI
   for a natural-language evaluation.
*/

const POWER = {

    Naruto: 100,
    Sasuke: 99,
    Madara: 100,
    Hashirama: 99,
    Kaguya: 100,

    Itachi: 94,
    Minato: 97,
    Tobirama: 94,
    Kakashi: 91,
    Obito: 96,

    Jiraiya: 89,
    Hiruzen: 91,
    Orochimaru: 91,

    Guy: 97,
    Lee: 82,
    Duy: 78,

    Nagato: 95,
    Pain: 95,

    Shikamaru: 76,
    Neji: 74,
    Gaara: 84,
    Kisame: 87,
    Sakura: 82,

    Tsunade: 88,
    KillerB: 88,
    Kabuto: 88,
    Shisui: 91,
    Sakumo: 88,
    Hanzo: 88,

    ThirdRaikage: 92,
    FourthRaikage: 88,

    Onoki: 87,
    Mei: 78,

    Sasori: 87,
    Deidara: 84,

    Mu: 91,
    Gengetsu: 88,

    Danzo: 82,
    Kakuzu: 84,
    Hidan: 72,

    Konan: 79,
    Zabuza: 76,
    Kimimaro: 79,

    Suigetsu: 70,
    Jugo: 71,
    Karin: 60,
    Yahiko: 70,
    Zetsu: 55,

    Hinata: 67,
    Ino: 62,
    Choji: 67,
    Kiba: 64,
    Shino: 68,
    Tenten: 59,

    Iruka: 45,
    Anko: 55,
    Shizune: 57,
    Asuma: 71,
    Kurenai: 68,

    Yamato: 75,
    Sai: 67,
    Konohamaru: 62,

    Kurotsuchi: 75,
    Mifune: 78,

    Fu: 79,
    Utakata: 79,
    Roshi: 81,

    Rasa: 78,
    Chiyo: 75,

    Darui: 79,
    Chojuro: 70
};


function characterPower(character) {

    return POWER[character] || 50;
}


/*
   Calculate a team strength.

   This is NOT points shown to the players.
   It is only used internally for comparison.
*/

function calculateTeamStrength(team) {

    if (!team || !team.length) {
        return 0;
    }

    const values =
        team.map(
            characterPower
        );

    const average =
        values.reduce(
            (a, b) => a + b,
            0
        ) / values.length;

    const top =
        Math.max(...values);

    const variety =
        new Set(team).size;

    const synergy =
        Math.min(
            10,
            variety * 1.5
        );

    return (
        average * 0.75 +
        top * 0.15 +
        synergy
    );
}


function getLocalTeamEvaluation(
    teams
) {

    const evaluations =
        teams.map(team => {

            const strength =
                calculateTeamStrength(
                    team.team
                );

            return {
                playerId:
                    team.playerId,

                playerName:
                    team.playerName,

                team:
                    team.team,

                internalStrength:
                    strength
            };
        });


    evaluations.sort(
        (a, b) =>
            b.internalStrength -
            a.internalStrength
    );


    const strongest =
        evaluations[0] || null;


    return {
        strongestTeam:
            strongest
                ? strongest.playerName
                : null,

        strongestPlayerId:
            strongest
                ? strongest.playerId
                : null,

        explanation:
            strongest
                ? `${strongest.playerName} has the strongest overall team because the selected characters provide the best combination of raw power, elite fighters, versatility, durability and team balance.`
                : "No teams are available.",

        teams:
            evaluations.map(
                item => ({
                    playerId:
                        item.playerId,

                    playerName:
                        item.playerName,

                    team:
                        item.team
                })
            )
    };
}


/* =========================================================
   OPENAI TEAM EVALUATION
========================================================= */

async function getAITeamEvaluation(
    teams,
    purpose = "final"
) {

    const local =
        getLocalTeamEvaluation(
            teams
        );


    /*
     * No API key:
     * use reliable local fallback.
     */

    if (!process.env.OPENAI_API_KEY) {

        return {
            ...local,

            source:
                "local-ai-fallback",

            purpose
        };
    }


    try {

        const teamText =
            teams.map(
                team =>
                    `${team.playerName}: ${team.team.join(", ")}`
            ).join("\n");


        const prompt = `
You are evaluating Naruto teams for a multiplayer Naruto character game.

Compare these teams:

${teamText}

Determine:
1. Which team is strongest overall.
2. Why that team is strongest.
3. The strengths of every team.
4. Weaknesses of every team.
5. Which team has the best balance.
6. Which team has the best offensive power.
7. Which team has the best defensive/utility combination.

Do NOT use numerical game points in the response.

Return concise plain text.
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
                            `Bearer ${process.env.OPENAI_API_KEY}`
                    },

                    body:
                        JSON.stringify({
                            model:
                                process.env.OPENAI_MODEL ||
                                "gpt-5.6-luna",

                            input:
                                prompt
                        })
                }
            );


        if (!response.ok) {

            throw new Error(
                `OpenAI HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        const text =
            data.output_text ||
            extractResponseText(
                data
            );


        if (!text) {
            throw new Error(
                "Empty AI response"
            );
        }


        return {

            ...local,

            source:
                "openai",

            purpose,

            aiText:
                text
        };

    } catch (error) {

        console.error(
            "AI evaluation failed:",
            error.message
        );


        return {

            ...local,

            source:
                "local-ai-fallback",

            purpose,

            aiText:
                "AI evaluation was unavailable, so the game used its built-in team evaluation."
        };
    }
}


function extractResponseText(
    data
) {

    try {

        if (
            !data ||
            !Array.isArray(
                data.output
            )
        ) {
            return "";
        }


        let result = "";


        for (
            const item
            of data.output
        ) {

            if (
                !Array.isArray(
                    item.content
                )
            ) {
                continue;
            }


            for (
                const content
                of item.content
            ) {

                if (
                    content.type ===
                    "output_text"
                ) {

                    result +=
                        content.text || "";
                }
            }
        }


        return result.trim();

    } catch {

        return "";
    }
}


/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(
    room
) {

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

        bidAmount:
            room.settings.bidAmount,

        bidTime:
            room.settings.bidTime,

        characterNumber:
            auction.index + 1,

        totalCharacters:
            auction.order.length,

        remainingCharacters:
            auction.order.length -
            auction.index,

        active:
            auction.active,

        eligiblePlayers:
            Object.values(
                room.players
            )
            .filter(
                player =>
                    !player.givenUp
            )
            .map(
                player => player.id
            ),

        players:
            getPlayers(room)
    };
}


/* =========================================================
   SEND AUCTION STATE
========================================================= */

function broadcastAuction(
    room
) {

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );

    /*
     * Also send complete player
     * money/team information.
     */

    broadcastPlayers(room);
}


/* =========================================================
   CREATE ROOM
========================================================= */

io.on(
    "connection",
    socket => {

        console.log(
            "Connected:",
            socket.id
        );


        /* =================================================
           CREATE
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

                        started:
                            false,

                        categoryIndex:
                            0,

                        categoryLocked:
                            false,

                        completion:
                            {}
                    },

                    auction: {

                        started:
                            false,

                        active:
                            false,

                        index:
                            0,

                        order:
                            shuffle(
                                CHARACTERS
                            ),

                        character:
                            null,

                        currentBid:
                            0,

                        highestBidder:
                            null,

                        eligible:
                            new Set(),

                        timer:
                            null,

                        timerEndsAt:
                            0
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

                    team:
                        [],

                    rankSelections:
                        {},

                    givenUp:
                        false,

                    auctionGivenUpFor:
                        null
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


        /* =================================================
           JOIN
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


                if (
                    room.auction.started ||
                    room.rank.started
                ) {

                    socket.emit(
                        "errorMessage",
                        "Game has already started."
                    );

                    return;
                }


                const playerName =
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
                        playerName,

                    balance:
                        room.settings
                            .startingBalance,

                    team:
                        [],

                    rankSelections:
                        {},

                    givenUp:
                        false,

                    auctionGivenUpFor:
                        null
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
                    getRoom(
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
                    "auction"
                ) {

                    startAuction(
                        room
                    );

                } else {

                    startRankGame(
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
                    getRoom(
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

                    socket.emit(
                        "errorMessage",
                        `Invalid character: ${character}`
                    );

                    return;
                }


                /*
                 * IMPORTANT:
                 * Same character may be selected
                 * by different players.
                 */


                player.rankSelections[
                    category
                ] =
                    character;


                /*
                 * DO NOT broadcast the actual
                 * character to everyone.
                 *
                 * This fixes the problem where
                 * another player sees your selection.
                 */

                socket.emit(
                    "rankSelectionAccepted",
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


                if (!room) {
                    return;
                }


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


                if (!player) {
                    return;
                }


                /*
                 * Player who gave up this
                 * character cannot bid again.
                 */

                if (
                    !auction.eligible.has(
                        socket.id
                    )
                ) {

                    socket.emit(
                        "errorMessage",
                        "You gave up this character and cannot bid again."
                    );

                    return;
                }


                /*
                 * Team already full.
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
                 * You cannot bid against
                 * yourself.
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
                    newBid >
                    player.balance
                ) {

                    socket.emit(
                        "errorMessage",
                        `Not enough money. You have ${player.balance} remaining.`
                    );

                    return;
                }


                auction.currentBid =
                    newBid;


                auction.highestBidder =
                    socket.id;


                /*
                 * EVERY valid bid resets
                 * the timer.
                 */

                resetAuctionTimer(
                    room
                );


                broadcastAuction(
                    room
                );


                /*
                 * Send remaining balance
                 * information immediately.
                 */

                io.to(room.code).emit(
                    "auctionMoneyUpdated",
                    {

                        playerId:
                            socket.id,

                        playerName:
                            player.name,

                        balance:
                            player.balance -
                            newBid,

                        currentBid:
                            newBid
                    }
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


                if (!room) {
                    return;
                }


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


                if (!player) {
                    return;
                }


                /*
                 * Remove this player from
                 * eligible bidders.
                 */

                auction.eligible.delete(
                    socket.id
                );


                player.auctionGivenUpFor =
                    auction.character;


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


                /*
                 * 2-player special rule:
                 *
                 * If one player gives up and
                 * the other player is the only
                 * eligible player AND there is
                 * already a bid, immediately sell.
                 */

                const eligible =
                    Array.from(
                        auction.eligible
                    );


                if (
                    eligible.length === 1 &&
                    auction.highestBidder &&
                    auction.highestBidder ===
                        eligible[0]
                ) {

                    finishAuctionCharacter(
                        room,
                        false
                    );

                    return;
                }


                /*
                 * If nobody is left,
                 * character is unsold.
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


                broadcastAuction(
                    room
                );
            }
        );


        /*
         * Backward compatibility:
         * old frontend may still send auctionUnsold.
         */

        socket.on(
            "auctionUnsold",
            () => {

                const room =
                    getRoom(
                        socket.roomCode
                    );


                if (!room) {
                    return;
                }


                /*
                 * Treat old UNSOLD button
                 * as GIVE UP for this player.
                 */

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


                if (!player) {
                    return;
                }


                auction.eligible.delete(
                    socket.id
                );


                player.auctionGivenUpFor =
                    auction.character;


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


                const eligible =
                    Array.from(
                        auction.eligible
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


                if (
                    eligible.length === 1 &&
                    auction.highestBidder ===
                        eligible[0]
                ) {

                    finishAuctionCharacter(
                        room,
                        false
                    );

                    return;
                }


                broadcastAuction(
                    room
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
                    getRoom(
                        roomCode
                    );


                if (!room) {
                    return;
                }


                /*
                 * If someone disconnects
                 * during auction, remove them
                 * from eligible bidders.
                 */

                if (
                    room.auction.active
                ) {

                    room.auction.eligible.delete(
                        socket.id
                    );


                    if (
                        room.auction.highestBidder ===
                        socket.id
                    ) {

                        room.auction.highestBidder =
                            null;

                        room.auction.currentBid =
                            0;
                    }
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
            }
        );
    }
);


/* =========================================================
   START RANK GAME
========================================================= */

function startRankGame(
    room
) {

    room.rank.started =
        true;

    room.rank.categoryIndex =
        0;

    room.rank.categoryLocked =
        false;

    room.rank.completion =
        {};


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

            category:
                CATEGORIES[0],

            totalCategories:
                CATEGORIES.length,

            categoryNumber:
                1
        }
    );
}


/* =========================================================
   RANK CATEGORY COMPLETE
========================================================= */

function checkRankCategoryComplete(
    room
) {

    if (
        !room.rank.started
    ) {
        return;
    }


    if (
        room.rank.categoryLocked
    ) {
        return;
    }


    const category =
        room.rank.categoryIndex;


    const players =
        Object.values(
            room.players
        );


    /*
     * EVERY player must have selected.
     */

    const allSelected =
        players.length >= 2 &&
        players.every(
            player =>
                Object.prototype
                    .hasOwnProperty.call(
                        player.rankSelections,
                        category
                    )
        );


    if (!allSelected) {

        /*
         * Send only progress count.
         * Do NOT reveal selections.
         */

        const selectedCount =
            players.filter(
                player =>
                    Object.prototype
                        .hasOwnProperty.call(
                            player.rankSelections,
                            category
                        )
            ).length;


        io.to(room.code).emit(
            "rankSelectionProgress",
            {

                categoryIndex:
                    category,

                categoryNumber:
                    category + 1,

                totalCategories:
                    CATEGORIES.length,

                selectedCount,

                totalPlayers:
                    players.length
            }
        );


        return;
    }


    room.rank.categoryLocked =
        true;


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


    setTimeout(
        () => {

            if (
                !room.rank.started
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

                finishRankGame(
                    room
                );

                return;
            }


            room.rank.categoryIndex =
                category + 1;

            room.rank.categoryLocked =
                false;


            const next =
                room.rank.categoryIndex;


            io.to(room.code).emit(
                "rankNextCategory",
                {

                    categoryIndex:
                        next,

                    category:
                        CATEGORIES[next],

                    categoryNumber:
                        next + 1,

                    totalCategories:
                        CATEGORIES.length
                }
            );

        },
        1200
    );
}


/* =========================================================
   FINISH RANK GAME
========================================================= */

async function finishRankGame(
    room
) {

    room.rank.started =
        false;


    const teams =
        Object.values(
            room.players
        ).map(
            player => ({

                playerId:
                    player.id,

                playerName:
                    player.name,

                team:
                    CATEGORIES.map(
                        (_, index) =>
                            player.rankSelections[
                                index
                            ]
                    ).filter(Boolean)
            })
        );


    /*
     * Evaluate every player's
     * complete selection.
     */

    const ai =
        await getAITeamEvaluation(
            teams,
            "rank"
        );


    io.to(room.code).emit(
        "rankGameFinished",
        {

            results:
                teams.map(
                    team => ({

                        playerId:
                            team.playerId,

                        playerName:
                            team.playerName,

                        selections:
                            room.players[
                                team.playerId
                            ]?.rankSelections ||
                            {},

                        team:
                            team.team
                    })
                ),

            teams,

            aiEvaluation:
                ai,

            strongestTeam:
                ai.strongestTeam,

            strongestPlayerId:
                ai.strongestPlayerId,

            aiText:
                ai.aiText ||
                ai.explanation
        }
    );
}


/* =========================================================
   START AUCTION
========================================================= */

function startAuction(
    room
) {

    clearAuctionTimer(
        room
    );


    room.auction.started =
        true;

    room.auction.active =
        false;

    room.auction.index =
        0;


    /*
     * RANDOM ORDER EVERY GAME
     */

    room.auction.order =
        shuffle(
            CHARACTERS
        );


    Object.values(
        room.players
    ).forEach(
        player => {

            player.balance =
                room.settings
                    .startingBalance;

            player.team =
                [];

            player.givenUp =
                false;

            player.auctionGivenUpFor =
                null;
        }
    );


    io.to(room.code).emit(
        "auctionStarted",
        {

            settings:
                room.settings,

            totalCharacters:
                room.auction.order.length
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


    clearAuctionTimer(
        room
    );


    /*
     * Finished all random characters.
     */

    if (
        auction.index >=
        auction.order.length
    ) {

        finishAuction(
            room
        );

        return;
    }


    /*
     * Stop if all teams are full.
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
     * Find the next character
     * that can still be useful.
     */

    const character =
        auction.order[
            auction.index
        ];


    auction.character =
        character;


    auction.currentBid =
        0;


    auction.highestBidder =
        null;


    auction.active =
        true;


    /*
     * EVERY PLAYER WHOSE TEAM IS NOT FULL
     * can bid at the beginning.
     */

    auction.eligible =
        new Set(
            Object.values(
                room.players
            )
            .filter(
                player =>
                    player.team.length <
                    room.settings.teamSize
            )
            .map(
                player =>
                    player.id
            )
        );


    /*
     * Reset give-up state
     * for the new character.
     */

    Object.values(
        room.players
    ).forEach(
        player => {

            player.auctionGivenUpFor =
                null;
        }
    );


    resetAuctionTimer(
        room
    );


    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );


    /*
     * Also explicitly tell frontend
     * to start its visible countdown.
     */

    io.to(room.code).emit(
        "auctionTimerStart",
        {

            duration:
                room.settings.bidTime,

            endsAt:
                auction.timerEndsAt,

            character
        }
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


    clearAuctionTimer(
        room
    );


    if (
        !auction.active
    ) {
        return;
    }


    const duration =
        Math.max(
            1,
            Number(
                room.settings.bidTime
            ) || 10
        );


    auction.timerEndsAt =
        Date.now() +
        duration * 1000;


    auction.timer =
        setTimeout(
            () => {

                if (
                    !auction.active
                ) {
                    return;
                }


                /*
                 * Timer expired.
                 *
                 * If someone has the highest bid,
                 * sell to that person.
                 *
                 * Otherwise unsold.
                 */

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
            duration * 1000
        );


    /*
     * Send reset event so every
     * browser resets its visible timer.
     */

    io.to(room.code).emit(
        "auctionTimerReset",
        {

            duration,

            endsAt:
                auction.timerEndsAt,

            character:
                auction.character
        }
    );
}


/* =========================================================
   CLEAR TIMER
========================================================= */

function clearAuctionTimer(
    room
) {

    if (
        room.auction &&
        room.auction.timer
    ) {

        clearTimeout(
            room.auction.timer
        );

        room.auction.timer =
            null;
    }
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
        !auction.active
    ) {
        return;
    }


    clearAuctionTimer(
        room
    );


    auction.active =
        false;


    const character =
        auction.character;


    const buyerId =
        unsold
            ? null
            : auction.highestBidder;


    /*
     * UNSOLD
     */

    if (
        !buyerId
    ) {

        io.to(room.code).emit(
            "auctionCharacterUnsold",
            {

                character,

                message:
                    `${character} was unsold.`,

                players:
                    getPlayers(room)
            }
        );


        auction.index++;


        setTimeout(
            () => {

                startAuctionCharacter(
                    room
                );

            },
            1200
        );


        return;
    }


    const buyer =
        room.players[
            buyerId
        ];


    /*
     * Safety check.
     */

    if (!buyer) {

        auction.index++;


        setTimeout(
            () => {

                startAuctionCharacter(
                    room
                );

            },
            500
        );

        return;
    }


    const price =
        auction.currentBid;


    /*
     * FINAL MONEY DEDUCTION.
     */

    buyer.balance =
        Math.max(
            0,
            buyer.balance - price
        );


    buyer.team.push(
        character
    );


    /*
     * IMPORTANT:
     * Send buyer NAME explicitly.
     * This fixes "sold to undefined".
     */

    io.to(room.code).emit(
        "auctionSold",
        {

            character,

            buyerId:
                buyer.id,

            buyerName:
                buyer.name,

            price,

            remainingBalance:
                buyer.balance,

            team:
                [...buyer.team],

            players:
                getPlayers(room),

            message:
                `${character} sold to ${buyer.name} for ${price}.`
        }
    );


    /*
     * Update everyone immediately.
     */

    broadcastPlayers(
        room
    );


    auction.index++;


    /*
     * If buyer's team is now full,
     * remove them from future bidding.
     */

    if (
        buyer.team.length >=
        room.settings.teamSize
    ) {

        auction.eligible.delete(
            buyer.id
        );
    }


    setTimeout(
        () => {

            startAuctionCharacter(
                room
            );

        },
        1500
    );
}


/* =========================================================
   FINISH ENTIRE AUCTION
========================================================= */

async function finishAuction(
    room
) {

    clearAuctionTimer(
        room
    );


    room.auction.active =
        false;

    room.auction.started =
        false;


    const teams =
        Object.values(
            room.players
        ).map(
            player => ({

                playerId:
                    player.id,

                playerName:
                    player.name,

                team:
                    [...player.team],

                remainingBalance:
                    player.balance
            })
        );


    /*
     * AI evaluates all teams.
     */

    const ai =
        await getAITeamEvaluation(
            teams,
            "auction"
        );


    io.to(room.code).emit(
        "auctionFinished",
        {

            teams,

            players:
                getPlayers(room),

            aiEvaluation:
                ai,

            strongestTeam:
                ai.strongestTeam,

            strongestPlayerId:
                ai.strongestPlayerId,

            aiText:
                ai.aiText ||
                ai.explanation,

            message:
                "Auction finished. AI has evaluated all teams."
        }
    );


    broadcastPlayers(
        room
    );
}


/* =========================================================
   ERROR HANDLER
========================================================= */

process.on(
    "uncaughtException",
    error => {

        console.error(
            "UNCAUGHT EXCEPTION:",
            error
        );
    }
);


process.on(
    "unhandledRejection",
    error => {

        console.error(
            "UNHANDLED REJECTION:",
            error
        );
    }
);


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

        console.log(
            `Characters loaded: ${CHARACTERS.length}`
        );

        console.log(
            `Categories loaded: ${CATEGORIES.length}`
        );

        console.log(
            `OpenAI AI evaluation: ${
                process.env.OPENAI_API_KEY
                    ? "ENABLED"
                    : "LOCAL FALLBACK"
            }`
        );
    }
);
