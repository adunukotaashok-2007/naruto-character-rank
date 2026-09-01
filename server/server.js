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

app.use(express.json());

app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
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


function getPlayers(room) {

    return Object.values(room.players).map(p => ({
        id: p.id,
        name: p.name,
        balance: p.balance,
        spent: p.spent,
        team: p.team
    }));
}


function broadcastPlayers(room) {

    io.to(room.code).emit("playersUpdated", {
        players: getPlayers(room)
    });
}


/* =========================================================
   RANK FINAL COMPARISON
========================================================= */

function calculateTeamScore(selections) {

    let score = 0;

    Object.keys(selections).forEach(categoryIndex => {

        const character = selections[categoryIndex];

        const position =
            CHARACTER_POWER[character] || 50;

        score += position;
    });

    return score;
}


/*
   General character power values.

   These are used only for the final comparison.
*/

const CHARACTER_POWER = {

    Naruto: 100,
    Sasuke: 98,
    Madara: 100,
    Hashirama: 99,
    Minato: 97,
    Itachi: 95,
    Obito: 94,
    Nagato: 94,
    Tobirama: 93,
    Kakashi: 91,
    MightGuy: 96,
    Guy: 96,
    Lee: 88,
    Jiraiya: 90,
    Orochimaru: 91,
    Hiruzen: 89,
    Gaara: 87,
    KillerB: 89,
    Tsunade: 86,
    Kabuto: 88,
    Shisui: 92,
    Sakumo: 91,
    Hanzo: 88,
    ThirdRaikage: 91,
    FourthRaikage: 90,
    Onoki: 88,
    Mei: 82,
    Sasori: 87,
    Deidara: 86,
    Mu: 90,
    Gengetsu: 89,
    Danzo: 83,
    Kakuzu: 84,
    Hidan: 75,
    Konan: 80,
    Zabuza: 79,
    Kimimaro: 82,
    Suigetsu: 75,
    Jugo: 76,
    Karin: 60,
    Yahiko: 70,
    Zetsu: 55,
    Hinata: 72,
    Ino: 65,
    Choji: 70,
    Kiba: 68,
    Shino: 72,
    Tenten: 65,
    Iruka: 50,
    Anko: 65,
    Duy: 82,
    Shizune: 65,
    Asuma: 72,
    Kurenai: 74,
    Yamato: 78,
    Sai: 72,
    Konohamaru: 70,
    Chiyo: 80,
    Rasa: 80,
    Darui: 82,
    Chojuro: 75,
    Kurotsuchi: 78,
    Mifune: 80,
    Fu: 78,
    Utakata: 80,
    Roshi: 82
};


function getFinalRankResults(room) {

    const players = Object.values(room.players);

    const results = players.map(player => {

        const score =
            calculateTeamScore(
                player.rankSelections
            );

        return {
            playerId: player.id,
            playerName: player.name,
            selections: player.rankSelections,
            score
        };
    });

    let strongest = null;

    if (results.length > 0) {

        strongest = results.reduce(
            (best, current) =>
                current.score > best.score
                    ? current
                    : best
        );
    }

    let explanation = "";

    if (strongest) {

        explanation =
            `${strongest.playerName} has the strongest overall selection ` +
            `with a score of ${strongest.score}. ` +
            `The team performs strongly across the 16 categories ` +
            `and has a good combination of power, speed, defense, ` +
            `battle ability, chakra and versatility.`;
    }

    return {
        results,
        strongestPlayerId:
            strongest?.playerId || null,
        strongestPlayerName:
            strongest?.playerName || null,
        explanation
    };
}


/* =========================================================
   SOCKET
========================================================= */

