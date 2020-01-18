import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Container from "react-bootstrap/Container"

import Header from "./Header"
import Authors from "./Authors"

const App = () => (
  <Router>
    <Container>
      <Header />

      <Switch>
        <Route path="/authors">
          <Authors />
        </Route>
      </Switch>
    </Container>
  </Router>
)

export default App
