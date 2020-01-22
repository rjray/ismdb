import React from "react"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ScaleLoader from "react-spinners/ScaleLoader"

import useDataApi from "./utils/data-api"
import ReferenceTable from "./ReferenceTable"

const MagazineDetail = props => {
  let id = props.match.params.id
  const [{ data, loading, error }] = useDataApi(
    `/api/views/magazineissue/${id}`,
    {
      data: {},
    }
  )
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load the magazine issue:</p>
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
    let mi = data.magazineissue

    content = (
      <>
        <Row>
          <Col>
            <h2>Magazine Issue Detail</h2>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>Name: {`${mi.Magazine.name} ${mi.number}`}</Col>
          <Col className="text-right">edit</Col>
        </Row>
        <Row>
          <Col>
            {mi.Magazine.language && `Language: ${mi.Magazine.language}`}
          </Col>
        </Row>
        <Row>
          <Col>
            <ReferenceTable
              title="References"
              pagination={false}
              data={mi.References}
            />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Magazine Issue Detail</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default MagazineDetail
