const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

describe('Blog API', () => {
  const initialBlogs = [
    {
      title: 'test',
      author: 'test',
      url: 'test',
      likes: 0,
    },
  ];

  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
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
    beforeEach(async () => {
      await User.deleteMany({});
      await User.create({
        username: 'testuser',
        name: 'Test User',
        passwordHash: 'dummy',
      });
    });

    test('POST request creates a new blog', async () => {
      const newBlog = {
        title: 'test',
        author: 'test',
        url: 'test',
        likes: 0,
      };

      const totalBefore = await Blog.countDocuments({});
      const response = await api.post('/api/blogs').send(newBlog).expect(201);
      const totalAfter = await Blog.countDocuments({});

      expect(totalAfter).toBe(totalBefore + 1);
      expect(response.body.user).toBeDefined();

      const user = await User.findOne({});
      expect(user.blogs).toContainEqual(response.body.id);
    });

    test('like defaults to 0', async () => {
      const newBlog = {
        title: `TestBlog${Math.random().toString(36).substring(7)}`,
        author: 'test',
        url: 'test',
      };

      await api.post('/api/blogs').send(newBlog).expect(201);
      const blog = await Blog.findOne({ title: newBlog.title });
      expect(blog.likes).toBe(0);
    });

    test('POST request returns 400 on bad request', async () => {
      const newBlog = {
        title: `Test Blog ${Math.random().toString(36).substring(7)}`,
      };

      await api.post('/api/blogs').send(newBlog).expect(400);
    });
  });

  describe('Deleting data', () => {
    test('succeeds with 204 if id is valid', async () => {
      const blogToDelete = await Blog.findOne({ title: 'test' });
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
      const blogsAfterDelete = await Blog.find({});
      expect(blogsAfterDelete).toHaveLength(0);
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
