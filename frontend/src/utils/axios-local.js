/*
  Use only a single instance of axios across the app.
 */

import axios from "axios";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

export default axios.create({ baseURL: endpoint, withCredentials: true });
