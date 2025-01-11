import { useState } from 'react';
import authService from '../services/auth';
import blogService from '../services/blogs';

function LoginForm({ setUser, setErrorMessage, setSuccessMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogout = () => {
    window.localStorage.removeItem('logged_user');
    setUser(null);
    blogService.setToken(null);
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
        window.localStorage.setItem('logged_user', JSON.stringify(user));
      })
      .catch((error) => {
        setErrorMessage('Wrong credentials');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

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
}

export default LoginForm;
