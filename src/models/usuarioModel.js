const mysql = require('mysql2');

// Criando a conexão com o banco de dados
const db = mysql.createConnection({
    host: 'junction.proxy.rlwy.net',   // Endereço do servidor
    user: 'root',                      // Usuário do banco
    password: 'VdidvuVTtAsThnNATPaOBtokJSQXRXqG', // Senha do banco
    database: 'railway',               // Nome do banco de dados
    port: 43479                        // Porta do banco de dados
}).promise(); // Usa promessas para trabalhar com async/await

// Função para registrar usuário
async function registrarUsuario(nick) {
    try {
        const query = "INSERT INTO usuarios (nick) VALUES (?)";
        const [result] = await db.execute(query, [nick]);
        return { id: result.insertId, nick };
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw new Error("Erro ao registrar o usuário.");
    }
}

// Função para buscar um usuário pelo ID
async function buscarUsuario(idUser) {
    try {
        const query = "SELECT * FROM usuarios WHERE id = ?";
        const [rows] = await db.execute(query, [idUser]);
        return rows.length > 0 ? rows[0] : null; // Retorna o usuário ou null
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw new Error("Erro ao buscar o usuário.");
    }
}

// Função para alterar os dados de um usuário
async function alterarUsuario(user) {
    try {
        const { id, ...updates } = user;
        const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
        const values = Object.values(updates);

        const query = `UPDATE usuarios SET ${fields} WHERE id = ?`;
        const [result] = await db.execute(query, [...values, id]);
        return result.affectedRows > 0; // Retorna true se houve alteração
    } catch (error) {
        console.error("Erro ao alterar usuário:", error);
        throw new Error("Erro ao alterar o usuário.");
    }
}

module.exports = { registrarUsuario, buscarUsuario, alterarUsuario };
