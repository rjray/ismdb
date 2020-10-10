import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery } from "react-query";
import Dropdown from "react-bootstrap/Dropdown";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../utils/api-endpoint";

const count = 10;
const params = [`limit=${count}`, "order=refcount,desc"];
const url = `${apiEndpoint}/api/authors/withRefCount?${params.join("&")}`;

const TopTags = () => {
  const { isLoading, error, data } = useQuery("top authors", () => {
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
        <em>Top authors by credits:</em>
      </div>
      <Dropdown>
        <Dropdown.Toggle style={{ width: "100%" }} id="top-authors-dropdown">
          Select author to view
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {data.authors.map((author) => (
            <LinkContainer key={author.id} to={`/authors/${author.id}`}>
              <Dropdown.Item>
                {author.name} <em>({author.refcount})</em>
              </Dropdown.Item>
            </LinkContainer>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default TopTags;
