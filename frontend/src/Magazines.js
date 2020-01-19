import React from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ScaleLoader from "react-spinners/ScaleLoader"
import { formatDistanceToNow } from "date-fns"
import DataTable from "react-data-table-component"
import _ from "lodash"

import useDataApi from "./utils/data-api"

const createRow = elements => {
  if (elements.length < 10) {
    let id = elements[elements.length - 1].id + 1000

    while (elements.length < 10) {
      elements.push({ id: id++, number: "" })
    }
  }

  return elements.map(item => <Col key={item.id}>{item.number}</Col>)
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
      let rowInner = createRow(row)
      return <Row key={idx}>{rowInner}</Row>
    })

    content = rows
  }

  return (
    <Container style={{ justifyContent: "" }} className="p-2">
      {content}
    </Container>
  )
}

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
        name: "Name",
        selector: "name",
        sortable: true,
      },
      {
        name: "Issues",
        selector: "issues",
        sortable: true,
      },
      {
        name: "First Added",
        selector: "createdAt",
        sortable: true,
        maxWidth: "25%",
        format: row => {
          const now = new Date(row.createdAt)
          return (
            <span title={now}>{formatDistanceToNow(new Date(now))} ago</span>
          )
        },
      },
    ]

    content = (
      <DataTable
        title="Magazines"
        striped
        responsive
        dense
        highlightOnHover
        pointerOnHover
        pagination
        paginationPerPage={25}
        expandableRows
        expandOnRowClicked
        expandableRowsComponent={<ExpandMagazine />}
        defaultSortField="name"
        columns={columns}
        data={magazines}
      />
    )
  }

  return (
    <>
      <Container className="mt-2">{content}</Container>
    </>
  )
}

export default Magazines
