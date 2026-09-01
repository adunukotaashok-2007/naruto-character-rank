/* =========================================================
   NARUTO CHARACTER RANK + AUCTION
   COMPLETE MULTIPLAYER SERVER
   2–25 PLAYERS
   SOCKET.IO
========================================================= */

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
    pingTimeout: 20000,
    pingInterval: 10000
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
        version: "2.0"
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
    "Might Guy",
    "Rock Lee",
    "Duy",
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
   RANK CATEGORIES
========================================================= */

const CATEGORIES = [
    {
        id: "speed",
        name: "⚡ SPEED",
        characters: [
            "Minato",
            "Tobirama",
            "Naruto",
            "Might Guy",
            "Kakashi"
        ]
    },

    {
        id: "strength",
        name: "💪 STRENGTH",
        characters: [
            "Madara",
            "Hashirama",
            "Might Guy",
            "Naruto",
            "Sakura"
        ]
    },

    {
        id: "intelligence",
        name: "🧠 INTELLIGENCE",
        characters: [
            "Shikamaru",
            "Tobirama",
            "Itachi",
            "Minato",
            "Orochimaru"
        ]
    },

    {
        id: "attack",
        name: "🔥 ATTACK POWER",
        characters: [
            "Madara",
            "Naruto",
            "Hashirama",
            "Nagato",
            "Might Guy"
        ]
    },

    {
        id: "defense",
        name: "🛡️ DEFENSE",
        characters: [
            "Hashirama",
            "Madara",
            "Gaara",
            "Naruto",
            "Kakashi"
        ]
    },

    {
        id: "chakra",
        name: "🌀 CHAKRA",
        characters: [
            "Naruto",
            "Hashirama",
            "Nagato",
            "Madara",
            "Kisame"
        ]
    },

    {
        id: "taijutsu",
        name: "⚔️ TAIJUTSU",
        characters: [
            "Might Guy",
            "Rock Lee",
            "Neji",
            "Naruto",
            "Sakura"
        ]
    },

    {
        id: "genjutsu",
        name: "👁️ GENJUTSU",
        characters: [
            "Itachi",
            "Madara",
            "Obito",
            "Kakashi",
            "Orochimaru"
        ]
    },

    {
        id: "durability",
        name: "🩸 DURABILITY",
        characters: [
            "Naruto",
            "Hashirama",
            "Madara",
            "Kisame",
            "Sakura"
        ]
    },

    {
        id: "accuracy",
        name: "🎯 ACCURACY",
        characters: [
            "Itachi",
            "Minato",
            "Kakashi",
            "Neji",
            "Sasuke"
        ]
    },

    {
        id: "agility",
        name: "🏃 AGILITY",
        characters: [
            "Minato",
            "Tobirama",
            "Might Guy",
            "Rock Lee",
            "Kakashi"
        ]
    },

    {
        id: "stamina",
        name: "❤️ STAMINA",
        characters: [
            "Naruto",
            "Hashirama",
            "Kisame",
            "Jiraiya",
            "Might Guy"
        ]
    },

    {
        id: "strategy",
        name: "🧩 STRATEGY",
        characters: [
            "Shikamaru",
            "Tobirama",
            "Itachi",
            "Minato",
            "Kakashi"
        ]
    },

    {
        id: "leadership",
        name: "👑 LEADERSHIP",
        characters: [
            "Hashirama",
            "Naruto",
            "Minato",
            "Tobirama",
            "Gaara"
        ]
    },

    {
        id: "destructive",
        name: "💥 DESTRUCTIVE POWER",
        characters: [
            "Madara",
            "Naruto",
            "Hashirama",
            "Nagato",
            "Might Guy"
        ]
    },

    {
        id: "overall",
        name: "🏆 OVERALL POWER",
        characters: [
            "Madara",
            "Naruto",
            "Hashirama",
            "Nagato",
            "Itachi"
        ]
    }
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

    } while (
        rooms.has(code)
    );

    return code;
}

