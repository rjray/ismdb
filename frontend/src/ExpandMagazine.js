import React from "react"
import { Link } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ScaleLoader from "react-spinners/ScaleLoader"
import _ from "lodash"

import useDataApi from "./utils/data-api"

const createIssueRow = (mId, elements) => {
  if (elements.length < 10) {
    let id = elements[elements.length - 1].id + 1000

    while (elements.length < 10) {
      elements.push({ id: id++, number: "" })
    }
  }

  return elements.map(item => (
    <Col key={item.id} xs={5} sm={5} md={1}>
      {item.number ? (
        <Link to={`/magazines/${mId}/${item.id}`}>{item.number}</Link>
      ) : (
        ""
      )}
    </Col>
  ))
}

const ExpandMagazine = props => {
  const [
    { data, loading, error },
  ] = useDataApi(`/api/views/magazine/${props.data.id}`, { data: {} })
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load data for magazine:</p>
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
    let magazine = data.magazine
    let chunks = _.chunk(magazine.MagazineIssues, 10)
    let rows = chunks.map((row, idx) => {
      let rowInner = createIssueRow(magazine.id, row)
      return <Row key={idx}>{rowInner}</Row>
    })

    if (magazine.notes) {
      rows.unshift(
        <Row>
          <Col>
            Notes:
            <br />
            {magazine.notes}
          </Col>
        </Row>
      )
    }
    rows.unshift(
      <Row>
        <Col>{magazine.language && `Language: ${magazine.language}`}</Col>
        <Col className="text-right">edit</Col>
      </Row>
    )

    content = rows
  }

  return (
    <Container fluid className="mt-2 mb-3">
      {content}
    </Container>
  )
}

export default ExpandMagazine
