/*
  Use only a single instance of axios across the app.
 */

import { create } from "axios";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

const axios = create({
  baseURL: endpoint,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axios;
