import React, { useState } from "react";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";

import apiEndpoint from "../../utils/api-endpoint";
import { sortBy } from "../../utils/no-lodash";

const sortByName = sortBy("name");

const FormatMatch = (option, props) => (
  <div style={{ whiteSpace: "normal" }}>
    <Highlighter search={props.text}>{option.name}</Highlighter>
    <em> ({option.refcount})</em>
  </div>
);

const TagEditor = ({ field, form, ...props }) => {
  const [loadingTagList, setLoadingTagList] = useState(false);
  const [tagList, setTagList] = useState([]);

  const handleTagsSearch = (query) => {
    setLoadingTagList(true);
    const url = `${apiEndpoint}/tags/queryWithRefCount?query=${query}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const tagList = data.tags;
        setTagList(tagList);
        setLoadingTagList(false);
      });
  };

  return (
    <AsyncTypeahead
      isLoading={loadingTagList}
      multiple
      id={field.name}
      name={field.name}
      labelKey="name"
      align="justify"
      maxResults={10}
      paginate
      minLength={2}
      allowNew
      newSelectionPrefix={<strong>New tag: </strong>}
      options={tagList}
      selected={field.value}
      renderMenuItemChildren={FormatMatch}
      inputProps={{ "data-lpignore": "true", id: `tei-${field.name}-input` }}
      onBlur={form.handleBlur}
      onSearch={handleTagsSearch}
      onChange={(selected) => {
        const seen = new Set();
        selected = selected
          .filter((item) => {
            if (seen.has(item.name)) return false;
            seen.add(item.name);
            return true;
          })
          .sort(sortByName);
        form.setFieldValue(field.name, selected);
      }}
      {...props}
    />
  );
};

export default TagEditor;
