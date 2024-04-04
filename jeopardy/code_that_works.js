// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

// {
//   "id": 3,
//   "title": "odd jobs",
//   "clues": [
//   {
//   "id": 3,
//   "answer": "sold flowers (flower girl accepted)",
//   "question": "Eliza Doolittle did it for a living",
//   "value": 100,
//   "airdate": "1985-02-08T12:00:00.000Z",
//   "created_at": "2014-02-11T22:47:18.841Z",
//   "updated_at": "2014-02-11T22:47:18.841Z",
//   "category_id": 3,
//   "game_id": null,
//   "invalid_count": null,
//   "category": {
//   "id": 3,
//   "title": "odd jobs",
//   "created_at": "2014-02-11T22:47:18.718Z",
//   "updated_at": "2014-02-11T22:47:18.718Z",
//   "clues_count": 35
//   }

let categories = [];
const $startButton = $('.start-button');
const $tHead = $('th');

async function getCategory() {
  try {
    const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
    const responseData = response.data;
    console.log(responseData);
    return responseData.map(category => category.id);
  } catch (error) {
    console.error("Error fetching category IDs:", error);
    return [];
  }
}

// async function getClues(catId) {
// async function getClues(catId) {
//   try {
//     const response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`);
//     const randomClues = response.data.clues.sort(() => 0.5 - Math.random()).slice(0, 5);
//     categories.push({ title: response.data.title, clues: randomClues });
//   } catch (error) {
//     console.error("Error fetching clues:", error);
//   }
// }
async function getClues(catId) {
  try {
    const response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`);
    
    // Randomly select one clue from the clues array
    const randomIndex = Math.floor(Math.random() * response.data.clues.length);
    const randomClue = response.data.clues[randomIndex];
    
    // Extract question and answer from the random clue
    const question = randomClue.question;
    const answer = randomClue.answer;
    
    // Check if we have pushed maximum 6 categories
    if (categories.length < 6) {
      // Push category title, question, and answer to the categories array
      categories.push({ 
        title: response.data.title, 
        question: question,
        answer: answer
      });
    }
  } catch (error) {
    console.error("Error fetching clues:", error);
  }
}
//////////////////////////THIS VERSION DISPLAYS QUESTIONS WHEN CLICKING ON TDS BUT THE SAME QUESTION ON ALL COLUMN TDS
// Fill the <th>s
async function fillTable(categoryData) {
  console.log("Filling table with category data:", categoryData);
  $tHead.each(function(index) {
    if (categoryData && categoryData[index]) {
      $(this).text(categoryData[index].title).addClass('th_styles');
    } else {
      $(this).text('');
    }
  });
  // Add event listener for clicks on game-board cells
  $('.game-board').click(function() {
    console.log('Clicked on a td cell');
  });
}

/* Don't display table until you click 'start' */
async function showLoadingView() {
  console.log("Show loading view function called");
  try {
    $('.hidden').removeClass();
    $startButton.text('Loading...');

    const catIds = await getCategory();
    if (catIds.length === 0) {
      console.error("No category IDs fetched");
      return;
    }

    const randomCatIds = catIds.sort(() => 0.5 - Math.random()).slice(0, 6);
    await Promise.all(randomCatIds.map(getClues));
    fillTable(categories);

  } catch (error) {
    console.error("Error showing loading view:", error);
  }
  //Replace text inside startButton with 'Restart!' "half a second later"
  let intervalId = setInterval(function() {
    $startButton.text('Restart!');
  }, 500);
}

// Add event listener for clicks on game-board cells
$(document).ready(function() {
  $('.game-board').click(function() {
    console.log("Clicked on a td cell");
    // Get the index of the clicked cell's parent row
    let rowIndex = $(this).parent().index();
    
    // Get the index of the clicked cell within its parent row
    let cellIndex = $(this).index();
    
    // Get the category data corresponding to the clicked cell
    let categoryData = categories[cellIndex];
    
    // If the category data exists and the question is not already displayed
    if (categoryData && $(this).text().trim() === "?") {
      // Get the question text
      let questionText = categoryData.question;
      
      // Replace the current text with the question text
      $(this).text(questionText).removeClass('th_styles').addClass('clicked-question');
    }
  });
});


// Handle click on star button to display table with categories
$('.start-button').on('click', showLoadingView);

