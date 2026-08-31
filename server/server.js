const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

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
   WEBSITE
   ========================================================= */

app.use(express.static(path.join(__dirname, "..")));

app.get("/health", (req, res) => {
    res.send("Naruto Character Games Server OK");
});

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "index.html")
    );
});


/* =========================================================
   ROOMS
   ========================================================= */

const rooms = {};


/* =========================================================
   CHARACTER RANK CATEGORIES
   EXACTLY 5 CHARACTERS EACH
   ========================================================= */

const RANK_CATEGORIES = [
    {
        id: "speed",
        title: "⚡ SPEED",
        characters: [
            "Minato",
            "Tobirama",
            "Naruto",
            "Lee",
            "Kakashi"
        ]
    },

    {
        id: "strength",
        title: "💪 STRENGTH",
        characters: [
            "Madara",
            "Hashirama",
            "Naruto",
            "Guy",
            "Sakura"
        ]
    },

    {
        id: "intelligence",
        title: "🧠 INTELLIGENCE",
        characters: [
            "Shikamaru",
            "Itachi",
            "Tobirama",
            "Kakashi",
            "Minato"
        ]
    },

    {
        id: "chakra",
        title: "🔵 CHAKRA",
        characters: [
            "Naruto",
            "Hashirama",
            "Madara",
            "Nagato",
            "Minato"
        ]
    },

    {
        id: "battle",
        title: "⚔️ BATTLE SKILL",
        characters: [
            "Madara",
            "Naruto",
            "Hashirama",
            "Itachi",
            "Kakashi"
        ]
    }
];


/* =========================================================
   AUCTION CHARACTERS
   ========================================================= */

const AUCTION_CHARACTERS = [
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
    "Obito"
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

    } while (rooms[code]);

    return code;
}


/* =========================================================
   PLAYER DATA
   ========================================================= */

function publicPlayer(player) {

    return {
        id: player.id,
        name: player.name,
        balance: player.balance,
        team: player.team,
        teamCount: player.team.length
    };
}


function getPlayers(room) {

    return room.players.map(
        publicPlayer
    );
}


/* =========================================================
   SEND PLAYERS
   ========================================================= */

function sendPlayers(roomCode) {

    const room =
        rooms[roomCode];

    if (!room) return;

    io.to(roomCode).emit(
        "playersUpdated",
        {
            players:
                getPlayers(room)
        }
    );
}


/* =========================================================
   CREATE ROOM
   ========================================================= */

io.on("connection", socket => {

    console.log(
        "Connected:",
        socket.id
    );


    socket.on(
        "createRoom",
        data => {

            const roomCode =
                generateRoomCode();

            const player = {

                id: socket.id,

                name:
                    String(
                        data?.playerName ||
                        "Player"
                    ).substring(
                        0,
                        20
                    ),

                balance: 1000,

                team: [],

                selection: null
            };


            rooms[roomCode] = {

                hostId:
                    socket.id,

                game:
                    data?.game ||
                    "rank",

                players: [
                    player
                ],

                categoryIndex: 0,

                selections: {},

                rankStarted: false,

                auctionStarted: false,

                auctionIndex: 0,

                currentCharacter: null,

                currentBid: 0,

                highestBidder: null,

                auctionActive: false,

                auctionTimer: null,

                timeLeft: 15
            };


            socket.join(
                roomCode
            );


            socket.roomCode =
                roomCode;


            socket.emit(
                "roomCreated",
                {
                    roomCode,
                    hostId:
                        socket.id,
                    players:
                        getPlayers(
                            rooms[roomCode]
                        )
                }
            );


            console.log(
                `Room ${roomCode} created`
            );
        }
    );


/* =========================================================
   JOIN ROOM
   ========================================================= */

    socket.on(
        "joinRoom",
        data => {

            const code =
                String(
                    data?.roomCode ||
                    ""
                )
                .trim()
                .toUpperCase();


            const room =
                rooms[code];


            if (!room) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "Room not found"
                    }
                );

                return;
            }


            if (
                room.players.length >= 6
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "Room is full. Maximum 6 players."
                    }
                );

                return;
            }


            const player = {

                id: socket.id,

                name:
                    String(
                        data?.playerName ||
                        "Player"
                    ).substring(
                        0,
                        20
                    ),

                balance: 1000,

                team: [],

                selection: null
            };


            room.players.push(
                player
            );


            socket.join(code);

            socket.roomCode =
                code;


            socket.emit(
                "roomJoined",
                {
                    roomCode: code,

                    hostId:
                        room.hostId,

                    players:
                        getPlayers(room)
                }
            );


            sendPlayers(code);


            console.log(
                `${player.name} joined ${code}`
            );
        }
    );


