import React from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const LoginHeader = ({ page }) => (
  <Container fluid>
    <Navbar bg="light" expand="sm">
      <Navbar.Brand>ISMDB</Navbar.Brand>
      <Nav>{page}</Nav>
    </Navbar>
  </Container>
);

LoginHeader.propTypes = {
  page: PropTypes.string.isRequired,
};

export default LoginHeader;
