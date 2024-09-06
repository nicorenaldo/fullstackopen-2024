import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhoneNum, setNewPhoneNum] = useState('');

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    if (persons.find((person) => person.name === newName)) {
      return;
    }

    const newPerson = {
      name: newName,
      number: newPhoneNum,
      id: `${persons.length + 1}`,
    };

    personService.create(newPerson).then((response) => {
      setPersons(persons.concat(response.data));
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
