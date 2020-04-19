import React from "react";

import MagazineCreate from "./create/MagazineCreate";
import MagazineRetrieve from "./retrieve/MagazineRetrieve";
import MagazineUpdate from "./update/MagazineUpdate";

const Magazines = (props) => {
  let content;

  switch (props.match.params.view) {
    case "create":
      content = <MagazineCreate {...props} />;
      break;
    case "update":
      content = <MagazineUpdate {...props} />;
      break;
    case "delete":
      break;
    default:
      // "retrieve" or null
      content = <MagazineRetrieve {...props} />;
  }

  return content;
};

export default Magazines;
