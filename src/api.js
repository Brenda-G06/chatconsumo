const express = require("express");
const cors = require("cors");
require('dotenv').config();


const token = require("./util/token.js");
const salaController = require("./controllers/salaController.js");
const usuarioController = require("./controllers/usuarioController.js");

const app = express();

// Configuração de CORS
const corsOptions = {
  origin: "*", // Permitir acesso de qualquer origem
};
app.use(cors(corsOptions));

// Middlewares para parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Criação de um Router para agrupar rotas
const router = express.Router();

// Rota raiz
router.get("/", (req, res) => {
  res.status(200).send("<h1>API - CHAT</h1>");
});

// Rota /sobre
router.get("/sobre", (req, res) => {
  res.status(200).send({
    nome: "API - CHAT",
    versão: "0.1.0",
    autor: "Ademir Gross",
  });
});

// Rota para entrar (registrar usuário)
router.post("/entrar", async (req, res) => {
  try {
    const { nick } = req.body;
    if (!nick) return res.status(400).send({ msg: "Nick é obrigatório" });

    const resp = await usuarioController.entrar(nick);
    res.status(200).send(resp);
  } catch (err) {
    console.error("Erro na rota /entrar:", err);
    res.status(500).send({ msg: "Erro ao registrar usuário" });
  }
});

// Rota para listar salas
router.get("/salas", async (req, res) => {
  try {
    if (await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) {
      const resp = await salaController.get();
      res.status(200).send(resp);
    } else {
      res.status(401).send({ msg: "Usuário não autorizado" });
    }
  } catch (err) {
    console.error("Erro na rota /salas:", err);
    res.status(500).send({ msg: "Erro ao listar salas" });
  }
});

// Rota para entrar em uma sala
router.put("/sala/entrar", async (req, res) => {
  try {
    if (!(await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))) {
      return res.status(401).send({ msg: "Usuário não autorizado" });
    }

    const resp = await salaController.entrar(req.headers.iduser, req.query.idsala);
    res.status(200).send(resp);
  } catch (err) {
    console.error("Erro na rota /sala/entrar:", err);
    res.status(500).send({ msg: "Erro ao entrar na sala" });
  }
});

// Rota para enviar mensagem
router.post("/sala/mensagem", async (req, res) => {
  try {
    if (!(await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))) {
      return res.status(401).send({ msg: "Usuário não autorizado" });
    }

    const { msg, idSala } = req.body;
    const resp = await salaController.enviarMensagem(req.headers.nick, msg, idSala);
    res.status(200).send(resp);
  } catch (err) {
    console.error("Erro na rota /sala/mensagem:", err);
    res.status(500).send({ msg: "Erro ao enviar mensagem" });
  }
});

// Rota para buscar mensagens de uma sala
router.get("/sala/mensagens", async (req, res) => {
  try {
    if (!(await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))) {
      return res.status(401).send({ msg: "Usuário não autorizado" });
    }

    const { idSala, timestamp } = req.query;
    const resp = await salaController.buscarMensagens(idSala, timestamp);
    res.status(200).send(resp);
  } catch (err) {
    console.error("Erro na rota /sala/mensagens:", err);
    res.status(500).send({ msg: "Erro ao buscar mensagens" });
  }
});

// Rota para sair da sala
router.put("/sala/sair", async (req, res) => {
  try {
    if (!(await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))) {
      return res.status(401).send({ msg: "Usuário não autorizado" });
    }

    const resp = await salaController.sair(req.headers.iduser);
    res.status(200).send(resp);
  } catch (err) {
    console.error("Erro na rota /sala/sair:", err);
    res.status(500).send({ msg: "Erro ao sair da sala" });
  }
});

// Rota para sair do sistema (remover usuário)
router.post("/sair-user", async (req, res) => {
  try {
    if (!(await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))) {
      return res.status(401).send({ msg: "Usuário não autorizado" });
    }

    const resp = await salaController.sairUser(req.headers.iduser);
    res.status(200).send(resp);
  } catch (err) {
    console.error("Erro na rota /sair-user:", err);
    res.status(500).send({ msg: "Erro ao sair do sistema" });
  }
});

// Registrar o Router no app
app.use("/", router);

// Exportar o app
module.exports = app;
