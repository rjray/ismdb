import React from "react";

import AuthorCreate from "./create/AuthorCreate";
import AuthorRetrieve from "./retrieve/AuthorRetrieve";
import AuthorUpdate from "./update/AuthorUpdate";
import AuthorDelete from "./delete/AuthorDelete";

const Authors = (props) => {
  let content;

  switch (props.match.params.view) {
    case "create":
      content = <AuthorCreate {...props} />;
      break;
    case "update":
      content = <AuthorUpdate {...props} />;
      break;
    case "delete":
      content = <AuthorDelete {...props} />;
      break;
    default:
      // "retrieve" or null
      content = <AuthorRetrieve {...props} />;
  }

  return content;
};

export default Authors;
