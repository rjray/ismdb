/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "react-query";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";

import { getTagsQueryWithRefCount } from "../../utils/queries";
import { sortBy } from "../../utils/no-lodash";

const sortByName = sortBy("name");

const FormatMatch = ({ name, refcount }, { text }) => (
  <div style={{ whiteSpace: "normal" }}>
    <Highlighter search={text}>{name}</Highlighter>
    <em> ({refcount})</em>
  </div>
);

const TagEditor = ({ field, form, ...props }) => {
  const queryClient = useQueryClient();
  const [loadingTagList, setLoadingTagList] = useState(false);
  const [tagList, setTagList] = useState([]);

  const handleTagsSearch = (query) => {
    setLoadingTagList(true);

    queryClient
      .fetchQuery(
        ["tags", { queryWithRefCount: true, query: { query } }],
        getTagsQueryWithRefCount
      )
      .then((data) => {
        const newTagList = data.tags;
        setTagList(newTagList);
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
        const filteredSelected = selected
          .filter((item) => {
            if (seen.has(item.name)) return false;
            seen.add(item.name);
            return true;
          })
          .sort(sortByName);
        form.setFieldValue(field.name, filteredSelected);
      }}
      {...props}
    />
  );
};

TagEditor.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default TagEditor;
