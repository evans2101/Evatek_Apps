// import axios
import axios from "axios";

// create axios base URL API
export const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
});

// set authorization token header
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};
