import React from "react"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ScaleLoader from "react-spinners/ScaleLoader"
import { formatDistanceToNow } from "date-fns"
import DataTable from "react-data-table-component"
import { compareAsc, compareDesc } from "date-fns"

import useDataApi from "./utils/data-api"
import compareVersion from "./utils/compare-version"

const sortRows = (rows, field, direction) => {
  switch (field) {
    case "number":
      rows =
        direction === "desc"
          ? rows.sort((a, b) => compareVersion(b.number, a.number))
          : rows.sort((a, b) => compareVersion(a.number, b.number))
      break
    case "createdAt":
      rows =
        direction === "desc"
          ? rows.sort((a, b) => compareDesc(a.createdAt, b.createdAt))
          : rows.sort((a, b) => compareAsc(a.createdAt, b.createdAt))
      break
    case "updatedAt":
      rows =
        direction === "desc"
          ? rows.sort((a, b) => compareDesc(a.updatedAt, b.updatedAt))
          : rows.sort((a, b) => compareAsc(a.updatedAt, b.updatedAt))
      break
    default:
      break
  }

  return rows
}

const MagazineDetail = props => {
  let id = props.match.params.id
  const [{ data, loading, error }] = useDataApi(`/api/views/magazine/${id}`, {
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
    let magazine = data.magazine
    let created = new Date(magazine.createdAt)
    let updated = new Date(magazine.updatedAt)
    let columns = [
      {
        name: <b>Issue</b>,
        selector: "number",
        sortable: true,
      },
      /*
      {
        name: <b>Added</b>,
        selector: "createdAt",
        sortable: true,
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
        hide: "md",
        format: row => {
          const now = new Date(row.updatedAt)
          return <span title={now}>{formatDistanceToNow(now)} ago</span>
        },
      }, */
    ]

    content = (
      <>
        <Row>
          <Col>
            <h2>Magazine Detail</h2>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>Name: {magazine.name}</Col>
          <Col className="text-right">edit</Col>
        </Row>
        <Row>
          <Col>{magazine.language && `Language: ${magazine.language}`}</Col>
        </Row>
        <Row>
          <Col>{magazine.aliases && `Aliases: ${magazine.aliases}`}</Col>
        </Row>
        <Row>
          <Col>{magazine.notes && `Notes: ${magazine.notes}`}</Col>
        </Row>
        <Row>
          <Col>
            Added:{" "}
            <span title={created}>{formatDistanceToNow(created)} ago</span>
          </Col>
          <Col>
            Last updated:{" "}
            <span title={updated}>{formatDistanceToNow(updated)} ago</span>
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
              defaultSortField="number"
              sortFunction={sortRows}
              columns={columns}
              data={magazine.MagazineIssues}
            />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Magazine Detail</title>
      </Helmet>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default MagazineDetail
