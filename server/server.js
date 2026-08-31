const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
cors: {
origin: "*"
}
});

const PORT = process.env.PORT || 10000;

// Serve frontend from repository root
app.use(express.static(path.join(__dirname, "..")));

app.get("/health", (req, res) => {
res.json({ status: "ok" });
});

const rooms = {};

const characters = [
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

const categories = [
"Talent",
"Body",
"Mind / IQ",
"Clan",
"Chakra",
"Sensei",
"Taijutsu",
"Ninjutsu",
"Kekkei Genkai",
"Speed",
"Strength",
"Battle IQ",
"Genjutsu",
"Chakra Nature",
"Tailed Beast",
"Healing"
];

function makeRoomCode() {
let code;

do {
    code = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
} while (rooms[code]);

return code;

}

function publicPlayers(room) {
return room.players.map(p => ({
id: p.id,
name: p.name,
balance: p.balance,
team: p.team,
teamCount: p.team.length
}));
}

function sendPlayers(roomCode) {
const room = rooms[roomCode];

if (!room) return;

io.to(roomCode).emit("playersUpdated", {
    players: publicPlayers(room)
});

}

function addPlayer(roomCode, socket, name) {
const room = rooms[roomCode];

const player = {
    id: socket.id,
    name,
    balance: 1000,
    team: []
};

room.players.push(player);

socket.join(roomCode);
socket.data.roomCode = roomCode;

}

function stopAuctionTimer(room) {
if (room.auctionTimer) {
clearInterval(room.auctionTimer);
room.auctionTimer = null;
}
}

function sendAuction(roomCode) {
const room = rooms[roomCode];

if (!room || !room.auction) return;

room.players.forEach(player => {

    const nextBid =
        room.auction.currentBid + 50;

    const canBid =
        player.id !== room.auction.highestBidder &&
        player.team.length < 5 &&
        player.balance >= nextBid;

    io.to(player.id).emit("auctionUpdate", {
        character: room.auction.character,
        currentBid: room.auction.currentBid,
        highestBidder:
            room.auction.highestBidderName,
        highestBidderId:
            room.auction.highestBidder,
        timeLeft:
            room.auction.timeLeft,
        myBalance:
            player.balance,
        myTeam:
            player.team,
        myTeamCount:
            player.team.length,
        canBid,
        players:
            publicPlayers(room)
    });
});

}

function startNextAuction(roomCode) {

const room = rooms[roomCode];

if (!room) return;

stopAuctionTimer(room);

if (room.auctionIndex >= characters.length) {

    io.to(roomCode).emit("auctionFinished", {
        ranking: room.players
            .map(p => ({
                name: p.name,
                balance: p.balance,
                team: p.team,
                teamCount: p.team.length
            }))
            .sort((a, b) => b.teamCount - a.teamCount)
    });

    room.auction = null;

    return;
}

room.auction = {
    character: characters[room.auctionIndex],
    currentBid: 0,
    highestBidder: null,
    highestBidderName: null,
    timeLeft: 15
};

sendAuction(roomCode);

room.auctionTimer = setInterval(() => {

    if (!room.auction) {
        stopAuctionTimer(room);
        return;
    }

    room.auction.timeLeft--;

    sendAuction(roomCode);

    if (room.auction.timeLeft <= 0) {
        finishAuction(roomCode);
    }

}, 1000);

}

function finishAuction(roomCode) {

const room = rooms[roomCode];

if (!room || !room.auction) return;

stopAuctionTimer(room);

const auction = room.auction;

if (!auction.highestBidder) {

    io.to(roomCode).emit("auctionResult", {
        character: auction.character,
        sold: false,
        winner: null,
        bid: 0
    });

} else {

    const winner = room.players.find(
        p => p.id === auction.highestBidder
    );

    if (winner) {

        winner.balance -= auction.currentBid;
        winner.team.push(auction.character);

        io.to(roomCode).emit("auctionResult", {
            character: auction.character,
            sold: true,
            winner: winner.name,
            bid: auction.currentBid
        });
    }
}

room.auction = null;
room.auctionIndex++;

sendPlayers(roomCode);

setTimeout(() => {
    startNextAuction(roomCode);
}, 2000);

}

io.on("connection", socket => {

console.log("Player connected:", socket.id);

socket.on("createRoom", data => {

    const name = String(
        data?.playerName || ""
    ).trim();

    if (!name) {
        socket.emit("roomError", "Enter your name.");
        return;
    }

    const game =
        data?.game === "auction"
            ? "auction"
            : "rank";

    const roomCode = makeRoomCode();

    rooms[roomCode] = {
        host: socket.id,
        game,
        players: [],
        rankCategory: 0,
        rankAnswers: {},
        auctionIndex: 0,
        auction: null,
        auctionTimer: null
    };

    addPlayer(
        roomCode,
        socket,
        name
    );

    socket.emit("roomCreated", {
        roomCode,
        game,
        players:
            publicPlayers(
                rooms[roomCode]
            )
    });

    sendPlayers(roomCode);
});

socket.on("joinRoom", data => {

    const name = String(
        data?.playerName || ""
    ).trim();

    const roomCode = String(
        data?.roomCode || ""
    ).trim().toUpperCase();

    const room = rooms[roomCode];

    if (!name) {
        socket.emit(
            "roomError",
            "Enter your name."
        );
        return;
    }

    if (!room) {
        socket.emit(
            "roomError",
            "Room not found."
        );
        return;
    }

    if (room.players.length >= 6) {
        socket.emit(
            "roomError",
            "Room is full. Maximum 6 players."
        );
        return;
    }

    if (
        room.players.some(
            p =>
                p.name.toLowerCase() ===
                name.toLowerCase()
        )
    ) {
        socket.emit(
            "roomError",
            "Name already used."
        );
        return;
    }

    if (
        room.auction ||
        room.rankCategory > 0
    ) {
        socket.emit(
            "roomError",
            "Game already started."
        );
        return;
    }

    addPlayer(
        roomCode,
        socket,
        name
    );

    socket.emit("roomJoined", {
        roomCode,
        game: room.game,
        players:
            publicPlayers(room)
    });

    sendPlayers(roomCode);
});

socket.on("startGame", data => {

    const roomCode = String(
        data?.roomCode || ""
    ).toUpperCase();

    const room = rooms[roomCode];

    if (!room) return;

    if (socket.id !== room.host) {

        socket.emit(
            "roomError",
            "Only the host can start the game."
        );

        return;
    }

    if (room.players.length < 2) {

        socket.emit(
            "roomError",
            "At least 2 players are required."
        );

        return;
    }

    if (room.game === "auction") {

        room.auctionIndex = 0;

        startNextAuction(roomCode);

    } else {

        room.rankCategory = 0;
        room.rankAnswers = {};

        io.to(roomCode).emit(
            "gameStarted",
            {
                game: "rank",
                category: 0,
                categoryName: categories[0]
            }
        );
    }
});

socket.on("auctionBid", data => {

    const roomCode = String(
        data?.roomCode || ""
    ).toUpperCase();

    const room = rooms[roomCode];

    if (!room || !room.auction) return;

    const player = room.players.find(
        p => p.id === socket.id
    );

    if (!player) return;

    if (
        player.id ===
        room.auction.highestBidder
    ) {
        return;
    }

    if (player.team.length >= 5) {

        socket.emit(
            "roomError",
            "You already have 5 characters."
        );

        return;
    }

    const newBid =
        room.auction.currentBid + 50;

    if (player.balance < newBid) {

        socket.emit(
            "roomError",
            "Not enough balance."
        );

        return;
    }

    room.auction.currentBid = newBid;

    room.auction.highestBidder =
        player.id;

    room.auction.highestBidderName =
        player.name;

    // IMPORTANT:
    // Every new bid resets timer to 15.
    room.auction.timeLeft = 15;

    sendAuction(roomCode);
});

socket.on("submitRank", data => {

    const roomCode = String(
        data?.roomCode || ""
    ).toUpperCase();

    const room = rooms[roomCode];

    if (!room) return;

    const player = room.players.find(
        p => p.id === socket.id
    );

    if (!player) return;

    const category =
        Number(data.category);

    if (
        category !==
        room.rankCategory
    ) return;

    if (
        room.rankAnswers[socket.id]
    ) return;

    room.rankAnswers[socket.id] = {
        player: player.name,
        option: String(
            data.option || ""
        )
    };

    const count =
        Object.keys(
            room.rankAnswers
        ).length;

    io.to(roomCode).emit(
        "rankProgress",
        {
            submitted: count,
            total: room.players.length
        }
    );

    if (
        count ===
        room.players.length
    ) {

        io.to(roomCode).emit(
            "rankResult",
            {
                category:
                    categories[
                        room.rankCategory
                    ],
                players:
                    Object.values(
                        room.rankAnswers
                    )
            }
        );
    }
});

socket.on(
    "nextRankCategory",
    data => {

        const roomCode = String(
            data?.roomCode || ""
        ).toUpperCase();

        const room = rooms[roomCode];

        if (!room) return;

        if (socket.id !== room.host)
            return;

        room.rankCategory++;
        room.rankAnswers = {};

        if (
            room.rankCategory >=
            categories.length
        ) {

            io.to(roomCode).emit(
                "rankFinished",
                {
                    players:
                        publicPlayers(room)
                }
            );

            return;
        }

        io.to(roomCode).emit(
            "nextRankCategory",
            {
                category:
                    room.rankCategory,
                categoryName:
                    categories[
                        room.rankCategory
                    ]
            }
        );
    }
);

socket.on("disconnect", () => {

    const roomCode =
        socket.data.roomCode;

    if (!roomCode) return;

    const room =
        rooms[roomCode];

    if (!room) return;

    room.players =
        room.players.filter(
            p => p.id !== socket.id
        );

    if (room.players.length === 0) {

        stopAuctionTimer(room);

        delete rooms[roomCode];

        return;
    }

    if (room.host === socket.id) {

        room.host =
            room.players[0].id;
    }

    sendPlayers(roomCode);
});

});

server.listen(
PORT,
"0.0.0.0",
() => {
console.log(
"Naruto server running on port ${PORT}"
);
}
);