function getRoom(socket) {

    if (!socket.roomCode) {
        return null;
    }

    return (
        rooms.get(
            socket.roomCode
        ) || null
    );
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
   ROOM PLAYERS
========================================================= */

function getRoomPlayers(room) {

    return Object.values(
        room.players
    ).map(player => {

        return {

            id:
                player.id,

            name:
                player.name,

            balance:
                player.balance,

            spent:
                player.spent,

            team:
                [...player.team],

            rankSelections:
                Object.keys(
                    player.rankSelections
                ).length
        };

    });
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
   RANK STATE
========================================================= */

function sendRankCategory(room) {

    const index =
        room.rank.categoryIndex;

    const category =
        CATEGORIES[index];

    if (!category) {
        return;
    }

    io.to(room.code).emit(
        "rankNextCategory",
        {

            categoryIndex:
                index,

            categoryNumber:
                index + 1,

            totalCategories:
                CATEGORIES.length,

            categoryName:
                category.name,

            characters:
                [...category.characters]

        }
    );

    /*
     * Send the characters separately too.
     * This makes the frontend compatible with
     * different game.js/index.html versions.
     */

    io.to(room.code).emit(
        "rankCharacters",
        {

            categoryIndex:
                index,

            characters:
                [...category.characters]

        }
    );

    Object.values(
        room.players
    ).forEach(player => {

        io.to(
            player.id
        ).emit(
            "rankMySelection",
            {

                categoryIndex:
                    index,

                selected:
                    Object.prototype.hasOwnProperty.call(
                        player.rankSelections,
                        index
                    ),

                character:
                    player.rankSelections[
                        index
                    ] || null

            }
        );

    });
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

    room.rank.transitioning =
        false;

    Object.values(
        room.players
    ).forEach(player => {

        player.rankSelections =
            {};

    });

    io.to(room.code).emit(
        "gameStarted",
        {
            gameMode: "rank"
        }
    );

    sendRankCategory(room);

    io.to(room.code).emit(
        "rankStatus",
        {

            selectedCount: 0,

            totalPlayers:
                Object.keys(
                    room.players
                ).length

        }
    );
}

/* =========================================================
   RANK SELECT
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
            "You are not in a room."
        );

        return;
    }

    if (
        !room.rank.started ||
        room.rank.finished
    ) {

        socket.emit(
            "errorMessage",
            "Rank game is not active."
        );

        return;
    }

    if (
        room.rank.transitioning
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

    const categoryIndex =
        Number(
            data?.categoryIndex
        );

    const character =
        String(
            data?.character || ""
        ).trim();

    if (
        !Number.isInteger(
            categoryIndex
        )
    ) {

        socket.emit(
            "errorMessage",
            "Invalid category."
        );

        return;
    }

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

    const category =
        CATEGORIES[
            categoryIndex
        ];

    if (!category) {
        return;
    }

    if (
        !category.characters.includes(
            character
        )
    ) {

        socket.emit(
            "errorMessage",
            "Invalid character."
        );

        return;
    }

    if (
        Object.prototype.hasOwnProperty.call(
            player.rankSelections,
            categoryIndex
        )
    ) {

        socket.emit(
            "errorMessage",
            "You already selected a character."
        );

        return;
    }

    /*
     * Save selection.
     */

    player.rankSelections[
        categoryIndex
    ] = character;

    /*
     * Tell everybody.
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

    socket.emit(
        "myRankStatus",
        {

            selected: true,

            categoryIndex,

            character

        }
    );

    checkRankCategoryComplete(
        room
    );
}

/* =========================================================
   CHECK RANK COMPLETE
========================================================= */

function checkRankCategoryComplete(
    room
) {

    if (
        !room.rank.started ||
        room.rank.finished
    ) {
        return;
    }

    if (
        room.rank.transitioning
    ) {
        return;
    }

    const players =
        Object.values(
            room.players
        );

    if (
        players.length < 2
    ) {
        return;
    }

    const categoryIndex =
        room.rank.categoryIndex;

    const selectedCount =
        players.filter(
            player =>
                Object.prototype.hasOwnProperty.call(
                    player.rankSelections,
                    categoryIndex
                )
        ).length;

    io.to(room.code).emit(
        "rankWaiting",
        {

            categoryIndex,

            categoryNumber:
                categoryIndex + 1,

            totalCategories:
                CATEGORIES.length,

            selectedCount,

            totalPlayers:
                players.length

        }
    );

    io.to(room.code).emit(
        "rankStatus",
        {

            selectedCount,

            totalPlayers:
                players.length

        }
    );

    /*
     * Not everyone selected yet.
     */

    if (
        selectedCount <
        players.length
    ) {

        return;
    }

    /*
     * Everyone selected.
     */

    room.rank.transitioning =
        true;

    io.to(room.code).emit(
        "rankCategoryComplete",
        {

            categoryIndex,

            categoryName:
                CATEGORIES[
                    categoryIndex
                ].name,

            selectedCount,

            totalPlayers:
                players.length

        }
    );

    /*
     * Wait 1.5 seconds, then next category.
     */

    setTimeout(() => {

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

        /*
         * All 16 categories completed.
         */

        if (
            room.rank.categoryIndex >=
            CATEGORIES.length
        ) {

            finishRanking(room);

            return;
        }

        room.rank.transitioning =
            false;

        sendRankCategory(room);

        io.to(room.code).emit(
            "rankStatus",
            {

                selectedCount: 0,

                totalPlayers:
                    Object.keys(
                        room.players
                    ).length

            }
        );

    }, 1500);
}

/* =========================================================
   FINISH RANK
========================================================= */

function finishRanking(room) {

    room.rank.finished =
        true;

    room.rank.started =
        false;

    room.rank.transitioning =
        false;

    const results =
        Object.values(
            room.players
        ).map(player => {

            const selections = {};

            CATEGORIES.forEach(
                (category, index) => {

                    selections[
                        category.name
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

    io.to(room.code).emit(
        "rankFinished",
        {
            results
        }
    );

    io.to(room.code).emit(
        "rankGameFinished",
        {
            results
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

        return {
            active: false
        };

    }

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

    let highestBidderName =
        null;

    if (
        auction.highestBidder
    ) {

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

        active:
            auction.active,

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
            auction.characters.length

    };
}

/* =========================================================
   AUCTION PERSONAL STATE
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

        io.to(
            player.id
        ).emit(
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
        room.auction?.timer
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
        room.auction?.tickInterval
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

/* =========================================================
   RESET AUCTION TIMER
========================================================= */

function resetAuctionTimer(room) {

    clearAuctionTimer(room);

    if (
        !room.auction ||
        !room.auction.active
    ) {
        return;
    }

    /*
     * 15 seconds.
     */

    room.auction.endTime =
        Date.now() +
        room.settings.bidTime *
        1000;

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
   AUCTION TIMER LOOP
========================================================= */

function startTimerLoop(room) {

    clearAuctionInterval(room);

    room.auction.tickInterval =
        setInterval(() => {

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

        }, 500);
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

        index: 0,

        characters:
            shuffle(
                CHARACTERS
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
            gameMode: "auction"
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

    if (
        players.length === 0
    ) {

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

    const data = {

        character:
            auction.character,

        characterNumber:
            auction.index + 1,

        totalCharacters:
            auction.characters.length

    };

    /*
     * Main event.
     */

    io.to(room.code).emit(
        "auctionNewCharacter",
        data
    );

    /*
     * Compatibility events.
     */

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    io.to(room.code).emit(
        "auctionReady",
        getAuctionState(room)
    );

    sendPersonalAuctionState(room);

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
            `Not enough money. You need ₹${newBid}.`
        );

        return;
    }

    auction.currentBid =
        newBid;

    auction.highestBidder =
        player.id;

    auction.givenUp.delete(
        player.id
    );

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

    sendPersonalAuctionState(room);

    broadcastPlayers(room);

    /*
     * Every accepted bid resets the
     * 15-second countdown.
     */

    resetAuctionTimer(room);
}

/* =========================================================
   HANDLE GIVE UP
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
            eligible[0].id
    ) {

        finishAuctionCharacter(
            room,
            false
        );

        return;
    }

    sendPersonalAuctionState(room);

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );
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

        const price =
            auction.currentBid;

        if (
            winner.balance <
            price
        ) {

            io.to(room.code).emit(
                "auctionUnsold",
                {

                    character:
                        auction.character

                }
            );

        } else {

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
                        [
                            ...winner.team
                        ]

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

    sendPersonalAuctionState(room);

    /*
     * Next character.
     */

    setTimeout(() => {

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

    }, 1500);
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
        ).map(player => {

            return {

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

            };

        });

    io.to(room.code).emit(
        "auctionFinished",
        {
            teams
        }
    );

    broadcastPlayers(room);
}

/* =========================================================
   CONNECTION
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

                let maxPlayers =
                    Number(
                        data?.maxPlayers
                    );

                if (
                    !Number.isFinite(
                        maxPlayers
                    )
                ) {
                    maxPlayers = 6;
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

                /*
                 * Maximum team size.
                 */

                let teamSize =
                    Number(
                        data?.teamSize
                    );

                if (
                    !Number.isFinite(
                        teamSize
                    )
                ) {
                    teamSize = 5;
                }

                teamSize =
                    Math.max(
                        1,
                        Math.floor(
                            teamSize
                        )
                    );

                /*
                 * Starting money.
                 * Default = ₹10,000.
                 */

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
                        10000;

                }

                startingBalance =
                    Math.max(
                        1000,
                        Math.floor(
                            startingBalance
                        )
                    );

                /*
                 * Bid amount.
                 * Default = ₹500.
                 */

                let bidAmount =
                    Number(
                        data?.bidAmount
                    );

                if (
                    !Number.isFinite(
                        bidAmount
                    )
                ) {

                    bidAmount =
                        500;

                }

                bidAmount =
                    Math.max(
                        100,
                        Math.floor(
                            bidAmount
                        )
                    );

                /*
                 * Auction timer.
                 * DEFAULT = 15 SECONDS.
                 */

                let bidTime =
                    Number(
                        data?.bidTime
                    );

                if (
                    !Number.isFinite(
                        bidTime
                    )
                ) {

                    bidTime =
                        15;

                }

                bidTime =
                    Math.max(
                        5,
                        Math.min(
                            60,
                            Math.floor(
                                bidTime
                            )
                        )
                    );

                const mode =
                    data?.gameMode ===
                    "auction"
                        ? "auction"
                        : "rank";

                const code =
                    generateRoomCode();

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
                            0,

                        transitioning:
                            false

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
                            mode,

                        settings:
                            room.settings

                    }
                );

                broadcastPlayers(room);

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
                    ).trim().toUpperCase();

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
                        room.settings.startingBalance,

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
                            room.gameMode,

                        settings:
                            room.settings

                    }
                );

                broadcastPlayers(room);

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
                    room.rank.started ||
                    room.auction?.active
                ) {

                    socket.emit(
                        "errorMessage",
                        "Game is already running."
                    );

                    return;
                }

                console.log(
                    `Starting ${room.gameMode} in ${room.code} with ${count} players`
                );

                if (
                    room.gameMode ===
                    "auction"
                ) {

                    startAuction(room);

                } else {

                    startRankGame(room);

                }
            }
        );

        /* =================================================
           BID
        ================================================= */

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

        /* =================================================
           GIVE UP
        ================================================= */

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

        /* =================================================
           RANK
        ================================================= */

        socket.on(
            "rankSelect",
            data => {

                handleRankSelect(
                    socket,
                    data
                );

            }
        );

        /* =================================================
           DISCONNECT
        ================================================= */

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
                 * Empty room.
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
                 * Host transfer.
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
                 * Auction disconnect.
                 */

                if (
                    room.auction &&
                    room.auction.active
                ) {

                    room.auction.givenUp.delete(
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

                        io.to(room.code).emit(
                            "auctionUpdated",
                            getAuctionState(room)
                        );

                        sendPersonalAuctionState(
                            room
                        );

                        resetAuctionTimer(
                            room
                        );
                    }
                }

                /*
                 * Rank disconnect.
                 */

                if (
                    room.rank.started
                ) {

                    checkRankCategoryComplete(
                        room
                    );

                }

                broadcastPlayers(room);

                console.log(
                    `Disconnected: ${socket.id}`
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
            "=========================================="
        );

        console.log(
            "NARUTO MULTIPLAYER SERVER"
        );

        console.log(
            `Port: ${PORT}`
        );

        console.log(
            "Players: 2–25"
        );

        console.log(
            "Rank: 16 categories × 5 characters"
        );

        console.log(
            "Auction timer: 15 seconds"
        );

        console.log(
            "Starting balance: ₹10,000"
        );

        console.log(
            "Bid increment: ₹500"
        );

        console.log(
            "=========================================="
        );

    }
);
