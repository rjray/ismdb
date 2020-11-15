import React, { useState } from "react";
import { useQueryCache } from "react-query";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";

import { getAllReferenceTypes } from "../../utils/queries";

// Limit the number of matches returned at a time
const limit = 20;

const ReferenceType = ({ field, form, ...props }) => {
  const queryCache = useQueryCache();
  const [loadingTypesList, setLoadingTypesList] = useState(false);
  const [typesList, setTypesList] = useState([field.value]);

  const handleTypesSearch = (type) => {
    setLoadingTypesList(true);

    queryCache
      .fetchQuery(
        ["referencetypes", { query: { limit, type } }],
        getAllReferenceTypes
      )
      .then((data) => {
        setTypesList(data.types);
        setLoadingTypesList(false);
      });
  };

  return (
    <AsyncTypeahead
      isLoading={loadingTypesList}
      id={field.name}
      name={field.name}
      align="left"
      minLength={2}
      allowNew
      newSelectionPrefix={<strong>New type: </strong>}
      options={typesList}
      defaultInputValue={field.value.type}
      onChange={(selected) => {
        if (selected && selected[0]) {
          form.setFieldValue(field.name, selected[0]);
        }
      }}
      inputProps={{ "data-lpignore": "true", id: `rti-${field.name}-input` }}
      onSearch={handleTypesSearch}
      onBlur={form.handleBlur}
      {...props}
    />
  );
};

export default ReferenceType;
