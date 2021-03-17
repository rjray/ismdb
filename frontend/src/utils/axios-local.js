/*
  An instance of axios that is not decorated with any interceptors.
 */

import { create } from "axios";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

const axios = create({
  baseURL: endpoint,
  withCredentials: true,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

export default axios;
