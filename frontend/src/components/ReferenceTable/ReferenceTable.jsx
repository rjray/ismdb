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

      if (row.RecordType.name === "book") {
        str = row.isbn ? `ISBN ${row.isbn}` : "Book";
      } else if (row.RecordType.name === "article") {
        str = `${row.Magazine.name} ${row.MagazineIssue.number}`;
      } else if (row.RecordType.name === "placeholder") {
        str = `${row.Magazine.name} ${row.MagazineIssue.number} (placeholder)`;
      } else {
        str = row.RecordType.notes;
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
    format: (row) => <FormatDate date={row.createdAt} />,
  },
  {
    name: <b>Updated</b>,
    selector: "updatedAt",
    sortable: true,
    maxWidth: "15%",
    hide: "md",
    format: (row) => <FormatDate date={row.updatedAt} />,
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
  data: PropTypes.array.isRequired,
  currentTag: PropTypes.number.isRequired,
  currentAuthor: PropTypes.number.isRequired,
};

export default ReferenceTable;
