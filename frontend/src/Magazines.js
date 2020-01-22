import React from "react"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ScaleLoader from "react-spinners/ScaleLoader"
import { formatDistanceToNow } from "date-fns"
import DataTable from "react-data-table-component"

import useDataApi from "./utils/data-api"
import MagazineExpand from "./MagazineExpand"

const Magazines = () => {
  const [{ data, loading, error }] = useDataApi("/api/views/magazine/all", {
    data: {},
  })
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load all the magazines:</p>
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
    let magazines = data.magazines
    let columns = [
      {
        name: <b>Name</b>,
        selector: "name",
        sortable: true,
      },
      {
        name: <b>Issues</b>,
        selector: "issues",
        sortable: true,
      },
      {
        name: <b>Added</b>,
        selector: "createdAt",
        sortable: true,
        maxWidth: "20%",
        hide: "sm",
        format: row => {
          const now = new Date(row.createdAt)
          return <span title={now}>{formatDistanceToNow(now)} ago</span>
        },
      },
      {
        name: <b>Updated</b>,
        selector: "updatedAt",
        sortable: true,
        maxWidth: "20%",
        hide: "md",
        format: row => {
          const now = new Date(row.updatedAt)
          return <span title={now}>{formatDistanceToNow(now)} ago</span>
        },
      },
    ]

    content = (
      <>
        <Row>
          <Col>
            <h2>Magazines</h2>
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
              expandableRowsComponent={<MagazineExpand />}
              defaultSortField="name"
              columns={columns}
              data={magazines}
            />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Magazines</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default Magazines
