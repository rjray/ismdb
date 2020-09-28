import React from "react";
import DataTable from "react-data-table-component";

import FormatDate from "../FormatDate";
import MagazineExpand from "./MagazineExpand";

let columns = [
  {
    name: <b>Name</b>,
    selector: "name",
    sortable: true,
  },
  {
    name: <b>Issues</b>,
    selector: "issues",
    sortable: true,
    format: (row) => row.issues.length,
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

const MagazineTable = ({ data: magazines, ...props }) => {
  const pagination = {};
  if (magazines.length > 25) {
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
      expandableRowsComponent={<MagazineExpand />}
      defaultSortField="name"
      columns={columns}
      data={magazines}
      {...pagination}
      {...props}
    />
  );
};

export default MagazineTable;
