import React from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useAuth } from "./auth";

import "./styles/Login.css";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required(<em className="form-field-error">Email is required</em>)
    .email(<em className="form-field-error">Must be an email address</em>),
  password: Yup.string().required(
    <em className="form-field-error">Password is required</em>
  ),
});

const LoginForm = ({ login }) => {
  function submitHandler(values, bag) {
    login(values);
    bag.resetForm();
    bag.setSubmitting(false);
  }

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={submitHandler}
      validationSchema={loginValidationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <Form>
          <Form.Group size="lg" controlId="email">
            <Form.Label>
              Email
              <ErrorMessage name="email" component="p" />
            </Form.Label>
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
          <Button
            block
            size="lg"
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Log In
          </Button>
        </Form>
      )}
    </Formik>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

const signupValidationSchema = Yup.object().shape({
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

const SignupForm = ({ register }) => {
  function submitHandler({ values, bag }) {
    register(values);
    bag.resetForm();
    bag.setSubmitting(false);
  }

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={submitHandler}
      validationSchema={signupValidationSchema}
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
  );
};

SignupForm.propTypes = {
  register: PropTypes.func.isRequired,
};

const Login = ({ login, register }) => (
  <div className="Login">
    <Tab.Container id="login-tabs" defaultActiveKey="login">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="login">Log In</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="signup">Sign Up</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="login">
              <LoginForm login={login} />
            </Tab.Pane>
            <Tab.Pane eventKey="signup">
              <SignupForm register={register} />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </div>
);

Login.propTypes = {
  login: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

const UnauthenticatedApp = () => {
  const { login, register } = useAuth();

  return (
    <>
      <Container fluid>
        <Navbar bg="light" expand="sm">
          <Navbar.Brand>ISMDB</Navbar.Brand>
        </Navbar>
      </Container>
      <Login login={login} register={register} />
    </>
  );
};

export default UnauthenticatedApp;
