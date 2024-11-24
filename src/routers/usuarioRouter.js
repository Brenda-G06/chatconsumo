const express = require("express");
const usuarioController = require("../controllers/usuarioController");

const router = express.Router();

// Entrar (registrar ou autenticar)
router.post("/entrar", async (req, res) => {
  const { nick } = req.body;

  if (!nick) {
    return res.status(400).json({ error: "Nick é obrigatório." });
  }

  const resultado = await usuarioController.entrar(nick);
  if (resultado) {
    return res.status(200).json(resultado);
  } else {
    return res.status(500).json({ error: "Erro ao entrar como usuário." });
  }
});

// Sair do sistema (remover usuário)
router.post("/sair", async (req, res) => {
  const { idUser } = req.body;

  if (!idUser) {
    return res.status(400).json({ error: "idUser é obrigatório." });
  }

  const resultado = await usuarioController.sairUser(idUser);
  if (resultado) {
    return res.status(200).json(resultado);
  } else {
    return res.status(500).json({ error: "Erro ao sair do sistema." });
  }
});

module.exports = router;
