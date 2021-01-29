import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const FullPageSpinner = () => (
  <div
    style={{
      fontSize: "4em",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <ScaleLoader height={70} width={8} radius={4} margin={4} />
  </div>
);

export default FullPageSpinner;
