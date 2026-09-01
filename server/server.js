const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

/*
=========================================================
OPTIONAL OPENAI
=========================================================

The game works even if OPENAI_API_KEY is not configured.

For real ChatGPT analysis on Render, add:

OPENAI_API_KEY = your_api_key

as an Environment Variable.

=========================================================
*/

let OpenAI = null;

try {
    OpenAI = require("openai");
} catch (error) {
    console.log(
        "OpenAI package not installed. AI fallback will be used."
    );
}

const openai =
    OpenAI && process.env.OPENAI_API_KEY
        ? new OpenAI({
              apiKey: process.env.OPENAI_API_KEY
          })
        : null;


/* =========================================================
   EXPRESS
========================================================= */

const app = express();

const server =
    http.createServer(app);

const io =
    new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

const PORT =
    process.env.PORT || 10000;

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
   GAME DATA
========================================================= */

const rooms = new Map();


/*
=========================================================
16 RANKING CATEGORIES

IMPORTANT:
The server does NOT require players to choose
the same character.

Every player only needs to make ONE selection
for the current category.
=========================================================
*/

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
   CHARACTER POWER DATA
   Used for fallback AI analysis.
========================================================= */

const POWER = {

    "Naruto": 100,
    "Sasuke": 98,
    "Madara": 100,
    "Hashirama": 99,
    "Kaguya": 100,

    "Minato": 96,
    "Tobirama": 94,
    "Itachi": 95,
    "Obito": 96,
    "Nagato": 95,

    "Kakashi": 91,
    "Might Guy": 96,
    "Rock Lee": 82,
    "Jiraiya": 91,
    "Orochimaru": 91,
    "Hiruzen": 90,

    "Tsunade": 88,
    "Killer B": 90,
    "Kabuto": 89,
    "Shisui": 91,
    "Sakumo": 91,
    "Hanzo": 88,

    "Third Raikage": 93,
    "Fourth Raikage": 91,
    "Onoki": 88,
    "Mei Terumi": 78,

    "Sasori": 86,
    "Deidara": 85,
    "Mū": 91,
    "Gengetsu Hozuki": 88,
    "Danzo": 83,
    "Kakuzu": 82,
    "Hidan": 75,

    "Konan": 78,
    "Zabuza": 77,
    "Kimimaro": 82,
    "Suigetsu": 72,
    "Jugo": 75,
    "Karin": 65,
    "Yahiko": 70,
    "Zetsu": 65,

    "Hinata": 72,
    "Ino": 65,
    "Choji": 68,
    "Kiba": 67,
    "Shino": 70,
    "Tenten": 62,

    "Iruka": 55,
    "Anko": 65,
    "Might Duy": 86,
    "Shizune": 64,
    "Asuma": 73,
    "Kurenai": 72,
    "Yamato": 76,
    "Sai": 72,
    "Konohamaru": 70,

    "Chiyo": 80,
    "Rasa": 78,
    "Darui": 79,
    "Chojuro": 75,
    "Kurotsuchi": 76,
    "Mifune": 82,
    "Fu": 75,
    "Utakata": 78,
    "Roshi": 80

};


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


function getRoom(socket) {

    if (!socket.roomCode) {
        return null;
    }

    return rooms.get(
        socket.roomCode
    ) || null;
}


function getPlayers(room) {

    return Object.values(
        room.players
    );
}


function broadcastPlayers(room) {

    const players =
        getPlayers(room).map(
            player => ({

                id: player.id,

                name: player.name,

                balance: player.balance,

                team:
                    player.team.map(
                        item => ({
                            character:
                                item.character,
                            price:
                                item.price
                        })
                    )

            })
        );

    io.to(room.code).emit(
        "playersUpdated",
        {
            players
        }
    );
}


function sendError(
    socket,
    message
) {

    socket.emit(
        "errorMessage",
        message
    );

}


/* =========================================================
   RANK PROGRESS
========================================================= */

