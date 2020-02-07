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
import ReferenceForm from "../forms/ReferenceForm"

const ReferenceUpdate = props => {
  let id = props.match.params.id

  const [{ data, loading, error }] = useDataApi(
    `/api/views/combo/editreference/${id}`,
    {
      data: {},
    }
  )
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load the reference:</p>
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
    const { reference } = data

    content = (
      <>
        <Row>
          <Col>
            <Header>Reference Update</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/references/delete/${reference.id}`}>
              <Button>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <ReferenceForm {...data} />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Reference Update</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default ReferenceUpdate
