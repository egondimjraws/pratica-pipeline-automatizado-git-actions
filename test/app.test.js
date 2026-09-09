const request = require('supertest');
const app = require('../src/app');

describe('API Pipeline GitHub Actions', () => {
  let server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /', () => {
    it('deve retornar a mensagem de boas-vindas', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'API Pipeline GitHub Actions');
      expect(response.body).toHaveProperty('status', 'online');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body.endpoints).toContain('/api/users');
    });
  });

  describe('GET /api/health', () => {
    it('deve retornar status healthy', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('CRUD de usuários', () => {
    let userId;

    it('GET /api/users - deve retornar lista de usuários', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('POST /api/users - deve criar novo usuário', async () => {
      const newUser = {
        name: 'Carlos Henrique',
        email: 'carlos@email.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', newUser.name);
      expect(response.body).toHaveProperty('email', newUser.email);
      
      userId = response.body.id;
    });

    it('POST /api/users - deve validar campos obrigatórios', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Teste' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Nome e email são obrigatórios');
    });

    it('PUT /api/users/:id - deve atualizar usuário', async () => {
      const updatedUser = {
        name: 'Carlos Silva',
        email: 'carlos.silva@email.com'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updatedUser)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('name', updatedUser.name);
      expect(response.body).toHaveProperty('email', updatedUser.email);
    });

    it('DELETE /api/users/:id - deve deletar usuário', async () => {
      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(204);
    });

    it('DELETE /api/users/:id - deve retornar 404 para usuário inexistente', async () => {
      const response = await request(app)
        .delete('/api/users/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
    });
  });
});
