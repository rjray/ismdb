/*
  The functions here are for use as query and mutator functions with the
  React Query package.
 */

import axios from "axios";
import XRegExp from "xregexp";

import apiEndpoint from "./api-endpoint";

// Use this regexp to find/replace the tokens in the strings:
const expandUrlTokens = XRegExp("(?:[{](?<ident>\\w+)[}])", "g");

/*
  Take the base URL given and do token-substitution and then append any query
  params. Return a new string with this prepended with the apiEndpoint value.
 */
function buildUrl(base, params = {}) {
  const { path = {}, query } = params;
  let url = base;

  // First do token-substitution in the given base:
  url = XRegExp.replace(url, expandUrlTokens, (match) => {
    if (!path[match.ident]) {
      throw new Error(`No value given for URL token: ${match.ident}`);
    }
    return path[match.ident];
  });

  // Next append any query parameters:
  if (query) {
    const queryValues = [];

    const entries = Object.entries(query).sort((a, b) =>
      b[0].localeCompare(a[0])
    );
    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        value.forEach((val) => queryValues.push(`${key}=${val}`));
      } else {
        queryValues.push(`${key}=${value}`);
      }
    }

    url = `${url}?${queryValues.join("&")}`;
  }

  return url;
}

export function makeRequest(...args) {
  const params = args[typeof args[0] === "object" ? 0 : 1] || {};
  const { url, path, query, data, method } = params;

  if (!url) throw new Error("Missing required parameter 'url'");

  return axios({
    url: buildUrl(url, { path, query }),
    baseURL: apiEndpoint,
    method,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  }).then((response) => response.data);
}

function createWrapper(type) {
  return (data) => makeRequest({ url: `/api/${type}`, data, method: "post" });
}

function getByIdWrapper(type) {
  return (_, id) =>
    makeRequest({ url: `/api/${type}/{id}`, method: "get", path: { id } });
}

/*
  /api/tags
 */

export const createTag = createWrapper("tags");
export const getTagById = getByIdWrapper("tags");

/*
  /api/authors
 */

export const createAuthor = createWrapper("authors");
export const getAuthorById = getByIdWrapper("authors");

/*
  /api/magazines
 */

export const createMagazine = createWrapper("magazines");
export const getMagazineById = getByIdWrapper("magazines");

/*
  /api/references
 */

export const createReference = createWrapper("references");
export const getReferenceById = getByIdWrapper("references");
