import React from "react";
import AuthorDetail from "./AuthorDetail";
import AuthorAll from "./AuthorAll";

const AuthorRetrieve = (props) => {
  let content;

  if (props.match.params.id) {
    content = <AuthorDetail id={props.match.params.id} />;
  } else {
    content = <AuthorAll />;
  }

  return content;
};

export default AuthorRetrieve;
