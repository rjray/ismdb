import React from "react"
import ReferenceDetail from "./ReferenceDetail"
import ReferenceAll from "./ReferenceAll"

const ReferenceRetrieve = props => {
  let content

  if (props.match.params.id) {
    content = <ReferenceDetail id={props.match.params.id} />
  } else {
    content = <ReferenceAll />
  }

  return content
}

export default ReferenceRetrieve
