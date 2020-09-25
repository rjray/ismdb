import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import DataTable from "react-data-table-component";

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
    minWidth: "20%",
    hide: "sm",
    format: (row) => formatDate(row.createdAt),
  },
  {
    name: <b>Updated</b>,
    selector: "updatedAt",
    sortable: true,
    minWidth: "20%",
    hide: "md",
    format: (row) => formatDate(row.updatedAt),
  },
];

const formatDate = (date) => {
  const now = new Date(date);
  const show = format(now, "PPpp");
  const title = formatDistanceToNow(now);
  return <span title={`${title} ago`}>{show}</span>;
};

const ReferenceTable = (props) => {
  const pagination = {};
  if (props.data.length > 25) {
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
        <ReferenceExpand currentTag={props.currentTag} />
      }
      defaultSortField="name"
      columns={columns}
      {...pagination}
      {...props}
    />
  );
};

export default ReferenceTable;
