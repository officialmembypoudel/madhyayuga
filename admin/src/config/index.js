import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.100.15:4000/api/v1",
});

export default client;
