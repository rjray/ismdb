import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Container from "react-bootstrap/Container"

import Header from "./Header"
import Authors from "./Authors"
import Magazines from "./Magazines"
import References from "./References"

const App = () => (
  <Router>
    <Header />

    <Container fluid>
      <Switch>
        <Route path="/references">
          <References />
        </Route>
        <Route path="/authors">
          <Authors />
        </Route>
        <Route path="/magazines">
          <Magazines />
        </Route>
        <Route path="/">
          <h1>Home</h1>
        </Route>
      </Switch>
    </Container>
  </Router>
)

export default App
