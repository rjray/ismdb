import React from "react"

import ReferenceRetrieve from "./ReferenceRetrieve"

const References = props => {
  let content

  switch (props.match.params.view) {
    case "create":
      break
    case "update":
      break
    case "delete":
      break
    default:
      // "retrieve" or null
      content = <ReferenceRetrieve {...props} />
  }

  return content
}

export default References
