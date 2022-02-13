import axios from 'axios';

// No lugar de localhost coloque o ip da sua máquina
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export default api;
