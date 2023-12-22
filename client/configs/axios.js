import axios from "axios";

// for general purpose and for ios emulator
// export const client = axios.create({
//   baseURL: "http://localhost:4000/api/v1",
// });

// for android emulator
// export const client = axios.create({
//   baseURL: "http://10.0.2.2:4000/api/v1",
// });

// while at home
export const client = axios.create({
  baseURL: "http://192.168.18.44:4000/api/v1",
});

// while at aunty
// export const client = axios.create({
//   baseURL: "http://192.168.18.150:4000/api/v1",
// });
