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
  return (data) => makeRequest({ url: `/${type}`, data, method: "post" });
}

function updateWrapper(type) {
  return (data) =>
    makeRequest({
      url: `/${type}/{id}`,
      data,
      method: "put",
      path: { id: data.id },
    });
}

function deleteWrapper(type) {
  return (id) =>
    makeRequest({ url: `/${type}/{id}`, method: "delete", path: { id } });
}

function getByIdWrapper(type, extra) {
  const url = extra ? `/${type}/{id}/${extra}` : `/${type}/{id}`;
  return (_, id) => makeRequest({ url, method: "get", path: { id } });
}

function getWithParamsWrapper(url) {
  return (_, params) => makeRequest({ url, method: "get", ...params });
}

/*
  /authors functionality
 */

export const createAuthor = createWrapper("authors");
export const getAllAuthors = getWithParamsWrapper("/authors");
export const getAllAuthorsWithRefCount = getWithParamsWrapper(
  "/authors/withRefCount"
);
export const getAuthorNamesAndAliases = getWithParamsWrapper(
  "/authors/namesAndAliases"
);
export const getAuthorById = getByIdWrapper("authors");
export const updateAuthorById = updateWrapper("authors");
export const deleteAuthorById = deleteWrapper("authors");
export const getAuthorByIdWithRefCount = getByIdWrapper(
  "authors",
  "withRefCount"
);
export const getAuthorByIdWithReferences = getByIdWrapper(
  "authors",
  "withRefsAndAliases"
);

/*
  /magazines functionality
 */

export const createMagazine = createWrapper("magazines");
export const getMagazineById = getByIdWrapper("magazines");
export const updateMagazineById = updateWrapper("magazines");
export const deleteMagazineById = deleteWrapper("magazines");

/*
  /issues functionality
 */

/*
  /references functionality
 */

export const createReference = createWrapper("references");
export const getReferenceById = getByIdWrapper("references");
export const updateReferenceById = updateWrapper("references");
export const deleteReferenceById = deleteWrapper("references");

/*
  /tags functionality
 */

export const createTag = createWrapper("tags");
export const getAllTags = getWithParamsWrapper("/tags");
export const getAllTagsWithRefCount = getWithParamsWrapper(
  "/tags/withRefCount"
);
export const getTagsQueryWithRefCount = getWithParamsWrapper(
  "/tags/queryWithRefCount"
);
export const getTagById = getByIdWrapper("tags");
export const updateTagById = updateWrapper("tags");
export const deleteTagById = deleteWrapper("tags");
export const getTagByIdWithRefCount = getByIdWrapper("tags", "withRefCount");
export const getTagByIdWithReferences = getByIdWrapper(
  "tags",
  "withReferences"
);

/*
  /misc functionality
 */

export const getAllRecordTypes = getWithParamsWrapper("/misc/recordtypes");
export const getAllLanguages = getWithParamsWrapper("/misc/languages");
export const getAllTagTypes = getWithParamsWrapper("/misc/tagtypes");
export const getAllReferenceTypes = getWithParamsWrapper(
  "/misc/referencetypes"
);
export const quickSearchName = getWithParamsWrapper("/misc/quicksearch");
