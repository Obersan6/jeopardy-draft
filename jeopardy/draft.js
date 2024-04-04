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

//Handle button clicks to call 'getCategory' ---> See if I have to call getCategoryIds instead.
// $('button').on('click', function() {
//   getCategoryIds().then(() => {
//     // Assuming you've modified `getCategory` to handle an array of IDs or single ID
//     // and assuming `categories` now holds the IDs you want to fetch details for
//     categories.forEach(categoryId => {getCategory(categoryId);
//     });
//   });
// });


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds(key, value) {
  try{
    const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
   
    const responseData = response.data;
    if (responseData && responseData.length > 0) {
      while (categories.length < 6) {
        const randomCategory = responseData[Math.floor(Math.random() * responseData.length)];
        console.log(randomCategory.id)
        if (!categories.includes(randomCategory.id)) {
          categories.push(randomCategory.id);
        }
      }
      console.log(categories);
      // getCategory(categories);
    }
  } catch (error) {
    console.error('Error fetching category IDs:', error);
  }
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


// {
//   "id": 2,
//   "title": "baseball",
//   clues: [
//     {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//     {question: "Bell Jar Author", answer: "Plath", showing: null},
//     ...
//   ],
//   },

async function getCategory(categoryIds) {
// Make a GET request to the API endpoint
//   $.ajax({
//     url: "https://rithm-jeopardy.herokuapp.com/api/categories?count=100",
//     method: "GET",
//     success: function(response) {
//       // Extract titles from each category
//       let titles = response.map(function(category) {
//         return category.title;
//       });

//       // Print the titles
//       console.log(titles);
//     },
//   });
  // ///////   VERSION 2
  try {
    const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
    return response.data;
  } catch (error) {
    console.error('Error fetching category data:', error);
    return []; // Return an empty array in case of error
  }
}


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */


async function fillTable(categoryData) {
  try {
    // Fetch category data using Axios
    const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
    const categoryData = response.data;

    // Ensure there's category data
    if (categoryData && categoryData.length > 0) {
      // Find all <th> elements in your table
      const thElements = $('th');

      // Loop over each <th> element and set its text to the corresponding category title
      thElements.each(function(index) {
        // Check if there's a corresponding category object
        if (categoryData[index]) {
          // Set the text of this <th> to the category title
          $(this).text(categoryData[index].title);
        } else {
          // Optional: Clear the text if there are more <th> elements than categories
          $(this).text('');
        }
      });
    } else {
      console.log('No category data available');
    }
  } catch (error) {
    console.error('Error fetching category data:', error);
  }

  /////////////////////// VERSION 2
  // try {
  //   // Fetch category data
  //   const categoryData = await getCategory();

  //   // Log category data to check if it's retrieved correctly
  //   console.log('Category data:', categoryData);

  //   // Ensure there's category data
  //   if (categoryData && categoryData.length > 0) {
  //     // Find all <th> elements in the table
  //     const thElements = $('th');

  //     // Loop over each <th> element and set its text to the corresponding category title
  //     thElements.each(function(index) {
  //       // Check if there's a corresponding category object
  //       if (categoryData[index]) {
  //         // Set the text of this <th> to the category title
  //         $(this).text(categoryData[index].title);
  //       } else {
  //         // Optional: Clear the text if there are more <th> elements than categories
  //         $(this).text('');
  //       }
  //     });
  //   } else {
  //     console.log('No category data available');
  //   }
  // } catch (error) {
  //   console.error('Error filling table:', error);
  // }
}


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
  // // Remove hidden class to make the table visible
  // $('.hidden').removeClass();
  // // Update the button used to fetch data
  /////////////////////////VERSION 2
  // Remove hidden class to make the table visible
  $('.hidden').removeClass();

  // Display the titles 
  fillTable();
}

// Handle click on star button to display table with categories and ?
$('.start-button').on('click', showLoadingView);

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {

}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  getCategoryIds();

}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO