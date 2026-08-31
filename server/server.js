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
   GAME STORAGE
========================================================= */

const rooms = new Map();

/* =========================================================
   16 RANKING CATEGORIES
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

const TOTAL_CATEGORIES = CATEGORIES.length;

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
   CHARACTER AI SCORES

   These are internal game ratings used to calculate
   the final "AI" recommendation.

   1 - 100
========================================================= */

const AI_SCORES = {

    "Naruto": {
        Speed: 95,
        Strength: 98,
        "Battle IQ": 90,
        Durability: 98,
        Chakra: 100,
        Ninjutsu: 98,
        Taijutsu: 90,
        Genjutsu: 55,
        Defense: 95,
        Attack: 99,
        Stamina: 100,
        Leadership: 98,
        Versatility: 98,
        Experience: 90,
        Teamwork: 98,
        "Overall Power": 99
    },

    "Sasuke": {
        Speed: 96,
        Strength: 95,
        "Battle IQ": 96,
        Durability: 90,
        Chakra: 96,
        Ninjutsu: 99,
        Taijutsu: 92,
        Genjutsu: 98,
        Defense: 90,
        Attack: 99,
        Stamina: 91,
        Leadership: 85,
        Versatility: 99,
        Experience: 91,
        Teamwork: 82,
        "Overall Power": 98
    },

    "Itachi": {
        Speed: 90,
        Strength: 85,
        "Battle IQ": 99,
        Durability: 82,
        Chakra: 88,
        Ninjutsu: 98,
        Taijutsu: 90,
        Genjutsu: 100,
        Defense: 88,
        Attack: 97,
        Stamina: 75,
        Leadership: 88,
        Versatility: 98,
        Experience: 94,
        Teamwork: 92,
        "Overall Power": 96
    },

    "Madara": {
        Speed: 96,
        Strength: 100,
        "Battle IQ": 99,
        Durability: 100,
        Chakra: 100,
        Ninjutsu: 100,
        Taijutsu: 96,
        Genjutsu: 98,
        Defense: 98,
        Attack: 100,
        Stamina: 100,
        Leadership: 96,
        Versatility: 100,
        Experience: 100,
        Teamwork: 75,
        "Overall Power": 100
    },

    "Kakashi": {
        Speed: 91,
        Strength: 82,
        "Battle IQ": 98,
        Durability: 78,
        Chakra: 80,
        Ninjutsu: 98,
        Taijutsu: 88,
        Genjutsu: 82,
        Defense: 86,
        Attack: 90,
        Stamina: 78,
        Leadership: 94,
        Versatility: 100,
        Experience: 96,
        Teamwork: 98,
        "Overall Power": 91
    },

    "Minato": {
        Speed: 100,
        Strength: 88,
        "Battle IQ": 99,
        Durability: 84,
        Chakra: 94,
        Ninjutsu: 98,
        Taijutsu: 88,
        Genjutsu: 75,
        Defense: 92,
        Attack: 97,
        Stamina: 94,
        Leadership: 98,
        Versatility: 98,
        Experience: 92,
        Teamwork: 98,
        "Overall Power": 97
    },

    "Tobirama": {
        Speed: 98,
        Strength: 88,
        "Battle IQ": 99,
        Durability: 87,
        Chakra: 94,
        Ninjutsu: 100,
        Taijutsu: 90,
        Genjutsu: 70,
        Defense: 92,
        Attack: 96,
        Stamina: 95,
        Leadership: 96,
        Versatility: 99,
        Experience: 99,
        Teamwork: 91,
        "Overall Power": 96
    },

    "Hashirama": {
        Speed: 90,
        Strength: 100,
        "Battle IQ": 96,
        Durability: 100,
        Chakra: 100,
        Ninjutsu: 100,
        Taijutsu: 94,
        Genjutsu: 70,
        Defense: 100,
        Attack: 99,
        Stamina: 100,
        Leadership: 100,
        Versatility: 98,
        Experience: 96,
        Teamwork: 99,
        "Overall Power": 99
    },

    "Jiraiya": {
        Speed: 82,
        Strength: 88,
        "Battle IQ": 95,
        Durability: 90,
        Chakra: 96,
        Ninjutsu: 97,
        Taijutsu: 86,
        Genjutsu: 72,
        Defense: 88,
        Attack: 94,
        Stamina: 94,
        Leadership: 91,
        Versatility: 98,
        Experience: 98,
        Teamwork: 95,
        "Overall Power": 92
    },

    "Hiruzen": {
        Speed: 80,
        Strength: 84,
        "Battle IQ": 96,
        Durability: 85,
        Chakra: 94,
        Ninjutsu: 99,
        Taijutsu: 82,
        Genjutsu: 90,
        Defense: 90,
        Attack: 94,
        Stamina: 88,
        Leadership: 99,
        Versatility: 100,
        Experience: 100,
        Teamwork: 96,
        "Overall Power": 91
    },

    "Orochimaru": {
        Speed: 80,
        Strength: 82,
        "Battle IQ": 98,
        Durability: 96,
        Chakra: 95,
        Ninjutsu: 100,
        Taijutsu: 70,
        Genjutsu: 80,
        Defense: 95,
        Attack: 93,
        Stamina: 99,
        Leadership: 72,
        Versatility: 100,
        Experience: 100,
        Teamwork: 60,
        "Overall Power": 92
    },

    "Might Guy": {
        Speed: 99,
        Strength: 100,
        "Battle IQ": 91,
        Durability: 98,
        Chakra: 82,
        Ninjutsu: 25,
        Taijutsu: 100,
        Genjutsu: 20,
        Defense: 91,
        Attack: 100,
        Stamina: 98,
        Leadership: 88,
        Versatility: 55,
        Experience: 90,
        Teamwork: 94,
        "Overall Power": 96
    },

    "Rock Lee": {
        Speed: 96,
        Strength: 94,
        "Battle IQ": 82,
        Durability: 90,
        Chakra: 72,
        Ninjutsu: 20,
        Taijutsu: 99,
        Genjutsu: 15,
        Defense: 82,
        Attack: 95,
        Stamina: 95,
        Leadership: 75,
        Versatility: 40,
        Experience: 78,
        Teamwork: 90,
        "Overall Power": 85
    },

    "Shikamaru": {
        Speed: 65,
        Strength: 55,
        "Battle IQ": 100,
        Durability: 60,
        Chakra: 72,
        Ninjutsu: 82,
        Taijutsu: 55,
        Genjutsu: 65,
        Defense: 75,
        Attack: 70,
        Stamina: 65,
        Leadership: 95,
        Versatility: 88,
        Experience: 80,
        Teamwork: 98,
        "Overall Power": 72
    },

    "Neji": {
        Speed: 86,
        Strength: 80,
        "Battle IQ": 88,
        Durability: 80,
        Chakra: 82,
        Ninjutsu: 78,
        Taijutsu: 98,
        Genjutsu: 55,
        Defense: 96,
        Attack: 88,
        Stamina: 78,
        Leadership: 70,
        Versatility: 78,
        Experience: 75,
        Teamwork: 80,
        "Overall Power": 82
    },

    "Gaara": {
        Speed: 72,
        Strength: 82,
        "Battle IQ": 88,
        Durability: 96,
        Chakra: 94,
        Ninjutsu: 96,
        Taijutsu: 55,
        Genjutsu: 45,
        Defense: 100,
        Attack: 92,
        Stamina: 90,
        Leadership: 94,
        Versatility: 90,
        Experience: 80,
        Teamwork: 91,
        "Overall Power": 88
    },

    "Kisame": {
        Speed: 76,
        Strength: 95,
        "Battle IQ": 84,
        Durability: 96,
        Chakra: 99,
        Ninjutsu: 88,
        Taijutsu: 85,
        Genjutsu: 35,
        Defense: 92,
        Attack: 94,
        Stamina: 100,
        Leadership: 70,
        Versatility: 72,
        Experience: 85,
        Teamwork: 78,
        "Overall Power": 87
    },

    "Sakura": {
        Speed: 78,
        Strength: 96,
        "Battle IQ": 82,
        Durability: 90,
        Chakra: 88,
        Ninjutsu: 90,
        Taijutsu: 92,
        Genjutsu: 50,
        Defense: 85,
        Attack: 95,
        Stamina: 88,
        Leadership: 80,
        Versatility: 80,
        Experience: 75,
        Teamwork: 92,
        "Overall Power": 82
    },

    "Nagato": {
        Speed: 82,
        Strength: 94,
        "Battle IQ": 97,
        Durability: 90,
        Chakra: 100,
        Ninjutsu: 100,
        Taijutsu: 72,
        Genjutsu: 55,
        Defense: 96,
        Attack: 99,
        Stamina: 98,
        Leadership: 92,
        Versatility: 99,
        Experience: 90,
        Teamwork: 82,
        "Overall Power": 97
    },

    "Obito": {
        Speed: 94,
        Strength: 90,
        "Battle IQ": 95,
        Durability: 94,
        Chakra: 97,
        Ninjutsu: 98,
        Taijutsu: 88,
        Genjutsu: 90,
        Defense: 96,
        Attack: 97,
        Stamina: 95,
        Leadership: 82,
        Versatility: 98,
        Experience: 91,
        Teamwork: 75,
        "Overall Power": 95
    },

    "Tsunade": {
        Speed: 72,
        Strength: 100,
        "Battle IQ": 86,
        Durability: 99,
        Chakra: 94,
        Ninjutsu: 88,
        Taijutsu: 94,
        Genjutsu: 35,
        Defense: 95,
        Attack: 98,
        Stamina: 95,
        Leadership: 96,
        Versatility: 78,
        Experience: 95,
        Teamwork: 94,
        "Overall Power": 88
    },

    "Killer B": {
        Speed: 88,
        Strength: 94,
        "Battle IQ": 88,
        Durability: 94,
        Chakra: 98,
        Ninjutsu: 90,
        Taijutsu: 95,
        Genjutsu: 40,
        Defense: 90,
        Attack: 96,
        Stamina: 97,
        Leadership: 80,
        Versatility: 82,
        Experience: 85,
        Teamwork: 88,
        "Overall Power": 90
    },

    "Kabuto": {
        Speed: 82,
        Strength: 78,
        "Battle IQ": 96,
        Durability: 91,
        Chakra: 94,
        Ninjutsu: 97,
        Taijutsu: 80,
        Genjutsu: 70,
        Defense: 88,
        Attack: 91,
        Stamina: 94,
        Leadership: 65,
        Versatility: 98,
        Experience: 88,
        Teamwork: 60,
        "Overall Power": 89
    },

    "Shisui": {
        Speed: 98,
        Strength: 80,
        "Battle IQ": 94,
        Durability: 75,
        Chakra: 85,
        Ninjutsu: 91,
        Taijutsu: 88,
        Genjutsu: 100,
        Defense: 82,
        Attack: 92,
        Stamina: 78,
        Leadership: 85,
        Versatility: 90,
        Experience: 82,
        Teamwork: 90,
        "Overall Power": 91
    },

    "Sakumo": {
        Speed: 91,
        Strength: 90,
        "Battle IQ": 94,
        Durability: 82,
        Chakra: 82,
        Ninjutsu: 80,
        Taijutsu: 95,
        Genjutsu: 50,
        Defense: 84,
        Attack: 96,
        Stamina: 85,
        Leadership: 86,
        Versatility: 78,
        Experience: 90,
        Teamwork: 90,
        "Overall Power": 87
    },

    "Hanzo": {
        Speed: 84,
        Strength: 82,
        "Battle IQ": 91,
        Durability: 88,
        Chakra: 90,
        Ninjutsu: 92,
        Taijutsu: 78,
        Genjutsu: 45,
        Defense: 87,
        Attack: 92,
        Stamina: 92,
        Leadership: 82,
        Versatility: 84,
        Experience: 96,
        Teamwork: 65,
        "Overall Power": 87
    },

    "Third Raikage": {
        Speed: 93,
        Strength: 99,
        "Battle IQ": 90,
        Durability: 100,
        Chakra: 92,
        Ninjutsu: 80,
        Taijutsu: 99,
        Genjutsu: 20,
        Defense: 100,
        Attack: 97,
        Stamina: 100,
        Leadership: 88,
        Versatility: 65,
        Experience: 94,
        Teamwork: 82,
        "Overall Power": 93
    },

    "Fourth Raikage": {
        Speed: 98,
        Strength: 96,
        "Battle IQ": 84,
        Durability: 96,
        Chakra: 90,
        Ninjutsu: 65,
        Taijutsu: 98,
        Genjutsu: 15,
        Defense: 94,
        Attack: 96,
        Stamina: 94,
        Leadership: 85,
        Versatility: 55,
        Experience: 82,
        Teamwork: 84,
        "Overall Power": 88
    },

    "Onoki": {
        Speed: 70,
        Strength: 62,
        "Battle IQ": 94,
        Durability: 70,
        Chakra: 82,
        Ninjutsu: 99,
        Taijutsu: 50,
        Genjutsu: 40,
        Defense: 85,
        Attack: 99,
        Stamina: 65,
        Leadership: 96,
        Versatility: 92,
        Experience: 100,
        Teamwork: 88,
        "Overall Power": 86
    },

    "Mei Terumi": {
        Speed: 68,
        Strength: 62,
        "Battle IQ": 78,
        Durability: 70,
        Chakra: 86,
        Ninjutsu: 94,
        Taijutsu: 50,
        Genjutsu: 45,
        Defense: 74,
        Attack: 91,
        Stamina: 76,
        Leadership: 87,
        Versatility: 82,
        Experience: 80,
        Teamwork: 86,
        "Overall Power": 78
    },

    "Sasori": {
        Speed: 75,
        Strength: 76,
        "Battle IQ": 92,
        Durability: 88,
        Chakra: 86,
        Ninjutsu: 94,
        Taijutsu: 55,
        Genjutsu: 40,
        Defense: 92,
        Attack: 94,
        Stamina: 90,
        Leadership: 65,
        Versatility: 95,
        Experience: 88,
        Teamwork: 50,
        "Overall Power": 85
    },

    "Deidara": {
        Speed: 78,
        Strength: 72,
        "Battle IQ": 88,
        Durability: 68,
        Chakra: 90,
        Ninjutsu: 96,
        Taijutsu: 45,
        Genjutsu: 35,
        Defense: 70,
        Attack: 98,
        Stamina: 82,
        Leadership: 55,
        Versatility: 90,
        Experience: 80,
        Teamwork: 45,
        "Overall Power": 84
    },

    "Mū": {
        Speed: 88,
        Strength: 78,
        "Battle IQ": 94,
        Durability: 82,
        Chakra: 92,
        Ninjutsu: 98,
        Taijutsu: 60,
        Genjutsu: 30,
        Defense: 90,
        Attack: 97,
        Stamina: 85,
        Leadership: 82,
        Versatility: 96,
        Experience: 98,
        Teamwork: 75,
        "Overall Power": 91
    },

    "Gengetsu Hozuki": {
        Speed: 80,
        Strength: 75,
        "Battle IQ": 92,
        Durability: 88,
        Chakra: 94,
        Ninjutsu: 96,
        Taijutsu: 68,
        Genjutsu: 30,
        Defense: 88,
        Attack: 94,
        Stamina: 90,
        Leadership: 84,
        Versatility: 93,
        Experience: 95,
        Teamwork: 74,
        "Overall Power": 88
    },

    "Danzo": {
        Speed: 72,
        Strength: 72,
        "Battle IQ": 90,
        Durability: 82,
        Chakra: 86,
        Ninjutsu: 90,
        Taijutsu: 68,
        Genjutsu: 70,
        Defense: 84,
        Attack: 88,
        Stamina: 86,
        Leadership: 82,
        Versatility: 88,
        Experience: 94,
        Teamwork: 40,
        "Overall Power": 80
    },

    "Kakuzu": {
        Speed: 70,
        Strength: 88,
        "Battle IQ": 82,
        Durability: 98,
        Chakra: 92,
        Ninjutsu: 94,
        Taijutsu: 78,
        Genjutsu: 25,
        Defense: 96,
        Attack: 92,
        Stamina: 100,
        Leadership: 45,
        Versatility: 90,
        Experience: 96,
        Teamwork: 35,
        "Overall Power": 84
    },

    "Hidan": {
        Speed: 65,
        Strength: 80,
        "Battle IQ": 65,
        Durability: 95,
        Chakra: 70,
        Ninjutsu: 45,
        Taijutsu: 82,
        Genjutsu: 20,
        Defense: 90,
        Attack: 88,
        Stamina: 100,
        Leadership: 30,
        Versatility: 45,
        Experience: 70,
        Teamwork: 25,
        "Overall Power": 68
    },

    "Konan": {
        Speed: 72,
        Strength: 62,
        "Battle IQ": 86,
        Durability: 70,
        Chakra: 85,
        Ninjutsu: 94,
        Taijutsu: 45,
        Genjutsu: 45,
        Defense: 78,
        Attack: 92,
        Stamina: 82,
        Leadership: 72,
        Versatility: 88,
        Experience: 80,
        Teamwork: 86,
        "Overall Power": 78
    },

    "Zabuza": {
        Speed: 70,
        Strength: 82,
        "Battle IQ": 78,
        Durability: 82,
        Chakra: 76,
        Ninjutsu: 84,
        Taijutsu: 88,
        Genjutsu: 20,
        Defense: 78,
        Attack: 90,
        Stamina: 82,
        Leadership: 60,
        Versatility: 65,
        Experience: 82,
        Teamwork: 65,
        "Overall Power": 75
    },

    "Kimimaro": {
        Speed: 78,
        Strength: 88,
        "Battle IQ": 80,
        Durability: 94,
        Chakra: 78,
        Ninjutsu: 80,
        Taijutsu: 94,
        Genjutsu: 20,
        Defense: 92,
        Attack: 94,
        Stamina: 80,
        Leadership: 45,
        Versatility: 70,
        Experience: 65,
        Teamwork: 40,
        "Overall Power": 80
    },

    "Suigetsu": {
        Speed: 70,
        Strength: 78,
        "Battle IQ": 70,
        Durability: 88,
        Chakra: 72,
        Ninjutsu: 76,
        Taijutsu: 76,
        Genjutsu: 20,
        Defense: 88,
        Attack: 74,
        Stamina: 85,
        Leadership: 35,
        Versatility: 62,
        Experience: 60,
        Teamwork: 62,
        "Overall Power": 66
    },

    "Jugo": {
        Speed: 70,
        Strength: 90,
        "Battle IQ": 62,
        Durability: 90,
        Chakra: 90,
        Ninjutsu: 62,
        Taijutsu: 88,
        Genjutsu: 15,
        Defense: 88,
        Attack: 90,
        Stamina: 90,
        Leadership: 25,
        Versatility: 50,
        Experience: 55,
        Teamwork: 60,
        "Overall Power": 70
    },

    "Karin": {
        Speed: 45,
        Strength: 35,
        "Battle IQ": 65,
        Durability: 45,
        Chakra: 90,
        Ninjutsu: 70,
        Taijutsu: 25,
        Genjutsu: 30,
        Defense: 45,
        Attack: 25,
        Stamina: 60,
        Leadership: 45,
        Versatility: 65,
        Experience: 55,
        Teamwork: 80,
        "Overall Power": 45
    },

    "Yahiko": {
        Speed: 65,
        Strength: 65,
        "Battle IQ": 75,
        Durability: 65,
        Chakra: 68,
        Ninjutsu: 62,
        Taijutsu: 72,
        Genjutsu: 20,
        Defense: 60,
        Attack: 70,
        Stamina: 70,
        Leadership: 92,
        Versatility: 55,
        Experience: 60,
        Teamwork: 95,
        "Overall Power": 60
    },

    "Zetsu": {
        Speed: 55,
        Strength: 40,
        "Battle IQ": 80,
        Durability: 60,
        Chakra: 70,
        Ninjutsu: 65,
        Taijutsu: 25,
        Genjutsu: 20,
        Defense: 55,
        Attack: 35,
        Stamina: 70,
        Leadership: 60,
        Versatility: 80,
        Experience: 90,
        Teamwork: 75,
        "Overall Power": 50
    },

    "Hinata": {
        Speed: 65,
        Strength: 62,
        "Battle IQ": 70,
        Durability: 65,
        Chakra: 75,
        Ninjutsu: 65,
        Taijutsu: 86,
        Genjutsu: 25,
        Defense: 88,
        Attack: 72,
        Stamina: 68,
        Leadership: 60,
        Versatility: 55,
        Experience: 60,
        Teamwork: 90,
        "Overall Power": 62
    },

    "Ino": {
        Speed: 48,
        Strength: 35,
        "Battle IQ": 70,
        Durability: 40,
        Chakra: 68,
        Ninjutsu: 75,
        Taijutsu: 30,
        Genjutsu: 45,
        Defense: 45,
        Attack: 40,
        Stamina: 55,
        Leadership: 65,
        Versatility: 75,
        Experience: 55,
        Teamwork: 94,
        "Overall Power": 48
    },

    "Choji": {
        Speed: 48,
        Strength: 90,
        "Battle IQ": 55,
        Durability: 85,
        Chakra: 72,
        Ninjutsu: 58,
        Taijutsu: 78,
        Genjutsu: 15,
        Defense: 80,
        Attack: 88,
        Stamina: 78,
        Leadership: 45,
        Versatility: 55,
        Experience: 55,
        Teamwork: 85,
        "Overall Power": 60
    },

    "Kiba": {
        Speed: 82,
        Strength: 70,
        "Battle IQ": 60,
        Durability: 60,
        Chakra: 58,
        Ninjutsu: 48,
        Taijutsu: 76,
        Genjutsu: 15,
        Defense: 55,
        Attack: 78,
        Stamina: 72,
        Leadership: 40,
        Versatility: 55,
        Experience: 50,
        Teamwork: 78,
        "Overall Power": 55
    },

    "Shino": {
        Speed: 55,
        Strength: 45,
        "Battle IQ": 82,
        Durability: 58,
        Chakra: 70,
        Ninjutsu: 78,
        Taijutsu: 35,
        Genjutsu: 20,
        Defense: 70,
        Attack: 75,
        Stamina: 75,
        Leadership: 55,
        Versatility: 78,
        Experience: 58,
        Teamwork: 82,
        "Overall Power": 58
    },

    "Tenten": {
        Speed: 60,
        Strength: 45,
        "Battle IQ": 60,
        Durability: 45,
        Chakra: 55,
        Ninjutsu: 60,
        Taijutsu: 55,
        Genjutsu: 20,
        Defense: 45,
        Attack: 70,
        Stamina: 55,
        Leadership: 40,
        Versatility: 70,
        Experience: 55,
        Teamwork: 68,
        "Overall Power": 48
    },

    "Iruka": {
        Speed: 40,
        Strength: 35,
        "Battle IQ": 58,
        Durability: 42,
        Chakra: 45,
        Ninjutsu: 55,
        Taijutsu: 45,
        Genjutsu: 35,
        Defense: 48,
        Attack: 35,
        Stamina: 45,
        Leadership: 65,
        Versatility: 45,
        Experience: 55,
        Teamwork: 80,
        "Overall Power": 38
    },

    "Anko": {
        Speed: 62,
        Strength: 55,
        "Battle IQ": 65,
        Durability: 55,
        Chakra: 65,
        Ninjutsu: 72,
        Taijutsu: 60,
        Genjutsu: 50,
        Defense: 55,
        Attack: 70,
        Stamina: 65,
        Leadership: 55,
        Versatility: 65,
        Experience: 60,
        Teamwork: 65,
        "Overall Power": 52
    },

    "Might Duy": {
        Speed: 88,
        Strength: 88,
        "Battle IQ": 65,
        Durability: 78,
        Chakra: 65,
        Ninjutsu: 15,
        Taijutsu: 96,
        Genjutsu: 10,
        Defense: 72,
        Attack: 92,
        Stamina: 88,
        Leadership: 70,
        Versatility: 25,
        Experience: 55,
        Teamwork: 85,
        "Overall Power": 65
    },

    "Shizune": {
        Speed: 45,
        Strength: 45,
        "Battle IQ": 65,
        Durability: 45,
        Chakra: 70,
        Ninjutsu: 72,
        Taijutsu: 35,
        Genjutsu: 30,
        Defense: 55,
        Attack: 42,
        Stamina: 60,
        Leadership: 55,
        Versatility: 62,
        Experience: 65,
        Teamwork: 80,
        "Overall Power": 45
    },

    "Asuma": {
        Speed: 70,
        Strength: 70,
        "Battle IQ": 78,
        Durability: 65,
        Chakra: 70,
        Ninjutsu: 65,
        Taijutsu: 80,
        Genjutsu: 20,
        Defense: 60,
        Attack: 78,
        Stamina: 70,
        Leadership: 75,
        Versatility: 55,
        Experience: 72,
        Teamwork: 90,
        "Overall Power": 62
    },

    "Kurenai": {
        Speed: 55,
        Strength: 35,
        "Battle IQ": 75,
        Durability: 40,
        Chakra: 65,
        Ninjutsu: 70,
        Taijutsu: 45,
        Genjutsu: 96,
        Defense: 55,
        Attack: 70,
        Stamina: 55,
        Leadership: 62,
        Versatility: 70,
        Experience: 65,
        Teamwork: 72,
        "Overall Power": 58
    },

    "Yamato": {
        Speed: 55,
        Strength: 65,
        "Battle IQ": 78,
        Durability: 70,
        Chakra: 80,
        Ninjutsu: 88,
        Taijutsu: 58,
        Genjutsu: 35,
        Defense: 78,
        Attack: 72,
        Stamina: 78,
        Leadership: 72,
        Versatility: 82,
        Experience: 70,
        Teamwork: 88,
        "Overall Power": 65
    },

    "Sai": {
        Speed: 60,
        Strength: 45,
        "Battle IQ": 75,
        Durability: 50,
        Chakra: 65,
        Ninjutsu: 82,
        Taijutsu: 50,
        Genjutsu: 25,
        Defense: 60,
        Attack: 72,
        Stamina: 65,
        Leadership: 50,
        Versatility: 82,
        Experience: 60,
        Teamwork: 78,
        "Overall Power": 55
    },

    "Konohamaru": {
        Speed: 60,
        Strength: 52,
        "Battle IQ": 62,
        Durability: 55,
        Chakra: 70,
        Ninjutsu: 78,
        Taijutsu: 58,
        Genjutsu: 25,
        Defense: 55,
        Attack: 70,
        Stamina: 62,
        Leadership: 72,
        Versatility: 68,
        Experience: 55,
        Teamwork: 82,
        "Overall Power": 58
    },

    "Chiyo": {
        Speed: 50,
        Strength: 42,
        "Battle IQ": 88,
        Durability: 50,
        Chakra: 65,
        Ninjutsu: 82,
        Taijutsu: 40,
        Genjutsu: 30,
        Defense: 75,
        Attack: 80,
        Stamina: 55,
        Leadership: 72,
        Versatility: 88,
        Experience: 98,
        Teamwork: 88,
        "Overall Power": 62
    },

    "Rasa": {
        Speed: 62,
        Strength: 65,
        "Battle IQ": 72,
        Durability: 68,
        Chakra: 80,
        Ninjutsu: 86,
        Taijutsu: 55,
        Genjutsu: 20,
        Defense: 72,
        Attack: 82,
        Stamina: 75,
        Leadership: 80,
        Versatility: 72,
        Experience: 75,
        Teamwork: 75,
        "Overall Power": 65
    },

    "Darui": {
        Speed: 72,
        Strength: 70,
        "Battle IQ": 78,
        Durability: 72,
        Chakra: 78,
        Ninjutsu: 84,
        Taijutsu: 70,
        Genjutsu: 25,
        Defense: 65,
        Attack: 84,
        Stamina: 75,
        Leadership: 75,
        Versatility: 72,
        Experience: 65,
        Teamwork: 82,
        "Overall Power": 68
    },

    "Chojuro": {
        Speed: 62,
        Strength: 78,
        "Battle IQ": 68,
        Durability: 68,
        Chakra: 72,
        Ninjutsu: 65,
        Taijutsu: 82,
        Genjutsu: 20,
        Defense: 62,
        Attack: 88,
        Stamina: 70,
        Leadership: 70,
        Versatility: 52,
        Experience: 60,
        Teamwork: 80,
        "Overall Power": 65
    },

    "Kurotsuchi": {
        Speed: 65,
        Strength: 70,
        "Battle IQ": 75,
        Durability: 70,
        Chakra: 78,
        Ninjutsu: 86,
        Taijutsu: 60,
        Genjutsu: 20,
        Defense: 70,
        Attack: 82,
        Stamina: 75,
        Leadership: 75,
        Versatility: 72,
        Experience: 65,
        Teamwork: 82,
        "Overall Power": 67
    },

    "Mifune": {
        Speed: 90,
        Strength: 82,
        "Battle IQ": 82,
        Durability: 70,
        Chakra: 20,
        Ninjutsu: 10,
        Taijutsu: 98,
        Genjutsu: 10,
        Defense: 75,
        Attack: 92,
        Stamina: 82,
        Leadership: 88,
        Versatility: 35,
        Experience: 88,
        Teamwork: 78,
        "Overall Power": 70
    },

    "Fu": {
        Speed: 82,
        Strength: 80,
        "Battle IQ": 70,
        Durability: 82,
        Chakra: 92,
        Ninjutsu: 78,
        Taijutsu: 78,
        Genjutsu: 25,
        Defense: 75,
        Attack: 82,
        Stamina: 90,
        Leadership: 50,
        Versatility: 65,
        Experience: 55,
        Teamwork: 65,
        "Overall Power": 70
    },

    "Utakata": {
        Speed: 72,
        Strength: 70,
        "Battle IQ": 75,
        Durability: 80,
        Chakra: 90,
        Ninjutsu: 90,
        Taijutsu: 60,
        Genjutsu: 20,
        Defense: 75,
        Attack: 88,
        Stamina: 88,
        Leadership: 45,
        Versatility: 75,
        Experience: 65,
        Teamwork: 55,
        "Overall Power": 72
    },

    "Roshi": {
        Speed: 65,
        Strength: 88,
        "Battle IQ": 72,
        Durability: 90,
        Chakra: 95,
        Ninjutsu: 85,
        Taijutsu: 78,
        Genjutsu: 20,
        Defense: 88,
        Attack: 90,
        Stamina: 95,
        Leadership: 55,
        Versatility: 65,
        Experience: 70,
        Teamwork: 55,
        "Overall Power": 75
    }
};

