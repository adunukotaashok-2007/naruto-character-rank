// ==========================================
// NARUTO CHARACTER RANKING GAME
// ==========================================

const categories = [
    "🧬 Talent",
    "💪 Body",
    "🧠 Mind / IQ",
    "🩸 Clan",
    "🔵 Chakra",
    "👨‍🏫 Sensei",
    "🥋 Taijutsu",
    "🌀 Ninjutsu",
    "🔥 Kekkei Genkai",
    "⚡ Speed",
    "💥 Strength",
    "🎯 Battle IQ",
    "👻 Genjutsu",
    "🌪️ Chakra Nature",
    "🐉 Tailed Beast",
    "❤️ Healing"
];


// ==========================================
// CHARACTER DATABASE
// ==========================================

const characters = {

    Naruto: {
        name: "Naruto Uzumaki",
        image: "assets/characters/images%20%282%29.jpeg"
    },

    Sasuke: {
        name: "Sasuke Uchiha",
        image: "assets/characters/images%20%283%29.jpeg"
    },

    Itachi: {
        name: "Itachi Uchiha",
        image: "assets/characters/images%20%284%29.jpeg"
    },

    Madara: {
        name: "Madara Uchiha",
        image: "assets/characters/images%20%285%29.jpeg"
    },

    Minato: {
        name: "Minato Namikaze",
        image: "assets/characters/images%20%286%29.jpeg"
    },

    Tobirama: {
        name: "Tobirama Senju",
        image: "assets/characters/images%20%287%29.jpeg"
    },

    Hashirama: {
        name: "Hashirama Senju",
        image: "assets/characters/images%20%288%29.jpeg"
    },

    Jiraiya: {
        name: "Jiraiya",
        image: "assets/characters/images%20%289%29.jpeg"
    },

    Hiruzen: {
        name: "Hiruzen Sarutobi",
        image: "assets/characters/images%20%2810%29.jpeg"
    },

    Orochimaru: {
        name: "Orochimaru",
        image: "assets/characters/images%20%2811%29.jpeg"
    },

    Guy: {
        name: "Might Guy",
        image: "assets/characters/images%20%2812%29.jpeg"
    },

    Lee: {
        name: "Rock Lee",
        image: "assets/characters/images%20%2813%29.jpeg"
    },

    Shikamaru: {
        name: "Shikamaru Nara",
        image: "assets/characters/images%20%2814%29.jpeg"
    },

    Neji: {
        name: "Neji Hyuga",
        image: "assets/characters/images%20%2815%29.jpeg"
    },

    Gaara: {
        name: "Gaara",
        image: "assets/characters/images%20%2816%29.jpeg"
    },

    Kisame: {
        name: "Kisame Hoshigaki",
        image: "assets/characters/images%20%2817%29.jpeg"
    },

    Sakura: {
        name: "Sakura Haruno",
        image: "assets/characters/images%20%2818%29.jpeg"
    },

    Nagato: {
        name: "Nagato / Pain",
        image: "assets/characters/images%20%2819%29.jpeg"
    },

    Obito: {
        name: "Obito Uchiha",
        image: "assets/characters/images%20%2820%29.jpeg"
    },

    Kakashi: {
        name: "Kakashi Hatake",
        image: "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg"
    }
};


// ==========================================
// CHARACTER POOLS FOR EACH CATEGORY
// ==========================================

const categoryPools = [

    // Talent
    ["Naruto", "Sasuke", "Itachi", "Minato", "Kakashi"],

    // Body
    ["Guy", "Lee", "Madara", "Hashirama", "Naruto"],

    // Mind / IQ
    ["Shikamaru", "Itachi", "Tobirama", "Minato", "Kakashi"],

    // Clan
    ["Sasuke", "Itachi", "Madara", "Hashirama", "Neji"],

    // Chakra
    ["Naruto", "Hashirama", "Madara", "Nagato", "Kisame"],

    // Sensei
    ["Jiraiya", "Kakashi", "Guy", "Orochimaru", "Hiruzen"],

    // Taijutsu
    ["Guy", "Lee", "Neji", "Naruto", "Sasuke"],

    // Ninjutsu
    ["Naruto", "Sasuke", "Minato", "Tobirama", "Kakashi"],

    // Kekkei Genkai
    ["Hashirama", "Sasuke", "Madara", "Gaara", "Naruto"],

    // Speed
    ["Minato", "Naruto", "Sasuke", "Tobirama", "Guy"],

    // Strength
    ["Guy", "Hashirama", "Madara", "Naruto", "Sakura"],

    // Battle IQ
    ["Itachi", "Shikamaru", "Minato", "Kakashi", "Tobirama"],

    // Genjutsu
    ["Itachi", "Sasuke", "Madara", "Obito", "Kakashi"],

    // Chakra Nature
    ["Naruto", "Sasuke", "Kakashi", "Hashirama", "Gaara"],

    // Tailed Beast
    ["Naruto", "Gaara", "Obito", "Madara", "Nagato"],

    // Healing
    ["Sakura", "Naruto", "Hashirama", "Orochimaru", "Tsunade"]
];


