import { get, post } from "../request";
const BASE_URL = "https://mern-social-media-6y61.onrender.com/api/auth";

const login = (data) => post(`${BASE_URL}/login`, data, "application/json");
const logout = () => get(`${BASE_URL}/logout`);
const register = (data) =>
  post(`${BASE_URL}/register`, data, "application/json");

const authService = {
  login,
  logout,
  register,
};

export default authService;
