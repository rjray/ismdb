import React from "react";
import { format, formatDistanceToNow } from "date-fns";

const FormatDate = ({ date, format: fmt }) => {
  const now = new Date(date);
  const show = format(now, fmt || "PP");
  const title = formatDistanceToNow(now);
  return <span title={`${title} ago`}>{show}</span>;
};

export default FormatDate;
