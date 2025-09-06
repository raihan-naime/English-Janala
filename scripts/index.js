const createElements = (names) => {
  const htmlElement = names.map((el) => `<span class="btn">${el}</span>`);
  return htmlElement.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("word-container").classList.remove("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLessons(json.data));
};

const removeActive = () => {
  const lessonsButtons = document.querySelectorAll(".lesson-btn");
  // console.log(lessonsButtons);
  lessonsButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
};

const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWords(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

// {
//     "word": "Eager",
//     "meaning": "আগ্রহী",
//     "pronunciation": "ইগার",
//     "level": 1,
//     "sentence": "The kids were eager to open their gifts.",
//     "points": 1,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "enthusiastic",
//         "excited",
//         "keen"
//     ],
//     "id": 5
// }

const displayWordDetails = (word) => {
  console.log(word);
  const detailBox = document.getElementById("details-container");
  detailBox.innerHTML = `
  
  <div>
                <h2 class="text-2xl font-bold">
                  ${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${
    word.pronunciation
  })
                </h2>
              </div>
              <div>
                <h2 class="font-bold">Meaning</h2>
                <p>${word.meaning}</p>
              </div>
              <div>
                <h2 class="text-xl font-bold">example</h2>
                <h2 class="">${word.sentence}</h2>
              </div>
              <div>
              <h2 class="">সমার্থক শব্দ গুলো</h2>
                  ${createElements(word.synonyms)}
                </div>


  `;
  document.getElementById("word_modal").showModal();
};

const displayLevelWords = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length === 0) {
    wordContainer.innerHTML = `
    
    <div class="text-center py-15 bg-white col-span-full rounded-lg">
    <img class="mx-auto" src="./assets/alert-error.png"/>
            <p class="text-xl font-bangla text-gray-600">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-3xl font-bold font-bangla text-gray-800">নেক্সট Lesson এ যান</h2>
    </div>
    `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="bg-white rounded-xl p-16 text-center">
            <h3 class="text-3xl font-bold text-[#000000]">${
              word.word ? word.word : "word Not Found"
            }</h3>
            <p class="text-xl font-bold text-[#000000]">${
              word.pronunciation
                ? word.pronunciation
                : "pronunciation Not Found"
            }</p>
            <h2 class="font-bangla text-3xl font-semibold text-[#000000]">"${
              word.meaning ? word.meaning : "Meaning Not Found"
            }"</h2>
            <div class="flex justify-between items-center">
              <button onclick="loadWordDetail(${
                word.id
              })" class="bg-[#e8f4ff] hover:bg-[#e8f4ff50] border-none btn btn-primary rounded-lg w-[56px] h-[56px]">
                <i class="fa-solid fa-circle-info text-[#374957]"></i>
              </button>
              <button onclick="pronounceWord('${word.word}')" class="bg-[#e8f4ff] hover:bg-[#e8f4ff50] border-none btn btn-primary rounded-lg w-[56px] h-[56px]">
                <i class="fa-solid fa-volume-high text-[#374957]"></i>
              </button>
            </div>
          </div>
    `;
    wordContainer.appendChild(card);
  });
  manageSpinner(false);
};
const displayLessons = (lessons) => {
  /**
   * 1.get the container and empty
   * 2.get into every lessons
   * 3.create element
   * 4.append into container
   */
  // 1
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  // 2
  for (let lesson of lessons) {
    // 3
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button id="lesson-btn-${lesson.level_no}" onclick='loadLevelWord(${lesson.level_no})' class="btn btn-outline btn-primary lesson-btn">
    <i class="fa-solid fa-book-open"></i>
     lesson- ${lesson.level_no}
    </button>
    `;
    // 4
    levelContainer.appendChild(btnDiv);
  }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  // console.log(searchValue);
  fetch("https://openapi.programming-hero.com/api/words/all")
  .then(res => res.json())
  .then(data => {
    // console.log(data)
    const allWords = data.data;
    // console.log(allWords);
    const filterWords = allWords.filter((word) => word.word.toLowerCase().includes(searchValue));
    displayLevelWords(filterWords);
  })
});
