/*
 * As simple/dumb as this is, it keeps the association of apiEndpoint and the
 * related env variable in one place.
 */

export const endpoint =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

export const apiEndpoint = `${endpoint}/api`;
