/*
 * As simple/dumb as this is, it keeps the association of apiEndpoint and the
 * related env variable in one place.
 */

const apiEndpoint =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export default apiEndpoint;
