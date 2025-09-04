const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLessons(json.data));
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
    console.log(lesson);
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button class="btn btn-outline btn-primary">
    <i class="fa-solid fa-book-open"></i>
     lesson- ${lesson.level_no}
    </button>
    `;
    levelContainer.appendChild(btnDiv);
  }
};

loadLessons();
