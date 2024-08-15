import axios from "axios";

// // for general purpose and for ios emulator
// export let serverAddress = "http://localhost:4000";

// export const client = axios.create({
//   baseURL: "http://localhost:4000/api/v1",
// });

// // while at home
export let serverAddress = "http://localhost:4000";
// export let serverAddress = "https://madhyayuga.azurewebsites.net";
// export const client = axios.create({
//   baseURL: serverAddress + "/api/v1",
// });
// export let serverAddress = "https://madhyayugabackend.onrender.com";
export const client = axios.create({
  baseURL: serverAddress + "/api/v1",
});

// while at aunty
// export let serverAddress = "http://192.168.18.150:4000";
// export const client = axios.create({
//   baseURL: serverAddress + "/api/v1",
// });
