const salaModel = require("../models/salaModel");
const usuarioModel = require("../models/usuarioModel");

exports.get = async (req, res) => {
    const salas = await salaModel.listarSalas();
    return res.status(200).json(salas);
};

exports.entrar = async (idUser, idSala) => {
    const sala = await salaModel.buscarSala(idSala);
    const user = await usuarioModel.buscarUsuario(idUser);

    if (!sala || !user) {
        return { error: "Sala ou usuário não encontrado." };
    }

    user.sala_id = sala.id;
    const alterado = await usuarioModel.alterarUsuario(user);

    if (alterado) {
        return { msg: "OK", timestamp: Date.now() };
    }
    return { error: "Falha ao entrar na sala." };
};

exports.enviarMensagem = async (nick, msg, idSala) => {
    const mensagem = {
        sala_id: idSala,
        nick,
        msg,
        timestamp: Date.now(),
    };

    const inserido = await salaModel.adicionarMensagem(mensagem);

    if (inserido) {
        return { msg: "OK", timestamp: mensagem.timestamp };
    }
    return { error: "Erro ao enviar mensagem." };
};

exports.buscarMensagens = async (idSala, timestamp) => {
    const mensagens = await salaModel.buscarMensagens(idSala, timestamp);

    if (mensagens.length === 0) {
        return { msg: "Sem novas mensagens." };
    }

    return {
        timestamp: mensagens[mensagens.length - 1].timestamp,
        msgs: mensagens,
    };
};

exports.sair = async (idUser) => {
    const user = await usuarioModel.buscarUsuario(idUser);

    if (!user) {
        return { error: "Usuário não encontrado." };
    }

    user.sala_id = null;
    const alterado = await usuarioModel.alterarUsuario(user);

    if (alterado) {
        return await salaModel.listarSalas();
    }
    return { error: "Erro ao sair da sala." };
};

exports.sairUser = async (idUser) => {
    const user = await usuarioModel.buscarUsuario(idUser);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    const removido = await salaModel.removerUsuarioDaSala(idUser);

    if (removido) {
        return { msg: "OK" };
    } else {
        return { error: "Erro ao remover usuário." };
    }
};

exports.criarSala = async (req, res) => {
    try {
        const { nome, tipo } = req.body;

        if (!nome || !tipo) {
            return res.status(400).json({ error: "Nome e tipo da sala são obrigatórios." });
        }

        const novaSala = await salaModel.criarSala({ nome, tipo });

        return res.status(201).json({
            msg: "Sala criada com sucesso.",
            sala: novaSala,
        });
    } catch (error) {
        console.error("Erro ao criar sala:", error);
        return res.status(500).json({ error: "Erro ao criar sala." });
    }
};
