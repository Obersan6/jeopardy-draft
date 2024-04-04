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


let categories = [];
const $startButton = $('.start-button');
const $tHead = $('th');

/* STEP 2: 
- Get the title randomly
- Include only 6 ids in the 'categories' counter var, and titles in 'another counter var'
- To get the random questions, do it if possible at the same time you get your random titles, otherwise create another function like this one for the random questions 
- */
// I may only get directly the titles, because I don't think there's really need for both
async function getCategory(key) { //This function is working
  // Get the categories ids
  const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
  let responseData = response.data;
  console.log(response.data);

  if (responseData && responseData.length > 0) {
    while (categories.length < 6) {
      let randomTitle = responseData[Math.floor(Math.random() * responseData.length)];
      console.log(randomTitle.title);
        if(!categories.includes(randomTitle.title)) {
          categories.push(randomTitle.title);
        }
    }   
  } 
}



/* Get question*/
// What another student tried and worked
// async function getCategory(catId) {
//   const response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`);
//   const clues = response.data.clues.map(clue => ({ question: clue.question, answer: clue.answer, showing: null }));
//   return { title: response.data.title, clues };
// }
/* Get answer*/



  // {
  //   "id": 2,
  //   "title": "baseball",
  //   clues: [
  //     {question: "Hamlet Author", answer: "Shakespeare", showing: null},
  //     {question: "Bell Jar Author", answer: "Plath", showing: null},
  //     ...
  //   ],
  //   },




// Fill the <th>s
async function fillTable(categoryData) {
  console.log(categoryData); // Check categoryData

  $tHead.each(function(index) {
    if (categoryData && categoryData[index]) {
      // Add class to <th> to style in css
      $(this).text(categoryData[index]).addClass('th_styles');
    } else {
      $(this).text('');
    }
  });
}

/* STEP 1:
- The page doesn't display the table until you click the button 'start' 
- After clicking 'start', and after "refreshing": show the loading spinner, the start button will turn to 'restart', the table will be displayed, the random titles will display on the <th>, and each cell will display a '?' */


/* Don't display table until you click 'start' */
function showLoadingView() {
  // Removes table
  $('.hidden').removeClass();
  // Replace tex inside startButton with 'Loading...' 
  $startButton.text('Loading...');
  // Replace text inside startButton with 'Restart!' "half a second later"
  var intervalId = setInterval(function() {
    $startButton.text('Restart!');
}, 500);
  
  // Display the titles 
  getCategory().then(() => {
    fillTable(categories);
  });
}

// Handle click on star button to display table with categories
$('.start-button').on('click', showLoadingView);




/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO