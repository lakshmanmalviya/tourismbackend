import axios from "axios";

export const pawdRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const api = axios.create({
    baseURL: 'http://localhost:5001',
    withCredentials: true,
  });