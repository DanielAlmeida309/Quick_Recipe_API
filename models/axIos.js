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
        address: 'https://www.teleculinaria.pt/receitas/'
    },
    {//4
        name: 'teleculinaria',
        address: 'https://www.teleculinaria.pt/receitas/page/2/'
    },
    {//5
        name: 'teleculinaria',
        address: 'https://www.teleculinaria.pt/receitas/page/3/'
    },
    {//6
        name: 'teleculinaria',
        address: 'https://www.teleculinaria.pt/receitas/page/4/'
    }
];
exports.capture_all = (req, res) => {
    var recipes = [];
    const arrayGets = [];
    const i = 0;

    websites.forEach( website => arrayGets.push(axios.get(website.address)) );

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
            const title = $('h3',this).text();
            i++;

            recipes.push({  //adidionar no array de receitas   
                i,
                title,
                link: websites[2].address + title.replace(/ /g, "-"),
                source: websites[2].name             
            });     
        });

        //pegando o html das paginas do website[3]
        for(let j = 3; j < 7; j++){
            html = responses[j].data;
            $ = cheerio.load(html);
            
            $('h3.entry-title','div.td_module_3').each(function() {          //pegar os dados que queremos tirando da página html
                const url = $('a', this).attr('href');
                const title = $('a', this).text();
                i++;
    
                recipes.push({  //adidionar no array de receitas 
                    i,
                    title,
                    link: url,
                    source: websites[j].name
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
    }else if(websites[3].name === id){
        const arrayGets = [];

        for(let j = 3; j < 7; j++){  //criar um array com todos os url do site
            arrayGets.push(axios.get(websites[j].address));
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