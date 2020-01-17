import React from "react"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"

const App = () => (
  <Container fluid>
    <Navbar bg="light" expand="sm">
      <Navbar.Brand href="#home">My Modeling DB</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Browse" id="basic-nav-dropdown">
            <NavDropdown.Item href="#references">References</NavDropdown.Item>
            <NavDropdown.Item href="#authors">Authors</NavDropdown.Item>
            <NavDropdown.Item href="#magazines">Magazines</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      <Nav>
        <Button variant="link">login</Button>
      </Nav>
    </Navbar>
  </Container>
)

export default App
