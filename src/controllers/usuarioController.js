const token = require("../util/token");
const usuarioModel = require("../models/usuarioModel");


exports.entrar = async (nick) => {
    try {
        console.log(`Tentando registrar usuário com nick: ${nick}`);

        // Registra o usuário no banco de dados
        const resp = await usuarioModel.registrarUsuario(nick);

        // Verifica se o ID do usuário foi gerado
        if (resp.id) {
            // Gera o token associado ao usuário
            const generatedToken = await token.setToken(resp.id.toString(), nick);

            return {
                idUser: resp.id,
                token: generatedToken,
                nick: resp.nick,
            };
        } else {
            throw new Error("Erro ao registrar o usuário.");
        }
    } catch (error) {
        console.error("Erro ao entrar:", error);
        throw new Error("Falha ao registrar o usuário.");
    }
};