/* =========================================================
   START CHARACTER RANK
   ========================================================= */

    socket.on(
        "startRankGame",
        data => {

            const code =
                data?.roomCode ||
                socket.roomCode;

            const room =
                rooms[code];


            if (!room) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "Room not found"
                    }
                );

                return;
            }


            if (
                room.hostId !==
                socket.id
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "Only the host can start the game"
                    }
                );

                return;
            }


            if (
                room.players.length < 2
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "At least 2 players are required"
                    }
                );

                return;
            }


            room.rankStarted =
                true;

            room.categoryIndex =
                0;

            room.selections = {};


            room.players.forEach(
                player => {
                    player.selection =
                        null;
                }
            );


            io.to(code).emit(
                "rankGameStarted",
                {
                    categoryIndex:
                        0,

                    category:
                        RANK_CATEGORIES[0],

                    totalCategories:
                        RANK_CATEGORIES.length,

                    players:
                        getPlayers(room)
                }
            );


            console.log(
                `Rank game started in ${code}`
            );
        }
    );


/* =========================================================
   PLAYER SELECTS ONE CHARACTER
   ========================================================= */

    socket.on(
        "selectRankCharacter",
        data => {

            const code =
                data?.roomCode ||
                socket.roomCode;

            const room =
                rooms[code];


            if (!room) {
                return;
            }


            if (!room.rankStarted) {
                return;
            }


            const player =
                room.players.find(
                    p =>
                        p.id ===
                        socket.id
                );


            if (!player) {
                return;
            }


            /*
             * PLAYER CAN SELECT ONLY ONCE
             */

            if (
                player.selection !==
                null
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "You already selected a character."
                    }
                );

                return;
            }


            const category =
                RANK_CATEGORIES[
                    room.categoryIndex
                ];


            const character =
                data?.character;


            /*
             * CHECK THAT CHARACTER
             * BELONGS TO CURRENT TOP 5
             */

            if (
                !category.characters.includes(
                    character
                )
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "Invalid character selection."
                    }
                );

                return;
            }


            /*
             * SAVE PLAYER SELECTION
             */

            player.selection =
                character;


            room.selections[
                socket.id
            ] = character;


            /*
             * TELL THIS PLAYER
             * HIS SELECTION IS LOCKED
             */

            socket.emit(
                "selectionAccepted",
                {
                    character
                }
            );


            /*
             * SHOW HOW MANY PLAYERS
             * HAVE ANSWERED
             */

            io.to(code).emit(
                "selectionProgress",
                {
                    selected:
                        Object.keys(
                            room.selections
                        ).length,

                    total:
                        room.players.length
                }
            );


            /*
             * IMPORTANT:
             * DO NOT MOVE TO NEXT
             * CATEGORY YET.
             */

            const allSelected =
                room.players.every(
                    p =>
                        p.selection !==
                        null
                );


            if (!allSelected) {

                console.log(
                    `Waiting for players in ${code}`
                );

                return;
            }


            /*
             * EVERY PLAYER HAS SELECTED
             */

            io.to(code).emit(
                "allPlayersSelected",
                {
                    selections:
                        room.selections,

                    categoryIndex:
                        room.categoryIndex
                }
            );


            /*
             * WAIT A LITTLE SO
             * EVERYONE CAN SEE RESULT
             */

            setTimeout(
                () => {

                    if (
                        !rooms[code] ||
                        !room.rankStarted
                    ) {
                        return;
                    }


                    room.categoryIndex++;


                    /*
                     * ALL CATEGORIES FINISHED
                     */

                    if (
                        room.categoryIndex >=
                        RANK_CATEGORIES.length
                    ) {

                        finishRankGame(
                            code
                        );

                        return;
                    }


                    /*
                     * RESET SELECTIONS
                     */

                    room.selections = {};


                    room.players.forEach(
                        player => {

                            player.selection =
                                null;
                        }
                    );


                    const nextCategory =
                        RANK_CATEGORIES[
                            room.categoryIndex
                        ];


                    /*
                     * SEND NEXT CATEGORY
                     * TO ALL PLAYERS AT SAME TIME
                     */

                    io.to(code).emit(
                        "rankNextCategory",
                        {
                            categoryIndex:
                                room.categoryIndex,

                            category:
                                nextCategory,

                            totalCategories:
                                RANK_CATEGORIES.length
                        }
                    );


                    console.log(
                        `Next category in ${code}: ${nextCategory.title}`
                    );

                },
                1800
            );
        }
    );


