const express = require("express");
const salaController = require("../controllers/salaController");

const router = express.Router();

// Listar salas
router.get("/listar", async (req, res) => {
  const salas = await salaController.get(req, res);
  return res.status(200).json(salas);
});

// Criar sala
router.post("/criar", salaController.criarSala);

// Entrar em uma sala
router.post("/entrar", async (req, res) => {
  const { iduser, idsala } = req.body;

  if (!iduser || !idsala) {
    return res.status(400).json({ error: "iduser e idsala são obrigatórios." });
  }

  const resultado = await salaController.entrar(iduser, idsala);
  if (resultado) {
    return res.status(200).json(resultado);
  } else {
    return res.status(500).json({ error: "Erro ao entrar na sala." });
  }
});

// Enviar mensagem para uma sala
router.post("/enviarMensagem", async (req, res) => {
  const { nick, msg, idsala } = req.body;

  if (!nick || !msg || !idsala) {
    return res.status(400).json({ error: "nick, msg e idsala são obrigatórios." });
  }

  const resultado = await salaController.enviarMensagem(nick, msg, idsala);
  return res.status(200).json(resultado);
});

// Buscar mensagens
router.get("/buscarMensagens/:idsala/:timestamp", async (req, res) => {
  const { idsala, timestamp } = req.params;

  const mensagens = await salaController.buscarMensagens(idsala, timestamp);
  return res.status(200).json(mensagens);
});

// Sair da sala
router.post("/sair", async (req, res) => {
  const { iduser } = req.body;

  if (!iduser) {
    return res.status(400).json({ error: "iduser é obrigatório." });
  }

  const resultado = await salaController.sair(iduser);
  if (resultado) {
    return res.status(200).json(resultado);
  } else {
    return res.status(500).json({ error: "Erro ao sair da sala." });
  }
});

module.exports = router;
