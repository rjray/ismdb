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
import AuthorForm from "../forms/AuthorForm"

const crudHandler = setupCRUDHandler({
  type: "author",
  onSuccess: (data, formikBag) => {
    console.log(JSON.stringify(data, null, 2))
    let author = { ...data.author }
    author.aliases = author.aliases.map(item => {
      return { name: item.name, id: item.id, deleted: false }
    })
    for (let field in author) {
      formikBag.setFieldValue(field, author[field], false)
    }
  },
  onError: (error, formikBag) => {
    alert(`Error during update: ${error.message}`)
    formikBag.resetForm()
  },
})

const AuthorUpdate = props => {
  let id = props.match.params.id

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
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default AuthorUpdate
