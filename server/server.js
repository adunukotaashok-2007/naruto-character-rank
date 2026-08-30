const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
cors: {
origin: "*",
methods: ["GET", "POST"]
}
});

const PORT = process.env.PORT || 3000;

const rooms = {};

const auctionCharacters = [
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
{
name: "🧬 Talent",
order: ["Naruto", "Sasuke", "Itachi", "Minato", "Kakashi"]
},
{
name: "💪 Body",
order: ["Guy", "Lee", "Madara", "Hashirama", "Naruto"]
},
{
name: "🧠 Mind / IQ",
order: ["Shikamaru", "Itachi", "Tobirama", "Minato", "Kakashi"]
},
{
name: "🩸 Clan",
order: ["Uzumaki", "Senju", "Uchiha", "Hyuga", "Nara"]
},
{
name: "🔵 Chakra",
order: ["Naruto", "Hashirama", "Madara", "Nagato", "Kisame"]
},
{
name: "👨‍🏫 Sensei",
order: ["Jiraiya", "Kakashi", "Guy", "Orochimaru", "Hiruzen"]
},
{
name: "🥋 Taijutsu",
order: ["Guy", "Lee", "Neji", "Naruto", "Sasuke"]
},
{
name: "🌀 Ninjutsu",
order: ["Naruto", "Sasuke", "Minato", "Tobirama", "Kakashi"]
},
{
name: "🔥 Kekkei Genkai",
order: ["Hashirama", "Sasuke", "Madara", "Gaara", "Naruto"]
},
{
name: "⚡ Speed",
order: ["Minato", "Naruto", "Tobirama", "Sasuke", "Guy"]
},
{
name: "💥 Strength",
order: ["Guy", "Hashirama", "Madara", "Naruto", "Sakura"]
},
{
name: "🎯 Battle IQ",
order: ["Itachi", "Shikamaru", "Minato", "Kakashi", "Tobirama"]
},
{
name: "👻 Genjutsu",
order: ["Itachi", "Sasuke", "Madara", "Obito", "Kakashi"]
},
{
name: "🌪️ Chakra Nature",
order: ["Naruto", "Sasuke", "Kakashi", "Hashirama", "Gaara"]
},
{
name: "🐉 Tailed Beast",
order: ["Naruto", "Obito", "Gaara", "Madara", "Nagato"]
},
{
name: "❤️ Healing",
order: ["Sakura", "Naruto", "Hashirama", "Orochimaru", "Kakashi"]
}
];

function makeRoomCode() {
let code;

```
do {
    code = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
} while (rooms[code]);

return code;
```

}

function getPlayers(room) {
return room.players.map(player => ({
id: player.id,
name: player.name,
balance: player.balance,
team: player.team
}));
}

function sendPlayers(roomCode) {
const room = rooms[roomCode];

```
if (!room) {
    return;
}

io.to(roomCode).emit("playersUpdated", {
    players: getPlayers(room)
});
```

}

function sendAuctionState(roomCode) {
const room = rooms[roomCode];

```
if (!room) {
    return;
}

const highestPlayer = room.players.find(
    player => player.id === room.highestBidder
);

room.players.forEach(player => {
    io.to(player.id).emit("auctionUpdate", {
        character: room.auctionCharacter,
        currentBid: room.currentBid,
        highestBidder: highestPlayer
            ? highestPlayer.name
            : null,
        time: room.time,
        myBalance: player.balance,
        myTeamCount: player.team.length,
        players: room.players.map(p => ({
            name: p.name,
            balance: p.balance,
            teamCount: p.team.length
        }))
    });
});
```

}

function startAuction(roomCode) {
const room = rooms[roomCode];

```
if (!room) {
    return;
}

if (room.auctionIndex >= auctionCharacters.length) {
    finishAuction(roomCode);
    return;
}

room.auctionCharacter =
    auctionCharacters[room.auctionIndex];

room.currentBid = 0;
room.highestBidder = null;
room.time = 10;

sendAuctionState(roomCode);

clearInterval(room.timer);

room.timer = setInterval(() => {
    room.time--;

    sendAuctionState(roomCode);

    if (room.time <= 0) {
        clearInterval(room.timer);
        finishAuctionRound(roomCode);
    }
}, 1000);
```

}

function finishAuctionRound(roomCode) {
const room = rooms[roomCode];

```
if (!room) {
    return;
}

const winner = room.players.find(
    player => player.id === room.highestBidder
);

if (winner) {
    winner.balance -= room.currentBid;
    winner.team.push(room.auctionCharacter);
}

io.to(roomCode).emit("auctionResult", {
    winner: winner ? winner.name : null,
    character: room.auctionCharacter,
    bid: room.currentBid
});
```

}

function finishAuction(roomCode) {
const room = rooms[roomCode];

```
if (!room) {
    return;
}

clearInterval(room.timer);

io.to(roomCode).emit("finalResults", {
    players: getPlayers(room)
});
```

}

function sendRankResult(roomCode, categoryIndex) {
const room = rooms[roomCode];

```
if (!room) {
    return;
}

const category = categories[categoryIndex];

const answers = room.answers[categoryIndex] || {};

const players = room.players.map(player => ({
    player: player.name,
    option: answers[player.id] || "No answer"
}));

players.sort((a, b) => {
    let aRank = category.order.indexOf(a.option);
    let bRank = category.order.indexOf(b.option);

    if (aRank === -1) {
        aRank = 999;
    }

    if (bRank === -1) {
        bRank = 999;
    }

    return aRank - bRank;
});

io.to(roomCode).emit("rankResult", {
    category: category.name,
    players: players
});
```

}

