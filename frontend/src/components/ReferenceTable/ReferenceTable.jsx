/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";

import FormatDate from "../FormatDate";
import ReferenceExpand from "./ReferenceExpand";

const columns = [
  {
    name: <b>Name</b>,
    selector: "name",
    sortable: true,
    wrap: true,
    minWidth: "30%",
  },
  {
    name: <b>Source</b>,
    selector: (row) => {
      let str;

      if (row.ReferenceType.name === "book") {
        str = row.isbn ? `ISBN ${row.isbn}` : "Book";
      } else if (row.ReferenceType.name === "article") {
        str = `${row.Magazine.name} ${row.MagazineIssue.number}`;
      } else if (row.ReferenceType.name === "placeholder") {
        str = `${row.Magazine.name} ${row.MagazineIssue.number} (placeholder)`;
      } else {
        str = row.ReferenceType.notes;
      }

      return str;
    },
    sortable: true,
    wrap: true,
    minWidth: "20%",
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

const ReferenceTable = ({ data, currentTag, currentAuthor, ...props }) => {
  const pagination = {};
  if (data.length > 25) {
    pagination.pagination = true;
    pagination.paginationPerPage = 25;
  }

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
      expandableRowsComponent={
        <ReferenceExpand
          currentTag={currentTag}
          currentAuthor={currentAuthor}
        />
      }
      defaultSortField="name"
      columns={columns}
      data={data}
      {...pagination}
      {...props}
    />
  );
};

ReferenceTable.propTypes = {
  currentAuthor: PropTypes.number,
  currentTag: PropTypes.number,
  data: PropTypes.array,
};

ReferenceTable.defaultProps = {
  currentAuthor: null,
  currentTag: null,
  data: [],
};

export default ReferenceTable;
