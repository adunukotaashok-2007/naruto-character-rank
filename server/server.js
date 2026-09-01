/* =========================================================
   NARUTO CHARACTER RANK + AUCTION
   COMPLETE MULTIPLAYER SERVER
   Supports 2–25 Players
   Socket.IO
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
        game: "Naruto Character Rank + Auction"
    });
});


/* =========================================================
   MASTER CHARACTER LIST
   IMPORTANT:
   These names must be used everywhere.
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
   ROOM STORAGE
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
    }
    while (rooms.has(code));

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


function getPlayer(room, playerId) {

    if (!room) {
        return null;
    }

    return room.players[playerId] || null;
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
   PLAYER DATA
========================================================= */

function getRoomPlayers(room) {

    return Object.values(
        room.players
    ).map(player => {

        return {
            id: player.id,
            name: player.name,
            balance: player.balance,
            spent: player.spent,
            team: [...player.team]
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

function sendRankState(room) {

    if (
        !room.rank.started ||
        room.rank.finished
    ) {
        return;
    }

    const index =
        room.rank.categoryIndex;

    io.to(room.code).emit(
        "rankNextCategory",
        {
            categoryIndex: index,
            categoryNumber: index + 1,
            totalCategories:
                CATEGORIES.length,
            categoryName:
                CATEGORIES[index]
        }
    );

    sendRankWaiting(room);
}


function sendRankWaiting(room) {

    if (
        !room.rank.started ||
        room.rank.finished
    ) {
        return;
    }

    const category =
        room.rank.categoryIndex;

    const players =
        Object.values(room.players);

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
   PERSONAL AUCTION MONEY
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
            auction.currentBid === 0
                ? room.settings.bidAmount
                : auction.currentBid +
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


function startTimerLoop(room) {

    clearAuctionInterval(room);

    if (!room.auction) {
        return;
    }

    room.auction.tickInterval =
        setInterval(() => {

            if (
                !rooms.has(room.code)
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

        }, 250);
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
   START NEXT AUCTION CHARACTER
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

    auction.currentBid = 0;

    auction.highestBidder = null;

    auction.givenUp =
        new Set();

    auction.active = true;

    auction.endTime = 0;


    /* -----------------------------------------------------
       CHARACTER
    ----------------------------------------------------- */

    const characterData = {

        character:
            auction.character,

        characterNumber:
            auction.index + 1,

        totalCharacters:
            auction.characters.length
    };

    io.to(room.code).emit(
        "auctionNewCharacter",
        characterData
    );

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


    /* =====================================================
       BID CALCULATION

       First bid = ₹50
       Next      = ₹100
       Next      = ₹150
       etc.
    ===================================================== */

    const newBid =
        auction.currentBid === 0
            ? room.settings.bidAmount
            : auction.currentBid +
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

    resetAuctionTimer(room);
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


    /* =====================================================
       NEXT CHARACTER
    ===================================================== */

    setTimeout(() => {

        if (
            !rooms.has(room.code)
        ) {
            return;
        }

        if (!room.auction) {
            return;
        }

        room.auction.index++;

        startAuctionCharacter(room);

    }, 1500);
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
   START RANK GAME
========================================================= */

function startRankGame(room) {

    room.rank.started = true;

    room.rank.finished = false;

    room.rank.categoryIndex = 0;


    Object.values(
        room.players
    ).forEach(player => {

        player.rankSelections = {};
    });


    io.to(room.code).emit(
        "gameStarted",
        {
            gameMode: "rank"
        }
    );


    sendRankState(room);
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
        ).trim();


    if (
        !Number.isInteger(category) ||
        category < 0 ||
        category >=
            CATEGORIES.length
    ) {

        socket.emit(
            "errorMessage",
            "Invalid category."
        );

        return;
    }


    /* =====================================================
       CHARACTER VALIDATION

       Exact master-list validation.
    ===================================================== */

    const validCharacter =
        CHARACTERS.find(
            name =>
                name.toLowerCase() ===
                character.toLowerCase()
        );


    if (!validCharacter) {

        socket.emit(
            "errorMessage",
            `Invalid character: ${character}`
        );

        return;
    }


    /* =====================================================
       CURRENT CATEGORY ONLY
    ===================================================== */

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


    /* =====================================================
       PREVENT DOUBLE SELECTION
    ===================================================== */

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


    player.rankSelections[
        category
    ] = validCharacter;


    io.to(room.code).emit(
        "rankSelectionMade",
        {
            playerId:
                player.id,

            playerName:
                player.name,

            categoryIndex:
                category,

            character:
                validCharacter
        }
    );


    socket.emit(
        "myRankStatus",
        {
            selected: true,

            categoryIndex:
                category,

            character:
                validCharacter
        }
    );


    checkRankCategoryComplete(room);
}


/* =========================================================
   CHECK RANK CATEGORY
========================================================= */

function checkRankCategoryComplete(room) {

    if (
        !room.rank.started ||
        room.rank.finished
    ) {
        return;
    }

    const category =
        room.rank.categoryIndex;

    const allPlayers =
        Object.values(
            room.players
        );


    if (
        allPlayers.length < 2
    ) {
        return;
    }


    const selectedCount =
        allPlayers.filter(
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
                allPlayers.length
        }
    );


    if (
        selectedCount <
        allPlayers.length
    ) {
        return;
    }


    /* =====================================================
       EVERYONE SELECTED
    ===================================================== */

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

        if (
            !rooms.has(room.code)
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


        /* =================================================
           ALL 16 CATEGORIES COMPLETE
        ================================================= */

        if (
            room.rank.categoryIndex >=
            CATEGORIES.length
        ) {

            finishRanking(room);

            return;
        }


        sendRankState(room);

    }, 1200);
}


/* =========================================================
   FINISH RANKING
========================================================= */

function finishRanking(room) {

    room.rank.finished = true;

    room.rank.started = false;


    const results =
        Object.values(
            room.players
        ).map(player => {

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
                    maxPlayers = 25;
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
                    teamSize = 5;
                }


                teamSize =
                    Math.max(
                        1,
                        Math.floor(
                            teamSize
                        )
                    );


                let startingBalance =
                    Number(
                        data?.startingBalance
                    );


                if (
                    !Number.isFinite(
                        startingBalance
                    )
                ) {
                    startingBalance = 1000;
                }


                startingBalance =
                    Math.max(
                        100,
                        Math.floor(
                            startingBalance
                        )
                    );


                let bidAmount =
                    Number(
                        data?.bidAmount
                    );


                if (
                    !Number.isFinite(
                        bidAmount
                    )
                ) {
                    bidAmount = 50;
                }


                bidAmount =
                    Math.max(
                        1,
                        Math.floor(
                            bidAmount
                        )
                    );


                /* =================================================
                   AUCTION TIME = 15 SECONDS
                ================================================= */

                let bidTime =
                    Number(
                        data?.bidTime
                    );


                if (
                    !Number.isFinite(
                        bidTime
                    )
                ) {
                    bidTime = 15;
                }


                bidTime =
                    Math.max(
                        3,
                        Math.floor(
                            bidTime
                        )
                    );


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
                            mode
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


        /* =================================================
           START GAME
        ================================================= */

        socket.on(
            "startGame",
            () => {

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
                        "Only the host can start."
                    );

                    return;
                }


                const playerCount =
                    Object.keys(
                        room.players
                    ).length;


                if (
                    playerCount < 2
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
                    `Starting ${room.gameMode} in ${room.code} with ${playerCount} players`
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
           BID EVENTS
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
           GIVE UP EVENTS
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


                /* =================================================
                   ROOM EMPTY
                ================================================= */

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


                /* =================================================
                   HOST CHANGE
                ================================================= */

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


                /* =================================================
                   AUCTION DISCONNECT
                ================================================= */

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


                /* =================================================
                   RANK DISCONNECT
                ================================================= */

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
            `Naruto game server running on port ${PORT}`
        );

        console.log(
            `Port: ${PORT}`
        );

        console.log(
            "Supports 2–25 players"
        );

        console.log(
            "Rank + Auction enabled"
        );

        console.log(
            "Auction timer: 15 seconds"
        );

        console.log(
            "Bid increment: ₹50"
        );

        console.log(
            "Starting balance: ₹1000"
        );

        console.log(
            "=========================================="
        );
    }
);
