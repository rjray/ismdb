import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import ScaleLoader from "react-spinners/ScaleLoader"
import DataTable from "react-data-table-component"

import useDataApi from "../utils/data-api"
import AuthorExpand from "./AuthorExpand"

const lastNameFirst = name => {
  if (!name) {
    return ""
  }

  let parts = name.replace(/,/, "").split(" ")
  let lastName = parts.pop()
  if (lastName.match(/^jr[.]?$/i)) {
    lastName = parts.pop()
    parts.push("Jr.")
  }

  return `${lastName}, ${parts.join(" ")}`
}

const AuthorAll = () => {
  const [{ data, loading, error }] = useDataApi("/api/views/author/all", {
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
    let authors = data.authors.map(item => {
      item.name = lastNameFirst(item.name)
      return item
    })
    let columns = [
      {
        name: <b>Name</b>,
        selector: "name",
        sortable: true,
      },
      {
        name: <b>References</b>,
        selector: "refcount",
        sortable: true,
        maxWidth: "10%",
      },
    ]

    content = (
      <>
        <Row>
          <Col>
            <h2>Authors</h2>
          </Col>
          <Col className="text-right">
            <LinkContainer to="/authors/create">
              <Button>New</Button>
            </LinkContainer>
          </Col>
        </Row>
        <Row>
          <Col>
            <DataTable
              striped
              responsive
              dense
              highlightOnHover
              pointerOnHover
              pagination
              paginationPerPage={25}
              expandableRows
              expandOnRowClicked
              expandableRowsComponent={<AuthorExpand />}
              defaultSortField="name"
              columns={columns}
              data={authors}
            />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Authors</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default AuthorAll
