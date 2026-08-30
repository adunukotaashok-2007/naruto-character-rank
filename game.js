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

let currentCategory = 0;
let characters = [];
let allResults = [];

const categoryNumber = document.getElementById("categoryNumber");
const categoryName = document.getElementById("categoryName");

const characterInputs = document.getElementById("characterInputs");
const addCharacter = document.getElementById("addCharacter");
const startRanking = document.getElementById("startRanking");

const rankingSection = document.getElementById("rankingSection");
const rankingList = document.getElementById("rankingList");
const confirmRanking = document.getElementById("confirmRanking");

const resultSection = document.getElementById("resultSection");
const resultList = document.getElementById("resultList");
const nextCategory = document.getElementById("nextCategory");


// --------------------------------------
// INITIAL SETUP
// --------------------------------------

function updateCategory() {

    categoryNumber.textContent = currentCategory + 1;
    categoryName.textContent = categories[currentCategory];

    characterInputs.innerHTML = "";

    characters = [];

    addInput();
    addInput();
}


// --------------------------------------
// ADD CHARACTER INPUT
// --------------------------------------

function addInput(value = "") {

    const wrapper = document.createElement("div");
    wrapper.className = "character-input";

    const input = document.createElement("input");

    input.type = "text";
    input.placeholder = "Enter Naruto character...";
    input.value = value;

    const remove = document.createElement("button");

    remove.className = "remove-character";
    remove.textContent = "×";

    remove.onclick = () => {

        if (characterInputs.children.length > 2) {
            wrapper.remove();
        }

    };

    wrapper.appendChild(input);
    wrapper.appendChild(remove);

    characterInputs.appendChild(wrapper);
}


// --------------------------------------
// ADD BUTTON
// --------------------------------------

addCharacter.onclick = () => {

    addInput();

};


// --------------------------------------
// START RANKING
// --------------------------------------

startRanking.onclick = () => {

    const inputs =
        characterInputs.querySelectorAll("input");

    characters = [];

    inputs.forEach(input => {

        const name = input.value.trim();

        if (name !== "") {
            characters.push(name);
        }

    });


    if (characters.length < 2) {

        alert("Please enter at least 2 characters!");

        return;
    }


    // Remove duplicate characters

    characters = [...new Set(characters)];


    showRanking();

};


// --------------------------------------
// SHOW RANKING
// --------------------------------------

function showRanking() {

    document
        .querySelector(".category-card")
        .classList.add("hidden");

    rankingSection.classList.remove("hidden");

    rankingList.innerHTML = "";


    characters.forEach((character, index) => {

        createRankItem(character, index);

    });

}


// --------------------------------------
// CREATE DRAG ITEM
// --------------------------------------

function createRankItem(name, index) {

    const item = document.createElement("div");

    item.className = "rank-item";

    item.draggable = true;

    item.dataset.name = name;


    const number = document.createElement("div");

    number.className = "rank-number";

    number.textContent = index + 1;


    const characterName =
        document.createElement("div");

    characterName.className = "rank-name";

    characterName.textContent = name;


    item.appendChild(number);

    item.appendChild(characterName);

    rankingList.appendChild(item);


    item.addEventListener("dragstart", () => {

        item.classList.add("dragging");

    });


    item.addEventListener("dragend", () => {

        item.classList.remove("dragging");

        updateNumbers();

    });

}


// --------------------------------------
// DRAG & DROP
// --------------------------------------

rankingList.addEventListener("dragover", event => {

    event.preventDefault();

    const dragging =
        document.querySelector(".dragging");

    if (!dragging) return;


    const items =
        [...rankingList.querySelectorAll(".rank-item:not(.dragging)")];

    const nextItem =
        items.find(item => {

            const rect = item.getBoundingClientRect();

            return event.clientY < rect.top + rect.height / 2;

        });


    if (nextItem) {

        rankingList.insertBefore(
            dragging,
            nextItem
        );

    } else {

        rankingList.appendChild(dragging);

    }

});


// --------------------------------------
// UPDATE RANK NUMBERS
// --------------------------------------

function updateNumbers() {

    const items =
        rankingList.querySelectorAll(".rank-item");

    items.forEach((item, index) => {

        item
            .querySelector(".rank-number")
            .textContent = index + 1;

    });

}


// --------------------------------------
// CONFIRM RANKING
// --------------------------------------

confirmRanking.onclick = () => {

    const items =
        rankingList.querySelectorAll(".rank-item");

    const ranking = [];


    items.forEach((item, index) => {

        ranking.push({

            character: item.dataset.name,

            rank: index + 1

        });

    });


    allResults.push({

        category: categories[currentCategory],

        ranking: ranking

    });


    showResult(ranking);

};


// --------------------------------------
// SHOW RESULT
// --------------------------------------

function showResult(ranking) {

    rankingSection.classList.add("hidden");

    resultSection.classList.remove("hidden");

    resultList.innerHTML = "";


    ranking.forEach((item, index) => {

        const result = document.createElement("div");

        result.className = "result-item";


        const position =
            document.createElement("div");

        position.className = "result-position";


        if (index === 0) {

            position.textContent = "🥇";

        } else if (index === 1) {

            position.textContent = "🥈";

        } else if (index === 2) {

            position.textContent = "🥉";

        } else {

            position.textContent =
                `${index + 1}️⃣`;

        }


        const name =
            document.createElement("div");

        name.className = "result-name";

        name.textContent = item.character;


        result.appendChild(position);

        result.appendChild(name);

        resultList.appendChild(result);

    });


    if (currentCategory === categories.length - 1) {

        nextCategory.textContent =
            "🏆 SHOW FINAL RESULTS";

    } else {

        nextCategory.textContent =
            "NEXT CATEGORY ➡️";

    }

}


// --------------------------------------
// NEXT CATEGORY
// --------------------------------------

nextCategory.onclick = () => {

    currentCategory++;


    if (currentCategory >= categories.length) {

        showFinalResults();

        return;

    }


    resultSection.classList.add("hidden");

    document
        .querySelector(".category-card")
        .classList.remove("hidden");


    updateCategory();

};


// --------------------------------------
// FINAL RESULTS
// --------------------------------------

function showFinalResults() {

    resultSection.classList.remove("hidden");

    document
        .querySelector(".category-card")
        .classList.add("hidden");

    rankingSection.classList.add("hidden");


    categoryName.textContent =
        "🏆 FINAL CHARACTER RANKINGS";


    resultList.innerHTML = "";


    allResults.forEach((result, index) => {

        const title =
            document.createElement("h3");

        title.style.margin =
            "20px 0 10px";

        title.textContent =
            `${index + 1}. ${result.category}`;


        resultList.appendChild(title);


        result.ranking.forEach((item, rank) => {

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


            row.appendChild(position);

            row.appendChild(name);

            resultList.appendChild(row);

        });

    });


    nextCategory.textContent =
        "🔄 PLAY AGAIN";


    nextCategory.onclick = () => {

        location.reload();

    };

}


// --------------------------------------
// START GAME
// --------------------------------------

updateCategory();
