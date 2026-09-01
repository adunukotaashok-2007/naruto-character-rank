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
    "Might Guy",
    "Rock Lee",
    "Shikamaru",
    "Neji",
    "Gaara",
    "Kisame",
    "Sakura",
    "Nagato / Pain",
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
    "Gengetsu Hōzuki",
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
    "Might Duy",
    "Shizune",
    "Asuma",
    "Kurenai",
    "Yamato",
    "Sai",
    "Konohamaru",
    "Chiyo",
    "Kurotsuchi",
    "Mifune",
    "Fū",
    "Utakata",
    "Rōshi",
    "Rasa",
    "Darui",
    "Chōjūrō"
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
   CHARACTER RANKINGS
   These are AI-style predefined rankings.
   Characters not in the top list are automatically placed
   after them, so EVERY character is selectable.
========================================================= */

const RANKINGS = {

    "Speed": [
        "Minato",
        "Naruto",
        "Tobirama",
        "Fourth Raikage",
        "Sasuke",
        "Kakashi",
        "Shisui",
        "Might Guy",
        "Rock Lee",
        "Obito"
    ],

    "Strength": [
        "Madara",
        "Hashirama",
        "Naruto",
        "Sasuke",
        "Might Guy",
        "Tsunade",
        "Minato",
        "Itachi",
        "Obito",
        "Killer B"
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
        "Killer B",
        "Tsunade",
        "Obito",
        "Sakura",
        "Gaara",
        "Third Raikage"
    ],

    "Chakra": [
        "Naruto",
        "Hashirama",
        "Madara",
        "Nagato / Pain",
        "Kisame",
        "Killer B",
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
        "Might Guy",
        "Rock Lee",
        "Might Duy",
        "Naruto",
        "Sasuke",
        "Neji",
        "Third Raikage",
        "Fourth Raikage",
        "Killer B",
        "Sakura"
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
        "Ino",
        "Sakura"
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
        "Third Raikage",
        "Kisame"
    ],

    "Attack": [
        "Madara",
        "Naruto",
        "Sasuke",
        "Hashirama",
        "Might Guy",
        "Minato",
        "Itachi",
        "Killer B",
        "Nagato / Pain",
        "Obito"
    ],

    "Stamina": [
        "Naruto",
        "Hashirama",
        "Kisame",
        "Killer B",
        "Madara",
        "Tsunade",
        "Sakura",
        "Jiraiya",
        "Orochimaru",
        "Third Raikage"
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
        "Nagato / Pain",
        "Might Guy",
        "Tobirama"
    ]
};

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
        code = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
    } while (rooms.has(code));

    return code;
}

function getRoom(socket) {
    if (!socket.roomCode) return null;
    return rooms.get(socket.roomCode);
}

function getPlayers(room) {

    return Object.values(room.players).map(player => ({
        id: player.id,
        name: player.name,
        balance: player.balance,
        team: [...player.team]
    }));
}

function broadcastPlayers(room) {

    io.to(room.code).emit("playersUpdated", {
        players: getPlayers(room)
    });
}

function sendError(socket, message) {

    socket.emit("errorMessage", message);
}

/* =========================================================
   AUCTION STATE
========================================================= */

function getAuctionState(room) {

    const auction = room.auction;

    let timeLeft = auction.timeLeft;

    if (auction.timerStartedAt) {

        const elapsed =
            Date.now() - auction.timerStartedAt;

        timeLeft = Math.max(
            0,
            auction.bidTime -
            Math.floor(elapsed / 1000)
        );
    }

    return {

        character: auction.character,

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

        timeLeft,

        active:
            auction.active,

        givenUp:
            [...auction.givenUp],

        index:
            auction.index,

        totalCharacters:
            CHARACTERS.length,

        bidAmount:
            room.settings.bidAmount,

        startingBalance:
            room.settings.startingBalance,

        players:
            getPlayers(room)
    };
}

function broadcastAuction(room) {

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );
}

/* =========================================================
   AUCTION TIMER
========================================================= */

function clearAuctionTimer(room) {

    if (room.auction.timer) {

        clearInterval(
            room.auction.timer
        );

        room.auction.timer = null;
    }
}

