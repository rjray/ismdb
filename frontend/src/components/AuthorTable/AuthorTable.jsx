/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";

import FormatDate from "../FormatDate";
import AuthorExpand from "./AuthorExpand";

const lastNameFirst = (name) => {
  if (!name) {
    return "";
  }

  const parts = name.replace(/,/, "").split(" ");
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
    selector: "dispName",
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
    maxWidth: "15%",
    hide: "sm",
    format: ({ createdAt }) => <FormatDate date={createdAt} />,
  },
  {
    name: <b>Updated</b>,
    selector: "updatedAt",
    sortable: true,
    maxWidth: "15%",
    hide: "md",
    format: ({ updatedAt }) => <FormatDate date={updatedAt} />,
  },
];

const AuthorTable = ({ data: authors, ...props }) => {
  const pagination = {};
  if (authors.length > 25) {
    pagination.pagination = true;
    pagination.paginationPerPage = 25;
  }

  const sortedAuthors = authors.map((item) => {
    const dispName = lastNameFirst(item.name);
    return { ...item, dispName };
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
      defaultSortField="dispName"
      columns={columns}
      {...pagination}
      {...props}
      data={sortedAuthors}
    />
  );
};

AuthorTable.propTypes = { data: PropTypes.array };

AuthorTable.defaultProps = { data: [] };

export default AuthorTable;