/* =========================================================
   FINISH RANK GAME
   ========================================================= */

    socket.on(
        "finishRankGame",
        data => {

            const code =
                data?.roomCode ||
                socket.roomCode;

            finishRankGame(code);
        }
    );


/* =========================================================
   RANK GAME RESULTS
   ========================================================= */

    function finishRankGame(code) {

        const room =
            rooms[code];

        if (!room) {
            return;
        }


        room.rankStarted =
            false;


        /*
         * COUNT EACH PLAYER'S
         * SELECTED CHARACTERS
         */

        const ranking =
            room.players
                .map(player => {

                    return {

                        id:
                            player.id,

                        name:
                            player.name,

                        selections:
                            player.rankSelections ||
                            [],

                        team:
                            player.team,

                        balance:
                            player.balance
                    };
                });


        io.to(code).emit(
            "rankGameFinished",
            {
                ranking
            }
        );
    }


/* =========================================================
   START AUCTION
   ========================================================= */

    socket.on(
        "startAuctionGame",
        data => {

            const code =
                data?.roomCode ||
                socket.roomCode;

            const room =
                rooms[code];


            if (!room) {
                return;
            }


            if (
                room.hostId !==
                socket.id
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "Only the host can start the auction."
                    }
                );

                return;
            }


            if (
                room.players.length < 2
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "At least 2 players are required."
                    }
                );

                return;
            }


            room.auctionStarted =
                true;

            room.auctionIndex =
                0;


            /*
             * RESET TEAMS
             */

            room.players.forEach(
                player => {

                    player.balance =
                        1000;

                    player.team = [];
                }
            );


            socket.to(code).emit(
                "auctionStarted"
            );

            socket.emit(
                "auctionStarted"
            );


            startAuctionCharacter(
                code
            );
        }
    );


/* =========================================================
   AUCTION CHARACTER
   ========================================================= */

    function startAuctionCharacter(
        code
    ) {

        const room =
            rooms[code];

        if (!room) {
            return;
        }


        if (
            room.auctionIndex >=
            AUCTION_CHARACTERS.length
        ) {

            finishAuction(
                code
            );

            return;
        }


        /*
         * IF EVERY PLAYER HAS 5
         * CHARACTERS, GAME ENDS.
         */

        const everyoneFull =
            room.players.every(
                player =>
                    player.team.length >= 5
            );


        if (everyoneFull) {

            finishAuction(
                code
            );

            return;
        }


        room.currentCharacter =
            AUCTION_CHARACTERS[
                room.auctionIndex
            ];


        room.currentBid =
            0;

        room.highestBidder =
            null;

        room.timeLeft =
            15;

        room.auctionActive =
            true;


        clearInterval(
            room.auctionTimer
        );


        emitAuctionUpdate(
            code
        );


        room.auctionTimer =
            setInterval(
                () => {

                    if (
                        !room.auctionActive
                    ) {
                        return;
                    }


                    room.timeLeft--;


                    emitAuctionUpdate(
                        code
                    );


                    if (
                        room.timeLeft <=
                        0
                    ) {

                        finishCurrentAuction(
                            code
                        );
                    }

                },
                1000
            );
    }


/* =========================================================
   AUCTION UPDATE
   ========================================================= */

    function emitAuctionUpdate(
        code
    ) {

        const room =
            rooms[code];

        if (!room) {
            return;
        }


        io.to(code).emit(
            "auctionUpdate",
            {
                character:
                    room.currentCharacter,

                currentBid:
                    room.currentBid,

                highestBidder:
                    room.highestBidder
                        ? room.highestBidder.name
                        : null,

                timeLeft:
                    room.timeLeft,

                auctionActive:
                    room.auctionActive,

                players:
                    getPlayers(room)
            }
        );
    }


