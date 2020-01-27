import React from "react"

import MagazineRetrieve from "./retrieve/MagazineRetrieve"

const Magazines = props => {
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
      content = <MagazineRetrieve {...props} />
  }

  return content
}

export default Magazines
