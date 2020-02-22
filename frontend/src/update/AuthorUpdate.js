import React, { useState } from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Toast from "react-bootstrap/Toast"
import ScaleLoader from "react-spinners/ScaleLoader"
import deepEqual from "deep-equal"

import useDataApi from "../utils/data-api"
import setupCRUDHandler from "../utils/crud"
import Header from "../styles/Header"
import AuthorForm from "../forms/AuthorForm"

const AuthorUpdate = props => {
  const id = props.match.params.id
  const [show, setShow] = useState(false)
  const [showResult, setShowResult] = useState("")
  const [showResultMessage, setShowResultMessage] = useState("")

  const [{ data, loading, error }] = useDataApi(`/api/retrieve/author/${id}`, {
    data: {},
  })
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load the author:</p>
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

    const crudHandler = setupCRUDHandler({
      type: "author",
      onSuccess: (data, formikBag) => {
        let author = { ...data.author }
        author.aliases = author.aliases.map(item => {
          return { name: item.name, id: item.id, deleted: false }
        })
        for (let field in author) {
          formikBag.setFieldValue(field, author[field], false)
        }
        setShow(true)
        setShowResult("Success")
        setShowResultMessage("Author succesfully updated")
      },
      onError: (error, formikBag) => {
        alert(`Error during update: ${error.message}`)
        formikBag.resetForm()
        setShow(true)
        setShowResult("Error")
        setShowResultMessage(`Update failed: ${data.error.message}`)
      },
    })

    const submitHandler = (values, formikBag) => {
      let oldAuthor = { ...author }
      let newAuthor = { ...values }
      delete newAuthor.action

      if (!deepEqual(oldAuthor, newAuthor)) {
        crudHandler(values, formikBag)
      }
      formikBag.setSubmitting(false)
    }

    content = (
      <>
        <Row>
          <Col>
            <Header>Author Update</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/authors/delete/${author.id}`}>
              <Button>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <AuthorForm
          author={author}
          action="update"
          submitHandler={submitHandler}
        />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Author Update</title>
      </Helmet>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: "relative" }}
      >
        <Toast
          onClose={() => setShow(false)}
          show={show}
          delay={5000}
          autohide
          style={{ zIndex: 1000, position: "absolute", top: 0, right: 0 }}
        >
          <Toast.Header>
            <strong className="mr-auto">{showResult}</strong>
          </Toast.Header>
          <Toast.Body>{showResultMessage}</Toast.Body>
        </Toast>
      </div>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default AuthorUpdate
