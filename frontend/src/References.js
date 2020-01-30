import React from "react"

import ReferenceRetrieve from "./retrieve/ReferenceRetrieve"
import ReferenceUpdate from "./update/ReferenceUpdate"

const References = props => {
  let content

  switch (props.match.params.view) {
    case "create":
      break
    case "update":
      content = <ReferenceUpdate {...props} />
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
