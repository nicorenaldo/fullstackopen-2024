const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');
const supertest = require('supertest');

const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 6);
    const user = new User({ username: 'root', name: 'rootName', passwordHash });

    await user.save();
  });

  describe('create user', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'testNew',
        name: 'Test New',
        password: 'test',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      expect(usernames).toContain(newUser.username);
    });

    test('creation fails if username is already taken', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'root',
        name: 'rootName',
        password: 'salainen',
      };

      await api.post('/api/users').send(newUser).expect(400);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });

    test('creation fails if username is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'ro',
        name: 'rootName',
        password: 'salainen',
      };

      await api.post('/api/users').send(newUser).expect(400);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });

    test('creation fails if password is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'root',
        name: 'rootName',
        password: 'ro',
      };

      await api.post('/api/users').send(newUser).expect(400);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });
  });

  test('retrieve users', async () => {
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(1);
    expect(usersAtEnd[0]).toEqual({
      id: expect.any(String),
      username: 'root',
      name: 'rootName',
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
