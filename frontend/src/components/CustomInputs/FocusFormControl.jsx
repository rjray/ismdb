import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";

/*
  This is a simple wrapper around Bootstrap's <Form.Control /> to allow it to
  take the `innerRef` prop that Formik passes it from the <Field /> container.
 */
const FocusFormControl = ({ innerRef, ...props }) => (
  <Form.Control ref={innerRef} {...props} />
);

FocusFormControl.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]).isRequired,
};

export default FocusFormControl;
