import React from "react";
import { useQuery } from "react-query";
import Dropdown from "react-bootstrap/Dropdown";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../utils/api-endpoint";

const TopTags = () => {
  const count = 10;
  const url = `${apiEndpoint}/api/magazines/getMostRecentlyUpdated?count=${count}`;

  const { isLoading, error, data } = useQuery(["Top Magazines"], () => {
    return fetch(url).then((res) => res.json());
  });

  if (isLoading) {
    return (
      <div className="text-center">
        <ScaleLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <strong>Error: {error.message}</strong>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2">
        <em>Top {count} magazines:</em>
      </div>
      <Dropdown style={{ width: "50%", margin: "auto" }}>
        <Dropdown.Toggle style={{ width: "100%" }} id="top-magazines-dropdown">
          Select magazine to view
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {data.magazines.map((magazine) => (
            <Dropdown.Item key={magazine.id}>{magazine.name}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default TopTags;
