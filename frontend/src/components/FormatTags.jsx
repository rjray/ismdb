import React from "react";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";

import { sortBy } from "../utils/no-lodash";

const FormatTags = ({ currentTag, tags }) => {
  let content = [];

  [...tags].sort(sortBy("name")).forEach((tag) => {
    const formatted =
      tag.id === currentTag ? (
        <Badge variant="secondary">{tag.name}</Badge>
      ) : (
        <Link key={tag.id} to={`/tags/${tag.id}`}>
          <Badge variant="primary">{tag.name}</Badge>
        </Link>
      );
    content.push(formatted, " ");
  });
  content.pop();

  return <span>{content}</span>;
};

export default FormatTags;
