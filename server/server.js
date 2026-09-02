/* =========================================================
   NARUTO CHARACTER RANK + AUCTION
   MULTIPLAYER SERVER
   2–25 PLAYERS
   OPENAI FINAL RESULTS
   ========================================================= */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const OpenAI = require("openai");


/* =========================================================
   APP
   ========================================================= */

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


/* =========================================================
   OPENAI
   ========================================================= */

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/* =========================================================
   PORT
   ========================================================= */

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


app.get("/health", (req, res) => {

    res.json({
        status: "ok",
        game: "Naruto Character Rank + Auction",
        players: "2-25",
        openai: Boolean(
            process.env.OPENAI_API_KEY
        )
    });

});


/* =========================================================
   CHARACTER DATABASE
   ========================================================= */

const CHARACTERS = [

    {
        name: "Naruto",
        image: "assets/characters/images%20%282%29.jpeg"
    },

    {
        name: "Sasuke",
        image: "assets/characters/images%20%283%29.jpeg"
    },

    {
        name: "Itachi",
        image: "assets/characters/images%20%284%29.jpeg"
    },

    {
        name: "Madara",
        image: "assets/characters/images%20%285%29.jpeg"
    },

    {
        name: "Kakashi",
        image: "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg"
    },

    {
        name: "Minato",
        image: "assets/characters/images%20%286%29.jpeg"
    },

    {
        name: "Tobirama",
        image: "assets/characters/images%20%287%29.jpeg"
    },

    {
        name: "Hashirama",
        image: "assets/characters/images%20%288%29.jpeg"
    },

    {
        name: "Jiraiya",
        image: "assets/characters/images%20%289%29.jpeg"
    },

    {
        name: "Hiruzen",
        image: "assets/characters/images%20%2810%29.jpeg"
    },

    {
        name: "Orochimaru",
        image: "assets/characters/images%20%2811%29.jpeg"
    },

    {
        name: "Might Guy",
        image: "assets/characters/images%20%2812%29.jpeg"
    },

    {
        name: "Rock Lee",
        image: "assets/characters/images%20%2813%29.jpeg"
    },

    {
        name: "Shikamaru",
        image: "assets/characters/images%20%2814%29.jpeg"
    },

    {
        name: "Neji",
        image: "assets/characters/images%20%2815%29.jpeg"
    },

    {
        name: "Gaara",
        image: "assets/characters/images%20%2816%29.jpeg"
    },

    {
        name: "Kisame",
        image: "assets/characters/images%20%2817%29.jpeg"
    },

    {
        name: "Sakura",
        image: "assets/characters/images%20%2818%29.jpeg"
    },

    {
        name: "Nagato",
        image: "assets/characters/images%20%2819%29.jpeg"
    },

    {
        name: "Obito",
        image: "assets/characters/images%20%2820%29.jpeg"
    },

    {
        name: "Killer B",
        image: "assets/characters/download%20%281%29.jpeg"
    },

    {
        name: "Sasori",
        image: "assets/characters/download%20%2810%29.jpeg"
    },

    {
        name: "Deidara",
        image: "assets/characters/download%20%2811%29.jpeg"
    },

    {
        name: "Mu",
        image: "assets/characters/download%20%2812%29.jpeg"
    },

    {
        name: "Gengetsu Hōzuki",
        image: "assets/characters/download%20%2813%29.jpeg"
    },

    {
        name: "Danzo",
        image: "assets/characters/download%20%2814%29.jpeg"
    },

    {
        name: "Kakuzu",
        image: "assets/characters/download%20%2815%29.jpeg"
    },

    {
        name: "Hidan",
        image: "assets/characters/download%20%2816%29.jpeg"
    },

    {
        name: "Konan",
        image: "assets/characters/download%20%2817%29.jpeg"
    },

    {
        name: "Zabuza",
        image: "assets/characters/download%20%2818%29.jpeg"
    },

    {
        name: "Kimimaro",
        image: "assets/characters/download%20%2819%29.jpeg"
    },

    {
        name: "Kabuto",
        image: "assets/characters/download%20%282%29.jpeg"
    },

    {
        name: "Suigetsu",
        image: "assets/characters/download%20%2820%29.jpeg"
    },

    {
        name: "Jugo",
        image: "assets/characters/download%20%2821%29.jpeg"
    },

    {
        name: "Karin",
        image: "assets/characters/download%20%2822%29.jpeg"
    },

    {
        name: "Yahiko",
        image: "assets/characters/download%20%2823%29.jpeg"
    },

    {
        name: "Zetsu",
        image: "assets/characters/download%20%2824%29.jpeg"
    },

    {
        name: "Hinata",
        image: "assets/characters/download%20%2825%29.jpeg"
    },

    {
        name: "Ino",
        image: "assets/characters/download%20%2826%29.jpeg"
    },

    {
        name: "Choji",
        image: "assets/characters/download%20%2827%29.jpeg"
    },

    {
        name: "Kiba",
        image: "assets/characters/download%20%2828%29.jpeg"
    },

    {
        name: "Shino",
        image: "assets/characters/download%20%2829%29.jpeg"
    },

    {
        name: "Shisui",
        image: "assets/characters/download%20%283%29.jpeg"
    },

    {
        name: "Tenten",
        image: "assets/characters/download%20%2830%29.jpeg"
    },

    {
        name: "Iruka",
        image: "assets/characters/download%20%2831%29.jpeg"
    },

    {
        name: "Anko",
        image: "assets/characters/download%20%2832%29.jpeg"
    },

    {
        name: "Duy",
        image: "assets/characters/download%20%2833%29.jpeg"
    },

    {
        name: "Shizune",
        image: "assets/characters/download%20%2834%29.jpeg"
    },

    {
        name: "Asuma",
        image: "assets/characters/download%20%2835%29.jpeg"
    },

    {
        name: "Kurenai",
        image: "assets/characters/download%20%2836%29.jpeg"
    },

    {
        name: "Yamato",
        image: "assets/characters/download%20%2837%29.jpeg"
    },

    {
        name: "Sai",
        image: "assets/characters/download%20%2838%29.jpeg"
    },

    {
        name: "Konohamaru",
        image: "assets/characters/download%20%2839%29.jpeg"
    },

    {
        name: "Sakumo",
        image: "assets/characters/download%20%284%29.jpeg"
    },

    {
        name: "Kurotsuchi",
        image: "assets/characters/download%20%2840%29.jpeg"
    },

    {
        name: "Mifune",
        image: "assets/characters/download%20%2841%29.jpeg"
    },

    {
        name: "Fu",
        image: "assets/characters/download%20%2842%29.jpeg"
    },

    {
        name: "Utakata",
        image: "assets/characters/download%20%2843%29.jpeg"
    },

    {
        name: "Hanzo",
        image: "assets/characters/download%20%285%29.jpeg"
    },

    {
        name: "Four Tails Jinchuriki",
        image: "assets/characters/download%20%2844%29.jpeg"
    },

    {
        name: "Third Raikage",
        image: "assets/characters/download%20%286%29.jpeg"
    },

    {
        name: "Fourth Raikage",
        image: "assets/characters/download%20%287%29.jpeg"
    },

    {
        name: "Onoki",
        image: "assets/characters/download%20%288%29.jpeg"
    },

    {
        name: "Mei",
        image: "assets/characters/download%20%289%29.jpeg"
    },

    {
        name: "Tsunade",
        image: "assets/characters/download.jpeg"
    },

    {
        name: "Chiyo",
        image: "assets/characters/images%20%2821%29.jpeg"
    },

    {
        name: "Rasa",
        image: "assets/characters/images%20%2822%29.jpeg"
    },

    {
        name: "Masashi Kishimoto",
        image: "assets/characters/images%20%2823%29.jpeg"
    },

    {
        name: "Darui",
        image: "assets/characters/images%20%2824%29.jpeg"
    },

    {
        name: "Chōjūrō",
        image: "assets/characters/images%20%2825%29.jpeg"
    }

];


