import axios from "axios";

export const client = axios.create({
  baseURL: "http://192.168.18.44:4000/api/v1",
});
