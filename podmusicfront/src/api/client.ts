import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.100.187:8989',
  timeout: 10000,
});

export default client;
