import { useEffect, useState } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import authService from './services/auth';
import blogService from './services/blogs';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogURL] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMesage] = useState('');

  const handleNewBlog = (event) => {
    event.preventDefault();
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    };
    blogService.create(newBlog).then((blog) => {
      setBlogs(blogs.concat(blog));
      setBlogTitle('');
      setBlogAuthor('');
      setBlogURL('');
      setSuccessMesage(`a new blog ${blog.title} by ${blog.author} added`);
      setTimeout(() => {
        setSuccessMesage(null);
      }, 5000);
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    authService
      .login({ username, password })
      .then((user) => {
        setUser(user);
        setUsername('');
        setPassword('');
        blogService.setToken(user.token);
      })
      .catch((error) => {
        setErrorMessage('Wrong credentials');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const loginForm = () => {
    return (
      <div>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    );
  };

  const noteForm = () => {
    return (
      <div>
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>

        <h2>create new</h2>
        <form onSubmit={handleNewBlog}>
          <div className='flex'>
            <label htmlFor='title'>title:</label>
            <input
              type='text'
              value={blogTitle}
              name='title'
              onChange={({ target }) => setBlogTitle(target.value)}
            />
          </div>
          <div className='flex'>
            <label htmlFor='author'>author:</label>
            <input
              type='text'
              value={blogAuthor}
              name='author'
              onChange={({ target }) => setBlogAuthor(target.value)}
            />
          </div>
          <div className='flex'>
            <label htmlFor='url'>url:</label>
            <input
              type='text'
              value={blogUrl}
              name='url'
              onChange={({ target }) => setBlogURL(target.value)}
            />
          </div>
          <button type='submit'>create</button>
        </form>

        <h2>blogs</h2>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>{user === null ? 'log in to application' : 'blogs'}</h1>

      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      />

      {user === null && loginForm()}
      {user !== null && noteForm()}
    </div>
  );
};

export default App;
