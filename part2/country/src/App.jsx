import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import countryService from './services/countries';

function App() {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countryService.getAll().then((response) => {
      setCountries(response.data);
    });
  }, []);

  const onChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <div>
        <p>find countries</p>
        <input type='text' onChange={onChange} />
      </div>

      <SearchResult countries={countries} search={search} />
    </div>
  );
}

const SearchResult = ({ countries, search }) => {
  SearchResult.propTypes = {
    countries: PropTypes.array.isRequired,
    search: PropTypes.string.isRequired,
  };

  if (search === '') {
    return <div></div>;
  }

  const filteredCountries = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(search.toLowerCase());
  });

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} open={true} />;
  }

  return (
    <div>
      {filteredCountries.map((country) => (
        <Country key={country.cca3} country={country} />
      ))}
    </div>
  );
};

const Country = ({ country, open }) => {
  Country.propTypes = {
    country: PropTypes.object.isRequired,
    open: PropTypes.bool,
  };

  const [showDetails, setShowDetails] = useState(open);

  if (showDetails) {
    return <CountryDetails country={country} />;
  }

  return (
    <div>
      {country.name.common}
      <button onClick={() => setShowDetails(true)}>show</button>
    </div>
  );
};

const CountryDetails = ({ country }) => {
  CountryDetails.propTypes = {
    country: PropTypes.object.isRequired,
  };

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <p>
        <strong>languages:</strong>
      </p>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt='flag' style={{ width: '100px' }} />

      <Weather capital={country.capital[0]} />
    </div>
  );
};

const Weather = ({ capital }) => {
  Weather.propTypes = {
    capital: PropTypes.string.isRequired,
  };

  const [weather, setWeather] = useState({});

  useEffect(() => {
    countryService
      .getWeather(capital)
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [capital]);

  if (Object.keys(weather).length === 0) {
    return <div></div>;
  }

  if (!weather) {
    return <div></div>;
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>
        <strong>temperature:</strong> {weather.main.temperature} Celcius
      </div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      />{' '}
      <div>
        <strong>wind:</strong> {weather.wind.speed} m/s{' '}
      </div>
    </div>
  );
};

export default App;
