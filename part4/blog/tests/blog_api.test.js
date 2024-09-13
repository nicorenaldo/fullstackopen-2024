const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const api = supertest(app);

describe('Blog API', () => {
  let token;
  let user;

  const postA = {
    title: 'test',
    author: 'test',
    url: 'test',
    likes: 0,
  };
  const postB = {
    title: 'test2',
    author: 'test2',
    url: 'test2',
    likes: 0,
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    user = await User.create({
      username: 'testuser',
      name: 'Test User',
      passwordHash: 'dummy',
    });

    postA.user = user._id;
    postB.user = user._id;

    await Blog.insertMany([postA, postB]);

    user.blogs = [postA._id, postB._id];
    await user.save();

    token = jwt.sign(
      { username: 'testuser', id: user._id },
      process.env.SECRET
    );
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('id field exists', async () => {
    const blog = new Blog({
      title: 'test',
      author: 'test',
      url: 'test',
      likes: 0,
    });
    const blogJson = blog.toJSON();

    expect(blogJson.id).toBeDefined();
    expect(blogJson._id).toBeUndefined();
  });

  describe('Adding new data', () => {
    test('POST request creates a new blog', async () => {
      const newBlog = {
        title: 'test',
        author: 'test',
        url: 'test',
        likes: 0,
      };

      const totalBefore = await Blog.countDocuments({});
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);
      const totalAfter = await Blog.countDocuments({});

      expect(totalAfter).toBe(totalBefore + 1);
      expect(response.body.user).toBeDefined();

      const user = await User.findById(postA.user);
      expect(user.blogs).toHaveLength(3);
    });

    test('like defaults to 0', async () => {
      const newBlog = {
        title: `TestBlog${Math.random().toString(36).substring(7)}`,
        author: 'test',
        url: 'test',
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);
      const blog = await Blog.findOne({ title: newBlog.title });
      expect(blog.likes).toBe(0);
    });

    test('POST request returns 400 on bad request', async () => {
      const newBlog = {
        title: `Test Blog ${Math.random().toString(36).substring(7)}`,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test('POST request returns 401 if token is invalid', async () => {
      const newBlog = {
        title: `Test Blog ${Math.random().toString(36).substring(7)}`,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer invalid`)
        .send(newBlog)
        .expect(401);
    });

    test('POST request returns 401 if token is missing', async () => {
      const newBlog = {
        title: `Test Blog ${Math.random().toString(36).substring(7)}`,
      };

      await api.post('/api/blogs').send(newBlog).expect(401);
    });
  });

  describe('Deleting data', () => {
    test('succeeds with 204 if id is valid', async () => {
      const blogToDelete = await Blog.findOne({ title: 'test' });
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
      const blogsAfterDelete = await Blog.findById(blogToDelete.id);
      expect(blogsAfterDelete).toBeNull();
    });

    test('fails with 401 if token is invalid', async () => {
      const blogToDelete = await Blog.findOne({ title: 'test' });
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer invalid`)
        .expect(401);
    });

    test('fails with 401 if token is missing', async () => {
      const blogToDelete = await Blog.findOne({ title: 'test' });
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
    });
  });

  describe('Updating data', () => {
    test('succeeds with 200 if id is valid and updates likes', async () => {
      const blogToUpdate = await Blog.findOne({ title: 'test' });
      const updatedLikes = blogToUpdate.likes + 1;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: updatedLikes })
        .expect(200);

      const updatedBlog = await Blog.findById(blogToUpdate.id);
      expect(updatedBlog.likes).toBe(updatedLikes);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
