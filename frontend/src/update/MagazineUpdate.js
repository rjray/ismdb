import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import ScaleLoader from "react-spinners/ScaleLoader"
import deepEqual from "deep-equal"

import useDataApi from "../utils/data-api"
import setupCRUDHandler from "../utils/crud"
import Header from "../styles/Header"
import MagazineForm from "../forms/MagazineForm"

const crudHandler = setupCRUDHandler({
  type: "magazine",
  onSuccess: (data, formikBag) => {
    let magazine = { ...data.magazine }
    magazine.createdAt = new Date(magazine.createdAt)
    magazine.updatedAt = new Date(magazine.updatedAt)
    for (let field in magazine) {
      formikBag.setFieldValue(field, magazine[field], false)
    }
  },
  onError: (error, formikBag) => {
    alert(`Error during update: ${error.message}`)
    formikBag.resetForm()
  },
})

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

    const submitHandler = (values, formikBag) => {
      let oldMagazine = { ...magazine }
      let newMagazine = { ...values }
      for (let key of ["action", "createdAt", "updatedAt"]) {
        delete oldMagazine[key]
        delete newMagazine[key]
      }

      if (!deepEqual(oldMagazine, newMagazine)) {
        //alert(JSON.stringify(values, null, 2))
        crudHandler(values, formikBag)
      }
      formikBag.setSubmitting(false)
    }

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
