import React from "react";
import { useQuery } from "react-query";
import Dropdown from "react-bootstrap/Dropdown";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../utils/api-endpoint";

const TopTags = () => {
  const count = 10;
  const params = [
    `limit=${count}`,
    "order=refcount,desc",
    "where=type,ne,meta",
    "where=type,ne,scale",
    "where=type,ne,nationality",
  ];
  const url = `${apiEndpoint}/api/tags/withRefCount?${params.join("&")}`;

  const { isLoading, error, data } = useQuery(["Top Tags"], () => {
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
        <em>Top {count} tags:</em>
      </div>
      <Dropdown style={{ width: "75%", margin: "auto" }}>
        <Dropdown.Toggle style={{ width: "100%" }} id="top-tags-dropdown">
          Select tag to view
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {data.tags.map((tag) => (
            <Dropdown.Item key={tag.id} href={`/tags/${tag.id}`}>
              {tag.name} <em>({tag.refcount})</em>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default TopTags;
