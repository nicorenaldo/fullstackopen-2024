const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user;

      const blog = new Blog({
        likes: request.body.likes || 0,
        ...request.body,
        user: user._id,
      });

      if (!blog.title || !blog.url || !blog.author) {
        return response
          .status(400)
          .json({ error: 'title, url and author are required' });
      }

      const savedBlog = await blog.save();

      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      response.status(201).json(savedBlog);
    } catch (error) {
      next(error);
    }
  }
);

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user;

      const blogToDelete = await Blog.findById(request.params.id);
      if (!blogToDelete) {
        return response.status(404).json({ error: 'blog not found' });
      }

      if (blogToDelete.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'token invalid' });
      }

      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

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
