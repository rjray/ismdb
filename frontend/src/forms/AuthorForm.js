import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Formik, Field, FieldArray, ErrorMessage } from "formik";
import { MdDelete, MdSettingsBackupRestore } from "react-icons/md";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(
      60,
      <em style={{ fontSize: "75%", color: "red" }}>
        Name cannot exceed 60 characters
      </em>
    )
    .required(
      <em style={{ fontSize: "75%", color: "red" }}>Name cannot be empty</em>
    ),
  aliases: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .max(
          60,
          <em style={{ fontSize: "75%", color: "red" }}>
            Name cannot exceed 60 characters
          </em>
        )
        .required(
          <em style={{ fontSize: "75%", color: "red" }}>
            Name cannot be empty
          </em>
        ),
    })
  ),
});

const AuthorForm = ({ author, action, submitHandler }) => {
  let initialValues = { ...author, action: action };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting,
      }) => (
        <Form className="mt-3">
          <Form.Group as={Form.Row} controlId="name">
            <Form.Label column sm={2} className="text-md-right text-sm-left">
              Name:
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
                data-lpignore="true"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Form.Row} controlId="aliases" className="mb-2">
            <Form.Label column sm={2} className="text-md-right text-sm-left">
              Aliases:
            </Form.Label>
            <Col sm={10}>
              <Container
                fluid
                className="mb-2 pb-0 px-0 d-flex flex-column justify-content-start"
              >
                <FieldArray name="aliases">
                  {(helpers) => (
                    <>
                      {values.aliases.map((alias, index) => (
                        <Form.Group
                          key={index}
                          as={Form.Row}
                          controlId={`alias${index}`}
                          className="mb-2"
                        >
                          <Col sm={3}>
                            <Field
                              as={Form.Control}
                              type="text"
                              name={`aliases.${index}.name`}
                              placeholder="Alias"
                              disabled={alias.deleted}
                              className={alias.deleted && "strikethrough"}
                              data-lpignore="true"
                            />
                            <ErrorMessage
                              name={`aliases.${index}.name`}
                              component="p"
                            />
                          </Col>
                          <Col sm>
                            <span>
                              <Button
                                variant="link"
                                className="text-reset"
                                tabIndex={-1}
                                onClick={() => {
                                  if (alias.id === 0 && alias.name === "") {
                                    helpers.remove(index);
                                  } else {
                                    helpers.replace(index, {
                                      name: alias.name,
                                      id: alias.id,
                                      deleted: !alias.deleted,
                                    });
                                  }
                                }}
                              >
                                {alias.deleted ? (
                                  <MdSettingsBackupRestore title="Restore this alias" />
                                ) : (
                                  <MdDelete title="Delete this alias" />
                                )}
                              </Button>
                            </span>
                          </Col>
                        </Form.Group>
                      ))}
                      <Form.Row>
                        <Col>
                          <Button
                            onClick={() =>
                              helpers.push({ name: "", id: 0, deleted: false })
                            }
                          >
                            Add
                          </Button>
                        </Col>
                      </Form.Row>
                    </>
                  )}
                </FieldArray>
              </Container>
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

export default AuthorForm;
