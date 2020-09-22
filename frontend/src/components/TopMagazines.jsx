import React from "react";
import { useQuery } from "react-query";
import FormControl from "react-bootstrap/FormControl";
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
        <em>Top {count} magazines:</em>
      </div>
      <div style={{ width: "50%", margin: "auto" }}>
        <FormControl as="select" className="select-css">
          <option value="0">-- Select --</option>
          {data.magazines.map((magazine) => (
            <option key={magazine.id} value={magazine.id}>
              {magazine.name}
            </option>
          ))}
        </FormControl>
      </div>
    </>
  );
};

export default TopTags;
