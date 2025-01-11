import { useEffect, useRef, useState } from 'react';
import blogService from '../services/blogs';
import Blog from './Blog';
import CreateBlogForm from './CreateBlogForm';
import Togglable from './Togglable';

function HomePage({ user, setUser, setSuccessMessage, setErrorMessage }) {
  const formRef = useRef();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  const handleLikeCallback = (blog) => {
    blogService
      .update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      })
      .then(() => {
        let modifiedBlogs = blogs.map((b) =>
          b.id === blog.id ? { ...blog, likes: blog.likes + 1 } : b
        );
        modifiedBlogs.sort((a, b) => b.likes - a.likes);
        setBlogs(modifiedBlogs);
      })
      .catch((error) => {
        setErrorMessage('Error updating blog');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const handleDeleteCallback = (blog) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      blogService
        .delete(blog.id)
        .then(() => {
          setBlogs(blogs.filter((b) => b.id !== blog.id));
        })
        .catch((error) => {
          setErrorMessage('Error deleting blog');
        });
    }
  };

  const handleNewBlog = (blogTitle, blogAuthor, blogUrl) => {
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    };
    blogService
      .create(newBlog)
      .then((blog) => {
        formRef.current.toggleVisibility();
        setBlogs(blogs.concat(blog));
        setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setErrorMessage('Failed to create blog');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  return (
    <div>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <h2>blogs</h2>

      <Togglable buttonLabel='create new blog' ref={formRef}>
        <CreateBlogForm handleNewBlog={handleNewBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLikeCallback={handleLikeCallback}
          handleDeleteCallback={handleDeleteCallback}
        />
      ))}
    </div>
  );
}

export default HomePage;
