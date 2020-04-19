import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const AuthorAliases = ({ aliases }) => {
  aliases = aliases.map((alias) => alias.name).join(", ");

  return (
    <Row>
      <Col>{`Aliases: ${aliases}`}</Col>
    </Row>
  );
};

export default AuthorAliases;
