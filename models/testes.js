const cheerio = require('cheerio');
const axios = require('axios');

exports.capture_key = (params, res) => {
    const key = params;
    const recipes = [];

    sitesRecipes("https://www.pingodoce.pt/receitas/pesquisa/")
    .then(websiteRecipes => {
        allRecipes(websiteRecipes, key, res);
    });
}

async function sitesRecipes(url){
    try{
        const websiteRecipes = [];
        
        const response = await axios.get(url);

        const html = response.data;
        const $ = cheerio.load(html);
        $('a.recipe', html).each(function() {
            const titleRecipe = $('div.title',this).text();
            const urlRecipe = $(this).attr('href');

            websiteRecipes.push({titleRecipe, urlRecipe});
        });

        return await websiteRecipes;

    } catch (error){
        console.error(error);
    }
}

async function allRecipes(websiteRecipes, key, res) {
    try{
        const autobot = [];
        for(website of websiteRecipes){ 
            const recipe = {
                recipeTitle: null,
                recipeUrl: null,
                key: null
            };

            const response = await axios.get(website.urlRecipe);

            const html = response.data;
            const $ = cheerio.load(html);
            $('.ingredient', '.recipe-content').each(function() {
                const description = $('div.description', this).text();
                if(description.concat(" ").search(key.concat(" ")) != -1){  //key.valueOf() === description.valueOf()
                    recipe.recipeTitle = website.titleRecipe;
                    recipe.recipeUrl = website.urlRecipe;
                    recipe.key = key;
                    console.log(recipe);
                    autobot.push(recipe);
                }
            });    
        
        }
        res.json(autobot);
        //return await autobot;
        
    } catch (error){
        console.error(error);
    }
}
