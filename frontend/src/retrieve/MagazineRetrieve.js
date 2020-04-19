import React from "react";
import MagazineDetail from "./MagazineDetail";
import MagazineIssueDetail from "./MagazineIssueDetail";
import MagazineAll from "./MagazineAll";

const MagazineRetrieve = (props) => {
  let content;

  if (props.match.params.iid) {
    content = <MagazineIssueDetail id={props.match.params.iid} />;
  } else if (props.match.params.id) {
    content = <MagazineDetail id={props.match.params.id} />;
  } else {
    content = <MagazineAll />;
  }

  return content;
};

export default MagazineRetrieve;