io.on("connection", socket => {

    console.log("Connected:", socket.id);


    /* =====================================================
       CREATE ROOM
    ===================================================== */

    socket.on("createRoom", data => {

        const roomCode =
            generateRoomCode();

        const name =
            String(data?.name || "Player 1").trim();

        const gameMode =
            data?.gameMode === "auction"
                ? "auction"
                : "rank";

        const maxPlayers = Math.max(
            2,
            Math.min(
                Number(data?.maxPlayers) || 6,
                25
            )
        );

        const teamSize = Math.max(
            1,
            Number(data?.teamSize) || 5
        );

        const startingBalance = Math.max(
            0,
            Number(data?.startingBalance) || 1000
        );

        const bidAmount = Math.max(
            1,
            Number(data?.bidAmount) || 50
        );

        const bidTime = Math.max(
            1,
            Number(data?.bidTime) || 10
        );

        const room = {

            code: roomCode,

            host: socket.id,

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
                categoryLocks: {}
            },

            auction: {
                active: false,
                characters: [],
                index: 0,
                character: null,
                currentBid: 0,
                highestBidder: null,
                timer: null,
                remainingTime: 0,
                bidders: {},
                gaveUp: {}
            }
        };


        room.players[socket.id] = {

            id: socket.id,

            name,

            balance: startingBalance,

            spent: 0,

            team: [],

            rankSelections: {}
        };


        rooms.set(roomCode, room);

        socket.join(roomCode);

        socket.roomCode = roomCode;

        socket.emit("roomCreated", {
            roomCode,
            isHost: true,
            gameMode,
            settings: room.settings
        });

        broadcastPlayers(room);

        console.log("Room created:", roomCode);
    });


    /* =====================================================
       JOIN
    ===================================================== */

    socket.on("joinRoom", data => {

        const roomCode =
            String(data?.roomCode || "")
                .trim()
                .toUpperCase();

        const room =
            rooms.get(roomCode);

        if (!room) {

            socket.emit(
                "errorMessage",
                "Room not found."
            );

            return;
        }

        const count =
            Object.keys(room.players).length;

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

        room.players[socket.id] = {

            id: socket.id,

            name,

            balance:
                room.settings.startingBalance,

            spent: 0,

            team: [],

            rankSelections: {}
        };

        socket.join(roomCode);

        socket.roomCode =
            roomCode;

        socket.emit("roomJoined", {

            roomCode,

            isHost: false,

            gameMode:
                room.gameMode,

            settings:
                room.settings
        });

        broadcastPlayers(room);
    });


    /* =====================================================
       START GAME
    ===================================================== */

    socket.on("startGame", () => {

        const room =
            rooms.get(socket.roomCode);

        if (!room) return;

        if (socket.id !== room.host) {

            socket.emit(
                "errorMessage",
                "Only the host can start the game."
            );

            return;
        }

        if (
            Object.keys(room.players).length < 2
        ) {

            socket.emit(
                "errorMessage",
                "At least 2 players are required."
            );

            return;
        }

        if (room.gameMode === "rank") {

            startRankGame(room);

        } else {

            startAuction(room);
        }
    });


    /* =====================================================
       RANK SELECT
    ===================================================== */

    socket.on("rankSelect", data => {

        const room =
            rooms.get(socket.roomCode);

        if (!room) return;

        if (!room.rank.started) return;

        const player =
            room.players[socket.id];

        if (!player) return;

        const category =
            Number(data?.categoryIndex);

        const character =
            String(data?.character || "");

        if (
            category !==
            room.rank.categoryIndex
        ) {
            return;
        }

        if (
            category < 0 ||
            category >= CATEGORIES.length
        ) {
            return;
        }

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
           Same character is allowed
           for different players.
        */

        player.rankSelections[category] =
            character;

        /*
           IMPORTANT:
           Send selection only to the player
           who selected it.

           Other players will NOT see the
           selected character.
        */

        socket.emit(
            "myRankSelection",
            {
                categoryIndex: category,
                character
            }
        );


        checkRankCategory(room);
    });


    /* =====================================================
       AUCTION BID
    ===================================================== */

    socket.on("auctionBid", () => {

        const room =
            rooms.get(socket.roomCode);

        if (!room) return;

        const auction =
            room.auction;

        if (!auction.active) {

            socket.emit(
                "errorMessage",
                "No auction is active."
            );

            return;
        }

        const player =
            room.players[socket.id];

        if (!player) return;


        if (
            auction.gaveUp[socket.id]
        ) {

            socket.emit(
                "errorMessage",
                "You gave up on this character."
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


        const newBid =
            auction.currentBid +
            room.settings.bidAmount;


        if (
            newBid >
            player.balance
        ) {

            socket.emit(
                "errorMessage",
                `Not enough money. Remaining: ${player.balance}`
            );

            return;
        }


        auction.currentBid =
            newBid;

        auction.highestBidder =
            socket.id;

        auction.bidders[socket.id] =
            true;


        /*
           Reset timer after valid bid.
        */

        startAuctionTimer(room);


        broadcastAuction(room);
    });


    /* =====================================================
       GIVE UP
    ===================================================== */

    socket.on("auctionGiveUp", () => {

        const room =
            rooms.get(socket.roomCode);

        if (!room) return;

        const auction =
            room.auction;

        if (!auction.active) return;

        const player =
            room.players[socket.id];

        if (!player) return;


        auction.gaveUp[socket.id] =
            true;


        /*
           If the highest bidder gives up,
           remove the bid and allow the
           remaining players to continue.
        */

        if (
            auction.highestBidder ===
            socket.id
        ) {

            auction.highestBidder =
                null;

            auction.currentBid =
                0;
        }


        const activePlayers =
            Object.values(room.players)
                .filter(p =>
                    !auction.gaveUp[p.id] &&
                    p.team.length <
                        room.settings.teamSize &&
                    p.balance >=
                        auction.currentBid +
                        room.settings.bidAmount
                );


        /*
           Two-player special case:
           if one gives up, the other wins
           immediately.
        */

        const remaining =
            Object.values(room.players)
                .filter(p =>
                    !auction.gaveUp[p.id] &&
                    p.team.length <
                        room.settings.teamSize
                );


        if (
            remaining.length === 1 &&
            auction.currentBid > 0
        ) {

            finishAuctionCharacter(
                room,
                false
            );

            return;
        }


        if (
            activePlayers.length === 0
        ) {

            finishAuctionCharacter(
                room,
                true
            );

            return;
        }


        startAuctionTimer(room);

        broadcastAuction(room);
    });


    /* =====================================================
       UNSOLD BUTTON
    ===================================================== */

    socket.on("auctionUnsold", () => {

        const room =
            rooms.get(socket.roomCode);

        if (!room) return;

        if (!room.auction.active)
            return;

        /*
           Only host can force UNSOLD.
        */

        if (
            socket.id !== room.host
        ) {

            socket.emit(
                "errorMessage",
                "Only the host can mark a player unsold."
            );

            return;
        }

        finishAuctionCharacter(
            room,
            true
        );
    });


    /* =====================================================
       DISCONNECT
    ===================================================== */

    socket.on("disconnect", () => {

        const roomCode =
            socket.roomCode;

        if (!roomCode) return;

        const room =
            rooms.get(roomCode);

        if (!room) return;


        delete room.players[socket.id];


        if (
            room.host === socket.id
        ) {

            const remaining =
                Object.keys(room.players);

            if (remaining.length > 0) {

                room.host =
                    remaining[0];

                io.to(room.code).emit(
                    "hostChanged",
                    {
                        host: room.host
                    }
                );

            } else {

                if (room.auction.timer) {

                    clearTimeout(
                        room.auction.timer
                    );
                }

                rooms.delete(roomCode);

                return;
            }
        }


        /*
           Re-check rank category
           if somebody disconnects.
        */

        if (room.rank.started) {

            checkRankCategory(room);
        }


        /*
           Re-check auction.
        */

        if (room.auction.active) {

            const remaining =
                Object.values(room.players)
                    .filter(p =>
                        !room.auction.gaveUp[p.id]
                    );

            if (remaining.length === 0) {

                finishAuctionCharacter(
                    room,
                    true
                );

            } else {

                broadcastAuction(room);
            }
        }


        broadcastPlayers(room);
    });
});


/* =========================================================
   START RANK
========================================================= */

function startRankGame(room) {

    room.rank.started =
        true;

    room.rank.categoryIndex =
        0;

    room.rank.categoryLocks =
        {};

    Object.values(room.players)
        .forEach(player => {

            player.rankSelections = {};
        });


    io.to(room.code).emit(
        "rankGameStarted",
        {
            categoryIndex: 0,
            totalCategories:
                CATEGORIES.length,
            categoryName:
                CATEGORIES[0]
        }
    );
}


/* =========================================================
   CHECK RANK CATEGORY
========================================================= */

function checkRankCategory(room) {

    if (!room.rank.started)
        return;

    const category =
        room.rank.categoryIndex;


    const players =
        Object.values(room.players);


    if (players.length < 2)
        return;


    const complete =
        players.every(player =>
            player.rankSelections[category] !==
            undefined
        );


    /*
       IMPORTANT:
       Do NOT compare the characters.

       Every player can select a different
       character, or the same character.

       The category advances as soon as
       EVERY player has selected.
    */

    if (!complete)
        return;


    if (
        room.rank.categoryLocks[category]
    )
        return;


    room.rank.categoryLocks[category] =
        true;


    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex: category,
            totalCategories:
                CATEGORIES.length
        }
    );


    setTimeout(() => {

        if (!room.rank.started)
            return;


        if (
            room.rank.categoryIndex !==
            category
        )
            return;


        if (
            category >=
            CATEGORIES.length - 1
        ) {

            finishRankGame(room);

            return;
        }


        room.rank.categoryIndex =
            category + 1;


        io.to(room.code).emit(
            "rankNextCategory",
            {
                categoryIndex:
                    room.rank.categoryIndex,

                totalCategories:
                    CATEGORIES.length,

                categoryName:
                    CATEGORIES[
                        room.rank.categoryIndex
                    ]
            }
        );

    }, 800);
}


