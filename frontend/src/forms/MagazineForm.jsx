import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(
      50,
      <em className="form-field-error">Name cannot exceed 50 characters</em>
    )
    .required(<em className="form-field-error">Name cannot be empty</em>),
  language: Yup.string()
    .max(
      50,
      <em className="form-field-error">Language cannot exceed 50 characters</em>
    )
    .nullable(),
  aliases: Yup.string()
    .max(
      100,
      <em className="form-field-error">Aliases cannot exceed 100 characters</em>
    )
    .nullable(),
  notes: Yup.string()
    .max(
      1000,
      <em className="form-field-error">Notes cannot exceed 1000 characters</em>
    )
    .nullable(),
});

const MagazineForm = ({ magazine, languages, submitHandler }) => {
  let initialValues = { ...magazine };
  initialValues.createdAt = new Date(initialValues.createdAt);
  initialValues.updatedAt = new Date(initialValues.updatedAt);

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
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                name="name"
                placeholder="Name"
                autoFocus
                data-lpignore="true"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} controlId="language">
            <Form.Label column sm={2} className="text-md-right text-xs-left">
              <strong>Language:</strong>
              <ErrorMessage name="language" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                type="text"
                name="language"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Language"
                list="language-list"
                data-lpignore="true"
              />
              <datalist id="language-list">
                {languages.map((language, index) => (
                  <option key={index} value={language}></option>
                ))}
              </datalist>
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} controlId="aliases">
            <Form.Label column sm={2} className="text-md-right text-xs-left">
              <strong>Aliases:</strong>
              <ErrorMessage name="aliases" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                name="aliases"
                placeholder="Aliases"
                data-lpignore="true"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} controlId="notes">
            <Form.Label column sm={2} className="text-md-right text-xs-left">
              <strong>Notes:</strong>
              <ErrorMessage name="notes" component="p" />
            </Form.Label>
            <Col sm={10}>
              <Field
                as={Form.Control}
                component="textarea"
                className="form-control"
                onBlur={handleBlur}
                onChange={handleChange}
                rows={4}
                name="notes"
                placeholder="Notes"
              />
            </Col>
          </Form.Group>
          {magazine.createdAt && (
            <Form.Group as={Form.Row} controlId="createdAt">
              <Form.Label column sm={2} className="text-md-right text-xs-left">
                <strong>Created:</strong>
              </Form.Label>
              <Col sm={10}>
                <Field
                  as={Form.Control}
                  type="text"
                  name="createdAt"
                  tabIndex={-1}
                  readOnly
                  plaintext
                />
              </Col>
            </Form.Group>
          )}
          {magazine.updatedAt && (
            <Form.Group as={Form.Row} controlId="updatedAt">
              <Form.Label column sm={2} className="text-md-right text-xs-left">
                <strong>Updated:</strong>
              </Form.Label>
              <Col sm={10}>
                <Field
                  as={Form.Control}
                  type="text"
                  name="updatedAt"
                  tabIndex={-1}
                  readOnly
                  plaintext
                />
              </Col>
            </Form.Group>
          )}
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

export default MagazineForm;
