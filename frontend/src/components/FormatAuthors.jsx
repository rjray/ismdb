import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function createAuthor(author, current, nolink) {
  if (nolink) {
    return <span key={author.id}>{author.name}</span>;
  }

  return current === author.id ? (
    <span key={author.id}>{author.name}</span>
  ) : (
    <Link key={author.id} to={`/authors/${author.id}`}>
      {author.name}
    </Link>
  );
}

const FormatAuthors = ({ currentAuthor, authors, nolink }) => {
  const content = [];

  authors.forEach((author) => {
    content.push(createAuthor(author, currentAuthor, nolink), ", ");
  });
  content.pop();

  return <span>{content}</span>;
};

FormatAuthors.propTypes = {
  currentAuthor: PropTypes.number.isRequired,
  authors: PropTypes.array.isRequired,
  nolink: PropTypes.bool,
};

FormatAuthors.defaultProps = {
  nolink: false,
};

export default FormatAuthors;
