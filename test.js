
const createElements = (names) =>{
    const htmlElement = names.map(el => `<span class="btn">${el}</span>`);
    console.log(htmlElement.join(' '));
}
const friends = ['rahim', 'korim', 'raihan'];
createElements(friends);