/* =========================================================
   FINISH RANK
========================================================= */

function finishRankGame(room) {

    room.rank.started =
        false;


    const finalData =
        getFinalRankResults(room);


    io.to(room.code).emit(
        "rankGameFinished",
        finalData
    );
}


/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    room.auction.active =
        true;

    room.auction.index =
        0;

    room.auction.characters =
        [...CHARACTERS];


    /*
       Random auction order.
    */

    for (
        let i =
            room.auction.characters.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            room.auction.characters[i],
            room.auction.characters[j]
        ] = [
            room.auction.characters[j],
            room.auction.characters[i]
        ];
    }


    Object.values(room.players)
        .forEach(player => {

            player.balance =
                room.settings.startingBalance;

            player.spent =
                0;

            player.team =
                [];
        });


    io.to(room.code).emit(
        "auctionStarted",
        {
            settings:
                room.settings
        }
    );


    startAuctionCharacter(room);
}


/* =========================================================
   START CHARACTER
========================================================= */

function startAuctionCharacter(room) {

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
            .every(player =>
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

    auction.gaveUp =
        {};

    auction.bidders =
        {};

    auction.remainingTime =
        room.settings.bidTime;

    auction.active =
        true;


    broadcastAuction(room);

    startAuctionTimer(room);
}


/* =========================================================
   TIMER
========================================================= */

function startAuctionTimer(room) {

    const auction =
        room.auction;


    if (auction.timer) {

        clearInterval(
            auction.timer
        );
    }


    auction.remainingTime =
        room.settings.bidTime;


    /*
       Send countdown immediately.
    */

    broadcastAuction(room);


    auction.timer =
        setInterval(() => {

            if (!auction.active) {

                clearInterval(
                    auction.timer
                );

                auction.timer =
                    null;

                return;
            }


            auction.remainingTime--;


            io.to(room.code).emit(
                "auctionTimer",
                {
                    remaining:
                        auction.remainingTime
                }
            );


            if (
                auction.remainingTime <= 0
            ) {

                clearInterval(
                    auction.timer
                );

                auction.timer =
                    null;


                /*
                   If there is a highest bidder,
                   sell the character.

                   Otherwise UNSOLD.
                */

                finishAuctionCharacter(
                    room,
                    auction.highestBidder === null
                );
            }

        }, 1000);
}


/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {

    const auction =
        room.auction;


    const players =
        Object.values(room.players)
            .map(player => ({

                id: player.id,

                name: player.name,

                balance:
                    player.balance,

                spent:
                    player.spent,

                team:
                    player.team,

                gaveUp:
                    !!auction.gaveUp[player.id],

                isHighestBidder:
                    auction.highestBidder ===
                    player.id
            }));


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

        remainingTime:
            auction.remainingTime,

        bidAmount:
            room.settings.bidAmount,

        players,

        index:
            auction.index,

        totalCharacters:
            auction.characters.length
    };
}


