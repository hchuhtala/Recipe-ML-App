// GET ingredients from cookie on ingredients page
function getIngredients() {
    fetch('/getIngredients')
        .then(function (response) {
            return response.text();
        }).then(function (text) {
            ingredients = text;
            console.log('GET response ingredients:');
            console.log(ingredients); // Print the greeting as text
            return ingredients;
        });
}

// This will be the array from the ingredients page, AND cuisine from map page
//let ingredientsArray = ["tomatoes", "garlic", "chicken breasts"];
fetch('/getIngredients')
    .then(function (response) {
        return response.text();
    }).then(function (text) {
        ingredients = text;
        return ingredients;
    }).then(function (ingredientsArray) {
        ingredientsArray = ingredientsArray.split(",")
        // console.log("ingredientsArray ", ingredientsArray);
        // console.log("ingredientsArray typeof", typeof ingredientsArray)
        // This will be cuisine from the main page
        let cuisine = ingredientsArray.shift().toString();
        let API_KEY_S = ingredientsArray.pop().toString();
        //console.log("key in recipes: ",API_KEY_S)
        // console.log("Cuisine from array: ", cuisine);
        // console.log('Ingredients:');
        // console.log(ingredientsArray); 

        let clnIngArray = ingredientsArray.map(ingredient => ingredient.replace(" ", "+"));
        console.log("clnIngArray: ", clnIngArray);
        let resultLimit = 6;

        let ingredientCall = "https://api.spoonacular.com/recipes/complexSearch?apiKey=" + API_KEY_S + "&cuisine=" + cuisine + "&includeIngredients=" + clnIngArray + "&sort=popularity&number=" + resultLimit;

        // make API call
        d3.json(ingredientCall, function (jsonData) {
            let results = jsonData.results;
            let recipeIDs = results.map(result => result.id);

            recipeIDs.forEach(function (recipeID) {
                let recipeCall = "https://api.spoonacular.com/recipes/" + recipeID + "/information?apiKey=" + API_KEY_S;
                console.log(recipeCall);
                d3.json(recipeCall, function (recipe) {
                    let resultsArray = [];
                    let recipeTitle = recipe.title;
                    let recipeImg = recipe.image;
                    let recipeURL = recipe.sourceUrl;

                    resultsArray.push({
                        "image": recipeImg,
                        "title": recipeTitle,
                        "url": recipeURL
                    });

                    let tableBody = d3.select("tbody");

                    // Define function for adding rows
                    function addTableRows(tableFill) {

                        // Loop through data
                        tableFill.forEach(function (recipeInfo) {

                            // Add new row
                            let newRow = tableBody.append("tr");
                            console.group(newRow);

                            // Loop through data objects
                            Object.entries(recipeInfo).forEach(function ([key, value]) {
                                // Add data to the row one cell at a time
                                if (key == "image") {
                                    let imgID = `recipe-image${recipeID}`
                                    let newCell = newRow.append("td").attr("id", imgID);
                                    displayImage(value, imgID);
                                }
                                else if (key == "url") {
                                    let newCell = newRow.append("td").append('a').attr("href",value).text(value);
                                }
                                else {
                                    let newCell = newRow.append("td").text(value);
                                };
                            });
                        });
                    };

                    function displayImage(value, imgID) {
                        var img = new Image();
                        img.src = value;
                        img.setAttribute("class", "banner-img");
                        img.setAttribute("alt", "effy");
                        document.getElementById(imgID).appendChild(img);
                    };

                    addTableRows(resultsArray);
                });
            });
        });
    });
