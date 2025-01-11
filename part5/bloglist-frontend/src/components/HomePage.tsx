import { useEffect, useRef, useState } from 'react';
import blogService from '../services/blogs';
import Blog from './Blog';
import CreateBlogForm from './CreateBlogForm';
import Togglable from './Togglable';

function HomePage({ user, setUser, setSuccessMessage, setErrorMessage }) {
  const formRef = useRef();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  const handleLikeCallback = (id) => {
    let modifiedBlogs = blogs.map((blog) =>
      blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
    );
    modifiedBlogs.sort((a, b) => b.likes - a.likes);
    setBlogs(modifiedBlogs);
  };

  const handleDeleteCallback = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <div>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <h2>blogs</h2>

      <Togglable buttonLabel='create new blog' ref={formRef}>
        <CreateBlogForm
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          blogs={blogs}
          setBlogs={setBlogs}
          formRef={formRef}
        />
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