function broadcastAuction(room) {

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );
}


/* =========================================================
   FINISH CHARACTER
========================================================= */

function finishAuctionCharacter(
    room,
    unsold
) {

    const auction =
        room.auction;


    if (!auction.active)
        return;


    auction.active =
        false;


    if (auction.timer) {

        clearInterval(
            auction.timer
        );

        auction.timer =
            null;
    }


    if (
        unsold ||
        !auction.highestBidder
    ) {

        io.to(room.code).emit(
            "auctionResult",
            {
                character:
                    auction.character,

                sold:
                    false,

                winnerId:
                    null,

                winnerName:
                    null,

                amount:
                    0
            }
        );

    } else {

        const winner =
            room.players[
                auction.highestBidder
            ];


        if (!winner) {

            auction.index++;

            startAuctionCharacter(room);

            return;
        }


        /*
           Charge the winner.
        */

        winner.balance -=
            auction.currentBid;

        winner.spent +=
            auction.currentBid;


        winner.team.push(
            auction.character
        );


        io.to(room.code).emit(
            "auctionResult",
            {
                character:
                    auction.character,

                sold:
                    true,

                winnerId:
                    winner.id,

                winnerName:
                    winner.name,

                amount:
                    auction.currentBid,

                remainingMoney:
                    winner.balance,

                spent:
                    winner.spent,

                team:
                    winner.team
            }
        );
    }


    broadcastPlayers(room);


    auction.index++;


    setTimeout(() => {

        startAuctionCharacter(room);

    }, 1200);
}