function getRankProgress(room) {

    const category =
        room.rank.categoryIndex;

    const totalPlayers =
        getPlayers(room).length;

    const selected =
        getPlayers(room)
            .filter(
                player =>
                    player.rankSelections[
                        category
                    ]
            ).length;

    return {

        categoryIndex: category,

        categoryNumber:
            category + 1,

        totalCategories:
            CATEGORIES.length,

        categoryName:
            CATEGORIES[category],

        selected,

        totalPlayers

    };
}


function broadcastRankProgress(room) {

    io.to(room.code).emit(
        "rankProgress",
        getRankProgress(room)
    );

}


/* =========================================================
   RANK GAME
========================================================= */

function startRankGame(room) {

    room.rank.started =
        true;

    room.rank.categoryIndex =
        0;

    room.rank.finished =
        false;

    getPlayers(room).forEach(
        player => {

            player.rankSelections =
                {};

        }
    );

    io.to(room.code).emit(
        "rankGameStarted",
        getRankProgress(room)
    );

    broadcastRankProgress(room);

}


function checkRankCategoryComplete(
    room
) {

    if (!room.rank.started) {
        return;
    }

    const players =
        getPlayers(room);

    if (!players.length) {
        return;
    }

    const category =
        room.rank.categoryIndex;

    const everyoneSelected =
        players.every(
            player =>
                Boolean(
                    player.rankSelections[
                        category
                    ]
                )
        );

    /*
    THIS IS THE IMPORTANT FIX.

    We only check whether EVERY player
    selected something.

    We DO NOT compare their characters.
    */

    if (!everyoneSelected) {

        broadcastRankProgress(
            room
        );

        return;
    }

    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex:
                category,

            categoryNumber:
                category + 1,

            categoryName:
                CATEGORIES[category]
        }
    );

    setTimeout(
        () => {

            if (!rooms.has(room.code)) {
                return;
            }

            if (!room.rank.started) {
                return;
            }

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

            io.to(room.code).emit(
                "rankNextCategory",
                getRankProgress(room)
            );

            broadcastRankProgress(
                room
            );

        },
        1000
    );

}


/* =========================================================
   RANK SELECTION
========================================================= */

function handleRankSelect(
    socket,
    data
) {

    const room =
        getRoom(socket);

    if (!room) {
        return;
    }

    if (!room.rank.started) {
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
            data.categoryIndex
        );

    const character =
        String(
            data.character || ""
        );

    /*
    Only current category is accepted.
    */

    if (
        category !==
        room.rank.categoryIndex
    ) {

        sendError(
            socket,
            "This category is no longer active."
        );

        return;
    }

    if (
        !CHARACTERS.includes(
            character
        )
    ) {

        sendError(
            socket,
            "Invalid character."
        );

        return;
    }

    /*
    A player cannot change their
    selection after selecting.
    */

    if (
        player.rankSelections[
            category
        ]
    ) {

        sendError(
            socket,
            "You already selected a character for this category."
        );

        return;
    }

    /*
    SAME CHARACTER IS ALLOWED
    FOR DIFFERENT PLAYERS.
    */

    player.rankSelections[
        category
    ] = character;

    /*
    PRIVATE MESSAGE ONLY TO THE
    PLAYER WHO SELECTED.

    Other players DO NOT receive
    the selected character.
    */

    socket.emit(
        "rankSelectionAccepted",
        {
            categoryIndex:
                category,

            categoryNumber:
                category + 1,

            categoryName:
                CATEGORIES[category],

            character
        }
    );

    /*
    Everyone only receives progress.
    NOT the character.
    */

    broadcastRankProgress(
        room
    );

    checkRankCategoryComplete(
        room
    );

}


/* =========================================================
   RANK FINAL TEAMS
========================================================= */

function buildRankTeams(room) {

    return getPlayers(
        room
    ).map(
        player => {

            const team =
                Object.keys(
                    player.rankSelections
                )
                .sort(
                    (a, b) =>
                        Number(a) -
                        Number(b)
                )
                .map(
                    categoryIndex => ({

                        category:
                            CATEGORIES[
                                Number(
                                    categoryIndex
                                )
                            ],

                        character:
                            player.rankSelections[
                                categoryIndex
                            ]

                    })
                );

            return {

                playerId:
                    player.id,

                playerName:
                    player.name,

                team

            };

        }
    );

}


/* =========================================================
   FALLBACK TEAM ANALYSIS
========================================================= */

function calculateFallbackScore(
    team
) {

    if (!team.length) {
        return 0;
    }

    let total = 0;

    team.forEach(
        item => {

            total +=
                POWER[
                    item.character
                ] || 50;

        }
    );

    return Math.round(
        total /
        team.length
    );

}


function fallbackTeamAnalysis(
    teams,
    mode
) {

    const scored =
        teams.map(
            team => ({

                ...team,

                score:
                    calculateFallbackScore(
                        team.team
                    )

            })
        )
        .sort(
            (a, b) =>
                b.score -
                a.score
        );

    const winner =
        scored[0];

    const rankings =
        scored.map(
            (team, index) => ({

                rank:
                    index + 1,

                playerName:
                    team.playerName,

                score:
                    team.score

            })
        );

    return {

        mode,

        bestPlayer:
            winner
                ? winner.playerName
                : "No team",

        bestScore:
            winner
                ? winner.score
                : 0,

        reason:
            winner
                ? `${winner.playerName} has the strongest overall combination of characters based on their average character power and team balance.`
                : "No team was available.",

        strategy:
            "Use the strongest attacker as the main damage dealer, combine high-speed characters with defensive characters, and use support characters to cover weaknesses.",

        rankings,

        source:
            "fallback"

    };

}


/* =========================================================
   REAL OPENAI TEAM ANALYSIS
========================================================= */

