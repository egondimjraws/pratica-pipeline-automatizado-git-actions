const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.get('/', (req, res) => {
  res.json({
    message: 'API Pipeline GitHub Actions',
    status: 'online',
    version: '1.0.0',
    endpoints: [
      '/api/users',
      '/api/health'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota de usuários (exemplo)
let users = [
  { id: 1, name: 'João Silva', email: 'joao@email.com' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com' }
];

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  users[userIndex] = { ...users[userIndex], name, email };
  res.json(users[userIndex]);
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});

module.exports = app;
