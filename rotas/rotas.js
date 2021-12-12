module.exports = app => {
    const controlador = require("../controladores/controller.js");

    var router = require("express").Router();

    // Envia todas as receitas de todos os sites
    router.get("/recipes", controlador.findAll);

    // Envia todas as receitas de um site
    router.get("/recipes/:id", controlador.findAll_oneSite);

    // Envia receitas com um determinado ingrediente de todos os sites
    router.post("/recipes/key/:key", controlador.findKey);

    // Envia receitas com dois ingrediente de todos os sites
    router.post("/recipes/key/:key/key2/:key2", controlador.find2Keys);

    // Cria um novo utilizador
    router.post("/registar", controlador.registar);
  
    // Rota para login - tem de ser POST para não vir user e pass na URL
    router.post("/login", controlador.login);



    app.use('/', router);
};