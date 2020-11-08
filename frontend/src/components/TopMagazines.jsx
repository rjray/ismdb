import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import Dropdown from "react-bootstrap/Dropdown";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../utils/api-endpoint";

const count = 10;
const params = [`count=${count}`];
const url = `${apiEndpoint}/magazines/getMostRecentlyUpdated?${params.join(
  "&"
)}`;

const TopTags = () => {
  const { isLoading, error, data } = useQuery("top magazines", () => {
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
        <em>Most-recently updated magazines:</em>
      </div>
      <Dropdown>
        <Dropdown.Toggle style={{ width: "100%" }} id="top-magazines-dropdown">
          Select magazine to view
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {data.magazines.map((magazine) => (
            <LinkContainer key={magazine.id} to={`/magazines/${magazine.id}`}>
              <Dropdown.Item>{magazine.name}</Dropdown.Item>
            </LinkContainer>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default TopTags;
