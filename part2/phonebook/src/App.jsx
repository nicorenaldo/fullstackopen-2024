import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhoneNum, setNewPhoneNum] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMesage] = useState('');

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newPhoneNum,
    };

    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      const result = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (result) {
        personService
          .update(existingPerson.id, newPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response.data
              )
            );
          })
          .catch(() => {
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
      return;
    }

    personService.create(newPerson).then((response) => {
      setPersons(persons.concat(response.data));
      setSuccessMesage(`Added ${newName}`);
      setTimeout(() => {
        setSuccessMesage(null);
      }, 5000);
    });
  };

  const onDelete = (id) => {
    personService
      .delete(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />

      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      />

      <h3>Add a new</h3>
      <PersonForm
        setName={setNewName}
        setPhoneNum={setNewPhoneNum}
        onSubmit={onSubmit}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} onDelete={onDelete} />
    </div>
  );
};

const Notification = ({ errorMessage, successMessage }) => {
  Notification.propTypes = {
    errorMessage: PropTypes.string,
    successMessage: PropTypes.string,
  };

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    'font-size': '20px',
    'border-style': 'solid',
    'border-radius': '5px',
    padding: '10px',
    'margin-bottom': '10px',
  };

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    'font-size': '20px',
    'border-style': 'solid',
    'border-radius': '5px',
    padding: '10px',
    'margin-bottom': '10px',
  };

  if (errorMessage) {
    return <div style={errorStyle}>{errorMessage}</div>;
  }

  if (successMessage) {
    return <div style={successStyle}>{successMessage}</div>;
  }

  return null;
};

const PersonForm = ({ setName, setPhoneNum, onSubmit }) => {
  PersonForm.propTypes = {
    setName: PropTypes.func.isRequired,
    setPhoneNum: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onPhoneNumChange = (event) => {
    setPhoneNum(event.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input onChange={onNameChange} />
      </div>
      <div>
        phone number: <input onChange={onPhoneNumChange} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, filter, onDelete }) => {
  Persons.propTypes = {
    persons: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
  };

  const deletePrompt = (id) => {
    const result = window.confirm('Do you really want to delete?');
    if (result) {
      onDelete(id);
    }
  };

  return (
    <div>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map((person) => (
          <div key={person.id} style={{ display: 'flex' }}>
            <div>
              {person.name} {person.number}
            </div>
            <button onClick={() => deletePrompt(person.id)}>delete</button>
          </div>
        ))}
    </div>
  );
};

const Filter = ({ filter, setFilter }) => {
  Filter.propTypes = {
    filter: PropTypes.string.isRequired,
    setFilter: PropTypes.func.isRequired,
  };

  const onChangeFilter = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      filter shown with <input value={filter} onChange={onChangeFilter} />
    </div>
  );
};

export default App;
