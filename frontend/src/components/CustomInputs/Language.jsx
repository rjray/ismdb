import React from "react";
import { useQuery } from "react-query";
import { Typeahead } from "react-bootstrap-typeahead";
import BeatLoader from "react-spinners/BeatLoader";

import "react-bootstrap-typeahead/css/Typeahead.css";

import { getAllLanguages } from "../../utils/queries";

const Language = ({ field, form, ...props }) => {
  const { isLoading, isError, data, error } = useQuery(
    "languages",
    getAllLanguages
  );

  if (isLoading) {
    return (
      <div className="mt-2">
        <BeatLoader size={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <em className="form-field-error">
        Error loading languages: {error.message}
      </em>
    );
  }

  return (
    <Typeahead
      id={field.name}
      name={field.name}
      labelKey="language"
      align="left"
      maxResults={20}
      paginate
      minLength={2}
      allowNew
      newSelectionPrefix={<strong>New language: </strong>}
      options={data.languages}
      defaultInputValue={field.value.language}
      onChange={(selected) => {
        if (selected && selected[0]) {
          form.setFieldValue(field.name, selected[0]);
        }
      }}
      placeholder="Language"
      inputProps={{ "data-lpignore": "true", id: `li-${field.name}-input` }}
      onBlur={form.handleBlur}
      {...props}
    />
  );
};

export default Language;
