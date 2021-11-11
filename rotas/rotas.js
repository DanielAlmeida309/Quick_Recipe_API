module.exports = app => {
    const controlador = require("../controladores/controller.js");

    var router = require("express").Router();

    // Mensagem default
    router.get("/", controlador.default);

    // Envia todas as receitas de todos os sites
    router.get("/recipes", controlador.findAll);

    // Envia todas as receitas de um site
    router.get("/recipes/:id", controlador.findAll_oneSite);

    // Envia receitas com um determinado ingrediente de todos os sites
    router.get("/recipes/key/:key", controlador.findKey);

    app.use('/', router);
};