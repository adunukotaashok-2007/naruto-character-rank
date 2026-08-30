// ==========================================
// NARUTO CHARACTER RANK
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

const characters = [
    {
        name: "Naruto Uzumaki",
        image: "assets/characters/images%20%282%29.jpeg"
    },

    {
        name: "Sasuke Uchiha",
        image: "assets/characters/images%20%283%29.jpeg"
    },

    {
        name: "Itachi Uchiha",
        image: "assets/characters/images%20%284%29.jpeg"
    },

    {
        name: "Madara Uchiha",
        image: "assets/characters/images%20%285%29.jpeg"
    },

    {
        name: "Kakashi Hatake",
        image: "assets/characters/why-do-people-believe-dms-kakashi-is-stronger-than-naruto-v0-6vyk8nfzaqre1.jpg"
    }
];


// ==========================================
// GAME VARIABLES
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
// START CATEGORY
// ==========================================

function loadCategory() {

    categoryNumber.textContent =
        currentCategory + 1;

    categoryName.textContent =
        categories[currentCategory];

    characterInputs.innerHTML = "";

    selectedCharacters = [];

    createCharacterCards();

}


// ==========================================
// CREATE CHARACTER CARDS
// ==========================================

function createCharacterCards() {

    characterInputs.innerHTML = "";

    const title = document.createElement("h3");

    title.textContent =
        "Select 2 or more characters";

    title.style.textAlign = "center";

    title.style.marginBottom = "15px";

    characterInputs.appendChild(title);


    const grid = document.createElement("div");

    grid.className = "character-grid";


    characters.forEach((character, index) => {

        const card =
            document.createElement("div");

        card.className = "character-card";


        const image =
            document.createElement("img");

        image.src = character.image;

        image.alt = character.name;


        image.onerror = function () {

            image.style.display = "none";

        };


        const name =
            document.createElement("div");

        name.className = "character-name";

        name.textContent =
            character.name;


        const selectButton =
            document.createElement("button");

        selectButton.className =
            "select-character";

        selectButton.textContent =
            "SELECT";


        selectButton.onclick = function () {

            selectCharacter(
                character,
                card,
                selectButton
            );

        };


        card.appendChild(image);

        card.appendChild(name);

        card.appendChild(selectButton);

        grid.appendChild(card);

    });


    characterInputs.appendChild(grid);

}


// ==========================================
// SELECT CHARACTER
// ==========================================

function selectCharacter(
    character,
    card,
    button
) {

    const alreadySelected =
        selectedCharacters.some(
            item => item.name === character.name
        );


    if (alreadySelected) {

        selectedCharacters =
            selectedCharacters.filter(
                item => item.name !== character.name
            );

        card.classList.remove("selected");

        button.textContent = "SELECT";

        return;
    }


    selectedCharacters.push(character);

    card.classList.add("selected");

    button.textContent = "✓ SELECTED";

}


// ==========================================
// START RANKING
// ==========================================

startRanking.onclick = function () {

    if (selectedCharacters.length < 2) {

        alert(
            "Please select at least 2 characters!"
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
        (character, index) => {

            createRankingItem(
                character,
                index
            );

        }
    );


    updateNumbers();

}


// ==========================================
// CREATE RANKING ITEM
// ==========================================

function createRankingItem(
    character,
    index
) {

    const item =
        document.createElement("div");

    item.className =
        "rank-item";

    item.draggable = true;

    item.dataset.name =
        character.name;


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


    // Drag events

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
// UPDATE NUMBERS
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
                        item.dataset.name,

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
// CATEGORY RESULT
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

                position.textContent = "🥇";

            } else if (index === 1) {

                position.textContent = "🥈";

            } else if (index === 2) {

                position.textContent = "🥉";

            } else {

                position.textContent =
                    `${index + 1}`;

            }


            const name =
                document.createElement("div");

            name.className =
                "result-name";

            name.textContent =
                item.character;


            row.appendChild(position);

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
        "🏆 YOUR COMPLETE RANKINGS";

    title.style.marginBottom =
        "20px";

    resultList.appendChild(title);


    finalRankings.forEach(
        (result, categoryIndex) => {

            const categoryTitle =
                document.createElement("h3");

            categoryTitle.textContent =
                `${categoryIndex + 1}. ${result.category}`;

            categoryTitle.style.marginTop =
                "20px";

            categoryTitle.style.marginBottom =
                "10px";


            resultList.appendChild(
                categoryTitle
            );


            result.ranking.forEach(
                (item, rank) => {

                    const row =
                        document.createElement("div");

                    row.className =
                        "result-item";


                    const position =
                        document.createElement("div");

                    position.className =
                        "result-position";

                    position.textContent =
                        `${rank + 1}.`;


                    const name =
                        document.createElement("div");

                    name.className =
                        "result-name";

                    name.textContent =
                        item.character;


                    row.appendChild(
                        position
                    );

                    row.appendChild(
                        name
                    );


                    resultList.appendChild(
                        row
                    );

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
