import React from "react";
import Form from "react-bootstrap/Form";

/*
  This is a simple wrapper around Bootstrap's <Form.Control /> to allow it to
  take the `innerRef` prop that Formik passes it from the <Field /> container.
 */
const FocusFormControl = ({ innerRef, ...props }) => (
  <Form.Control ref={innerRef} {...props} />
);

export default FocusFormControl;
