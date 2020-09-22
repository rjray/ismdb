import React from "react";
import { useQuery } from "react-query";
import FormControl from "react-bootstrap/FormControl";
import ScaleLoader from "react-spinners/ScaleLoader";

import apiEndpoint from "../utils/api-endpoint";

const TopTags = () => {
  const count = 10;
  const url = `${apiEndpoint}/api/authors/withRefCount?limit=${count}&order=refcount,desc`;

  const { isLoading, error, data } = useQuery(["Top Authors"], () => {
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
      <div className="mb-2">
        <em>Top {count} authors:</em>
      </div>
      <div style={{ width: "50%", margin: "auto" }}>
        <FormControl as="select" className="select-css">
          <option value="0">-- Select --</option>
          {data.authors.map((author) => (
            <option key={author.id} value={author.id}>
              {`${author.name} (${author.refcount})`}
            </option>
          ))}
        </FormControl>
      </div>
    </>
  );
};

export default TopTags;
