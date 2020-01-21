import React from "react"
import Container from "react-bootstrap/Container"
import ScaleLoader from "react-spinners/ScaleLoader"
import DataTable from "react-data-table-component"

import useDataApi from "./utils/data-api"
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

const Authors = () => {
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
      <DataTable
        title="Authors"
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
    )
  }

  return <Container className="mt-2">{content}</Container>
}

export default Authors
