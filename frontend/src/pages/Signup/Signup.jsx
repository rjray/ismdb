import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import LoginHeader from "../../components/LoginHeader";
import "./Signup.css";

const Signup = () => {
  function submitHandler(event) {
    event.preventDefault();
  }

  return (
    <>
      <LoginHeader page="Sign Up" />
      <div className="Signup">
        <Formik onSubmit={submitHandler}>
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            isSubmitting,
          }) => (
            <Form>
              <Form.Group size="lg" controlId="email">
                <Form.Label>Email</Form.Label>
                <Field
                  as={Form.Control}
                  autoFocus
                  name="email"
                  type="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group size="lg" controlId="password">
                <Form.Label>Password</Form.Label>
                <Field
                  as={Form.Control}
                  name="password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group size="lg" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Field
                  as={Form.Control}
                  name="confirmPassword"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button block size="lg" type="submit" disabled={isSubmitting}>
                Signup
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Signup;