/* =========================================================
   BID ₹50
   ========================================================= */

    socket.on(
        "placeBid",
        data => {

            const code =
                data?.roomCode ||
                socket.roomCode;

            const room =
                rooms[code];


            if (!room) {
                return;
            }


            if (
                !room.auctionActive
            ) {

                return;
            }


            const player =
                room.players.find(
                    p =>
                        p.id ===
                        socket.id
                );


            if (!player) {
                return;
            }


            /*
             * PLAYER ALREADY HAS 5
             */

            if (
                player.team.length >= 5
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "Your team already has 5 characters."
                    }
                );

                return;
            }


            /*
             * HIGHEST BIDDER CANNOT
             * BID AGAIN
             */

            if (
                room.highestBidder &&
                room.highestBidder.id ===
                socket.id
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "You are already the highest bidder."
                    }
                );

                return;
            }


            const nextBid =
                room.currentBid + 50;


            /*
             * PLAYER MUST HAVE
             * ENOUGH BALANCE
             */

            if (
                player.balance <
                nextBid
            ) {

                socket.emit(
                    "errorMessage",
                    {
                        message:
                            "Not enough balance."
                    }
                );

                return;
            }


            /*
             * CURRENT BIDDER CHANGES
             */

            room.currentBid =
                nextBid;

            room.highestBidder =
                player;


            /*
             * IMPORTANT:
             *
             * EVERY NEW BID RESETS
             * THE TIMER TO 15 SECONDS.
             */

            room.timeLeft =
                15;


            emitAuctionUpdate(
                code
            );


            console.log(
                `${player.name} bid ₹${nextBid} for ${room.currentCharacter}`
            );
        }
    );


/* =========================================================
   FINISH CURRENT AUCTION
   ========================================================= */

    function finishCurrentAuction(
        code
    ) {

        const room =
            rooms[code];

        if (!room) {
            return;
        }


        if (
            !room.auctionActive
        ) {
            return;
        }


        room.auctionActive =
            false;


        clearInterval(
            room.auctionTimer
        );


        let winner = null;


        /*
         * SOLD
         */

        if (
            room.highestBidder &&
            room.currentBid > 0
        ) {

            winner =
                room.highestBidder;


            winner.balance -=
                room.currentBid;


            winner.team.push(
                room.currentCharacter
            );
        }


        io.to(code).emit(
            "auctionResult",
            {
                sold:
                    !!winner,

                character:
                    room.currentCharacter,

                winner:
                    winner
                        ? winner.name
                        : null,

                bid:
                    room.currentBid
            }
        );


        sendPlayers(code);


        room.auctionIndex++;


        /*
         * NEXT CHARACTER
         */

        setTimeout(
            () => {

                if (
                    !rooms[code]
                ) {
                    return;
                }


                /*
                 * END WHEN EVERY TEAM
                 * HAS 5 CHARACTERS
                 */

                const everyoneFull =
                    room.players.every(
                        player =>
                            player.team.length >= 5
                    );


                if (everyoneFull) {

                    finishAuction(
                        code
                    );

                    return;
                }


                /*
                 * END WHEN ALL
                 * AUCTION CHARACTERS DONE
                 */

                if (
                    room.auctionIndex >=
                    AUCTION_CHARACTERS.length
                ) {

                    finishAuction(
                        code
                    );

                    return;
                }


                startAuctionCharacter(
                    code
                );

            },
            1800
        );
    }


/* =========================================================
   AUCTION FINISHED
   ========================================================= */

    function finishAuction(
        code
    ) {

        const room =
            rooms[code];

        if (!room) {
            return;
        }


        clearInterval(
            room.auctionTimer
        );


        room.auctionActive =
            false;

        room.auctionStarted =
            false;


        /*
         * RANK BY TEAM SIZE
         */

        const ranking =
            [...room.players]
                .sort(
                    (a, b) =>
                        b.team.length -
                        a.team.length
                )
                .map(player => ({

                    name:
                        player.name,

                    balance:
                        player.balance,

                    team:
                        player.team,

                    teamCount:
                        player.team.length
                }));


        io.to(code).emit(
            "auctionFinished",
            {
                ranking
            }
        );


        console.log(
            `Auction finished in ${code}`
        );
    }


/* =========================================================
   DISCONNECT
   ========================================================= */

    socket.on(
        "disconnect",
        () => {

            const code =
                socket.roomCode;

            if (!code) {
                return;
            }


            const room =
                rooms[code];

            if (!room) {
                return;
            }


            room.players =
                room.players.filter(
                    player =>
                        player.id !==
                        socket.id
                );


            /*
             * IF HOST LEAVES,
             * GIVE HOST TO NEXT PLAYER.
             */

            if (
                room.hostId ===
                socket.id
            ) {

                if (
                    room.players.length > 0
                ) {

                    room.hostId =
                        room.players[0].id;

                }
            }


            /*
             * DELETE EMPTY ROOM
             */

            if (
                room.players.length === 0
            ) {

                clearInterval(
                    room.auctionTimer
                );

                delete rooms[code];

                console.log(
                    `Room ${code} deleted`
                );

                return;
            }


            sendPlayers(code);
        }
    );

});


/* =========================================================
   START SERVER
   ========================================================= */

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Naruto server running on port ${PORT}`
        );
    }
);
