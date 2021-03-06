/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";

import { quickSearchName } from "../utils/queries";

const typeMap = {
  references: "Reference",
  magazines: "Magazine",
  authors: "Author",
  tags: "Tag",
};

const FormatMatch = ({ name, type }, { text }) => (
  <Row>
    <Col xs={12} md={9}>
      <div style={{ whiteSpace: "normal" }}>
        <Highlighter search={text}>{name}</Highlighter>
      </div>
    </Col>
    <Col xs={12} md={3} className="text-right">
      <em>{typeMap[type]}</em>
    </Col>
  </Row>
);

const QuickSearch = (props) => {
  const queryClient = useQueryClient();
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [queryMatches, setQueryMatches] = useState([]);
  const history = useHistory();

  const handleQuickSearch = (query) => {
    setLoadingQuery(true);

    queryClient
      .fetchQuery(["quicksearch", { query: { query } }], quickSearchName)
      .then((data) => {
        setQueryMatches(data.matches);
        setLoadingQuery(false);
      });
  };

  return (
    <AsyncTypeahead
      isLoading={loadingQuery}
      id="quicksearch"
      name="tags"
      labelKey="name"
      align="justify"
      maxResults={20}
      paginate
      minLength={2}
      options={queryMatches}
      placeholder="Quick search by name"
      inputProps={{ "data-lpignore": "true" }}
      onSearch={handleQuickSearch}
      onChange={(selected) => {
        if (selected && selected[0]) {
          history.push(`/${selected[0].type}/${selected[0].id}`);
        }
      }}
      renderMenuItemChildren={FormatMatch}
      {...props}
    />
  );
};

export default QuickSearch;
