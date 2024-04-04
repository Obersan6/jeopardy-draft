async function getCategoryIds() {
    try {
      const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
      const responseData = response.data;
      const categoryIds = [];
      if (responseData && responseData.length > 0) {
        while (categoryIds.length < 6) {
          const randomCategory = responseData[Math.floor(Math.random() * responseData.length)];
          if (!categoryIds.includes(randomCategory.id)) {
            categoryIds.push(randomCategory.id);
          }
        }
      }
      return categoryIds;
    } catch (error) {
      console.error('Error fetching category IDs:', error);
      return []; // Return an empty array in case of error
    }
  }
  
  async function getCategoryTitles(categoryIds) {
    try {
      const categoryTitles = [];
      for (const categoryId of categoryIds) {
        const response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/categories/${categoryId}`);
        const responseData = response.data;
        if (responseData && responseData.title) {
          categoryTitles.push(responseData.title);
        }
      }
      return categoryTitles;
    } catch (error) {
      console.error('Error fetching category titles:', error);
      return []; // Return an empty array in case of error
    }
  }
  
  async function fillTable() {
    try {
      // Fetch random category IDs
      const categoryIds = await getCategoryIds();
      
      // Fetch category titles corresponding to the random IDs
      const categoryTitles = await getCategoryTitles(categoryIds);
  
      // Ensure there are category titles
      if (categoryTitles.length > 0) {
        // Find all <th> elements in the table
        const thElements = $('th');
  
        // Loop over each <th> element and set its text to a random category title
        thElements.each(function(index) {
          const randomIndex = Math.floor(Math.random() * categoryTitles.length);
          const randomTitle = categoryTitles[randomIndex];
          $(this).text(randomTitle);
          // Remove the used title from the array to prevent duplication
          categoryTitles.splice(randomIndex, 1);
        });
      } else {
        console.log('No category titles available');
      }
    } catch (error) {
      console.error('Error filling table:', error);
    }
  }
  
  async function showLoadingView() {
    // Remove hidden class to make the table visible
    $('.hidden').removeClass();
  
    // Display the titles
    await fillTable();
  }
  
  // Handle click on start button to display table with categories and ?
  $('.start-button').on('click', showLoadingView);
  
  // Call showLoadingView on page load to initially display the table with random category titles
  $(document).ready(showLoadingView);
  

  /////////////////////////////////////////ENTIRE CODE FROM ANOTHER STUDENT THAT WORKS
  /* Get question, answer */
// What another student tried and worked
let categories = [];

const NUM_CATEGORIES = 14;
const NUM_QUESTIONS_PER_CAT = 5;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getCategoryIds() {
  const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories', { params: { count: NUM_CATEGORIES } });
  return response.data.map(category => category.id);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
  const response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`);
  const clues = response.data.clues.map(clue => ({ question: clue.question, answer: clue.answer, showing: null }));
  return { title: response.data.title, clues };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initially, just show a "?" where the question/answer would go.)
 */
async function fillTable() {
  const $thead = $('#jeopardy thead');
  const $tbody = $('#jeopardy tbody');

  $thead.empty();
  $tbody.empty();

  const maxColumns = 6; // Set the maximum number of columns
  const $trHead = $('<tr>');
  for (let i = 0; i < Math.min(categories.length, maxColumns); i++) {
    $trHead.append(`<td>${categories[i].title}</td>`);
  }
  $thead.append($trHead);

  for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
    const $trBody = $('<tr>');
    for (let j = 0; j < Math.min(categories.length, maxColumns); j++) {
      const $td = $(`<td class="clue" data-row="${i}" data-col="${j}">❔</td>`);
      $trBody.append($td);
    }
    $tbody.append($trBody);
  }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
function handleClick(evt) {
  const $clickedCell = $(evt.target);
  const row = $clickedCell.data('row');
  const col = $clickedCell.data('col');
  const clue = categories[col].clues[row];

  if (clue.showing === null) {
    $clickedCell.text(clue.question);
    clue.showing = 'question';
  } else if (clue.showing === 'question') {
    $clickedCell.text(clue.answer).addClass("important");
    clue.showing = 'answer';
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */
function showLoadingView() {
  $('#jeopardy').hide();
  $('#loading').show();
  $('#start').prop('disabled', true);
}

/** Remove the loading spinner and update the button used to fetch data. */
function hideLoadingView() {
  $('#loading').hide();
  $('#jeopardy').show();
  $('#start').prop('disabled', false);
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

/** Shuffle an array in place using Fisher-Yates algorithm. */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  /** Shuffle the categories array in place. */
  function shuffleCategories() {
    shuffleArray(categories);
  }

  /** Shuffle an array in place using Fisher-Yates algorithm. */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/** Shuffle the categories array in place. */
function shuffleCategories() {
  shuffleArray(categories);
}

/** Start game with shuffled categories:
 *
 * - shuffle categories
 * - fill the HTML table
 */
async function setupAndStartShuffled() {
    showLoadingView();
  
    const categoryIds = await getCategoryIds();
  
    categories = [];
    for (const catId of categoryIds) {
      const category = await getCategory(catId);
      categories.push(category);
    }
  
    shuffleCategories();
    fillTable();
    hideLoadingView();
  }

/** On click of start / restart button, set up game with shuffled categories. */
$('#start').on('click', setupAndStartShuffled);

/** On page load, add event handler for clicking clues */
$(document).on('click', '.clue', handleClick);




////////////////////////////////CHAT GPT SOLUTION: there are some elements that may come in handy
$(document).ready(function() {
  const $startButton = $('.start-button');
  const $table = $('table');
  const $tHead = $('th');
  let categories = []; // This will hold category data including fetched clues

  async function fetchCategories() {
      const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=6');
      const categoryIds = response.data.map(cat => cat.id);
      return Promise.all(categoryIds.map(id => fetchCluesForCategory(id)));
  }

  async function fetchCluesForCategory(id) {
      const response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${id}`);
      return { title: response.data.title, clues: response.data.clues.slice(0, 5) }; // Limiting clues to 5 per category
  }

  function fillTable() {
      $tHead.each(function(index) {
          $(this).text(categories[index].title).addClass('th_styles');
      });
  }

  function toggleQuestion(event) {
      const $cell = $(event.target);
      const colIndex = $cell.index();
      const rowIndex = $cell.closest('tr').index();
      const clue = categories[colIndex].clues[rowIndex];

      if (!$cell.data('question-visible')) {
          $cell.html(`<h2>${clue.question}</h2>`).data('question-visible', true);
      } else {
          $cell.html('<h2>?</h2>').data('question-visible', false); // Reset to "?" to simplify
      }
  }

  async function startGame() {
      $startButton.text('Loading...');
      categories = await fetchCategories();
      fillTable();
      $table.removeClass('hidden');
      $startButton.text('Restart!');
      $('td').on('click', toggleQuestion); // Bind click event after table is populated
  }

  $startButton.on('click', startGame);
});








///////////////////////THIS CODE IS AN ATEMPT TO INTEGRATE getCategory AND getClue together
async function getCategoriesAndClues() {
  try {
    // Fetch the categories
    const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
    let responseData = response.data;

    if (responseData && responseData.length > 0) {
      let categoriesWithClues = [];
      while (categoriesWithClues.length < 6) {
        let randomIndex = Math.floor(Math.random() * responseData.length);
        let randomCategory = responseData[randomIndex];
        
        // Remove the selected category to avoid repetition
        responseData.splice(randomIndex, 1);
        
        // Fetch clues for the selected category
        const cluesResponse = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${randomCategory.id}`);
        const clues = cluesResponse.data.clues.map(clue => ({ 
          question: clue.question, 
          answer: clue.answer, 
          showing: null  // Initial state
        }));
        
        categoriesWithClues.push({ 
          title: randomCategory.title, 
          clues 
        });

        // Optional: Check to avoid duplicate category titles, if necessary
        // This depends on your application's requirements
      }
      return categoriesWithClues;
    }
  } catch (error) {
    console.error("Failed to fetch categories and clues:", error);
    return [];  // Return an empty array in case of failure
  }
}
