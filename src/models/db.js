const mysql = require('mysql2/promise');
require('dotenv').config();
let pool;

async function connect() {
  try {
    if (pool) {
        console.log("Conexão com o banco já estabelecida.");
        return pool;
    }

    console.log("Tentando conectar ao banco de dados...");
    console.log("Configuração do banco:", {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
    });

    pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 30000, // 10 segundos
    });

    // Testando a conexão
    await pool.query("SELECT 1");
    console.log("Conexão com o banco estabelecida com sucesso!");

    return pool;
} catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw new Error("Erro ao conectar ao banco.");
}
}

async function findAll(table) {
    const connection = await connect();
    const [rows] = await connection.query(`SELECT * FROM ??`, [table]);
    return rows;
}

async function insertOne(table, object) {
    const connection = await connect();
    const [result] = await connection.query(`INSERT INTO ?? SET ?`, [table, object]);
    return result.insertId; // Retorna o ID do registro inserido
}

async function findOne(table, id) {
    const connection = await connect();
    const [rows] = await connection.query(`SELECT * FROM ?? WHERE id = ? LIMIT 1`, [table, id]);
    return rows.length > 0 ? rows[0] : null;
}

async function updateOne(table, object, id) {
    const connection = await connect();
    const [result] = await connection.query(`UPDATE ?? SET ? WHERE id = ?`, [table, object, id]);
    return result.affectedRows; // Retorna o número de linhas afetadas
}

async function deleteOne(table, id) {
    const connection = await connect();
    const [result] = await connection.query(`DELETE FROM ?? WHERE id = ?`, [table, id]);
    return result.affectedRows; // Retorna o número de linhas afetadas
}

module.exports = { findAll, insertOne, findOne, updateOne, deleteOne, connect };
