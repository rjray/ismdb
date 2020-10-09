import React from "react";
import { useQuery } from "react-query";
import Dropdown from "react-bootstrap/Dropdown";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../utils/api-endpoint";

const TopTags = () => {
  const count = 10;
  const url = `${apiEndpoint}/api/authors/withRefCount?limit=${count}&order=refcount,desc`;

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
        <em>Top {count} authors:</em>
      </div>
      <Dropdown style={{ width: "75%", margin: "auto" }}>
        <Dropdown.Toggle style={{ width: "100%" }} id="top-authors-dropdown">
          Select author to view
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {data.authors.map((author) => (
            <Dropdown.Item key={author.id} href={`/authors/${author.id}`}>
              {author.name} <em>({author.refcount})</em>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default TopTags;
