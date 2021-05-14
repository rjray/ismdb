/* eslint-disable react/prop-types */
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
    format: ({ id, name }) => <Link to={`/references/${id}`}>{name}</Link>,
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
    format: ({ createdAt }) => <FormatDate date={createdAt} />,
  },
  {
    name: <b>Updated</b>,
    selector: "updatedAt",
    hide: "md",
    maxWidth: "20%",
    format: ({ updatedAt }) => <FormatDate date={updatedAt} />,
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
