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
import AuthorAliases from "./AuthorAliases"
import ReferenceTable from "./ReferenceTable"

const AuthorDetail = ({ id }) => {
  const [{ data, loading, error }] = useDataApi(`/api/views/author/${id}`, {
    data: {},
  })
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load all the authors:</p>
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
    const author = data.author
    const references = author.References
    const pagination = references.length < 26 ? { pagination: false } : {}

    content = (
      <>
        <Row>
          <Col>
            <Header>Author Detail</Header>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>Name: {author.name}</Col>
          <Col className="text-right">
            <LinkContainer to={`/authors/update/${author.id}`}>
              <Button>Edit</Button>
            </LinkContainer>
          </Col>
        </Row>
        {author.AuthorAliases.length > 0 && <AuthorAliases author={author} />}
        <Row>
          <Col>
            <ReferenceTable data={references} {...pagination} />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Author Detail</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default AuthorDetail