/* =========================================================
   FALLBACK AI SCORE
========================================================= */

function getCharacterScore(character, category) {

    if (
        AI_SCORES[character] &&
        typeof AI_SCORES[character][category] === "number"
    ) {
        return AI_SCORES[character][category];
    }

    return 50;
}

/* =========================================================
   AI OVERALL TEAM EVALUATION
========================================================= */

function evaluateTeam(team) {

    if (!team || team.length === 0) {

        return {
            score: 0,
            rating: "No team",
            strengths: [],
            weaknesses: []
        };
    }

    const totals = {};

    CATEGORIES.forEach(category => {
        totals[category] = 0;
    });

    team.forEach(character => {

        CATEGORIES.forEach(category => {

            totals[category] +=
                getCharacterScore(
                    character,
                    category
                );

        });

    });

    const count = team.length;

    const averages = {};

    CATEGORIES.forEach(category => {

        averages[category] =
            Math.round(
                totals[category] / count
            );

    });

    let total = 0;

    CATEGORIES.forEach(category => {
        total += averages[category];
    });

    const score =
        Math.round(
            total / CATEGORIES.length
        );

    const sorted =
        Object.entries(averages)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );

    const strengths =
        sorted
            .slice(0, 3)
            .map(item => item[0]);

    const weaknesses =
        sorted
            .slice(-3)
            .map(item => item[0]);

    let rating;

    if (score >= 95) {
        rating = "S+";
    } else if (score >= 90) {
        rating = "S";
    } else if (score >= 85) {
        rating = "A+";
    } else if (score >= 80) {
        rating = "A";
    } else if (score >= 70) {
        rating = "B";
    } else if (score >= 60) {
        rating = "C";
    } else {
        rating = "D";
    }

    return {
        score,
        rating,
        averages,
        strengths,
        weaknesses
    };
}

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

    } while (rooms.has(code));

    return code;
}

