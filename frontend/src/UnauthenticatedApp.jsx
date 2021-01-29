import React, { lazy, Suspense } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Formik, Field, ErrorMessage } from "formik";

import { useAuth } from "./auth";
import "./styles/Login.css";

const SignupForm = lazy(() => import("./components/SignupForm"));

const UnauthenticatedApp = () => {
  const { login, register } = useAuth();
  function submitHandler(values, bag) {
    login(values);
    bag.resetForm();
    bag.setSubmitting(false);
  }

  return (
    <>
      <Container fluid>
        <Navbar bg="light" expand="sm">
          <Navbar.Brand>ISMDB</Navbar.Brand>
        </Navbar>
      </Container>
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
                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                    }}
                    onSubmit={submitHandler}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
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
                </Tab.Pane>
                <Tab.Pane eventKey="signup">
                  <Suspense fallback={<ScaleLoader />}>
                    <SignupForm register={register} />
                  </Suspense>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
};

export default UnauthenticatedApp;
