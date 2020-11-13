import React from "react";
import { Link } from "react-router-dom";

import { sortBy } from "../utils/no-lodash";
const sortByOrder = sortBy("order");

function createAuthor(author, current, nolink) {
  if (nolink) {
    return <span key={author.id}>{author.name}</span>;
  } else {
    return current === author.id ? (
      <span key={author.id}>{author.name}</span>
    ) : (
      <Link key={author.id} to={`/authors/${author.id}`}>
        {author.name}
      </Link>
    );
  }
}

const FormatAuthors = ({ currentAuthor, authors, nolink }) => {
  const content = [];

  [...authors].sort(sortByOrder).forEach((author) => {
    content.push(createAuthor(author, currentAuthor, nolink), ", ");
  });
  content.pop();

  return <span>{content}</span>;
};

export default FormatAuthors;
