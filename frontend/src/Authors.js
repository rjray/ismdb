import React from "react"

import AuthorRetrieve from "./retrieve/AuthorRetrieve"
import AuthorUpdate from "./update/AuthorUpdate"

const Authors = props => {
  let content

  switch (props.match.params.view) {
    case "create":
      break
    case "update":
      content = <AuthorUpdate {...props} />
      break
    case "delete":
      break
    default:
      // "retrieve" or null
      content = <AuthorRetrieve {...props} />
  }

  return content
}

export default Authors
