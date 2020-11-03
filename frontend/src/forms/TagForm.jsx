import React from "react";
import { useQuery } from "react-query";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import BeatLoader from "react-spinners/BeatLoader";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import apiEndpoint from "../utils/api-endpoint";
const tagTypesUrl = `${apiEndpoint}/api/misc/tagtypes`;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(
      75,
      <em className="form-field-error">Name cannot exceed 75 characters</em>
    )
    .required(<em className="form-field-error">Name cannot be empty</em>),
  description: Yup.string()
    .max(
      255,
      <em className="form-field-error">
        Description cannot exceed 255 characters
      </em>
    )
    .nullable(),
  type: Yup.string()
    .max(
      25,
      <em className="form-field-error">Type cannot exceed 25 characters</em>
    )
    .nullable(),
});

const TagForm = ({ tag, submitHandler }) => {
  const initialValues = { ...tag };
  const { isLoading, isError, data, error } = useQuery("tag types", () => {
    return fetch(tagTypesUrl).then((res) => res.json());
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting,
      }) => (
        <Form className="mt-3">
          <Form.Group as={Form.Row} controlId="name">
            <Form.Label column sm={2} className="text-md-right text-xs-left">
              <strong>Name:</strong>
              <ErrorMessage name="name" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="Name"
                autoFocus
                data-lpignore="true"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} controlId="name">
            <Form.Label column sm={2} className="text-md-right text-xs-left">
              <strong>Type:</strong>
              <ErrorMessage name="type" component="p" />
            </Form.Label>
            <Col sm={10}>
              {isLoading && (
                <div className="mt-2">
                  <BeatLoader size={8} />
                </div>
              )}
              {isError && (
                <em className="form-field-error">
                  Error loading types: {error.message}
                </em>
              )}
              {data && data.types && (
                <>
                  <Field
                    as={Form.Control}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    name="type"
                    placeholder="Type"
                    list="tag-type-list"
                    data-lpignore="true"
                    autoComplete="off"
                  />
                  <datalist id="tag-type-list">
                    {data.types.map((type) => (
                      <option key={type} value={type} />
                    ))}
                  </datalist>
                </>
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} controlId="description">
            <Form.Label column sm={2} className="text-md-right text-xs-left">
              <strong>Description:</strong>
              <ErrorMessage name="description" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                component="textarea"
                className="form-control"
                onBlur={handleBlur}
                onChange={handleChange}
                rows={4}
                name="description"
                placeholder="Description"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} className="mt-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Submit
              </Button>{" "}
              <Button type="reset" onClick={handleReset}>
                Reset
              </Button>
            </Col>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

export default TagForm;
