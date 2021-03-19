/*
  Use a single instance of axios for the API calls. Creates an instance and
  attaches a response interceptor to handle refreshing the access token as
  needed.
 */

import { create } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import axios from "./axios-local";
import { getToken, processToken } from "../auth/provider";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

const connector = create({
  baseURL: endpoint,
  withCredentials: true,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

// Set up an interceptor for requests that adds the Authorization header.
connector.interceptors.request.use(
  (config) => {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  null,
  { synchronous: true }
);

// Set up an interceptor for responses to catch when the auth token expires
// and automatically refresh.
const refreshAuth = (failed) => {
  return axios.post("token").then(({ data: { success, accessToken } }) => {
    if (!success) Promise.reject(failed);

    processToken(accessToken);
    // eslint-disable-next-line no-param-reassign
    failed.response.config.headers.Authorization = `Bearer ${accessToken}`;
    return Promise.resolve();
  });
};
createAuthRefreshInterceptor(connector, refreshAuth);

export default connector;
