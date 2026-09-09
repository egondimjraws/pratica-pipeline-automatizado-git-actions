const app = require('./src/app');
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`📚 Documentação da API: http://localhost:${port}/`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promessa rejeitada não tratada:', reason);
});

module.exports = server;
