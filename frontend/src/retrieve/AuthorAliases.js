import React from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const AuthorAliases = ({ author }) => {
  const aliases = author.AuthorAliases.map(alias => alias.name)
    .sort()
    .join(", ")

  return (
    <Row>
      <Col>{`Aliases: ${aliases}`}</Col>
    </Row>
  )
}

export default AuthorAliases
