import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";

import { sortBy } from "../utils/no-lodash";

const sortByName = sortBy("name");

function createBadge(tag, current, nolink) {
  if (nolink) {
    return (
      <Badge key={tag.id} variant="primary">
        {tag.name}
      </Badge>
    );
  }

  return tag.id === current ? (
    <Badge key={tag.id} variant="secondary">
      {tag.name}
    </Badge>
  ) : (
    <Link key={tag.id} to={`/tags/${tag.id}`}>
      <Badge variant="primary">{tag.name}</Badge>
    </Link>
  );
}

const FormatTags = ({ currentTag, tags, nolink }) => {
  const content = [];

  [...tags].sort(sortByName).forEach((tag) => {
    content.push(createBadge(tag, currentTag, nolink), " ");
  });
  content.pop();

  return <span>{content}</span>;
};

FormatTags.propTypes = {
  currentTag: PropTypes.number,
  tags: PropTypes.array.isRequired,
  nolink: PropTypes.bool,
};

FormatTags.defaultProps = {
  currentTag: null,
  nolink: false,
};

export default FormatTags;
