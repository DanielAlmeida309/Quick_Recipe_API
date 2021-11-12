const cheerio = require('cheerio');
const axios = require('axios');
const websites = [
    {//0
        name: 'petiscos',
        address: 'https://www.petiscos.com/tipo-receitas/bimby/'
    },
    {//1
        name: 'Pingo Doce',
        address: 'https://www.pingodoce.pt/receitas/pesquisa/'
    },
    {//2
        name: '24Kitchen',
        address: 'https://www.24kitchen.pt/receita/'
    },
    {//3
        name: 'teleculinaria',
        address: 'https://www.teleculinaria.pt/receitas/',
        num_pages: '4'
    }
];
exports.capture_all = (req, res) => {
    const recipes = [];
    const arrayGets = [];

    websites.forEach( website => {   //criar array de gets
        if(website.name === 'teleculinaria')
            for(let i = 1; i <= website.num_pages; i++)
                arrayGets.push(axios.get(website.address.concat(`page/${i}/`)));
        else
            arrayGets.push(axios.get(website.address));
    });

    axios.all(arrayGets)
    .then(axios.spread( (...responses) => {
        var i = 0; //iterator for number of recipes
        
        //pegando o html do website[0]
        let html = responses[0].data;
        let $ = cheerio.load(html);

        $('h4', 'div.detail', html).each(function() {   //pegar os dados que queremos tirando da página html
            const title = $(this).text();
            const url = $('a', this).attr('href');
            i++;

            recipes.push({  //adidionar no array de receitas
                i,
                title,
                url,
                source: websites[0].name             
            });     
        });

        //pegando o html do website[1]
        html = responses[1].data;
        $ = cheerio.load(html);
        
        $('a.recipe', html).each(function() {          //pegar os dados que queremos tirando da página html
            const title = $('div.title',this).text();
            const url = $(this).attr('href');
            i++;

            recipes.push({  //adidionar no array de receitas   
                i,
                title,
                url,
                source: websites[1].name             
            });     
        });        

        //pegando o html do website[2]
        html = responses[2].data;
        $ = cheerio.load(html);

        $('div.cardBox', html).each(function() {          //pegar os dados que queremos tirando da página html
            const url = $('a', this).attr('href');
            const title = $('a',this).attr('title');
            i++;

            recipes.push({  //adidionar no array de receitas   
                i,
                title,
                link: websites[2].address + url.substr(1),
                source: websites[2].name             
            });     
        });

        //pegando o html das paginas do website[3]
        for(let j = 0; j < websites[3].num_pages; j++){
            html = responses[3 + j].data;
            $ = cheerio.load(html);
            
            $('h3.entry-title','div.td_module_3').each(function() {          //pegar os dados que queremos tirando da página html
                const url = $('a', this).attr('href');
                const title = $('a', this).text();
                i++;
    
                recipes.push({  //adidionar no array de receitas 
                    i,
                    title,
                    link: url,
                    source: websites[3].name
                });
            });   
        }
        
        console.log(recipes);
        res.json(recipes);

    })).catch( errors => console.log(errors));


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
            $('div.cardBox', html).each(function() {          //pegar os dados que queremos tirando da página html
                const url = $('a', this).attr('href');
                const title = $('a',this).attr('title');
                i++;
    
                recipes.push({  //adidionar no array de receitas   
                    i,
                    title,
                    link: websites[2].address + url.substr(1),
                    source: websites[2].name             
                });     
            });
            res.json(recipes);
        });
    }else if(websites[3].name === id){
        const arrayGets = [];

        for(let j = 1; j <= websites[3].num_pages; j++){  //criar um array com todos os url do site
            arrayGets.push(axios.get(websites[3].address.concat(`page/${j}/`)));
        }

        axios.all(arrayGets)
        .then(axios.spread( (...responses) => {

            responses.forEach( response => {
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
            });
            res.json(recipes);      
        })).catch( errors => console.log(errors));

    }

};