/* =========================================================
   CHARACTER LOOKUP
   ========================================================= */

const CHARACTER_MAP = new Map(
    CHARACTERS.map(character => [
        character.name,
        character
    ])
);

const CHARACTER_NAMES = CHARACTERS.map(
    character => character.name
);


/* =========================================================
   RANK CATEGORIES
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


function getPlayer(room, id) {

    if (!room) {
        return null;
    }

    return room.players[id] || null;
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
                Math.random() *
                (i + 1)
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
   PUBLIC PLAYERS
   ========================================================= */

function publicPlayers(room) {

    return Object.values(
        room.players
    ).map(player => ({

        id: player.id,

        name: player.name,

        balance: player.balance,

        spent: player.spent,

        team: [...player.team]

    }));

}


function broadcastPlayers(room) {

    io.to(room.code).emit(
        "playersUpdated",
        {
            players:
                publicPlayers(room)
        }
    );

}


/* =========================================================
   RANK CATEGORY
   ========================================================= */

function sendRankCategory(room) {

    const index =
        room.rank.categoryIndex;

    const categoryName =
        CATEGORIES[index];


    io.to(room.code).emit(
        "rankNextCategory",
        {

            categoryIndex:
                index,

            categoryNumber:
                index + 1,

            totalCategories:
                CATEGORIES.length,

            categoryName,

            characters:
                CHARACTERS

        }
    );

}


