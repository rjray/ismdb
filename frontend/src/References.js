import React from "react"
import Container from "react-bootstrap/Container"
import ScaleLoader from "react-spinners/ScaleLoader"
import { formatDistanceToNow } from "date-fns"
import DataTable from "react-data-table-component"

import useDataApi from "./utils/data-api"
import ReferenceExpand from "./ReferenceExpand"

const References = () => {
  const [{ data, loading, error }] = useDataApi("/api/views/reference/all", {
    data: {},
  })
  let content

  if (error) {
    content = (
      <>
        <h3>An Error Occurred</h3>
        <p>An error occurred trying to load all the references:</p>
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
    let references = data.references
    let columns = [
      {
        name: <b>Name</b>,
        selector: "name",
        sortable: true,
        width: "30%",
      },
      {
        name: <b>Source</b>,
        selector: row => {
          let str

          if (row.RecordType.description === "book") {
            str = row.isbn ? `ISBN ${row.isbn}` : "Book"
          } else if (row.RecordType.description === "article") {
            str = `${row.Magazine.name} ${row.MagazineIssue.number}`
          } else if (row.RecordType.description === "placeholder") {
            str = `${row.Magazine.name} ${row.MagazineIssue.number} (placeholder)`
          } else {
            str = row.RecordType.notes
          }

          return str
        },
        width: "25%",
        sortable: true,
      },
      {
        name: <b>Added</b>,
        selector: "createdAt",
        sortable: true,
        hide: "sm",
        format: row => {
          const now = new Date(row.createdAt)
          return (
            <span title={now}>{formatDistanceToNow(new Date(now))} ago</span>
          )
        },
        width: "15%",
      },
      {
        name: <b>Updated</b>,
        selector: "updatedAt",
        sortable: true,
        hide: "md",
        format: row => {
          const now = new Date(row.updatedAt)
          return (
            <span title={now}>{formatDistanceToNow(new Date(now))} ago</span>
          )
        },
        width: "15%",
      },
    ]

    content = (
      <DataTable
        title="References"
        striped
        responsive
        dense
        highlightOnHover
        pointerOnHover
        pagination
        paginationPerPage={25}
        expandableRows
        expandOnRowClicked
        expandableRowsComponent={<ReferenceExpand />}
        defaultSortField="name"
        columns={columns}
        data={references}
      />
    )
  }

  return <Container className="mt-2">{content}</Container>
}

export default References