/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    room.auction.active =
        false;


    if (room.auction.timer) {

        clearInterval(
            room.auction.timer
        );

        room.auction.timer =
            null;
    }


    const teams =
        Object.values(room.players)
            .map(player => ({

                playerId:
                    player.id,

                playerName:
                    player.name,

                team:
                    player.team,

                spent:
                    player.spent,

                remainingMoney:
                    player.balance,

                score:
                    player.team.reduce(
                        (total, character) =>
                            total +
                            (
                                CHARACTER_POWER[
                                    character
                                ] || 50
                            ),
                        0
                    )
            }));


    let bestTeam =
        null;


    if (teams.length) {

        bestTeam =
            teams.reduce(
                (best, current) =>
                    current.score >
                    best.score
                        ? current
                        : best
            );
    }


    io.to(room.code).emit(
        "auctionFinished",
        {
            teams,

            bestTeamPlayerId:
                bestTeam?.playerId ||
                null,

            bestTeamPlayerName:
                bestTeam?.playerName ||
                null,

            explanation:
                bestTeam
                    ? `${bestTeam.playerName} has the strongest team based on the combined character power of the selected team.`
                    : "No team data available."
        }
    );


    broadcastPlayers(room);
}


/* =========================================================
   SERVER
========================================================= */

server.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on port ${PORT}`
    );
});
