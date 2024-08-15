import axios from "axios";

const client = axios.create({
  // baseURL: "https://madhyayuga.azurewebsites.net/api/v1",
  baseURL: "http://localhost:4000/api/v1",
});

export default client;