function startAuctionTimer(room) {

    clearAuctionTimer(room);

    const auction =
        room.auction;

    auction.timerStartedAt =
        Date.now();

    auction.timeLeft =
        auction.bidTime;

    auction.timer =
        setInterval(() => {

            if (!auction.active) {

                clearAuctionTimer(room);
                return;
            }

            const elapsed =
                Date.now() -
                auction.timerStartedAt;

            auction.timeLeft =
                Math.max(
                    0,
                    auction.bidTime -
                    Math.floor(
                        elapsed / 1000
                    )
                );

            io.to(room.code).emit(
                "auctionTimer",
                {
                    timeLeft:
                        auction.timeLeft
                }
            );

            if (
                auction.timeLeft <= 0
            ) {

                clearAuctionTimer(room);

                finishAuctionCharacter(
                    room,
                    auction.highestBidder
                        ? false
                        : true
                );
            }

        }, 250);
}

function resetAuctionTimer(room) {

    startAuctionTimer(room);

    broadcastAuction(room);
}

/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    room.auction = {

        index: 0,

        character: null,

        currentBid: 0,

        highestBidder: null,

        highestBidderName: null,

        active: true,

        givenUp: new Set(),

        timer: null,

        timerStartedAt: null,

        timeLeft:
            room.settings.bidTime,

        bidTime:
            room.settings.bidTime,

        soldCharacters: []
    };

    Object.values(room.players)
        .forEach(player => {

            player.balance =
                room.settings.startingBalance;

            player.team = [];
        });

    io.to(room.code).emit(
        "auctionStarted",
        {
            settings:
                room.settings
        }
    );

    broadcastPlayers(room);

    startAuctionCharacter(room);
}

/* =========================================================
   START AUCTION CHARACTER
========================================================= */

function startAuctionCharacter(room) {

    const auction =
        room.auction;

    clearAuctionTimer(room);

    const players =
        Object.values(room.players);

    if (!players.length) {

        finishAuction(room);
        return;
    }

    const allFull =
        players.every(player =>
            player.team.length >=
            room.settings.teamSize
        );

    if (
        allFull ||
        auction.index >= CHARACTERS.length
    ) {

        finishAuction(room);
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

    auction.highestBidderName =
        null;

    auction.givenUp =
        new Set();

    auction.active =
        true;

    auction.timerStartedAt =
        Date.now();

    auction.timeLeft =
        room.settings.bidTime;

    auction.bidTime =
        room.settings.bidTime;

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(room)
    );

    broadcastAuction(room);

    startAuctionTimer(room);
}

/* =========================================================
   AUCTION BID
========================================================= */

function auctionBid(socket) {

    const room =
        getRoom(socket);

    if (!room) return;

    const auction =
        room.auction;

    if (!auction.active) {

        sendError(
            socket,
            "Auction is not active."
        );

        return;
    }

    const player =
        room.players[socket.id];

    if (!player) return;

    if (
        player.team.length >=
        room.settings.teamSize
    ) {

        sendError(
            socket,
            "Your team is already full."
        );

        return;
    }

    if (
        auction.givenUp.has(
            socket.id
        )
    ) {

        sendError(
            socket,
            "You gave up on this character."
        );

        return;
    }

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

    const newBid =
        auction.currentBid === 0
            ? room.settings.bidAmount
            : auction.currentBid +
              room.settings.bidAmount;

    if (
        player.balance <
        newBid
    ) {

        sendError(
            socket,
            `Not enough money. You have ₹${player.balance}.`
        );

        return;
    }

    auction.currentBid =
        newBid;

    auction.highestBidder =
        socket.id;

    auction.highestBidderName =
        player.name;

    /*
     * A new bid means the countdown
     * starts again from 10 seconds.
     */
    resetAuctionTimer(room);

    io.to(room.code).emit(
        "auctionBidPlaced",
        {
            playerId:
                socket.id,

            playerName:
                player.name,

            character:
                auction.character,

            bid:
                auction.currentBid,

            remainingMoney:
                player.balance -
                auction.currentBid
        }
    );

    broadcastAuction(room);
}

/* =========================================================
   GIVE UP
========================================================= */

