import React from "react";
import { useQuery } from "react-query";
import FormControl from "react-bootstrap/FormControl";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../utils/api-endpoint";

const TopTags = ({ count }) => {
  if (!count) count = 10;
  const params = [
    `limit=${count}`,
    "order=refcount,desc",
    "where=type,ne,meta",
    "where=type,ne,nationality",
  ];
  const url = `${apiEndpoint}/api/tags/withRefCount?${params.join("&")}`;

  const { isLoading, error, data } = useQuery(["TopTags", count], () => {
    return fetch(url).then((res) => res.json());
  });

  if (isLoading) {
    return (
      <div>
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
      <div>
        <em>Top {count} tags:</em>
      </div>
      <div style={{ width: "50%", margin: "auto" }}>
        <FormControl as="select">
          <option value="0">-- Select --</option>
          {data.tags.map((tag) => (
            <option
              key={tag.id}
              value={tag.id}
            >{`${tag.name} (${tag.refcount})`}</option>
          ))}
        </FormControl>
      </div>
    </>
  );
};

export default TopTags;
