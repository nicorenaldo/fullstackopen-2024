import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  console.log(token, newToken);
  token = `Bearer ${newToken}`;
  console.log(token, newToken);
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject, token) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log(config);
  console.log(token);

  const request = axios.post(baseUrl, newObject, config);
  return request.then((response) => response.data);
};

export default { setToken, getAll, create };