function auctionGiveUp(socket) {

    const room =
        getRoom(socket);

    if (!room) return;

    const auction =
        room.auction;

    if (!auction.active) return;

    const player =
        room.players[socket.id];

    if (!player) return;

    auction.givenUp.add(
        socket.id
    );

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
     * If this player was the highest bidder,
     * remove their bid.
     */
    if (
        auction.highestBidder ===
        socket.id
    ) {

        auction.highestBidder =
            null;

        auction.highestBidderName =
            null;

        auction.currentBid =
            0;
    }

    /*
     * If exactly one eligible player remains,
     * immediately sell to that player.
     *
     * This handles the important
     * 2-player case.
     */
    const eligible =
        Object.values(room.players)
            .filter(p =>
                p.team.length <
                room.settings.teamSize &&
                !auction.givenUp.has(p.id)
            );

    if (
        eligible.length === 1
    ) {

        const winner =
            eligible[0];

        auction.currentBid =
            auction.currentBid ||
            room.settings.bidAmount;

        auction.highestBidder =
            winner.id;

        auction.highestBidderName =
            winner.name;

        finishAuctionCharacter(
            room,
            false
        );

        return;
    }

    /*
     * If nobody remains, character is unsold.
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

    resetAuctionTimer(room);

    broadcastAuction(room);
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

    if (!auction.active) return;

    clearAuctionTimer(room);

    auction.active =
        false;

    const character =
        auction.character;

    if (
        !unsold &&
        auction.highestBidder
    ) {

        const winner =
            room.players[
                auction.highestBidder
            ];

        if (winner) {

            const price =
                auction.currentBid;

            winner.balance =
                Math.max(
                    0,
                    winner.balance -
                    price
                );

            winner.team.push(
                character
            );

            auction.soldCharacters.push({
                character,
                playerId:
                    winner.id,
                playerName:
                    winner.name,
                price
            });

            io.to(room.code).emit(
                "auctionSold",
                {
                    character,
                    playerId:
                        winner.id,
                    playerName:
                        winner.name,
                    price,
                    remainingMoney:
                        winner.balance,
                    team:
                        [...winner.team]
                }
            );

            broadcastPlayers(room);

        }

    } else {

        io.to(room.code).emit(
            "auctionUnsoldResult",
            {
                character
            }
        );
    }

    setTimeout(() => {

        if (
            !rooms.has(room.code)
        ) return;

        auction.index++;

        startAuctionCharacter(
            room
        );

    }, 1200);
}

/* =========================================================
   FINISH AUCTION
========================================================= */

function finishAuction(room) {

    clearAuctionTimer(room);

    room.auction.active =
        false;

    const teams =
        Object.values(room.players)
            .map(player => ({
                playerId:
                    player.id,

                playerName:
                    player.name,

                balance:
                    player.balance,

                team:
                    [...player.team]
            }));

    const recommendation =
        generateTeamRecommendation(
            teams
        );

    io.to(room.code).emit(
        "auctionFinished",
        {
            teams,
            recommendation
        }
    );

    /*
     * Also emit the event name used by
     * some frontend versions.
     */
    io.to(room.code).emit(
        "finalTeams",
        {
            teams,
            recommendation
        }
    );
}

/* =========================================================
   TEAM RECOMMENDATION
========================================================= */

function characterPower(name) {

    const power = {

        "Madara": 100,
        "Naruto": 99,
        "Sasuke": 98,
        "Hashirama": 98,
        "Might Guy": 96,
        "Minato": 96,
        "Itachi": 95,
        "Obito": 94,
        "Nagato / Pain": 94,
        "Tobirama": 93,
        "Kakashi": 91,
        "Might Duy": 90,
        "Rock Lee": 88,
        "Jiraiya": 88,
        "Orochimaru": 88,
        "Hiruzen": 87,
        "Shisui": 87,
        "Killer B": 87,
        "Third Raikage": 87,
        "Sakura": 83,
        "Tsunade": 83,
        "Gaara": 82,
        "Kisame": 81,
        "Kabuto": 81,
        "Sasori": 80,
        "Deidara": 79,
        "Hanzo": 79,
        "Fourth Raikage": 79,
        "Danzo": 78,
        "Onoki": 78,
        "Kakuzu": 77,
        "Konan": 75,
        "Darui": 74,
        "Mei Terumi": 74,
        "Kimimaro": 73,
        "Zabuza": 72,
        "Chiyo": 71,
        "Neji": 70,
        "Shikamaru": 69,
        "Yamato": 68,
        "Sai": 66,
        "Asuma": 65,
        "Kurenai": 64,
        "Suigetsu": 63,
        "Jūgo": 63,
        "Kurotsuchi": 62,
        "Chōjūrō": 62,
        "Rasa": 62,
        "Mifune": 61,
        "Utakata": 61,
        "Fū": 60,
        "Rōshi": 60,
        "Yahiko": 59,
        "Zetsu": 58,
        "Hinata": 58,
        "Kiba": 57,
        "Shino": 57,
        "Choji": 56,
        "Ino": 55,
        "Tenten": 54,
        "Konohamaru": 53,
        "Shizune": 52,
        "Anko": 52,
        "Karin": 50,
        "Iruka": 48
    };

    return power[name] || 45;
}

function teamScore(team) {

    if (!team.length) return 0;

    let total = 0;

    team.forEach(character => {
        total += characterPower(
            character
        );
    });

    /*
     * Small bonus for team diversity.
     */
    const unique =
        new Set(team).size;

    total +=
        unique * 1.5;

    return Math.round(total);
}

function generateTeamRecommendation(
    teams
) {

    if (!teams.length) {

        return {
            bestPlayer: null,
            bestTeam: [],
            reason: "No teams available."
        };
    }

    const scored =
        teams.map(team => ({

            playerId:
                team.playerId,

            playerName:
                team.playerName,

            team:
                team.team,

            score:
                teamScore(team),

            reason:
                buildTeamReason(
                    team.team
                )
        }));

    scored.sort(
        (a, b) =>
            b.score - a.score
    );

    const best =
        scored[0];

    return {

        bestPlayer:
            best.playerName,

        bestTeam:
            best.team,

        bestScore:
            best.score,

        reason:
            best.reason,

        allTeams:
            scored
    };
}

function buildTeamReason(team) {

    if (!team.length) {

        return "This team has no characters.";
    }

    const strongest =
        [...team]
            .sort(
                (a, b) =>
                    characterPower(b) -
                    characterPower(a)
            )
            .slice(0, 3);

    return (
        `AI-style analysis: ${team.join(", ")}. ` +
        `The strongest core is ${strongest.join(", ")}. ` +
        `This team is evaluated by overall combat strength, ` +
        `speed, attack, defense, versatility, stamina and ` +
        `how well the characters can complement each other.`
    );
}

/* =========================================================
   RANKING GAME
========================================================= */

function startRankGame(room) {

    room.rank.started =
        true;

    room.rank.categoryIndex =
        0;

    Object.values(room.players)
        .forEach(player => {

            player.rankSelections = {};

        });

    io.to(room.code).emit(
        "rankGameStarted",
        {
            categoryIndex: 0,
            categoryNumber: 1,
            totalCategories:
                CATEGORIES.length,
            categoryName:
                CATEGORIES[0],
            categories:
                CATEGORIES
        }
    );
}

/* =========================================================
   RANK SELECTION
========================================================= */

function rankSelect(socket, data) {

    const room =
        getRoom(socket);

    if (!room) return;

    if (!room.rank.started) return;

    const player =
        room.players[socket.id];

    if (!player) return;

    const category =
        Number(data.categoryIndex);

    const character =
        String(
            data.character || ""
        );

    if (
        category !==
        room.rank.categoryIndex
    ) {

        sendError(
            socket,
            "Please select for the current category."
        );

        return;
    }

    if (
        category < 0 ||
        category >=
        CATEGORIES.length
    ) return;

    if (
        !CHARACTERS.includes(
            character
        )
    ) {

        sendError(
            socket,
            `Invalid character: ${character}`
        );

        return;
    }

    /*
     * IMPORTANT:
     * Selection belongs ONLY to this player.
     *
     * Other players can select the same character.
     */
    player.rankSelections[
        category
    ] = character;

    /*
     * Send private confirmation.
     * The global event only tells everyone
     * that this player has completed the category.
     */
    socket.emit(
        "myRankSelection",
        {
            categoryIndex:
                category,

            categoryName:
                CATEGORIES[category],

            character
        }
    );

    io.to(room.code).emit(
        "rankPlayerSelected",
        {
            playerId:
                socket.id,

            playerName:
                player.name,

            categoryIndex:
                category,

            categoryName:
                CATEGORIES[category]
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
        Object.values(room.players);

    if (!players.length) return;

    const everyoneSelected =
        players.every(player =>
            Object.prototype.hasOwnProperty.call(
                player.rankSelections,
                category
            )
        );

    if (!everyoneSelected) {

        /*
         * Tell each player how many
         * have selected.
         */
        const selectedCount =
            players.filter(player =>
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

                selected:
                    selectedCount,

                total:
                    players.length
            }
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

            totalCategories:
                CATEGORIES.length,

            categoryName:
                CATEGORIES[category]
        }
    );

    setTimeout(() => {

        if (
            !rooms.has(room.code)
        ) return;

        if (
            room.rank.categoryIndex >=
            CATEGORIES.length - 1
        ) {

            finishRankGame(room);
            return;
        }

        room.rank.categoryIndex++;

        const next =
            room.rank.categoryIndex;

        io.to(room.code).emit(
            "rankNextCategory",
            {
                categoryIndex:
                    next,

                categoryNumber:
                    next + 1,

                totalCategories:
                    CATEGORIES.length,

                categoryName:
                    CATEGORIES[next]
            }
        );

    }, 1200);
}

/* =========================================================
   RANK FINAL
========================================================= */

function finishRankGame(room) {

    room.rank.started =
        false;

    const results =
        Object.values(room.players)
            .map(player => ({

                playerId:
                    player.id,

                playerName:
                    player.name,

                selections:
                    Object.fromEntries(
                        Object.entries(
                            player.rankSelections
                        ).map(
                            ([index, character]) =>
                                [
                                    index,
                                    character
                                ]
                        )
                    )
            }));

    const teams =
        results.map(player => {

            const team =
                Object.values(
                    player.selections
                );

            return {

                playerId:
                    player.playerId,

                playerName:
                    player.playerName,

                team,

                score:
                    teamScore(team),

                reason:
                    buildTeamReason(team)
            };
        });

    const recommendation =
        generateTeamRecommendation(
            teams
        );

    io.to(room.code).emit(
        "rankGameFinished",
        {
            results,
            teams,
            recommendation,
            categories:
                CATEGORIES
        }
    );
}

/* =========================================================
   SOCKET CONNECTION
========================================================= */

io.on("connection", socket => {

    console.log(
        "Connected:",
        socket.id
    );

    /* =====================================================
       CREATE ROOM
    ===================================================== */

    socket.on(
        "createRoom",
        data => {

            data =
                data || {};

            const roomCode =
                generateRoomCode();

            const name =
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
                    Math.min(
                        CHARACTERS.length,
                        Number(
                            data.teamSize
                        ) || 5
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

                    started: false,

                    categoryIndex: 0
                },

                auction: {

                    active: false,

                    index: 0,

                    character: null,

                    currentBid: 0,

                    highestBidder: null,

                    highestBidderName: null,

                    givenUp: new Set(),

                    timer: null,

                    timerStartedAt: null,

                    timeLeft:
                        bidTime,

                    bidTime,

                    soldCharacters: []
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
                `Room created: ${roomCode}`
            );
        }
    );

    /* =====================================================
       JOIN ROOM
    ===================================================== */

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

                sendError(
                    socket,
                    "Room not found."
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

            const count =
                Object.keys(
                    room.players
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

            const name =
                String(
                    data.name ||
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

    /* =====================================================
       START GAME
    ===================================================== */

    socket.on(
        "startGame",
        () => {

            const room =
                getRoom(socket);

            if (!room) return;

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
                Object.keys(
                    room.players
                ).length;

            if (count < 2) {

                sendError(
                    socket,
                    "At least 2 players are required."
                );

                return;
            }

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

    /* =====================================================
       RANK SELECT
    ===================================================== */

    socket.on(
        "rankSelect",
        data => {

            rankSelect(
                socket,
                data || {}
            );
        }
    );

    /* =====================================================
       AUCTION BID
    ===================================================== */

    socket.on(
        "auctionBid",
        () => {

            auctionBid(socket);
        }
    );

    /*
     * Support alternative frontend event names.
     */
    socket.on(
        "bid",
        () => {

            auctionBid(socket);
        }
    );

    /* =====================================================
       AUCTION GIVE UP
    ===================================================== */

    socket.on(
        "auctionGiveUp",
        () => {

            auctionGiveUp(socket);
        }
    );

    socket.on(
        "giveUp",
        () => {

            auctionGiveUp(socket);
        }
    );

    /*
     * Old frontend may call this.
     * Treat it as Give Up during an active auction.
     */
    socket.on(
        "auctionUnsold",
        () => {

            auctionGiveUp(socket);
        }
    );

    /* =====================================================
       DISCONNECT
    ===================================================== */

    socket.on(
        "disconnect",
        () => {

            const room =
                getRoom(socket);

            if (!room) return;

            const wasHost =
                room.host ===
                socket.id;

            delete room.players[
                socket.id
            ];

            /*
             * If an auction is active and
             * the highest bidder disconnects,
             * remove that bid.
             */
            if (
                room.auction.active &&
                room.auction.highestBidder ===
                socket.id
            ) {

                room.auction.highestBidder =
                    null;

                room.auction.highestBidderName =
                    null;

                room.auction.currentBid =
                    0;
            }

            if (wasHost) {

                const remaining =
                    Object.keys(
                        room.players
                    );

                if (
                    remaining.length
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

                    rooms.delete(
                        room.code
                    );

                    return;
                }
            }

            broadcastPlayers(room);

            if (
                room.auction.active
            ) {

                broadcastAuction(
                    room
                );
            }
        }
    );
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
    "/health",
    (req, res) => {

        res.json({
            status: "ok",
            rooms:
                rooms.size
        });
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