/* =========================================================
   AUCTION STATE
   ========================================================= */

function getAuctionState(room) {

    if (!room.auction) {

        return {
            active: false
        };

    }


    const auction =
        room.auction;


    let remainingTime = 0;


    if (
        auction.endTime > 0
    ) {

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


    const character =
        CHARACTER_MAP.get(
            auction.character
        );


    let highestBidderName =
        "Nobody";


    if (
        auction.highestBidder
    ) {

        const bidder =
            room.players[
                auction.highestBidder
            ];

        if (bidder) {

            highestBidderName =
                bidder.name;

        }

    }


    return {

        active:
            auction.active,

        character:
            auction.character,

        image:
            character?.image || "",

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
            auction.characters.length

    };

}


/* =========================================================
   PERSONAL AUCTION STATE
   ========================================================= */

function sendPersonalAuctionState(room) {

    if (!room.auction) {
        return;
    }


    const auction =
        room.auction;


    Object.values(
        room.players
    ).forEach(player => {

        const nextBid =
            auction.currentBid +
            room.settings.bidAmount;


        const gaveUp =
            auction.givenUp.has(
                player.id
            );


        const teamFull =
            player.team.length >=
            room.settings.teamSize;


        const isHighest =
            auction.highestBidder ===
            player.id;


        const enoughMoney =
            player.balance >=
            nextBid;


        const canBid =
            auction.active &&
            !gaveUp &&
            !teamFull &&
            !isHighest &&
            enoughMoney;


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

                gaveUp

            }
        );

    });

}


/* =========================================================
   AUCTION TIMERS
   ========================================================= */

function clearAuctionTimer(room) {

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


function clearAuctionInterval(room) {

    if (
        room.auction &&
        room.auction.tickInterval
    ) {

        clearInterval(
            room.auction.tickInterval
        );

        room.auction.tickInterval =
            null;

    }

}


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
        room.settings.bidTime *
        1000;


    sendTimer(room);


    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );


    sendPersonalAuctionState(
        room
    );


    room.auction.timer =
        setTimeout(
            () => {

                if (
                    !room.auction ||
                    !room.auction.active
                ) {

                    return;
                }


                finishAuctionCharacter(
                    room,
                    !room.auction.highestBidder
                );

            },
            room.settings.bidTime * 1000
        );

}


function startTimerLoop(room) {

    clearAuctionInterval(room);


    room.auction.tickInterval =
        setInterval(
            () => {

                if (
                    !rooms.has(
                        room.code
                    )
                ) {

                    clearAuctionInterval(
                        room
                    );

                    return;
                }


                if (
                    !room.auction ||
                    !room.auction.active
                ) {

                    return;
                }


                sendTimer(room);

            },
            500
        );

}


/* =========================================================
   START AUCTION
   ========================================================= */

