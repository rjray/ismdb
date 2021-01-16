import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const LoginHeader = () => (
  <Container fluid>
    <Navbar bg="light" expand="sm">
      <Navbar.Brand>ISMDB</Navbar.Brand>
    </Navbar>
  </Container>
);

export default LoginHeader;
