import axios from 'axios';

const api_key = import.meta.env.VITE_APIKEY;
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';

const getAll = () => {
  return axios.get(`${baseUrl}/all`);
};

const getWeather = (capital) => {
  return axios.get(
    `https://samples.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`
  );
};

export default {
  getAll: getAll,
  getWeather: getWeather,
};
