import React from "react"
import { Link } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import { Helmet } from "react-helmet"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import ScaleLoader from "react-spinners/ScaleLoader"
import { formatDistanceToNow, compareAsc, compareDesc, format } from "date-fns"
import DataTable from "react-data-table-component"

import useDataApi from "../utils/data-api"
import compareVersion from "../utils/compare-version"
import Header from "../styles/Header"

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

const MagazineDetailExpand = props => {
  let references = props.data.References

  let columns = [
    {
      name: <b>Name</b>,
      selector: "name",
      wrap: true,
      format: row => <Link to={`/references/${row.id}`}>{row.name}</Link>,
    },
    {
      name: <b>Type</b>,
      selector: "type",
      wrap: true,
    },
    {
      name: <b>Keywords</b>,
      selector: "keywords",
      wrap: true,
    },
    {
      name: <b>Added</b>,
      selector: "createdAt",
      hide: "sm",
      format: row => {
        const now = new Date(row.createdAt)
        const show = format(now, "PPpp")
        const title = formatDistanceToNow(now)
        return <span title={`${title} ago`}>{show}</span>
      },
    },
    {
      name: <b>Updated</b>,
      selector: "updatedAt",
      hide: "md",
      format: row => {
        const now = new Date(row.updatedAt)
        const show = format(now, "PPpp")
        const title = formatDistanceToNow(now)
        return <span title={`${title} ago`}>{show}</span>
      },
    },
  ]

  let content = (
    <DataTable
      responsive
      dense
      highlightOnHover
      pointerOnHover
      noHeader
      columns={columns}
      data={references}
    />
  )

  return (
    <Container fluid className="mt-2 mb-3">
      {content}
    </Container>
  )
}

const MagazineDetail = ({ id }) => {
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
        name: <b>Number</b>,
        selector: "number",
        sortable: true,
      },
      {
        name: <b>References</b>,
        selector: "References",
        format: row => row.References.length,
      },
      {
        name: <b>Added</b>,
        selector: "createdAt",
        sortable: true,
        hide: "sm",
        format: row => {
          const now = new Date(row.createdAt)
          const show = format(now, "PPpp")
          const title = formatDistanceToNow(now)
          return <span title={`${title} ago`}>{show}</span>
        },
      },
      {
        name: <b>Updated</b>,
        selector: "updatedAt",
        sortable: true,
        hide: "md",
        format: row => {
          const now = new Date(row.updatedAt)
          const show = format(now, "PPpp")
          const title = formatDistanceToNow(now)
          return <span title={`${title} ago`}>{show}</span>
        },
      },
    ]
    let pagination =
      magazine.MagazineIssues.length < 26
        ? {}
        : { pagination: true, paginationPerPage: 25 }

    content = (
      <>
        <Row>
          <Col>
            <Header>Magazine Detail</Header>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>Name: {magazine.name}</Col>
          <Col className="text-right">
            <LinkContainer to={`/magazines/update/${magazine.id}`}>
              <Button>Edit</Button>
            </LinkContainer>
          </Col>
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
            <span title={`${formatDistanceToNow(created)} ago`}>
              {format(created, "PPpp")}
            </span>
          </Col>
          <Col>
            Last updated:{" "}
            <span title={`${formatDistanceToNow(updated)} ago`}>
              {format(updated, "PPpp")}
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <DataTable
              title="Issues"
              striped
              responsive
              dense
              highlightOnHover
              pointerOnHover
              defaultSortField="number"
              sortFunction={sortRows}
              expandableRows
              expandOnRowClicked
              expandableRowsHideExpander
              expandableRowsComponent={<MagazineDetailExpand />}
              columns={columns}
              data={magazine.MagazineIssues}
              {...pagination}
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
