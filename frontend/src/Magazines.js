import React from "react"

import MagazineRetrieve from "./retrieve/MagazineRetrieve"
import MagazineUpdate from "./update/MagazineUpdate"

const Magazines = props => {
  let content

  switch (props.match.params.view) {
    case "create":
      break
    case "update":
      content = <MagazineUpdate {...props} />
      break
    case "delete":
      break
    default:
      // "retrieve" or null
      content = <MagazineRetrieve {...props} />
  }

  return content
}

export default Magazines
