import axios from "axios";
import history from "./routeHistory";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV !== "production"
      ? "https://take-home-test-api.nutech-integrasi.app"
      : "https://take-home-test-api.nutech-integrasi.app",
  // withCredentials: true,
});

// api.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("SimsPpobAdmTkn");
      history.replace("/login");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
