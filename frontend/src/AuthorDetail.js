import React from "react"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ScaleLoader from "react-spinners/ScaleLoader"

import useDataApi from "./utils/data-api"
import ReferenceTable from "./ReferenceTable"

const AuthorDetail = props => {
  let id = props.match.params.id
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
    let author = data.author

    content = (
      <>
        <Row>
          <Col>
            <h2>Author Detail</h2>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>Name: {author.name}</Col>
          <Col className="text-right">edit</Col>
        </Row>
        <Row>
          <Col>
            {author.aliases &&
              `Aliases: ${author.aliases.replace(/\|/g, ", ")}`}
          </Col>
        </Row>
        <Row>
          <Col>
            <ReferenceTable data={author.References} />
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
