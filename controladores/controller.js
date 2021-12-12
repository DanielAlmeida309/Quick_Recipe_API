const axios = require("../models/axIos");
const db = require("../models/nedb"); // Define o MODEL que vamos usar
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    const allRecipes = req.body;
    const key = req.params.key;
    console.log("Key: " + key);
    axios.capture_key([key,allRecipes], res);
};

exports.find2Keys = (req, res) => {
    console.log("Find 2 Keys");
    const allRecipes = req.body;
    const key = req.params.key;
    const key2 = req.params.key2;
    console.log("Key: ", key, "\nKey2: ", key2);
    axios.capture_2keys([key, key2, allRecipes], res);
};


// REGISTAR - cria um novo utilizador
exports.registar = async (req, res) => {
    console.log("Registar novo utilizador");
    if (!req.body) {
      return res.status(400).send({
        message: "O conteúdo não pode ser vazio!",
      });
    }
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const email = req.body.email;
      const password = hashPassword;
      db.Crud_registar(email, password) // C: Create
        .then((dados) => {
          res.status(201).send({ message: "Utilizador criado com sucesso!" });
          console.log("Dados: ");
          console.log(JSON.stringify(dados)); // para debug
        });
    } catch {
      return res.status(400).send({ message: "Problemas ao criar utilizador" });
    }
  };
  
  // LOGIN - autentica um utilizador
  exports.login = async (req, res) => {
    console.log("Autenticação de um utilizador");
    if (!req.body) {
      return res.status(400).send({
        message: "O conteúdo não pode ser vazio!",
      });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const email = req.body.email;
      const password = hashPassword;
      db.cRud_login(email) //
        .then(async (dados) => {
          if (dados == null) {
            console.log("Não encontrou o utilizador");
            return res.status(401).send({ erro: "Utilizador não encontrado!" });
          }
          if (await bcrypt.compare(req.body.password, dados.password)) {
            const user = { name: email };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken }); // aqui temos de enviar a token de autorização
            console.log("Dados: ");
            console.log(JSON.stringify(dados)); // para debug
          } else {
            console.log("Password incorreta");
            return res.status(401).send({ erro: "A senha não está correta!" });
          }
        });
    } catch {
      return res.status(400).send({ message: dados });
    }
  };


  function authenticateToken(req, res) {
    console.log("A autenticar...");
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      console.log("Token nula");
      return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.email = user;
    });
  }