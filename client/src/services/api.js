import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5050/api',
});

export const createPoll = (data) => API.post('/polls', data);
