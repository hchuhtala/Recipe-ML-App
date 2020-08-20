// This will be the array from the ingredients page
let ingredientsArray = ["tomatoes", "garlic", "chicken breasts"];

// This will be cuisine from the main page
let cuisine = "Italian";

let clnIngArray = ingredientsArray.map(ingredient => ingredient.replace(" ", "+"));

let ingredientCall = "https://api.spoonacular.com/recipes/complexSearch?apiKey=" + API_KEY + "&cuisine=" + cuisine + "&includeIngredients=" + clnIngArray + "&sort=popularity&number=3";

// console.log(recipeCall);

// make API call
d3.json(ingredientCall, function (jsonData) {
            let results = jsonData.results;
            let recipeIDs = results.map(result => result.id);
            // console.log(recipeIDs);

            recipeIDs.forEach(function (recipeID) {
                let recipeCall = "https://api.spoonacular.com/recipes/" + recipeID + "/information?apiKey=" + API_KEY;

                d3.json(recipeCall, function (recipe) {
                    let resultsArray = [];
                    let recipeTitle = recipe.title;
                    let recipeImg = recipe.image;
                    let recipeURL = recipe.sourceUrl;

                    resultsArray.push({
                        "image": recipeImg,
                        "title": recipeTitle,
                        "url" : recipeURL
                    });
                    console.log(resultsArray);

                    let tableBody = d3.select("tbody");

                    // Define function for adding rows
                    function addTableRows(tableFill) {

                        // Loop through data
                        tableFill.forEach(function (recipeInfo) {
                            // console.log(recipeInfo);
                            // Add new row
                            let newRow = tableBody.append("tr");
                            console.group(newRow);
                            // Loop through data objects
                            Object.entries(recipeInfo).forEach(function ([key, value]) {
                                // Add data to the row one cell at a time
                                if (key == "image") {
                                    let imgID = `recipe-image${recipeID}`
                                    let newCell = newRow.append("td").attr("id",imgID);
                                    displayImage(value,imgID);
                                }
                                else if (key == "url") {
                                    let newCell = newRow.append("td").append('a').attr("href",value).text(value);
                                }
                                else {
                                let newCell = newRow.append("td").text(value);
                                newCell.classed("recipe-title",true);
                                };
                            });
                        });
                    };

                    function displayImage(value,imgID) {
                        var img = new Image();
                        img.src = value;
                        img.setAttribute("class", "banner-img");
                        img.setAttribute("alt", "effy");
                        document.getElementById(imgID).appendChild(img);
                    };

                    addTableRows(resultsArray);
                });
            });

//     // Select different parts of page that might be needed
//     let filterButton = d3.select("#filter-btn");
//     let inputField1 = d3.select("#datetime");
//     let inputField2 = d3.select("#city");
//     let inputField3 = d3.select("#state");
//     let inputField4 = d3.select("#country");
//     let inputField5 = d3.select("#shape");
//     let tableBody = d3.select("tbody");

//     // Define function for adding rows
//     function addTableRows(tableFill) {

//         // Loop through data
//         tableFill.forEach(function(ufoSighting) {

//             // Add new row
//             let newRow = tableBody.append("tr");

//             // Loop through data objects
//             Object.entries(ufoSighting).forEach(function([key, value]) {
//                 // Add data to the row one cell at a time
//                 let newCell = newRow.append("td").text(value);
//             });
//         });
//     };

//     // Create event handlers
//     filterButton.on("click", filterTable);

//     // Define function for button click
//     function filterTable() {
//         // Prevent the page from refreshing
//         d3.event.preventDefault();

//         // Pull value from date field
//         let dateInput = inputField1.property("value");
//         let cityInput = inputField2.property("value");
//         let stateInput = inputField3.property("value");
//         let countryInput = inputField4.property("value");
//         let shapeInput = inputField5.property("value");

//         // Remove current rows
//         tableBody.html("");

//         // Setup initial data
//         let filteredData = tableData

//         // Filter data
//         if (dateInput != "") {
//             filteredData = filteredData.filter(sighting => sighting.datetime === dateInput);
//         }
        
//         if (cityInput != ""){
//             filteredData = filteredData.filter(sighting => sighting.city === cityInput);
//         }

//         if (stateInput != ""){
//             filteredData = filteredData.filter(sighting => sighting.state === stateInput);
//         }

//         if (countryInput != ""){
//             filteredData = filteredData.filter(sighting => sighting.country === countryInput);
//         }

//         if (shapeInput != ""){
//             filteredData = filteredData.filter(sighting => sighting.shape === shapeInput);
//         }

//         addTableRows(filteredData);
//     };
});