function startAuction(room) {

    clearAuctionTimer(room);

    clearAuctionInterval(room);


    Object.values(
        room.players
    ).forEach(player => {

        player.balance =
            room.settings.startingBalance;

        player.spent =
            0;

        player.team =
            [];

    });


    room.auction = {

        index:
            0,

        characters:
            shuffle(
                CHARACTER_NAMES
            ),

        character:
            null,

        currentBid:
            0,

        highestBidder:
            null,

        active:
            false,

        endTime:
            0,

        timer:
            null,

        tickInterval:
            null,

        givenUp:
            new Set()

    };


    io.to(room.code).emit(
        "gameStarted",
        {
            gameMode:
                "auction"
        }
    );


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
   START AUCTION CHARACTER
   ========================================================= */

function startAuctionCharacter(room) {

    clearAuctionTimer(room);


    const auction =
        room.auction;


    if (!auction) {
        return;
    }


    if (
        auction.index >=
        auction.characters.length
    ) {

        finishAuction(room);

        return;
    }


    const players =
        Object.values(
            room.players
        );


    if (!players.length) {

        finishAuction(room);

        return;
    }


    const allFull =
        players.every(
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


    auction.currentBid =
        0;

    auction.highestBidder =
        null;

    auction.givenUp =
        new Set();

    auction.active =
        true;

    auction.endTime =
        0;


    const character =
        CHARACTER_MAP.get(
            auction.character
        );


    io.to(room.code).emit(
        "auctionNewCharacter",
        {

            character:
                auction.character,

            image:
                character?.image || "",

            characterNumber:
                auction.index + 1,

            totalCharacters:
                auction.characters.length

        }
    );


    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );


    sendPersonalAuctionState(
        room
    );


    resetAuctionTimer(room);

}


/* =========================================================
   HANDLE BID
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
            `Not enough money. Need ₹${newBid}.`
        );

        return;
    }


    auction.currentBid =
        newBid;

    auction.highestBidder =
        player.id;


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


    sendPersonalAuctionState(
        room
    );


    broadcastPlayers(room);


    resetAuctionTimer(room);

}


/* =========================================================
   GIVE UP
   ========================================================= */

function handleGiveUp(socket) {

    const room =
        getRoom(socket);


    if (
        !room ||
        !room.auction
    ) {

        return;
    }


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


    if (!player) {
        return;
    }


    /*
     * Already gave up.
     */

    if (
        auction.givenUp.has(
            player.id
        )
    ) {

        return;

    }


    auction.givenUp.add(
        player.id
    );


    /*
     * IMPORTANT FIX:
     *
     * If the highest bidder gives up,
     * their current bid cannot remain
     * as a valid winning bid.
     */

    if (
        auction.highestBidder ===
        player.id
    ) {

        auction.highestBidder =
            null;

        auction.currentBid =
            0;

    }


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


    const eligible =
        Object.values(
            room.players
        ).filter(other => {

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
     * Nobody can continue.
     */

    if (!eligible.length) {

        finishAuctionCharacter(
            room,
            true
        );

        return;
    }


    /*
     * Only one player remains
     * and that player is highest bidder.
     */

    if (
        eligible.length === 1 &&
        auction.highestBidder ===
            eligible[0].id
    ) {

        finishAuctionCharacter(
            room,
            false
        );

        return;
    }


    /*
     * If the highest bidder was the
     * player who gave up, there is
     * no current bidder now.
     */

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );


    sendPersonalAuctionState(
        room
    );


    resetAuctionTimer(room);

}


/* =========================================================
   FINISH AUCTION CHARACTER
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


    auction.active =
        false;


    clearAuctionTimer(room);


    let winner =
        null;


    if (
        !unsold &&
        auction.highestBidder
    ) {

        winner =
            room.players[
                auction.highestBidder
            ];

    }


    if (winner) {

        /*
         * Winner must still be valid.
         */

        const winnerGaveUp =
            auction.givenUp.has(
                winner.id
            );


        const teamFull =
            winner.team.length >=
            room.settings.teamSize;


        if (
            winnerGaveUp ||
            teamFull
        ) {

            winner =
                null;

        }

    }


    if (winner) {

        const price =
            auction.currentBid;


        if (
            winner.balance >=
            price
        ) {

            winner.balance -=
                price;

            winner.spent +=
                price;

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

            io.to(room.code).emit(
                "auctionUnsold",
                {

                    character:
                        auction.character

                }
            );

        }

    } else {

        io.to(room.code).emit(
            "auctionUnsold",
            {

                character:
                    auction.character

            }
        );

    }


    broadcastPlayers(room);

    sendPersonalAuctionState(
        room
    );


    setTimeout(
        () => {

            if (
                !rooms.has(
                    room.code
                )
            ) {

                return;
            }


            if (!room.auction) {
                return;
            }


            room.auction.index++;


            startAuctionCharacter(
                room
            );

        },
        1200
    );

}


