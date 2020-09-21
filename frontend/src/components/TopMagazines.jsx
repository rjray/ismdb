import React from "react";
import { useQuery } from "react-query";
import Form from "react-bootstrap/Form";

import apiEndpoint from "../utils/api-endpoint";

const TopTags = ({ count }) => {
  if (!count) count = 10;
  const url = `${apiEndpoint}/api/magazines/getMostRecentlyUpdated?count=${count}`;

  const { isLoading, error, data } = useQuery(["TopMagazines", count], () => {
    return fetch(url).then((res) => res.json());
  });

  if (isLoading) {
    console.log("Loading....");
    return (
      <div>
        <em>Loading...</em>
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
      <div>
        <Form style={{ width: "50%", margin: "auto" }}>
          <Form.Control as="select">
            <option value="0">-- Select --</option>
            {data.magazines.map((magazine) => (
              <option key={magazine.id} value={magazine.id}>
                {magazine.name}
              </option>
            ))}
          </Form.Control>
        </Form>
      </div>
    </>
  );
};

export default TopTags;
