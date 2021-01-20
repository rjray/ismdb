/*
  This code is largely adapted from the auth-provider.js module in Kent C.
  Dodds' "bookshelf" class project.

  https://github.com/kentcdodds/bookshelf.git
 */

import axios from "axios";
import jwtDecode from "jwt-decode";

import { endpoint } from "../utils/endpoints";

const clientId = process.env.REACT_APP_CLIENT_ID;
const instance = axios.create({ baseURL: endpoint });
const userState = {};

async function client(url, data) {
  return instance({
    url,
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  }).then((response) => response.data);
}

function getToken() {
  return userState.accessToken;
}

function handleUserResponse({ success, accessToken, message }) {
  if (!success) throw new Error(message);

  const { user, exp: expires } = jwtDecode(accessToken);

  userState.user = user;
  userState.expires = new Date(expires * 1000);
  userState.accessToken = accessToken;

  return user;
}

function login(form) {
  return client("login", { ...form, client: clientId }).then(
    handleUserResponse
  );
}

function register(form) {
  return client("register", { ...form, client: clientId }).then(
    handleUserResponse
  );
}

async function logout() {
  delete userState.accessToken;
  return client("logout");
}

export { getToken, login, register, logout, client };
