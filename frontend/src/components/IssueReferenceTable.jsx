import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import FormatDate from "./FormatDate";

const columns = [
  {
    name: <b>Name</b>,
    selector: "name",
    wrap: true,
    format: (row) => <Link to={`/references/${row.id}`}>{row.name}</Link>,
  },
  {
    name: <b>Type</b>,
    selector: "type",
    wrap: true,
  },
  {
    name: <b>Added</b>,
    selector: "createdAt",
    hide: "sm",
    maxWidth: "20%",
    format: (row) => <FormatDate date={row.createdAt} />,
  },
  {
    name: <b>Updated</b>,
    selector: "updatedAt",
    hide: "md",
    maxWidth: "20%",
    format: (row) => <FormatDate date={row.updatedAt} />,
  },
];

const IssueReferenceTable = ({ data: references, ...props }) => (
  <DataTable
    responsive
    dense
    highlightOnHover
    pointerOnHover
    columns={columns}
    data={references}
    {...props}
  />
);

IssueReferenceTable.propTypes = {
  data: PropTypes.object.isRequired,
};

export default IssueReferenceTable;
