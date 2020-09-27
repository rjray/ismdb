import React from "react";
import DataTable from "react-data-table-component";

import FormatDate from "../FormatDate";
import AuthorExpand from "./AuthorExpand";

const lastNameFirst = (name) => {
  if (!name) {
    return "";
  }

  let parts = name.replace(/,/, "").split(" ");
  let lastName = parts.pop();
  if (lastName.match(/^jr[.]?$/i)) {
    lastName = parts.pop();
    parts.push("Jr.");
  }

  return `${lastName}, ${parts.join(" ")}`;
};

const columns = [
  {
    name: <b>Name</b>,
    selector: "name",
    sortable: true,
    wrap: true,
    minWidth: "30%",
  },
  {
    name: <b>References</b>,
    selector: "refcount",
    sortable: true,
    maxWidth: "10%",
  },
  {
    name: <b>Added</b>,
    selector: "createdAt",
    sortable: true,
    maxWidth: "25%",
    hide: "sm",
    format: (row) => <FormatDate date={row.createdAt} />,
  },
  {
    name: <b>Updated</b>,
    selector: "updatedAt",
    sortable: true,
    maxWidth: "25%",
    hide: "md",
    format: (row) => <FormatDate date={row.updatedAt} />,
  },
];

const AuthorTable = ({ data: authors, ...props }) => {
  const pagination = {};
  if (authors.length > 25) {
    pagination.pagination = true;
    pagination.paginationPerPage = 25;
  }

  authors = authors.map((item) => {
    item.name = lastNameFirst(item.name);
    return item;
  });

  return (
    <DataTable
      striped
      responsive
      dense
      highlightOnHover
      pointerOnHover
      expandableRows
      expandOnRowClicked
      expandableRowsHideExpander
      expandableRowsComponent={<AuthorExpand />}
      defaultSortField="name"
      columns={columns}
      {...pagination}
      {...props}
      data={authors}
    />
  );
};

export default AuthorTable;
