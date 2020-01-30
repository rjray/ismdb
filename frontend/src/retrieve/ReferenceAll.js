import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import ScaleLoader from "react-spinners/ScaleLoader"

import useDataApi from "../utils/data-api"
import Header from "../styles/Header"
import ReferenceTable from "./ReferenceTable"

const ReferenceAll = () => {
  const [{ data, loading, error }] = useDataApi("/api/views/reference/all", {
    data: {},
  })
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load all the references:</p>
        <p>{error.message}</p>
      </>
    )
  } else if (loading) {
    content = (
      <div style={{ textAlign: "center" }}>
        <ScaleLoader />
      </div>
    )
  } else {
    content = (
      <>
        <Row>
          <Col>
            <Header>References</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer to="/references/create">
              <Button>New</Button>
            </LinkContainer>
          </Col>
        </Row>
        <Row>
          <Col>
            <ReferenceTable data={data.references} />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>References</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default ReferenceAll
