import React from "react";

const FormatAuthorAliases = ({ aliases }) => (
  <span>
    {aliases
      .map((alias) => alias.name)
      .sort()
      .join(", ")}
  </span>
);

export default FormatAuthorAliases;
