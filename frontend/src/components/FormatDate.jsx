import React from "react";
import PropTypes from "prop-types";
import { format, formatDistanceToNow } from "date-fns";

const FormatDate = ({ date, format: fmt }) => {
  const now = new Date(date);
  const show = format(now, fmt);
  const title = formatDistanceToNow(now);

  return <span title={`${title} ago`}>{show}</span>;
};

FormatDate.propTypes = {
  date: PropTypes.string.isRequired,
  format: PropTypes.string,
};

FormatDate.defaultProps = {
  format: "PP",
};

export default FormatDate;
