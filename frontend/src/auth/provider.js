/*
  This code is largely adapted from the auth-provider.js module in Kent C.
  Dodds' "bookshelf" class project.

  https://github.com/kentcdodds/bookshelf.git
 */

const localStorageKey = "__auth_provider_token__";

// an auth provider wouldn't use your client, they'd have their own
// so that's why we're not just re-using the client
const authURL = process.env.REACT_APP_AUTH_URL;

async function client(endpoint, data) {
  const config = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };

  return window
    .fetch(`${authURL}/${endpoint}`, config)
    .then(async (response) => {
      const json = await response.json();
      if (response.ok) {
        return json;
      }
      return Promise.reject(json);
    });
}

async function getToken() {
  // if we were a real auth provider, this is where we would make a request
  // to retrieve the user's token. (It's a bit more complicated than that...
  // but you're probably not an auth provider so you don't need to worry about it).
  return window.localStorage.getItem(localStorageKey);
}

function handleUserResponse({ user }) {
  window.localStorage.setItem(localStorageKey, user.token);
  return user;
}

function login({ username, password }) {
  return client("login", { username, password }).then(handleUserResponse);
}

function register({ username, password }) {
  return client("register", { username, password }).then(handleUserResponse);
}

async function logout() {
  window.localStorage.removeItem(localStorageKey);
}

export { getToken, login, register, logout, localStorageKey };
