/*
  The functions here are for use as query and mutator functions with the
  React Query package.
 */

import axios from "axios";
import XRegExp from "xregexp";

import { endpoint } from "./endpoints";

axios.defaults.withCredentials = true;
axios.defaults.endpoint = endpoint;

// Use this regexp to find/replace the tokens in the strings:
const expandUrlTokens = XRegExp("(?:[{](?<ident>\\w+)[}])", "g");

/*
  Take the base URL given and do token-substitution and then append any query
  params. Return a new string (that axios will concat onto the endpoint).
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

function updateByIdWrapper(type) {
  return (data) =>
    makeRequest({
      url: `/${type}/{id}`,
      data,
      method: "put",
      path: { id: data.id },
    });
}

function deleteByIdWrapper(type) {
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
export const updateAuthorById = updateByIdWrapper("authors");
export const deleteAuthorById = deleteByIdWrapper("authors");
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
export const getAllMagazines = getWithParamsWrapper("/magazines");
export const getAllMagazinesWithIssues = getWithParamsWrapper(
  "/magazines/withIssues"
);
export const getMostRecentUpdatedMagazines = getWithParamsWrapper(
  "/magazines/getMostRecentlyUpdated"
);
export const getMagazineById = getByIdWrapper("magazines");
export const updateMagazineById = updateByIdWrapper("magazines");
export const deleteMagazineById = deleteByIdWrapper("magazines");
export const getMagazineByIdWithIssues = getByIdWrapper(
  "magazines",
  "withIssues"
);

/*
  /issues functionality
 */

export const createMagazineIssue = createWrapper("issues");
export const getMagazineIssueById = getByIdWrapper("issues");
export const updateMagazineIssueById = updateByIdWrapper("issues");
export const deleteMagazineIssueById = deleteByIdWrapper("issues");

/*
  /references functionality
 */

export const createReference = createWrapper("references");
export const getAllReferences = getWithParamsWrapper("/references");
export const getReferenceById = getByIdWrapper("references");
export const updateReferenceById = updateByIdWrapper("references");
export const deleteReferenceById = deleteByIdWrapper("references");

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
export const updateTagById = updateByIdWrapper("tags");
export const deleteTagById = deleteByIdWrapper("tags");
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
