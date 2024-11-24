const app = require("./api");

// Porta configurável com fallback para 3001
const PORT = process.env.PORT || 3001;

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
