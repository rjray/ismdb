import React, { useState, lazy, Suspense } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import ScaleLoader from "react-spinners/ScaleLoader";

import { useAuth } from "./auth";
import "./styles/Login.css";

const SignupForm = lazy(() => import("./components/SignupForm"));

const UnauthenticatedApp = () => {
  const { login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  function submitHandler(e) {
    e.preventDefault();

    if (!username) {
      setError("User Name is required");
    } else if (!password) {
      setError("Password is required");
    } else {
      login({ username, password }).catch((err) => setError(err.message));
      setUsername("");
      setPassword("");
    }
  }

  return (
    <>
      <Container fluid>
        <Navbar bg="light" expand="sm">
          <Navbar.Brand>ISMDB</Navbar.Brand>
        </Navbar>
      </Container>
      <div className="Login">
        {error && <Alert variant="danger">{error}</Alert>}
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
                  <Form>
                    <Form.Group size="lg" controlId="email">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        autoFocus
                        name="username"
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      block
                      size="lg"
                      type="submit"
                      onClick={submitHandler}
                    >
                      Log In
                    </Button>
                  </Form>
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
