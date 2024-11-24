const mysql = require('mysql2');

// Criando a conexão com o banco de dados
const db = mysql.createConnection({
    host: 'junction.proxy.rlwy.net',   // Endereço do servidor
    user: 'root',                      // Usuário do banco
    password: 'VdidvuVTtAsThnNATPaOBtokJSQXRXqG', // Senha do banco
    database: 'railway',               // Nome do banco de dados
    port: 43479                       
}).promise(); 


async function listarSalas() {
    try {
        const query = "SELECT * FROM salas";
        const [salas] = await db.execute(query);
        return salas;
    } catch (error) {
        console.error("Erro ao listar salas:", error);
        throw new Error("Erro ao listar salas.");
    }
}


async function buscarSala(idSala) {
    try {
        const query = "SELECT * FROM salas WHERE id = ?";
        const [salas] = await db.execute(query, [idSala]);
        return salas.length > 0 ? salas[0] : null;
    } catch (error) {
        console.error("Erro ao buscar sala:", error);
        throw new Error("Erro ao buscar sala.");
    }
}


async function atualizarMensagens(idSala, mensagens) {
    try {
        const mensagensString = JSON.stringify(mensagens); 
        const query = "UPDATE salas SET msgs = ? WHERE id = ?";
        const [result] = await db.execute(query, [mensagensString, idSala]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Erro ao atualizar mensagens da sala:", error);
        throw new Error("Erro ao atualizar mensagens da sala.");
    }
}


async function buscarMensagens(idSala, timestamp) {
    try {
        const sala = await buscarSala(idSala);
        if (sala && sala.msgs) {
            const mensagens = JSON.parse(sala.msgs); 
            return mensagens.filter((msg) => msg.timestamp >= timestamp);
        }
        return [];
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        throw new Error("Erro ao buscar mensagens.");
    }
}


async function sairSala() {
    try {
        return await listarSalas();
    } catch (error) {
        console.error("Erro ao sair da sala:", error);
        throw new Error("Erro ao sair da sala.");
    }
}


async function removerUsuario(idUser) {
    try {
        const query = "DELETE FROM usuarios WHERE id = ?";
        const [result] = await db.execute(query, [idUser]);
        if (result.affectedRows === 1) {
            return true;
        } else {
            throw new Error("Nenhum usuário encontrado com o ID especificado.");
        }
    } catch (error) {
        console.error("Erro ao remover usuário:", error);
        throw new Error("Erro ao remover usuário.");
    }
}
async function criarSala({ nome, tipo }) {
  try {
    
      const query = "INSERT INTO salas (nome, tipo) VALUES (?, ?)";
      
   
      const [result] = await db.execute(query, [nome, tipo]);

      
      return { id: result.insertId, nome, tipo };
  } catch (error) {
      console.error("Erro ao criar sala:", error);
      throw new Error("Erro ao criar sala.");
  }
}
module.exports = {
    listarSalas,
    buscarSala,
    atualizarMensagens,
    buscarMensagens,
    sairSala,
    removerUsuario,
    criarSala,
};
