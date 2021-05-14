/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";

import FormatDate from "../FormatDate";
import MagazineExpand from "./MagazineExpand";

const columns = [
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

MagazineTable.propTypes = { data: PropTypes.array };

MagazineTable.defaultProps = { data: [] };

export default MagazineTable;
