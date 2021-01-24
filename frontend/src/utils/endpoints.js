/*
 * As simple/dumb as this is, it keeps the association of the API endpoint and
 * the related env variable in one place.
 */

export const endpoint = process.env.REACT_APP_API_ENDPOINT;
export const environment = process.env.NODE_ENV;
