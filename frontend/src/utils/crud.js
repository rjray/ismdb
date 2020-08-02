/*
 * This is assumes that the form from which this is called is a Formik
 * construct.
 */
import axios from "axios";

import apiEndpoint from "./api-endpoint";

const setupCRUDHandler = (params) => {
  return (values, formikBag) => submitCRUDForm(params, values, formikBag);
};

const submitCRUDForm = (params, values, formikBag) => {
  const { type, onSuccess, onError } = params;
  const { action } = values;

  axios
    .post(`${apiEndpoint}/api/${action}/${type}`, values)
    .then((res) => {
      let status = res.data.status;
      if (status === "success") {
        onSuccess && onSuccess(res.data, formikBag);
      } else if (status === "error") {
        onError && onError(res.data, formikBag);
      }
    })
    .catch((error) => {
      onError && onError(error, formikBag);
    });
};

export default setupCRUDHandler;
