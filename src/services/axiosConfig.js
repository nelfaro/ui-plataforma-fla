import axios from 'axios';
import { API_KEY } from '../config/constants';

const axiosInstance = axios.create({
  headers: {
    'x-api-key': API_KEY
  }
});

export default axiosInstance;