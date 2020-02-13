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
import MagazineForm from "../forms/MagazineForm"

const submitHandler = (values, actions) => {
  alert(JSON.stringify(values, null, 2))
  actions.setSubmitting(false)
}

const MagazineUpdate = props => {
  let id = props.match.params.id

  const [{ data, loading, error }] = useDataApi(
    `/api/views/combo/editmagazine/${id}`,
    {
      data: {},
    }
  )
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load the magazine:</p>
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
    const magazine = data.magazine

    content = (
      <>
        <Row>
          <Col>
            <Header>Magazine Update</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/magazines/delete/${magazine.id}`}>
              <Button>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <MagazineForm submitHandler={submitHandler} action="update" {...data} />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Magazine Update</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default MagazineUpdate