async function analyzeTeamsWithAI(
    teams,
    mode
) {

    /*
    If no API key exists, use fallback.
    */

    if (!openai) {

        console.log(
            "OPENAI_API_KEY not configured. Using fallback analysis."
        );

        return fallbackTeamAnalysis(
            teams,
            mode
        );

    }

    try {

        const prompt = `

You are an expert Naruto team-building analyst.

This is a multiplayer Naruto game.

Game mode:
${mode}

Analyze the following teams.

${JSON.stringify(
    teams,
    null,
    2
)}

Important instructions:

1. Choose the best team.
2. Rank every team from best to worst.
3. Explain why the winning team is strongest.
4. Explain the winning team's strengths.
5. Explain its weaknesses.
6. Give a battle strategy.
7. Mention the strongest character in each team.
8. Do NOT invent characters that are not in the supplied teams.
9. Do not use numerical game points unless needed for explanation.
10. Return concise JSON.

Use exactly this JSON structure:

{
  "bestPlayer": "player name",
  "reason": "why this team is best",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "strategy": "battle strategy",
  "teamRankings": [
    {
      "rank": 1,
      "playerName": "name",
      "strongestCharacter": "character",
      "reason": "short reason"
    }
  ]
}

`;

        const response =
            await openai.responses.create({

                model:
                    "gpt-5.6-luna",

                input:
                    prompt

            });

        const text =
            response.output_text
                .trim();

        /*
        Try to parse JSON.
        */

        let parsed;

        try {

            parsed =
                JSON.parse(
                    text
                        .replace(
                            /^```json/i,
                            ""
                        )
                        .replace(
                            /^```/i,
                            ""
                        )
                        .replace(
                            /```$/i,
                            ""
                        )
                        .trim()
                );

        } catch {

            return {

                mode,

                bestPlayer:
                    "AI analysis",

                reason:
                    text,

                strengths: [],

                weaknesses: [],

                strategy:
                    text,

                teamRankings: [],

                source:
                    "openai-text"

            };

        }

        return {

            ...parsed,

            mode,

            source:
                "openai"

        };

    } catch (error) {

        console.error(
            "OpenAI error:",
            error.message
        );

        return fallbackTeamAnalysis(
            teams,
            mode
        );

    }

}


/* =========================================================
   FINISH RANK GAME
========================================================= */

async function finishRankGame(
    room
) {

    if (!room.rank.started) {
        return;
    }

    room.rank.started =
        false;

    room.rank.finished =
        true;

    const teams =
        buildRankTeams(
            room
        );

    io.to(room.code).emit(
        "rankPreparingResults",
        {
            message:
                "Analyzing all teams..."
        }
    );

    const analysis =
        await analyzeTeamsWithAI(
            teams,
            "Character Rank"
        );

    if (!rooms.has(room.code)) {
        return;
    }

    io.to(room.code).emit(
        "rankGameFinished",
        {
            teams,
            analysis
        }
    );

}


/* =========================================================
   AUCTION HELPERS
========================================================= */

function clearAuctionTimer(
    room
) {

    if (
        room.auction.timer
    ) {

        clearTimeout(
            room.auction.timer
        );

        room.auction.timer =
            null;

    }

}


function getEligibleAuctionPlayers(
    room
) {

    return getPlayers(
        room
    ).filter(
        player =>
            !room.auction.giveUps.has(
                player.id
            ) &&
            player.team.length <
                room.settings.teamSize
    );

}


function getAuctionPublicState(
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
            auction.highestBidder
                ? room.players[
                      auction.highestBidder
                  ]?.name || null
                : null,

        timeLeft:
            auction.timeLeft,

        bidAmount:
            room.settings.bidAmount,

        eligiblePlayers:
            getEligibleAuctionPlayers(
                room
            ).length,

        totalPlayers:
            getPlayers(room).length,

        giveUps:
            Array.from(
                auction.giveUps
            )

    };

}


function sendAuctionState(
    room
) {

    const state =
        getAuctionPublicState(
            room
        );

    /*
    Public state.
    */

    io.to(room.code).emit(
        "auctionUpdated",
        state
    );

    /*
    Private state for each player.
    This prevents exposing private balances.
    */

    getPlayers(room).forEach(
        player => {

            const remaining =
                Math.max(
                    0,
                    player.balance -
                        state.currentBid
                );

            io.to(player.id).emit(
                "auctionPersonalState",
                {

                    balance:
                        player.balance,

                    remainingIfWin:
                        remaining,

                    hasGivenUp:
                        room.auction.giveUps
                            .has(
                                player.id
                            ),

                    canBid:
                        !room.auction.giveUps
                            .has(
                                player.id
                            ) &&
                        player.team.length <
                            room.settings
                                .teamSize &&
                        state.highestBidder !==
                            player.name

                }
            );

        }
    );

}


function startAuctionTimer(
    room
) {

    clearAuctionTimer(
        room
    );

    const auction =
        room.auction;

    auction.timeLeft =
        room.settings.bidTime;

    /*
    Send immediately.
    */

    sendAuctionState(
        room
    );

    auction.timer =
        setInterval(
            () => {

                if (
                    !auction.active
                ) {

                    clearAuctionTimer(
                        room
                    );

                    return;
                }

                auction.timeLeft--;

                if (
                    auction.timeLeft <=
                    0
                ) {

                    clearAuctionTimer(
                        room
                    );

                    auction.timeLeft =
                        0;

                    sendAuctionState(
                        room
                    );

                    /*
                    Time expired.

                    If there is a highest bidder,
                    sell.

                    Otherwise UNSOLD.
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

                    return;
                }

                sendAuctionState(
                    room
                );

            },
            1000
        );

}


/* =========================================================
   START AUCTION
========================================================= */

function startAuction(
    room
) {

    room.auction.index =
        0;

    room.auction.active =
        true;

    room.auction.currentBid =
        0;

    room.auction.highestBidder =
        null;

    room.auction.character =
        null;

    room.auction.giveUps =
        new Set();

    getPlayers(room).forEach(
        player => {

            player.team = [];

            player.balance =
                room.settings
                    .startingBalance;

        }
    );

    io.to(room.code).emit(
        "auctionStarted",
        {
            settings:
                room.settings
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

    clearAuctionTimer(
        room
    );

    const auction =
        room.auction;

    /*
    Check if every player has
    a full team.
    */

    const allFull =
        getPlayers(room).every(
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
    Move through character list.
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

    auction.giveUps =
        new Set();

    auction.active =
        true;

    auction.timeLeft =
        room.settings.bidTime;

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionPublicState(
            room
        )
    );

    startAuctionTimer(
        room
    );

}


/* =========================================================
   BID
========================================================= */

function handleAuctionBid(
    socket
) {

    const room =
        getRoom(socket);

    if (!room) {
        return;
    }

    const auction =
        room.auction;

    if (!auction.active) {
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
    Player already gave up.
    */

    if (
        auction.giveUps.has(
            socket.id
        )
    ) {

        sendError(
            socket,
            "You gave up this character and cannot bid again."
        );

        return;
    }

    /*
    Team full.
    */

    if (
        player.team.length >=
        room.settings.teamSize
    ) {

        sendError(
            socket,
            "Your team is full."
        );

        return;
    }

    /*
    Highest bidder cannot immediately
    bid against themselves.
    */

    if (
        auction.highestBidder ===
        socket.id
    ) {

        sendError(
            socket,
            "You are already the highest bidder."
        );

        return;
    }

    /*
    Minimum next bid.
    */

    const newBid =
        auction.currentBid +
        room.settings.bidAmount;

    if (
        player.balance <
        newBid
    ) {

        sendError(
            socket,
            `You need ${newBid} but only have ${player.balance}.`
        );

        return;
    }

    auction.currentBid =
        newBid;

    auction.highestBidder =
        socket.id;

    /*
    EVERY BID RESETS TIMER.
    */

    auction.timeLeft =
        room.settings.bidTime;

    clearAuctionTimer(
        room
    );

    startAuctionTimer(
        room
    );

    io.to(room.code).emit(
        "auctionBidMade",
        {

            playerName:
                player.name,

            character:
                auction.character,

            bid:
                newBid,

            timeLeft:
                auction.timeLeft

        }
    );

    sendAuctionState(
        room
    );

}


/* =========================================================
   GIVE UP
========================================================= */

function handleAuctionGiveUp(
    socket
) {

    const room =
        getRoom(socket);

    if (!room) {
        return;
    }

    const auction =
        room.auction;

    if (!auction.active) {
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
    Already gave up.
    */

    if (
        auction.giveUps.has(
            socket.id
        )
    ) {
        return;
    }

    auction.giveUps.add(
        socket.id
    );

    /*
    IMPORTANT:

    Giving up is only for the CURRENT
    character.

    The player can bid on the next
    character.
    */

    io.to(room.code).emit(
        "auctionPlayerGaveUp",
        {

            playerName:
                player.name,

            character:
                auction.character

        }
    );

    const eligible =
        getEligibleAuctionPlayers(
            room
        );

    /*
    If only one player remains:

    - If that player is already highest
      bidder -> immediately sell.

    - If nobody has bid -> UNSOLD.

    This is especially important for
    2-player games.
    */

    if (
        eligible.length === 1
    ) {

        const remaining =
            eligible[0];

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

        if (
            auction.highestBidder ===
            socket.id
        ) {

            /*
            The highest bidder gave up.

            Their bid is cancelled.

            If another player remains,
            there is no automatic price.
            */

            auction.highestBidder =
                null;

            auction.currentBid =
                0;

            sendAuctionState(
                room
            );

            return;
        }

        /*
        Nobody bid.
        */

        if (
            !auction.highestBidder
        ) {

            finishAuctionCharacter(
                room,
                true
            );

            return;
        }

    }

    sendAuctionState(
        room
    );

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

    if (!auction.active) {
        return;
    }

    clearAuctionTimer(
        room
    );

    auction.active =
        false;

    const character =
        auction.character;

    /*
    UNSOLD
    */

    if (
        unsold ||
        !auction.highestBidder
    ) {

        io.to(room.code).emit(
            "auctionUnsoldResult",
            {

                character,

                message:
                    `${character} was unsold.`

            }
        );

        auction.index++;

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
            1200
        );

        return;
    }

    const buyer =
        room.players[
            auction.highestBidder
        ];

    if (!buyer) {

        auction.index++;

        startAuctionCharacter(
            room
        );

        return;
    }

    const price =
        auction.currentBid;

    /*
    Deduct money ONLY when sold.
    */

    buyer.balance =
        Math.max(
            0,
            buyer.balance -
                price
        );

    buyer.team.push(
        {

            character,

            price

        }
    );

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

            teamSize:
                buyer.team.length,

            maxTeamSize:
                room.settings.teamSize

        }
    );

    /*
    Send updated money/team information.
    */

    broadcastPlayers(
        room
    );

    sendAuctionState(
        room
    );

    auction.index++;

    /*
    Wait briefly before next character.
    */

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
        1500
    );

}


/* =========================================================
   FINISH AUCTION
========================================================= */

async function finishAuction(
    room
) {

    clearAuctionTimer(
        room
    );

    room.auction.active =
        false;

    /*
    Build final teams.
    */

    const teams =
        getPlayers(room)
            .map(
                player => ({

                    playerId:
                        player.id,

                    playerName:
                        player.name,

                    balance:
                        player.balance,

                    team:
                        player.team.map(
                            item => ({

                                character:
                                    item.character,

                                price:
                                    item.price

                            })
                        )

                })
            );

    io.to(room.code).emit(
        "auctionPreparingResults",
        {

            message:
                "Auction finished. Analyzing the teams..."

        }
    );

    /*
    AI TEAM ANALYSIS
    */

    const analysis =
        await analyzeTeamsWithAI(
            teams,
            "Auction"
        );

    if (!rooms.has(room.code)) {
        return;
    }

    io.to(room.code).emit(
        "auctionFinished",
        {

            teams,

            analysis

        }
    );

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

                /*
                Host controls these values.
                */

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
                        1,
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

                        categoryIndex:
                            0,

                        started:
                            false,

                        finished:
                            false

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

                        timeLeft:
                            0,

                        active:
                            false,

                        giveUps:
                            new Set()

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

                const roomCode =
                    String(
                        data?.roomCode ||
                        ""
                    )
                    .trim()
                    .toUpperCase();

                const room =
                    rooms.get(
                        roomCode
                    );

                if (!room) {

                    sendError(
                        socket,
                        "Room not found."
                    );

                    return;
                }

                const count =
                    getPlayers(
                        room
                    ).length;

                if (
                    count >=
                    room.settings.maxPlayers
                ) {

                    sendError(
                        socket,
                        "Room is full."
                    );

                    return;
                }

                if (
                    room.rank.started ||
                    room.auction.active
                ) {

                    sendError(
                        socket,
                        "Game has already started."
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

                    sendError(
                        socket,
                        "Only the host can start the game."
                    );

                    return;
                }

                const count =
                    getPlayers(
                        room
                    ).length;

                if (
                    count < 2
                ) {

                    sendError(
                        socket,
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


        /* =================================================
           AUCTION BID
        ================================================= */

        socket.on(
            "auctionBid",
            () => {

                handleAuctionBid(
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

                handleAuctionGiveUp(
                    socket
                );

            }
        );


        /*
        Keep old event name working too.
        */

        socket.on(
            "auctionUnsold",
            () => {

                handleAuctionGiveUp(
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

                /*
                Remove player.
                */

                delete room.players[
                    socket.id
                ];

                /*
                If auction is running and the
                highest bidder leaves, remove
                their bid.
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

                }

                /*
                Remove from give-up list.
                */

                room.auction
                    .giveUps
                    ?.delete(
                        socket.id
                    );

                /*
                Host migration.
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

                if (
                    room.rank.started
                ) {

                    broadcastRankProgress(
                        room
                    );

                    checkRankCategoryComplete(
                        room
                    );

                }

                if (
                    room.auction.active
                ) {

                    sendAuctionState(
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
            `Naruto game server running on port ${PORT}`
        );

        console.log(
            `AI enabled: ${Boolean(openai)}`
        );

    }
);
