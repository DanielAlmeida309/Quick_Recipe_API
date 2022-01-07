const buttonsAllR = document.querySelectorAll("[data-section-button]");
const buttonsWebsites = document.querySelectorAll("[data-website-button]");
const buttonIngredients = document.getElementById("button-ingredient-search");
var allRecipes = [];

//script do nav
buttonsAllR.forEach(button => {
  button.addEventListener("click", () => {
    const nextSection = document.querySelector("#"+button.dataset.sectionButton); 
    const nextButton = button;
    const actualSection = document.querySelector("[data-active-s]");
    const actualButton = document.querySelector("[data-active-b]");
    
    //retirar o data-active da section atual
    delete actualSection.dataset.activeS;

    //retirar o data-active do botão atual
    delete actualButton.dataset.activeB;

    //colocar o data-active na nova section 
    nextSection.dataset.activeS = true;

    //colocar o data-active no novo botão
    nextButton.dataset.activeB = true;
    console.log(button.dataset.sectionButton);
    if(button.dataset.sectionButton == "s1" & localStorage.getItem("token") == null){
      bsModalInfo.show();
      getAllRecipes();
    }else{
      getAllRecipes();   
    }

  })
});

//script da escolha de website
buttonsWebsites.forEach(button => {
  button.addEventListener("click", () => {
    const listRecipes = document.getElementById("recipes-1site");
    listRecipes.innerText = ""; // remove tudo da div
    buttonsWebsites.forEach(buttonW => buttonW.classList.remove('active')); //tira active de todos os botões
    button.classList.add('active'); //colocar classe active
    getRecipes1Site(button.dataset.websiteButton);
  })
});

buttonIngredients.addEventListener("click", () => {
  const listRecipes = document.getElementById("AllRecipes");
  listRecipes.innerText = ""; // remove tudo da div
  const ingredients = [document.getElementById("Ingredient1").value , document.getElementById("Ingredient2").value];
  console.log(ingredients);
  if(ingredients[0] == '' && ingredients[1] == ''){
    getAllRecipes();
  }else if(ingredients[1] == ''){
    getRecipes1Ingredient(ingredients[0]);
  }else{
    getRecipes2Ingredients(ingredients[0], ingredients[1]);
  }

});

