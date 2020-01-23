import React from "react"
import { Helmet } from "react-helmet"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Container from "react-bootstrap/Container"

import Header from "./Header"
import Authors from "./Authors"
import AuthorDetail from "./AuthorDetail"
import Magazines from "./Magazines"
import MagazineDetail from "./MagazineDetail"
import MagazineIssueDetail from "./MagazineIssueDetail"
import References from "./References"
import ReferenceDetail from "./ReferenceDetail"

const App = () => (
  <Router>
    <Helmet titleTemplate="MyMoDB - %s">
      <title>Home</title>
    </Helmet>

    <Header />

    <Container fluid>
      <Switch>
        <Route exact path="/">
          <Container>
            <h1>Home</h1>
          </Container>
        </Route>
        <Route path="/references/:id(\\d+)" component={ReferenceDetail} />
        <Route path="/references" component={References} />
        <Route path="/authors/:id(\\d+)" component={AuthorDetail} />
        <Route path="/authors" component={Authors} />
        <Route
          path="/magazines/:mid(\\d+)/:id(\\d+)"
          component={MagazineIssueDetail}
        />
        <Route path="/magazines/:id(\\d+)" component={MagazineDetail} />
        <Route path="/magazines" component={Magazines} />
      </Switch>
    </Container>
  </Router>
)

export default App