exports.capture_key = (params, res) => {
    const key = params;
    const recipes = [];
    const arrayGets = [];

    //pega em todos os links dos sites
    websites.forEach( website => {   //criar array de gets
        if(website.name === 'teleculinaria')
            for(let i = 1; i <= website.num_pages; i++)
                arrayGets.push(axios.get(website.address.concat(`page/${i}/`)));
        else
            arrayGets.push(axios.get(website.address));
    });

    axios.all(arrayGets)
    .then(axios.spread( (...responses) => {
        var i = 0; //iterator for number of recipes
        
        //pegando o html do website[0]
        let html = responses[0].data;
        let $ = cheerio.load(html);

        $('h4', 'div.detail', html).each(function() {   //pegar os dados que queremos tirando da página html
            const title = $(this).text();
            const url = $('a', this).attr('href');
            i++;

            recipes.push({  //adidionar no array de receitas
                i,
                title,
                link: url,
                source: websites[0].name             
            });     
        });

        //pegando o html do website[1]
        html = responses[1].data;
        $ = cheerio.load(html);
        
        $('a.recipe', html).each(function() {          //pegar os dados que queremos tirando da página html
            const title = $('div.title',this).text();
            const url = $(this).attr('href');
            i++;

            recipes.push({  //adidionar no array de receitas   
                i,
                title,
                link: url,
                source: websites[1].name             
            });     
        });        

        //pegando o html do website[2]
        html = responses[2].data;
        $ = cheerio.load(html);

        $('div.cardBox', html).each(function() {          //pegar os dados que queremos tirando da página html
            const url = $('a', this).attr('href');
            const title = $('a',this).attr('title');
            i++;

            recipes.push({  //adidionar no array de receitas   
                i,
                title,
                link: websites[2].address + url.substr(1),
                source: websites[2].name             
            });     
        });

        //pegando o html das paginas do website[3]
        for(let j = 0; j < websites[3].num_pages; j++){
            html = responses[3 + j].data;
            $ = cheerio.load(html);
            
            $('h3.entry-title','div.td_module_3').each(function() {          //pegar os dados que queremos tirando da página html
                const url = $('a', this).attr('href');
                const title = $('a', this).text();
                i++;
    
                recipes.push({  //adidionar no array de receitas 
                    i,
                    title,
                    link: url,
                    source: websites[3].name
                });
            });   
        }

        const recipes_with_key = [];  
    
        //criar um vetor com todos os urls das receitas
        const getRecipes = [];
        recipes.forEach( infoRecipe => getRecipes.push( axios.get( infoRecipe.link ) ));

        //vai buscar o html de todas as páginas
        axios.all(getRecipes)
        .then(axios.spread( (...responses) => {
            
            //verificar de qual site é a pagina da receita
            for(let j = 0; j < recipes.length; j++){

                if(recipes[j].source === "Pingo Doce"){ //

                    const html = responses[j].data;
                    const $ = cheerio.load(html);
                    $('.ingredient', '.recipe-content').each(function() {
                        const description = $('div.description', this).text();
                        if(description.concat(" ").search(key.concat(" ")) != -1){ //agora vai verificar se tem o ingrediente inserido na key 
                            recipes_with_key.push({
                                title: recipes[j].title,
                                link: recipes[j].link,
                                source: recipes[j].source,
                                key: key
                            })
                        }
                    });   

                }else if(recipes[j].source === "teleculinaria"){

                    const html = responses[j].data;
                    const $ = cheerio.load(html);
                    $('span.wprm-recipe-ingredient-name', '.wprm-recipe-ingredient-group').each(function() {
                        const description = $('a', this).text();
                        if(description.concat(" ").search(key.concat(" ")) != -1){ //agora vai verificar se tem o ingrediente inserido na key 
                            recipes_with_key.push({
                                title: recipes[j].title,
                                link: recipes[j].link,
                                source: recipes[j].source,
                                key: key
                            })
                        }
                    });   

                }
            }

            res.json(recipes_with_key);
        })).catch( errors => console.log(errors.message));

    })).catch( errors => console.log(errors));


}