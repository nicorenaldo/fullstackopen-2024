import { useEffect, useState } from 'react';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';

const App = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const userJSON = window.localStorage.getItem('logged_user');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <div>
      <h1>{user === null ? 'log in to application' : 'blogs'}</h1>

      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      />

      {user === null && (
        <LoginForm
          setUser={setUser}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      {user !== null && (
        <HomePage
          user={user}
          setUser={setUser}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};

export default App;
