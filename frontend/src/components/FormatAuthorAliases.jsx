import React from "react";
import PropTypes from "prop-types";

const FormatAuthorAliases = ({ aliases }) => (
  <span>
    {aliases
      .map((alias) => alias.name)
      .sort()
      .join(", ")}
  </span>
);

FormatAuthorAliases.propTypes = {
  aliases: PropTypes.array.isRequired,
};

export default FormatAuthorAliases;