/* =========================================================
   PLAYER DATA
========================================================= */

function getRoomPlayers(room) {

    return Object.values(room.players)
        .map(player => ({
            id: player.id,
            name: player.name,
            balance: player.balance,
            team: player.team,
            rankSelections: player.rankSelections
        }));
}

/* =========================================================
   BROADCAST PLAYERS
========================================================= */

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
   AUCTION STATE
========================================================= */

function getAuctionState(room) {

    const auction =
        room.auction;

    let remainingSeconds =
        auction.remainingSeconds;

    if (
        auction.timerEnd
    ) {

        remainingSeconds =
            Math.max(
                0,
                Math.ceil(
                    (
                        auction.timerEnd -
                        Date.now()
                    ) / 1000
                )
            );

    }

    return {

        index:
            auction.index,

        totalCharacters:
            CHARACTERS.length,

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

        remainingSeconds,

        active:
            auction.active
    };
}

/* =========================================================
   SEND AUCTION STATE
========================================================= */

function broadcastAuction(room) {

    io.to(room.code).emit(
        "auctionUpdated",
        getAuctionState(room)
    );
}

/* =========================================================
   START AUCTION TIMER
========================================================= */

function startAuctionTimer(room) {

    const auction =
        room.auction;

    if (auction.timer) {

        clearTimeout(
            auction.timer
        );
    }

    const seconds =
        Math.max(
            1,
            Number(
                room.settings.bidTime
            ) || 10
        );

    auction.remainingSeconds =
        seconds;

    auction.timerEnd =
        Date.now() +
        seconds * 1000;

    broadcastAuction(room);

    auction.timer =
        setTimeout(
            () => {

                if (
                    !auction.active
                ) {
                    return;
                }

                /*
                 * When timer reaches zero:
                 *
                 * - If somebody bid -> SOLD
                 * - If nobody bid -> UNSOLD
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
            seconds * 1000
        );
}

/* =========================================================
   RANK CATEGORY COMPLETE
========================================================= */

function checkRankCategoryComplete(
    room,
    category
) {

    if (
        category < 0 ||
        category >= TOTAL_CATEGORIES
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

    const complete =
        players.every(
            player =>
                player.rankSelections[
                    category
                ]
        );

    if (!complete) {
        return;
    }

    /*
     * Prevent duplicate completion.
     */

    if (
        room.rank.completedCategories[
            category
        ]
    ) {
        return;
    }

    room.rank.completedCategories[
        category
    ] = true;

    io.to(room.code).emit(
        "rankCategoryComplete",
        {
            categoryIndex: category,
            categoryNumber: category + 1,
            totalCategories: TOTAL_CATEGORIES,
            categoryName:
                CATEGORIES[category]
        }
    );

    setTimeout(
        () => {

            if (
                !rooms.has(room.code)
            ) {
                return;
            }

            /*
             * Last category = index 15
             */

            if (
                category ===
                TOTAL_CATEGORIES - 1
            ) {

                finishRankGame(
                    room
                );

                return;
            }

            const nextCategory =
                category + 1;

            room.rank.categoryIndex =
                nextCategory;

            io.to(room.code).emit(
                "rankNextCategory",
                {
                    categoryIndex:
                        nextCategory,

                    categoryNumber:
                        nextCategory + 1,

                    totalCategories:
                        TOTAL_CATEGORIES,

                    categoryName:
                        CATEGORIES[
                            nextCategory
                        ]
                }
            );

        },
        1000
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

                        categoryIndex: 0,

                        started: false,

                        completedCategories: {}

                    },

                    auction: {

                        index: 0,

                        character: null,

                        currentBid: 0,

                        highestBidder: null,

                        active: false,

                        timer: null,

                        timerEnd: null,

                        remainingSeconds:
                            bidTime
                    }
                };

                room.players[
                    socket.id
                ] = {

                    id:
                        socket.id,

                    name:
                        playerName ||
                        "Player 1",

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
           JOIN ROOM
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
                    rooms.get(
                        roomCode
                    );

                if (!room) {

                    socket.emit(
                        "errorMessage",
                        "Room not found."
                    );

                    return;
                }

                const playerCount =
                    Object.keys(
                        room.players
                    ).length;

                if (
                    playerCount >=
                    room.settings.maxPlayers
                ) {

                    socket.emit(
                        "errorMessage",
                        "Room is full."
                    );

                    return;
                }

                const playerName =
                    String(
                        data.name ||
                        `Player ${playerCount + 1}`
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
                    rooms.get(
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
                    "rank"
                ) {

                    room.rank.started =
                        true;

                    room.rank.categoryIndex =
                        0;

                    room.rank.completedCategories =
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
                            categoryIndex: 0,

                            categoryNumber: 1,

                            totalCategories:
                                TOTAL_CATEGORIES,

                            categoryName:
                                CATEGORIES[0]
                        }
                    );

                } else {

                    startAuction(
                        room
                    );
                }
            }
        );

        /* =================================================
           RANK CHARACTER SELECT
        ================================================= */

        socket.on(
            "rankSelect",
            data => {

                const room =
                    rooms.get(
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

                    socket.emit(
                        "errorMessage",
                        "This category is no longer active."
                    );

                    return;
                }

                if (
                    !CHARACTERS.includes(
                        character
                    )
                ) {
                    return;
                }

                /*
                 * IMPORTANT:
                 *
                 * Same character CAN be selected
                 * by Player 1 and Player 2.
                 */

                player.rankSelections[
                    category
                ] = character;

                io.to(room.code).emit(
                    "rankSelectionMade",
                    {
                        playerId:
                            socket.id,

                        playerName:
                            player.name,

                        categoryIndex:
                            category,

                        categoryNumber:
                            category + 1,

                        totalCategories:
                            TOTAL_CATEGORIES,

                        categoryName:
                            CATEGORIES[
                                category
                            ],

                        character
                    }
                );

                checkRankCategoryComplete(
                    room,
                    category
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
                    rooms.get(
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
                 * Player who already owns this
                 * character cannot bid.
                 */

                if (
                    player.team.includes(
                        auction.character
                    )
                ) {

                    socket.emit(
                        "errorMessage",
                        "You already own this character."
                    );

                    return;
                }

                /*
                 * Player cannot bid if team is full.
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
                 * Highest bidder cannot immediately
                 * bid again.
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
                    player.balance <
                    newBid
                ) {

                    socket.emit(
                        "errorMessage",
                        "Not enough balance."
                    );

                    return;
                }

                auction.currentBid =
                    newBid;

                auction.highestBidder =
                    socket.id;

                /*
                 * IMPORTANT:
                 *
                 * Every successful bid resets
                 * the auction timer to 10 seconds
                 * or whatever the host selected.
                 */

                startAuctionTimer(
                    room
                );

                io.to(room.code).emit(
                    "auctionUpdated",
                    getAuctionState(
                        room
                    )
                );
            }
        );

        /* =================================================
           UNSOLD BUTTON
        ================================================= */

        socket.on(
            "auctionUnsold",
            () => {

                const room =
                    rooms.get(
                        socket.roomCode
                    );

                if (!room) {
                    return;
                }

                if (
                    !room.auction.active
                ) {
                    return;
                }

                /*
                 * Only the HOST can manually
                 * press UNSOLD.
                 */

                if (
                    socket.id !==
                    room.host
                ) {

                    socket.emit(
                        "errorMessage",
                        "Only the host can mark a player unsold."
                    );

                    return;
                }

                /*
                 * Manual UNSOLD is allowed even
                 * if somebody has bid.
                 */

                finishAuctionCharacter(
                    room,
                    true
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

                        if (
                            room.auction.timer
                        ) {

                            clearTimeout(
                                room.auction.timer
                            );
                        }

                        rooms.delete(
                            roomCode
                        );

                        return;
                    }
                }

                /*
                 * If auction is active and the
                 * highest bidder disconnected,
                 * remove their bid.
                 */

                if (
                    room.auction.active &&
                    room.auction.highestBidder ===
                    socket.id
                ) {

                    room.auction.highestBidder =
                        null;

                    room.auction.currentBid =
                        0;

                    startAuctionTimer(
                        room
                    );

                    broadcastAuction(
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
   FINISH RANK GAME
========================================================= */

function finishRankGame(room) {

    room.rank.started =
        false;

    const results =
        Object.values(
            room.players
        ).map(
            player => {

                const selectedCharacters =
                    Object.values(
                        player.rankSelections
                    );

                const evaluation =
                    evaluateTeam(
                        selectedCharacters
                    );

                return {

                    playerId:
                        player.id,

                    playerName:
                        player.name,

                    selections:
                        player.rankSelections,

                    characters:
                        selectedCharacters,

                    aiEvaluation:
                        evaluation
                };
            }
        );

    /*
     * Find best player/team.
     */

    const sorted =
        [...results]
            .sort(
                (a, b) =>
                    b.aiEvaluation.score -
                    a.aiEvaluation.score
            );

    const winner =
        sorted.length
            ? sorted[0]
            : null;

    io.to(room.code).emit(
        "rankGameFinished",
        {
            results,

            bestPlayer:
                winner
                    ? {
                        playerId:
                            winner.playerId,

                        playerName:
                            winner.playerName,

                        score:
                            winner.aiEvaluation
                                .score,

                        rating:
                            winner.aiEvaluation
                                .rating,

                        strengths:
                            winner.aiEvaluation
                                .strengths
                    }
                    : null
        }
    );
}

/* =========================================================
   START AUCTION
========================================================= */

function startAuction(room) {

    room.auction.index =
        0;

    room.auction.active =
        true;

    room.auction.character =
        null;

    room.auction.currentBid =
        0;

    room.auction.highestBidder =
        null;

    Object.values(
        room.players
    ).forEach(
        player => {

            player.balance =
                room.settings
                    .startingBalance;

            player.team =
                [];

        }
    );

    io.to(room.code).emit(
        "auctionStarted",
        {
            settings:
                room.settings,

            totalCharacters:
                CHARACTERS.length
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

    if (
        auction.timer
    ) {

        clearTimeout(
            auction.timer
        );

        auction.timer =
            null;
    }

    /*
     * No more characters.
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

    /*
     * Check whether all teams are full.
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
     * Find next character that can still
     * be useful to at least one player.
     */

    let selectedCharacter =
        null;

    while (
        auction.index <
        CHARACTERS.length
    ) {

        const candidate =
            CHARACTERS[
                auction.index
            ];

        const somebodyNeeds =
            Object.values(
                room.players
            ).some(
                player =>
                    player.team.length <
                    room.settings.teamSize &&
                    !player.team.includes(
                        candidate
                    )
            );

        if (somebodyNeeds) {

            selectedCharacter =
                candidate;

            break;
        }

        auction.index++;
    }

    if (!selectedCharacter) {

        finishAuction(
            room
        );

        return;
    }

    auction.character =
        selectedCharacter;

    auction.currentBid =
        0;

    auction.highestBidder =
        null;

    auction.active =
        true;

    /*
     * Tell clients the new character.
     */

    io.to(room.code).emit(
        "auctionCharacter",
        getAuctionState(
            room
        )
    );

    /*
     * START REAL TIMER.
     */

    startAuctionTimer(
        room
    );

    broadcastAuction(
        room
    );
}

/* =========================================================
   FINISH AUCTION CHARACTER
========================================================= */

function finishAuctionCharacter(
    room,
    forceUnsold = false
) {

    const auction =
        room.auction;

    if (
        !auction.active
    ) {
        return;
    }

    if (
        auction.timer
    ) {

        clearTimeout(
            auction.timer
        );

        auction.timer =
            null;
    }

    auction.active =
        false;

    auction.timerEnd =
        null;

    auction.remainingSeconds =
        0;

    const character =
        auction.character;

    const bidderId =
        auction.highestBidder;

    /*
     * =====================================================
     * UNSOLD
     * =====================================================
     */

    if (
        forceUnsold ||
        !bidderId
    ) {

        io.to(room.code).emit(
            "auctionUnsold",
            {
                character,

                characterIndex:
                    auction.index,

                message:
                    `${character} is UNSOLD`
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

    /*
     * =====================================================
     * SOLD
     * =====================================================
     */

    const bidder =
        room.players[
            bidderId
        ];

    /*
     * Safety check.
     */

    if (!bidder) {

        auction.highestBidder =
            null;

        auction.currentBid =
            0;

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
            1000
        );

        return;
    }

    /*
     * Check team capacity.
     */

    if (
        bidder.team.length >=
        room.settings.teamSize
    ) {

        io.to(room.code).emit(
            "auctionUnsold",
            {
                character,

                characterIndex:
                    auction.index,

                message:
                    `${character} is UNSOLD because ${bidder.name}'s team is full.`
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
            1000
        );

        return;
    }

    const price =
        auction.currentBid;

    /*
     * Deduct money only NOW.
     *
     * Not when bidding.
     */

    bidder.balance -=
        price;

    bidder.team.push(
        character
    );

    /*
     * THIS FIXES "undefined".
     *
     * We explicitly send bidderName.
     */

    io.to(room.code).emit(
        "auctionSold",
        {

            character,

            characterIndex:
                auction.index,

            playerId:
                bidder.id,

            playerName:
                bidder.name,

            bidderId:
                bidder.id,

            bidderName:
                bidder.name,

            price,

            remainingBalance:
                bidder.balance,

            team:
                bidder.team
        }
    );

    broadcastPlayers(
        room
    );

    auction.index++;

    /*
     * Reset auction state.
     */

    auction.character =
        null;

    auction.currentBid =
        0;

    auction.highestBidder =
        null;

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
   FINISH ENTIRE AUCTION
========================================================= */

function finishAuction(room) {

    const auction =
        room.auction;

    if (
        auction.timer
    ) {

        clearTimeout(
            auction.timer
        );

        auction.timer =
            null;
    }

    auction.active =
        false;

    auction.timerEnd =
        null;

    /*
     * Evaluate every final team.
     */

    const results =
        Object.values(
            room.players
        ).map(
            player => {

                const evaluation =
                    evaluateTeam(
                        player.team
                    );

                return {

                    playerId:
                        player.id,

                    playerName:
                        player.name,

                    team:
                        player.team,

                    balance:
                        player.balance,

                    aiEvaluation:
                        evaluation
                };
            }
        );

    const sorted =
        [...results]
            .sort(
                (a, b) =>
                    b.aiEvaluation.score -
                    a.aiEvaluation.score
            );

    const bestTeam =
        sorted.length
            ? sorted[0]
            : null;

    io.to(room.code).emit(
        "auctionFinished",
        {

            results,

            bestTeam:
                bestTeam
                    ? {

                        playerId:
                            bestTeam.playerId,

                        playerName:
                            bestTeam.playerName,

                        score:
                            bestTeam.aiEvaluation
                                .score,

                        rating:
                            bestTeam.aiEvaluation
                                .rating,

                        strengths:
                            bestTeam.aiEvaluation
                                .strengths,

                        weaknesses:
                            bestTeam.aiEvaluation
                                .weaknesses
                    }
                    : null
        }
    );

    broadcastPlayers(
        room
    );
}

/* =========================================================
   SERVER START
========================================================= */

server.listen(
    PORT,
    () => {

        console.log(
            `Naruto Character Rank server running on port ${PORT}`
        );

    }
);
