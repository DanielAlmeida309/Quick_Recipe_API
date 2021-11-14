const axios = require("../models/axIos");
const test = require("../models/testes");

// Mensagem default
exports.default = (req, res) => {
    console.log("Message Default!");
    res.json('Welcome to my Quick Recipes API');
};

// Envia todas as receitas de todos os sites
exports.findAll = (req, res) => {
    console.log("FindAll");
    axios.capture_all(req,res);
};

// Envia todas as receitas de um site
exports.findAll_oneSite = (req, res) => {
    console.log("FindAll of 1 website");
    axios.capture_all_1site(req.params.id, res);
};

// Envia receitas com um determinado ingrediente de todos os sites
exports.findKey = (req, res) => {
    console.log("Find Key");
    const key = req.params.key;
    console.log("Key: " + key);
    axios.capture_key(key, res);
    //test.capture_key(key, res);
};

exports.find2Keys = (req, res) => {
    console.log("Find 2 Keys");
    const key = req.params.key;
    const key2 = req.params.key2;
    console.log("Key: ", key, "\nKey2: ", key2);
    axios.capture_2keys([key, key2], res);
};
