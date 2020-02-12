/*
 * This is assumes that the form from which this is called is a Formik
 * construct.
 */
import axios from "axios"

import apiEndpoint from "./api-endpoint"

const setupCRUDHandler = params => {
  return (values, actions) => submitCRUDForm(params, values, actions)
}

const submitCRUDForm = (params, values, actions) => {
  const { type } = params
  const { action } = values

  axios
    .post(`${apiEndpoint}/api/${action}/${type}`, values)
    .then(res => {
      let status = res.data.status
      if (status === "success") {
        alert("Success")
      } else if (status === "error") {
        alert(`Error: ${res.data.error.message}`)
      }
      actions.setSubmitting(false)
    })
    .catch(error => {
      alert(`Error: ${error.message}`)
      actions.setSubmitting(false)
    })
}

export { setupCRUDHandler, submitCRUDForm }