// ==========================================
// GAME STATE
// ==========================================

let currentCategory = 0;

let selectedCharacters = [];

let finalRankings = [];


// ==========================================
// HTML ELEMENTS
// ==========================================

const categoryNumber =
    document.getElementById("categoryNumber");

const categoryName =
    document.getElementById("categoryName");

const characterInputs =
    document.getElementById("characterInputs");

const addCharacter =
    document.getElementById("addCharacter");

const startRanking =
    document.getElementById("startRanking");

const rankingSection =
    document.getElementById("rankingSection");

const rankingList =
    document.getElementById("rankingList");

const confirmRanking =
    document.getElementById("confirmRanking");

const resultSection =
    document.getElementById("resultSection");

const resultList =
    document.getElementById("resultList");

const nextCategory =
    document.getElementById("nextCategory");


// ==========================================
// LOAD CATEGORY
// ==========================================

function loadCategory() {

    categoryNumber.textContent =
        currentCategory + 1;

    categoryName.textContent =
        categories[currentCategory];

    selectedCharacters = [];

    createCharacterCards();

}


// ==========================================
// CREATE CHARACTER CARDS
// ==========================================

function createCharacterCards() {

    characterInputs.innerHTML = "";

    const title =
        document.createElement("h3");

    title.textContent =
        "Select 2 or more characters";

    title.style.textAlign = "center";

    title.style.marginBottom = "15px";

    characterInputs.appendChild(title);


    const grid =
        document.createElement("div");

    grid.className =
        "character-grid";


    const pool =
        categoryPools[currentCategory];


    pool.forEach(key => {

        const character =
            characters[key];

        if (!character) return;


        const card =
            document.createElement("div");

        card.className =
            "character-card";


        const image =
            document.createElement("img");

        image.src =
            character.image;

        image.alt =
            character.name;


        image.onerror =
            function () {

                console.log(
                    "Image failed:",
                    character.image
                );

            };


        const name =
            document.createElement("div");

        name.className =
            "character-name";

        name.textContent =
            character.name;


        const button =
            document.createElement("button");

        button.className =
            "select-character";

        button.textContent =
            "SELECT";


        button.onclick =
            function () {

                selectCharacter(
                    key,
                    card,
                    button
                );

            };


        card.appendChild(image);

        card.appendChild(name);

        card.appendChild(button);

        grid.appendChild(card);

    });


    characterInputs.appendChild(grid);

}


// ==========================================
// SELECT CHARACTER
// ==========================================

function selectCharacter(
    key,
    card,
    button
) {

    const exists =
        selectedCharacters.includes(key);


    if (exists) {

        selectedCharacters =
            selectedCharacters.filter(
                item => item !== key
            );

        card.classList.remove(
            "selected"
        );

        button.textContent =
            "SELECT";

        return;
    }


    selectedCharacters.push(key);

    card.classList.add(
        "selected"
    );

    button.textContent =
        "✓ SELECTED";

}


// ==========================================
// START RANKING
// ==========================================

startRanking.onclick =
    function () {

        if (
            selectedCharacters.length < 2
        ) {

            alert(
                "Select at least 2 characters!"
            );

            return;

        }


        showRanking();

    };


// ==========================================
// SHOW RANKING
// ==========================================

function showRanking() {

    document
        .querySelector(".category-card")
        .classList.add("hidden");

    rankingSection
        .classList.remove("hidden");


    rankingList.innerHTML = "";


    selectedCharacters.forEach(
        (key, index) => {

            createRankingItem(
                key,
                index
            );

        }
    );


    updateNumbers();

}


// ==========================================
// CREATE RANK ITEM
// ==========================================

function createRankingItem(
    key,
    index
) {

    const character =
        characters[key];


    const item =
        document.createElement("div");

    item.className =
        "rank-item";

    item.draggable = true;

    item.dataset.key =
        key;


    const number =
        document.createElement("div");

    number.className =
        "rank-number";

    number.textContent =
        index + 1;


    const image =
        document.createElement("img");

    image.src =
        character.image;

    image.className =
        "rank-image";


    const name =
        document.createElement("div");

    name.className =
        "rank-name";

    name.textContent =
        character.name;


    item.appendChild(number);

    item.appendChild(image);

    item.appendChild(name);


    rankingList.appendChild(item);


    item.addEventListener(
        "dragstart",
        function () {

            item.classList.add(
                "dragging"
            );

        }
    );


    item.addEventListener(
        "dragend",
        function () {

            item.classList.remove(
                "dragging"
            );

            updateNumbers();

        }
    );

}


// ==========================================
// DRAG & DROP
// ==========================================