/* =========================================================
   OPENAI FINAL RESULTS
   ========================================================= */

async function generateFinalResults(
    room,
    gameMode
) {

    try {

        const players =
            Object.values(
                room.players
            );


        if (!players.length) {
            return null;
        }


        const playerData =
            players.map(player => {

                let rankSelections =
                    {};


                if (
                    player.rankSelections
                ) {

                    CATEGORIES.forEach(
                        (
                            category,
                            index
                        ) => {

                            rankSelections[
                                category
                            ] =
                                player.rankSelections[
                                    index
                                ] || null;

                        }
                    );

                }


                return {

                    playerName:
                        player.name,

                    team:
                        [...player.team],

                    balance:
                        player.balance,

                    spent:
                        player.spent,

                    rankSelections

                };

            });


        const prompt = `
You are the official AI judge for a Naruto multiplayer game.

GAME MODE:
${gameMode}

PLAYER DATA:
${JSON.stringify(
    playerData,
    null,
    2
)}

Analyze the completed game fairly.

For each player consider:

- Naruto character strength
- Team composition
- Team balance
- Offensive power
- Defensive power
- Speed
- Chakra
- Ninjutsu
- Taijutsu
- Genjutsu
- Durability
- Stamina
- Versatility
- Experience
- Leadership
- Teamwork
- Overall power
- Auction spending efficiency when applicable
- Remaining balance when applicable
- Character choices in Rank mode when applicable

IMPORTANT RULES:

1. Only use characters actually present in the supplied data.
2. Do not invent characters.
3. Do not invent players.
4. Rank every player.
5. Score every player from 0 to 100.
6. Choose exactly one winner.
7. Explain the winner clearly.
8. Keep the analysis fair.
9. For Rank mode, evaluate the player's selected characters.
10. For Auction mode, evaluate the player's final team and spending.
11. Return ONLY valid JSON.

Use exactly this structure:

{
    "winner": {
        "playerName": "",
        "score": 0,
        "reason": ""
    },

    "rankings": [
        {
            "position": 1,
            "playerName": "",
            "score": 0,
            "strengths": [],
            "weaknesses": [],
            "reason": ""
        }
    ],

    "bestCharacter": {
        "character": "",
        "owner": "",
        "reason": ""
    },

    "bestTeam": {
        "playerName": "",
        "reason": ""
    },

    "analysis": "",

    "battlePrediction": ""
}

Make the final analysis concise but useful.
`;


        /*
         * OpenAI Responses API
         */

        const response =
            await openai.responses.create({

                model:
                    "gpt-5.6-luna",

                input: [

                    {
                        role:
                            "system",

                        content:
                            "You are a fair Naruto multiplayer tournament judge. Return JSON only."
                    },

                    {
                        role:
                            "user",

                        content:
                            prompt
                    }

                ]

            });


        const text =
            response.output_text;


        if (!text) {

            throw new Error(
                "OpenAI returned an empty response."
            );

        }


        const cleanText =
            text
                .replace(
                    /^```json\s*/i,
                    ""
                )
                .replace(
                    /^```\s*/i,
                    ""
                )
                .replace(
                    /\s*```$/i,
                    ""
                )
                .trim();


        let result;


        try {

            result =
                JSON.parse(
                    cleanText
                );

        } catch (error) {

            console.error(
                "OpenAI JSON parse error:",
                cleanText
            );


            return {

                error:
                    "AI returned an invalid final result.",

                raw:
                    cleanText

            };

        }


        return result;


    } catch (error) {

        console.error(
            "OpenAI final analysis error:",
            error
        );


        return {

            error:
                "Unable to generate AI final results."

        };

    }

}


/* =========================================================
   SEND FINAL AI RESULTS
   ========================================================= */

async function sendFinalAIResults(
    room,
    gameMode
) {

    io.to(room.code).emit(
        "finalResultsLoading",
        {

            message:
                "🤖 AI is analyzing the final results..."

        }
    );


    const results =
        await generateFinalResults(
            room,
            gameMode
        );


    io.to(room.code).emit(
        "finalAIResults",
        {

            gameMode,

            results

        }
    );

}


/* =========================================================
   FINISH AUCTION
   ========================================================= */

function finishAuction(room) {

    if (!room.auction) {
        return;
    }


    room.auction.active =
        false;


    clearAuctionTimer(room);

    clearAuctionInterval(room);


    const teams =
        Object.values(
            room.players
        ).map(player => ({

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


    sendFinalAIResults(
        room,
        "auction"
    );

}


/* =========================================================
   START RANK GAME
   ========================================================= */

function startRankGame(room) {

    room.rank.started =
        true;

    room.rank.finished =
        false;

    room.rank.categoryIndex =
        0;


    Object.values(
        room.players
    ).forEach(player => {

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


    sendRankCategory(room);

}


/* =========================================================
   HANDLE RANK SELECT
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


    if (
        !room.rank.started ||
        room.rank.finished
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
            data?.categoryIndex
        );


    const character =
        String(
            data?.character || ""
        );


    if (
        !Number.isInteger(
            category
        ) ||
        category !==
            room.rank.categoryIndex
    ) {

        socket.emit(
            "errorMessage",
            "Please wait for the current category."
        );

        return;
    }


    if (
        !CHARACTER_MAP.has(
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
        Object.prototype.hasOwnProperty.call(
            player.rankSelections,
            category
        )
    ) {

        socket.emit(
            "errorMessage",
            "You already selected this category."
        );

        return;
    }


    /*
     * Save privately.
     */

    player.rankSelections[
        category
    ] =
        character;


    /*
     * Only the selecting player
     * receives the selected character.
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


/* =========================================================
   CHECK RANK CATEGORY
   ========================================================= */

function checkRankCategoryComplete(
    room
) {

    const category =
        room.rank.categoryIndex;


    const players =
        Object.values(
            room.players
        );


    if (!players.length) {
        return;
    }


    const selectedCount =
        players.filter(
            player =>
                Object.prototype.hasOwnProperty.call(
                    player.rankSelections,
                    category
                )
        ).length;


    io.to(room.code).emit(
        "rankWaiting",
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


    if (
        selectedCount <
        players.length
    ) {

        return;
    }


    io.to(room.code).emit(
        "rankCategoryComplete",
        {

            categoryIndex:
                category,

            categoryName:
                CATEGORIES[category]

        }
    );


    setTimeout(
        () => {

            if (
                !rooms.has(
                    room.code
                )
            ) {

                return;
            }


            if (
                !room.rank.started ||
                room.rank.finished
            ) {

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


            sendRankCategory(room);

        },
        1200
    );

}


/* =========================================================
   FINISH RANKING
   ========================================================= */

function finishRanking(room) {

    room.rank.finished =
        true;

    room.rank.started =
        false;


    const results =
        Object.values(
            room.players
        ).map(player => {

            const selections =
                {};


            CATEGORIES.forEach(
                (
                    category,
                    index
                ) => {

                    selections[
                        category
                    ] =
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


    /*
     * Reveal all Rank selections
     * only after all 16 categories finish.
     */

    io.to(room.code).emit(
        "rankFinished",
        {
            results
        }
    );


    sendFinalAIResults(
        room,
        "rank"
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


                let maxPlayers =
                    Number(
                        data?.maxPlayers
                    );


                if (
                    !Number.isFinite(
                        maxPlayers
                    )
                ) {

                    maxPlayers =
                        6;

                }


                maxPlayers =
                    Math.max(
                        2,
                        Math.min(
                            25,
                            Math.floor(
                                maxPlayers
                            )
                        )
                    );


                let teamSize =
                    Number(
                        data?.teamSize
                    );


                if (
                    !Number.isFinite(
                        teamSize
                    )
                ) {

                    teamSize =
                        5;

                }


                /*
                 * Team size is exactly 5.
                 */

                teamSize = 5;


                let startingBalance =
                    Number(
                        data?.startingBalance
                    );


                if (
                    !Number.isFinite(
                        startingBalance
                    )
                ) {

                    startingBalance =
                        1000;

                }


                startingBalance =
                    Math.max(
                        100,
                        Math.floor(
                            startingBalance
                        )
                    );


                /*
                 * Fixed auction settings.
                 */

                const bidAmount =
                    50;

                const bidTime =
                    15;


                const mode =
                    data?.gameMode ===
                    "auction"
                        ? "auction"
                        : "rank";


                const room = {

                    code,

                    hostId:
                        socket.id,

                    gameMode:
                        mode,

                    maxPlayers,

                    settings: {

                        teamSize,

                        startingBalance,

                        bidAmount,

                        bidTime

                    },

                    players: {},

                    rank: {

                        started:
                            false,

                        finished:
                            false,

                        categoryIndex:
                            0

                    },

                    auction:
                        null

                };


                room.players[
                    socket.id
                ] = {

                    id:
                        socket.id,

                    name,

                    balance:
                        startingBalance,

                    spent:
                        0,

                    team:
                        [],

                    rankSelections:
                        {}

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
                            mode

                    }
                );


                broadcastPlayers(
                    room
                );


                console.log(
                    `Room ${code} created by ${name}`
                );

            }
        );


        /* =================================================
           JOIN ROOM
           ================================================= */

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
                    )
                        .trim()
                        .toUpperCase();


                if (
                    !name ||
                    !code
                ) {

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


                const count =
                    Object.keys(
                        room.players
                    ).length;


                if (
                    count >=
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
                    room.auction
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
                        room.settings
                            .startingBalance,

                    spent:
                        0,

                    team:
                        [],

                    rankSelections:
                        {}

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


                broadcastPlayers(
                    room
                );


                console.log(
                    `${name} joined ${code}`
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
                    room.rank.started ||
                    room.auction?.active
                ) {

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
           AUCTION EVENTS
           ================================================= */

        socket.on(
            "bid",
            () =>
                handleBid(socket)
        );


        socket.on(
            "placeBid",
            () =>
                handleBid(socket)
        );


        socket.on(
            "auctionBid",
            () =>
                handleBid(socket)
        );


        socket.on(
            "giveUp",
            () =>
                handleGiveUp(socket)
        );


        socket.on(
            "auctionGiveUp",
            () =>
                handleGiveUp(socket)
        );


        /* =================================================
           RANK EVENTS
           ================================================= */

        socket.on(
            "rankSelect",
            data =>
                handleRankSelect(
                    socket,
                    data
                )
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
                 * No players left.
                 */

                if (
                    Object.keys(
                        room.players
                    ).length === 0
                ) {

                    clearAuctionTimer(
                        room
                    );

                    clearAuctionInterval(
                        room
                    );


                    rooms.delete(
                        room.code
                    );


                    return;
                }


                /*
                 * Transfer host.
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
                 * AUCTION DISCONNECT
                 */

                if (
                    room.auction &&
                    room.auction.active
                ) {

                    room.auction.givenUp.delete(
                        socket.id
                    );


                    /*
                     * If highest bidder disconnects,
                     * invalidate their bid.
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

                        resetAuctionTimer(
                            room
                        );

                    }


                    sendPersonalAuctionState(
                        room
                    );

                }


                /*
                 * RANK DISCONNECT
                 */

                if (
                    room.rank.started
                ) {

                    checkRankCategoryComplete(
                        room
                    );

                }


                broadcastPlayers(
                    room
                );

            }
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
            "======================================"
        );

        console.log(
            `Naruto server running on port ${PORT}`
        );

        console.log(
            `Characters: ${CHARACTERS.length}`
        );

        console.log(
            "Players: 2–25"
        );

        console.log(
            "Team size: 5"
        );

        console.log(
            "Auction timer: 15 seconds"
        );

        console.log(
            "Bid increment: ₹50"
        );

        console.log(
            "Rank + Auction enabled"
        );

        console.log(
            "OpenAI final results enabled:"
        );

        console.log(
            Boolean(
                process.env.OPENAI_API_KEY
            )
        );

        console.log(
            "======================================"
        );

    }
);
