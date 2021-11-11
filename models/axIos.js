const cheerio = require('cheerio');
const axios = require('axios');
const websites = [
    {
        name: 'petiscos',
        address: 'https://www.petiscos.com/tipo-receitas/bimby/'
    },
    {
        name: 'Pingo Doce',
        address: 'https://www.pingodoce.pt/receitas/pesquisa/'
    },
    {
        name: '24Kitchen',
        address: 'https://www.24kitchen.pt/receita/'
    },
    {
        name: 'teleculinaria',
        address: 'https://www.teleculinaria.pt/receitas/'
    }  
];
exports.capture_all = (req, res) => {
    var recipes = [];
    const i = 0;

    axios.get(websites[0].address)   //saca dados do 1 site
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            var i = 0;
            $('h4', 'div.detail', html).each(function() {
                const title = $(this).text();
                const url = $('a', this).attr('href');
                i++;

                recipes.push({
                    i,
                    title,
                    url,
                    source: websites[0].name             
                });     
            });
    
            axios.get(websites[1].address)   //saca dados do 2 site
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                $('a.recipe', html).each(function() {
                    const title = $('div.title',this).text();
                    const url = $(this).attr('href');
                    i++;
    
                    recipes.push({
                        i,
                        title,
                        url,
                        source: websites[1].name             
                    });     
                });
                const websiteAddress = websites[2].address;
                axios.get(websiteAddress)   //saca dados do 3 site
                .then(response => {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    $('div.cardBox', html).each(function() {
                        const url = $('a', this).attr('href');
                        const title = $('h3',this).text();
                        i++;
        
                        recipes.push({
                            i,
                            title,
                            link: websiteAddress + title.replace(/ /g, "-"),
                            source: websites[2].name             
                        });     
                    });
                    axios.get(websites[3].address)   //saca dados do 4 site
                    .then(response => {
                        const html = response.data;
                        const $ = cheerio.load(html);
                        $('h3.entry-title','div.td_module_3').each(function() {
                            const url = $('a', this).attr('href');
                            const title = $('a', this).text();
                            i++;

                            recipes.push({
                                i,
                                title,
                                link: url,
                                source: websites[3].name
                            });
                        });           
                        res.json(recipes);
                        res.end();
                    });
                });
            });           
        }); 
};

exports.capture_key_oneSite = (params, res) => {
    const websiteName = params[0];
    const key = params[1];
    const websiteRecipes = [];



    var i = 0; //incrementador do numero da receita
    if(websites[1].name === websiteName){
        const websiteAddress = websites[1].address;
        axios.get(websiteAddress)
        .then(resposta => {
            const html = resposta.data;
            const $ = cheerio.load(html);
            $('a.recipe', html).each(function() {
                const titleRecipe = $('div.title',this).text();
                const urlRecipe = $(this).attr('href');

                websiteRecipes.push({titleRecipe, urlRecipe});
            });
            return websiteRecipes;
        })
        .then( websiteRecipes => {
            const recipes = [];
            websiteRecipes.forEach( website => {
                axios.get(website.urlRecipe)
                .then( responseRecipe => {
                    const htmlRecipe = responseRecipe.data;
                    const $ = cheerio.load(htmlRecipe);
                    $('.ingredient', '.recipe-content').each(function() {
                        const description = $('div.description', this).text();
                        console.log(key, "     ", description, "    =     ", key.valueOf() === description.valueOf());
                        if(key.valueOf() === description.valueOf()){
                            i++;
                            recipes.push({
                                i: i,
                                recipeTitle: website.titleRecipe,
                                recipeUrl: website.urlRecipe,
                                key: key
                            });
                            console.log(recipes);
                        }
                    });   
                })
                
            });

            console.log(recipes);
            return recipes;
        })
        .then( recipes => {
            if(recipes.length == 0)
                recipes.push({i: "0"});
            console.log(recipes);
            res.json(recipes);
            res.end();           
        }).catch(error => console.log(error));

    }else if(websites[2].name === websiteName){
        const websiteAddress = websites[2].address;

        axios.get(websiteAddress)
        .then(resposta => {
            const html = resposta.data;
            const $ = cheerio.load(html);
            $('div.cardBox', html).each(function() {
                const titleRecipe = $('h3',this).text();
                const urlRecipe = websiteAddress + titleRecipe.replace(/ /g, "-")

                websiteRecipes.push({titleRecipe, urlRecipe});
            });

            //verificar em todas as receitas qual tem o ingrediente inserido na receita
            for(let j = 0; j<websiteRecipes.length; j++){
                axios.get(websiteRecipes[j].urlRecipe)
                .then( responseRecipe => {
                    const htmlRecipe = responseRecipe.data;
                    const $ = cheerio.load(htmlRecipe);

                    $('li', '.ingredientContent').each(function() {
                        const description = $(this).text();
                        //console.log(description);


                        

                    });

                });
            }
            //envia os dados
            setInterval(function(){ 
                res.json(recipes);
                res.end(); 
            }, 5000);
            
        });
    };

};





exports.capture_all_1site = (id, res) => {
    const recipes = [];
    var i = 0;
    if(websites[0].name === id){
        const websiteAddress = websites[0].address;
        
        axios.get(websiteAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            $('h4', 'div.detail', html).each(function() {
                const title = $(this).text();
                const url = $('a', this).attr('href');
                i++;        
                recipes.push({
                    i,
                    title,
                    url            
                });   
            });
            res.json(recipes);
        });

    }else if(websites[1].name === id){
        const websiteAddress = websites[1].address;

        axios.get(websiteAddress)   //saca dados do 2 site
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                $('a.recipe', html).each(function() {
                    const title = $('div.title',this).text();
                    const url = $(this).attr('href');
                    i++;
    
                    recipes.push({
                        i,
                        title,
                        url,
                        source: websiteAddress.name             
                    });     
                });
                res.json(recipes);
            });

    }else if(websites[2].name === id){
        const websiteAddress = websites[2].address;

        axios.get(websiteAddress)   //saca dados do 3 site
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            $('div.cardBox', html).each(function() {
                const url = $('a', this).attr('href');
                const title = $('h3',this).text();
                i++;

                recipes.push({
                    i,
                    title,
                    link: websiteAddress + title.replace(/ /g, "-"),
                    source: websites[2].name             
                });     
            });
            res.json(recipes);
        });
    };

};