rankingList.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();


        const dragging =
            document.querySelector(
                ".dragging"
            );


        if (!dragging) return;


        const items =
            [
                ...rankingList.querySelectorAll(
                    ".rank-item:not(.dragging)"
                )
            ];


        const nextItem =
            items.find(item => {

                const rect =
                    item.getBoundingClientRect();

                return (
                    event.clientY <
                    rect.top +
                    rect.height / 2
                );

            });


        if (nextItem) {

            rankingList.insertBefore(
                dragging,
                nextItem
            );

        } else {

            rankingList.appendChild(
                dragging
            );

        }

    }
);


// ==========================================
// UPDATE RANK NUMBERS
// ==========================================

function updateNumbers() {

    const items =
        rankingList.querySelectorAll(
            ".rank-item"
        );


    items.forEach(
        (item, index) => {

            item
                .querySelector(
                    ".rank-number"
                )
                .textContent =
                index + 1;

        }
    );

}


// ==========================================
// CONFIRM RANKING
// ==========================================

confirmRanking.onclick =
    function () {

        const items =
            rankingList.querySelectorAll(
                ".rank-item"
            );


        const ranking = [];


        items.forEach(
            (item, index) => {

                ranking.push({

                    character:
                        characters[
                            item.dataset.key
                        ].name,

                    image:
                        characters[
                            item.dataset.key
                        ].image,

                    rank:
                        index + 1

                });

            }
        );


        finalRankings.push({

            category:
                categories[currentCategory],

            ranking:
                ranking

        });


        showCategoryResult(
            ranking
        );

    };


// ==========================================
// SHOW CATEGORY RESULT
// ==========================================

function showCategoryResult(
    ranking
) {

    rankingSection
        .classList.add("hidden");

    resultSection
        .classList.remove("hidden");


    resultList.innerHTML = "";


    ranking.forEach(
        (item, index) => {

            const row =
                document.createElement("div");

            row.className =
                "result-item";


            const position =
                document.createElement("div");

            position.className =
                "result-position";


            if (index === 0) {

                position.textContent =
                    "🥇";

            } else if (index === 1) {

                position.textContent =
                    "🥈";

            } else if (index === 2) {

                position.textContent =
                    "🥉";

            } else {

                position.textContent =
                    `${index + 1}`;

            }


            const image =
                document.createElement("img");

            image.src =
                item.image;

            image.className =
                "rank-image";


            const name =
                document.createElement("div");

            name.className =
                "result-name";

            name.textContent =
                item.character;


            row.appendChild(position);

            row.appendChild(image);

            row.appendChild(name);


            resultList.appendChild(row);

        }
    );


    if (
        currentCategory ===
        categories.length - 1
    ) {

        nextCategory.textContent =
            "🏆 SHOW ALL RESULTS";

    } else {

        nextCategory.textContent =
            "NEXT CATEGORY ➡️";

    }

}


// ==========================================
// NEXT CATEGORY
// ==========================================

nextCategory.onclick =
    function () {

        currentCategory++;


        if (
            currentCategory >=
            categories.length
        ) {

            showFinalResults();

            return;

        }


        resultSection
            .classList.add("hidden");


        document
            .querySelector(".category-card")
            .classList.remove("hidden");


        loadCategory();

    };


// ==========================================
// FINAL RESULTS
// ==========================================

function showFinalResults() {

    document
        .querySelector(".category-card")
        .classList.add("hidden");

    rankingSection
        .classList.add("hidden");

    resultSection
        .classList.remove("hidden");


    resultList.innerHTML = "";


    const title =
        document.createElement("h2");

    title.textContent =
        "🏆 COMPLETE RANKINGS";

    resultList.appendChild(title);


    finalRankings.forEach(
        (result, categoryIndex) => {

            const heading =
                document.createElement("h3");

            heading.textContent =
                `${categoryIndex + 1}. ${result.category}`;

            heading.style.margin =
                "20px 0 10px";


            resultList.appendChild(
                heading
            );


            result.ranking.forEach(
                (item, index) => {

                    const row =
                        document.createElement("div");

                    row.className =
                        "result-item";


                    const position =
                        document.createElement("div");

                    position.className =
                        "result-position";

                    position.textContent =
                        `${index + 1}.`;


                    const image =
                        document.createElement("img");

                    image.src =
                        item.image;

                    image.className =
                        "rank-image";


                    const name =
                        document.createElement("div");

                    name.className =
                        "result-name";

                    name.textContent =
                        item.character;


                    row.appendChild(position);

                    row.appendChild(image);

                    row.appendChild(name);


                    resultList.appendChild(row);

                }
            );

        }
    );


    nextCategory.textContent =
        "🔄 PLAY AGAIN";


    nextCategory.onclick =
        function () {

            location.reload();

        };

}


// ==========================================
// START GAME
// ==========================================

loadCategory();