function getRecipes1Ingredient(key){
  (async () => {
    const urlBase = `http://localhost:8000/recipes/key/${key}`;
    const listRecipes = document.getElementById("AllRecipes");
    listRecipes.innerHTML = "<img src='images/loading.gif'>";
    let texto = "";

    await fetch(`${urlBase}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(allRecipes)
    }).then(async function (response) {
      if (!response.ok) {
        listRecipes.innerHTML ="Não existem receitas disponíveis de momento!";
      } else {
        recipes = await response.json();
        if (recipes.length == 0){
          listRecipes.innerHTML ="Não existem receitas disponíveis de momento!";          
        } else {
          for (const recipe of recipes) {
            texto += `
              <div class="card card-recipes text-center" style="width: 18rem;">
                <div class="col">
                  <img src="${recipe.urlPhoto}" class="card-img-top" alt="${recipe.title}" style="padding:4%;">
                  <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <p class="card-text"><h6>Source:</h6> ${recipe.source}</p>
                    <a href="${recipe.url}" class="btn btn-success" target="_blank">Go to Recipe</a>
                  </div>
                </div>
              </div>`;
          }
          listRecipes.innerHTML = texto;
        }
      }
    });
  })(); 
}

function getRecipes2Ingredients(key1, key2){
  (async () => {
    const urlBase = `http://localhost:8000/recipes/key/${key1}/key2/${key2}`;
    const listRecipes = document.getElementById("AllRecipes");
    listRecipes.innerHTML = "<img src='images/loading.gif'>";
    let texto = "";
  
    await fetch(`${urlBase}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(allRecipes)
    }).then(async function (response) {
      if (!response.ok) {
        listRecipes.innerHTML =
          "Não existem receitas disponíveis de momento!";
      } else {
        recipes = await response.json();
        console.log(recipes);
        if (recipes.length == 0){
          listRecipes.innerHTML ="Não existem receitas disponíveis de momento!";          
        } else {
          for (const recipe of recipes) {
            texto += `
              <div class="card card-recipes text-center" style="width: 18rem;">
                <div class="col">
                  <img src="${recipe.urlPhoto}" class="card-img-top" alt="${recipe.title}" style="padding:4%;">
                  <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <p class="card-text"><h6>Source:</h6> ${recipe.source}</p>
                    <a href="${recipe.url}" class="btn btn-success" target="_blank">Go to Recipe</a>
                  </div>
                </div>
              </div>`;
          }
          listRecipes.innerHTML = texto;
        }
      }
    });
  })(); 
}

function getRecipes1Site(site){
  (async () => {
    const urlBase = `http://localhost:8000/recipes/${site}`;
    const listRecipes = document.getElementById("recipes-1site");
    listRecipes.innerHTML = "<img src='images/loading.gif'>";
    let texto = "";
    var myHeaders = new Headers();
  
    var myInit = { method: "GET", headers: myHeaders };
  
    var myRequest = new Request(`${urlBase}`, myInit);
  
    await fetch(myRequest).then(async function (response) {
      if (!response.ok) {
        listRecipes.innerHTML =
          "Não existem receitas disponíveis de momento!";
      } else {
        recipes = await response.json();
        for (const recipe of recipes) {
          texto += `
          <div class="card card-recipes text-center" style="width: 18rem;">
            <div class="col">
              <img src="${recipe.urlPhoto}" class="card-img-top" alt="${recipe.title}" style="padding:4%;">
              <div class="card-body">
                <h5 class="card-title">${recipe.title}</h5>
                <p class="card-text"><h6>Source:</h6> ${recipe.source}</p>
                <a href="${recipe.url}" class="btn btn-success" target="_blank">Go to Recipe</a>
              </div>
            </div>
          </div>`;
        }
        listRecipes.innerHTML = texto;
      }
    });
  })(); 
}

function getAllRecipes(){
  (async () => {
    const urlBase = "http://localhost:8000/recipes";
    const listRecipes = document.getElementById("AllRecipes");
    listRecipes.innerHTML = "<img src='images/loading.gif'>";
    let texto = "";
    allRecipes = [];
    var myHeaders = new Headers();
  
    var myInit = { method: "GET", headers: myHeaders };
  
    var myRequest = new Request(`${urlBase}`, myInit);
  
    await fetch(myRequest).then(async function (response) {
      if (!response.ok) {
        listRecipes.innerHTML =
          "Não existem receitas disponíveis de momento!";
      } else {
        recipes = await response.json();
        console.log(localStorage.getItem("token"));
        if (localStorage.getItem("token") === null) {
        
          for (let i = 0; i < 15; i++){
            allRecipes.push(recipes[i]);
            texto += `
              <div class="card card-recipes text-center" style="width: 18rem;">
                <div class="col">
                  <img src="${recipes[i].urlPhoto}" class="card-img-top" alt="${recipes[i].title}" style="padding:4%;">
                  <div class="card-body">
                    <h5 class="card-title">${recipes[i].title}</h5>
                    <p class="card-text"><h6>Source:</h6> ${recipes[i].source}</p>
                    <a href="${recipes[i].url}" class="btn btn-success" target="_blank">Go to Recipe</a>
                  </div>
                </div>
              </div>`;
          }
        }else{
          for (const recipe of recipes) {
            allRecipes.push(recipe);
            texto += `
              <div class="card card-recipes text-center" style="width: 18rem;">
                <div class="col">
                  <img src="${recipe.urlPhoto}" class="card-img-top" alt="${recipe.title}" style="padding:4%;">
                  <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <p class="card-text"><h6>Source:</h6> ${recipe.source}</p>
                    <a href="${recipe.url}" class="btn btn-success" target="_blank">Go to Recipe</a>
                  </div>
                </div>
              </div>`;
          }
        }
        listRecipes.innerHTML = texto;
      }
    });
  })();
}



