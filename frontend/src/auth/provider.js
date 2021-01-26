/*
  This code is largely adapted from the auth-provider.js module in Kent C.
  Dodds' "bookshelf" class project.

  https://github.com/kentcdodds/bookshelf.git
 */

import jwtDecode from "jwt-decode";

import axios from "../utils/axios-local";

const userState = {};

async function client(url, data) {
  return axios({
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

function getUser() {
  return { ...userState };
}

function handleUserResponse({ success, accessToken, message }) {
  if (!success) throw new Error(message);

  const { user, exp: expires } = jwtDecode(accessToken);

  userState.user = user;
  userState.expires = new Date(expires * 1000);
  userState.accessToken = accessToken;

  return user;
}

function bootstrap() {
  return client("bootstrap").then(handleUserResponse);
}

function login(form) {
  return client("login", { ...form }).then(handleUserResponse);
}

function register(form) {
  return client("register", { ...form }).then(handleUserResponse);
}

function logout() {
  delete userState.accessToken;
  return client("logout");
}

export { getToken, getUser, bootstrap, login, register, logout, client };
