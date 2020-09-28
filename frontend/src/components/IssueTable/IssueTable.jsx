import React from "react";
import DataTable from "react-data-table-component";

import compareVersion from "../../utils/compare-version";
import FormatDate from "../FormatDate";
import IssueExpand from "./IssueExpand";

let columns = [
  {
    name: <b>Number</b>,
    selector: "number",
    sortable: true,
    sortFunction: (a, b) => compareVersion(a.number, b.number),
  },
  {
    name: <b>References</b>,
    selector: "refcount",
    format: (row) => row.references.length,
  },
  {
    name: <b>Added</b>,
    selector: "createdAt",
    sortable: true,
    hide: "sm",
    maxWidth: "15%",
    format: (row) => <FormatDate date={row.createdAt} />,
  },
  {
    name: <b>Updated</b>,
    selector: "updatedAt",
    sortable: true,
    hide: "md",
    maxWidth: "15%",
    format: (row) => <FormatDate date={row.updatedAt} />,
  },
];

const IssueTable = ({ data: issues, ...props }) => {
  const pagination = {};
  if (issues.length > 25) {
    pagination.pagination = true;
    pagination.paginationPerPage = 25;
  }

  return (
    <DataTable
      title="Issues"
      striped
      responsive
      dense
      highlightOnHover
      pointerOnHover
      defaultSortField="number"
      expandableRows
      expandOnRowClicked
      expandableRowsHideExpander
      expandableRowsComponent={<IssueExpand />}
      columns={columns}
      data={issues}
      {...pagination}
      {...props}
    />
  );
};

export default IssueTable;
