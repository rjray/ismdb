import React from "react";
import { Link } from "react-router-dom";

import { sortBy } from "../utils/no-lodash";

const FormatAuthors = ({ currentAuthor, authors }) => {
  const content = [];

  [...authors].sort(sortBy("order")).forEach((author) => {
    const formatted =
      currentAuthor === author.id ? (
        <span>{author.name}</span>
      ) : (
        <Link key={author.id} to={`/authors/${author.id}`}>
          {author.name}
        </Link>
      );
    content.push(formatted, ", ");
  });
  content.pop();

  return <span>{content}</span>;
};

export default FormatAuthors;
