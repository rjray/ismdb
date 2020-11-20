import React from "react";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";

import TagExpand from "./TagExpand";

const columns = [
  {
    name: <b>Name</b>,
    selector: "name",
    sortable: true,
    wrap: true,
    minWidth: "30%",
  },
  {
    name: <b>Type</b>,
    selector: "type",
    sortable: true,
    wrap: true,
  },
  {
    name: <b>Description</b>,
    selector: "description",
    sortable: true,
    minWidth: "30%",
  },
  {
    name: <b>Count</b>,
    selector: "refcount",
    sortable: true,
  },
];

const TagTable = ({ data, ...props }) => {
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
      expandableRowsComponent={<TagExpand />}
      defaultSortField="name"
      columns={columns}
      data={data}
      {...pagination}
      {...props}
    />
  );
};

TagTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TagTable;
