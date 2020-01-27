import React from "react"
import { format, formatDistanceToNow } from "date-fns"
import DataTable from "react-data-table-component"

import ReferenceExpand from "./ReferenceExpand"

const ReferenceTable = props => {
  let columns = [
    {
      name: <b>Name</b>,
      selector: "name",
      sortable: true,
      wrap: true,
      minWidth: "30%",
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
      sortable: true,
      wrap: true,
      minWidth: "20%",
    },
    {
      name: <b>Added</b>,
      selector: "createdAt",
      sortable: true,
      minWidth: "20%",
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
      minWidth: "20%",
      hide: "md",
      format: row => {
        const now = new Date(row.updatedAt)
        const show = format(now, "PPpp")
        const title = formatDistanceToNow(now)
        return <span title={`${title} ago`}>{show}</span>
      },
    },
  ]

  return (
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
      expandableRowsComponent={<ReferenceExpand />}
      defaultSortField="name"
      columns={columns}
      {...props}
    />
  )
}

export default ReferenceTable
