const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body);
  if (!blog.likes) {
    blog.likes = 0;
  }

  if (!blog.title || !blog.url || !blog.author) {
    response.status(400).send({ error: 'title, url and author are required' });
    return;
  }

  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
