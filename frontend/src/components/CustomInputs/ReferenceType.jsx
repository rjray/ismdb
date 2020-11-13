import React, { useState } from "react";
import { useQueryCache } from "react-query";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";

import { getAllReferenceTypes } from "../../utils/queries";

const ReferenceType = ({ field, form, ...props }) => {
  const queryCache = useQueryCache();
  const [loadingTypesList, setLoadingTypesList] = useState(false);
  const [typesList, setTypesList] = useState([field.value]);

  const handleTypesSearch = (type) => {
    setLoadingTypesList(true);

    queryCache
      .fetchQuery(["referencetypes", { query: { type } }], getAllReferenceTypes)
      .then((data) => {
        const typesList = data.types;
        setTypesList(typesList);
        setLoadingTypesList(false);
      });
  };

  return (
    <AsyncTypeahead
      isLoading={loadingTypesList}
      id={field.name}
      name={field.name}
      labelKey="type"
      align="left"
      maxResults={20}
      paginate
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
      placeholder="Type"
      inputProps={{ "data-lpignore": "true", id: `rti-${field.name}-input` }}
      onSearch={handleTypesSearch}
      onBlur={form.handleBlur}
      {...props}
    />
  );
};

export default ReferenceType;