app.get("/", (req, res) => {
res.send("Naruto Character Games Server is running!");
});

io.on("connection", socket => {
console.log("Player connected:", socket.id);

```
socket.on("createRoom", data => {
    const playerName = String(data.playerName || "").trim();
    const game = data.game;

    if (!playerName) {
        socket.emit("roomError", "Enter your name.");
        return;
    }

    const roomCode = makeRoomCode();

    rooms[roomCode] = {
        host: socket.id,
        game: game,
        started: false,

        players: [
            {
                id: socket.id,
                name: playerName,
                balance: 1000,
                team: []
            }
        ],

        currentCategory: 0,
        answers: {},

        auctionIndex: 0,
        auctionCharacter: null,
        currentBid: 0,
        highestBidder: null,
        timer: null,
        time: 10
    };

    socket.join(roomCode);

    socket.emit("roomCreated", {
        roomCode: roomCode,
        players: getPlayers(rooms[roomCode])
    });
});

socket.on("joinRoom", data => {
    const roomCode =
        String(data.roomCode || "").trim().toUpperCase();

    const playerName =
        String(data.playerName || "").trim();

    const game = data.game;

    const room = rooms[roomCode];

    if (!room) {
        socket.emit("roomError", "Room not found.");
        return;
    }

    if (room.started) {
        socket.emit("roomError", "Game already started.");
        return;
    }

    if (room.game !== game) {
        socket.emit(
            "roomError",
            "This room belongs to another game."
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

    if (!playerName) {
        socket.emit("roomError", "Enter your name.");
        return;
    }

    room.players.push({
        id: socket.id,
        name: playerName,
        balance: 1000,
        team: []
    });

    socket.join(roomCode);

    socket.emit("roomJoined", {
        roomCode: roomCode,
        players: getPlayers(room)
    });

    sendPlayers(roomCode);
});

socket.on("startGame", data => {
    const roomCode = data.roomCode;
    const room = rooms[roomCode];

    if (!room) {
        return;
    }

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

    room.started = true;

    io.to(roomCode).emit("gameStarted");

    if (room.game === "auction") {
        startAuction(roomCode);
    }
});

socket.on("submitRank", data => {
    const roomCode = data.roomCode;
    const category = Number(data.category);
    const option = data.option;

    const room = rooms[roomCode];

    if (!room) {
        return;
    }

    if (!room.answers[category]) {
        room.answers[category] = {};
    }

    room.answers[category][socket.id] = option;

    const submitted =
        Object.keys(room.answers[category]).length;

    io.to(roomCode).emit("rankProgress", {
        submitted: submitted,
        total: room.players.length
    });

    if (submitted >= room.players.length) {
        sendRankResult(roomCode, category);
    }
});

socket.on("nextRankCategory", data => {
    const roomCode = data.roomCode;
    const room = rooms[roomCode];

    if (!room) {
        return;
    }

    if (socket.id !== room.host) {
        return;
    }

    room.currentCategory++;

    if (room.currentCategory >= categories.length) {
        io.to(roomCode).emit("finalResults", {
            players: getPlayers(room)
        });
        return;
    }

    io.to(roomCode).emit("nextRankCategory", {
        category: room.currentCategory
    });
});

socket.on("bid", data => {
    const roomCode = data.roomCode;
    const amount = Number(data.amount);

    const room = rooms[roomCode];

    if (!room) {
        return;
    }

    const player = room.players.find(
        p => p.id === socket.id
    );

    if (!player) {
        return;
    }

    if (player.team.length >= 5) {
        socket.emit(
            "roomError",
            "Your team already has 5 characters."
        );
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        return;
    }

    const newBid =
        room.currentBid + amount;

    if (newBid > player.balance) {
        socket.emit(
            "roomError",
            "You don't have enough coins."
        );
        return;
    }

    room.currentBid = newBid;
    room.highestBidder = socket.id;

    sendAuctionState(roomCode);
});

socket.on("nextAuction", data => {
    const roomCode = data.roomCode;
    const room = rooms[roomCode];

    if (!room) {
        return;
    }

    if (socket.id !== room.host) {
        return;
    }

    room.auctionIndex++;

    if (
        room.auctionIndex >=
        auctionCharacters.length
    ) {
        finishAuction(roomCode);
        return;
    }

    startAuction(roomCode);
});

socket.on("disconnect", () => {
    for (const roomCode of Object.keys(rooms)) {
        const room = rooms[roomCode];

        const index = room.players.findIndex(
            player => player.id === socket.id
        );

        if (index === -1) {
            continue;
        }

        room.players.splice(index, 1);

        if (room.players.length === 0) {
            clearInterval(room.timer);
            delete rooms[roomCode];
            continue;
        }

        if (room.host === socket.id) {
            room.host = room.players[0].id;
        }

        sendPlayers(roomCode);
    }

    console.log(
        "Player disconnected:",
        socket.id
    );
});
```

});

server.listen(PORT, () => {
console.log(
`Naruto Character Games server running on port ${PORT}`
);
});
