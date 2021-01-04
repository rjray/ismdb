import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import "./Signup.css";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required(<em className="form-field-error">Name is required</em>)
    .max(
      75,
      <em className="form-field-error">Name cannot exceed 75 characters</em>
    ),
  email: Yup.string()
    .required(<em className="form-field-error">Email is required</em>)
    .max(
      100,
      <em className="form-field-error">Email cannot exceed 100 characters</em>
    )
    .email(<em className="form-field-error">Must be an email address</em>),
  password: Yup.string()
    .required(<em className="form-field-error">Password is required</em>)
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
      message: (
        <em className="form-field-error">
          Password must be at least 8 characters and contain at least one each
          of: upper-case, lower-case, digit, special character
        </em>
      ),
    }),
  confirmPassword: Yup.string().when("password", {
    is: (val) => !!(val && val.length > 0),
    then: Yup.string().oneOf(
      [Yup.ref("password")],
      <em className="form-field-error">Passwords do not match</em>
    ),
  }),
});

const Signup = () => {
  function submitHandler(event) {
    event.preventDefault();
  }

  return (
    <div className="Signup">
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={submitHandler}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form>
            <Form.Group size="lg" controlId="email">
              <Form.Label>
                Name
                <ErrorMessage name="name" component="p" />
              </Form.Label>
              <Field
                as={Form.Control}
                autoFocus
                name="name"
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group size="lg" controlId="email">
              <Form.Label>
                Email
                <ErrorMessage name="email" component="p" />
              </Form.Label>
              <Field
                as={Form.Control}
                name="email"
                type="email"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group size="lg" controlId="password">
              <Form.Label>
                Password
                <ErrorMessage name="password" component="p" />
              </Form.Label>
              <Field
                as={Form.Control}
                name="password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group size="lg" controlId="confirmPassword">
              <Form.Label>
                Confirm Password
                <ErrorMessage name="confirmPassword" component="p" />
              </Form.Label>
              <Field
                as={Form.Control}
                name="confirmPassword"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              block
              size="lg"
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Sign Up
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
