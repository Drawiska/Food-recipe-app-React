const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// event listenery
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// druhý search stisknutím button ENTER

// získání MealListu po 0.5 sekundách, když user přestane psát
function automaticSearch(){
    let timeout = null;

    document.getElementById('search-input').addEventListener('keyup', function (e) {
       
        clearTimeout(timeout);
    
        timeout = setTimeout(function () {
            getMealList();
        }, 500);
    });
    
}

document.getElementById('search-input').addEventListener('keypress', function(e){
    if (e.key === 'Enter') {
        getMealList();
      }
      else{
          automaticSearch();
      }
});

// získání jídel odpovídajícím input ingredienci (api-receptů)
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, your input is too short or there's no meal for you <br>😖 😖 😖 ";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}

/*zrušení funkce getMealList - když lenght<3 tak break, else zpuštění funkce
function breakFunctionByLength (){
    if(searchInputTxt.length>3){
        getMealList();
    }
    else{
        break getMealRecipe(e);
    }
}*/



// získání receptu
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// lístečky s názvem receptu obrázkem, RECEPTEM a linkem na YT
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}