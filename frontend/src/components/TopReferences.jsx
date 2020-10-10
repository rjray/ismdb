import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import Dropdown from "react-bootstrap/Dropdown";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../utils/api-endpoint";

const count = 10;
const params = [`limit=${count}`, "order=updatedAt,desc"];
const url = `${apiEndpoint}/api/references?${params.join("&")}`;

const TopReferences = () => {
  const { isLoading, error, data } = useQuery("top references", () => {
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
        <em>Most-recently updated references:</em>
      </div>
      <Dropdown style={{ width: "100%", margin: "auto" }}>
        <Dropdown.Toggle style={{ width: "100%" }} id="top-references-dropdown">
          Select reference to view
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {data.references.map((reference) => (
            <LinkContainer
              key={reference.id}
              to={`/references/${reference.id}`}
            >
              <Dropdown.Item>{reference.name}</Dropdown.Item>
            </LinkContainer>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default TopReferences;
