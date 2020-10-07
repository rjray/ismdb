import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";

import apiEndpoint from "../utils/api-endpoint";

const typeMap = {
  references: "Reference",
  magazines: "Magazine",
  authors: "Author",
  tags: "Tag",
};

const FormatMatch = (option, props) => (
  <Row>
    <Col xs={12} md={9}>
      <div style={{ whiteSpace: "normal" }}>
        <Highlighter search={props.text}>{option.name}</Highlighter>
      </div>
    </Col>
    <Col xs={12} md={3} className="text-right">
      <em>{typeMap[option.type]}</em>
    </Col>
  </Row>
);

const QuickSearch = (props) => {
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [queryMatches, setQueryMatches] = useState([]);
  const history = useHistory();

  const handleQuickSearch = (query) => {
    setLoadingQuery(true);
    const url = `${apiEndpoint}/api/misc/quicksearch?query=${query}`;

    fetch(url)
      .then((response) => response.json())
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
