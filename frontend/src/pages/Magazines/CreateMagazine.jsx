import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useQueryClient, useMutation } from "react-query";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useToasts } from "react-toast-notifications";

import Header from "../../components/Header";
import MagazineForm from "../../forms/MagazineForm";
import { multientrySwitch } from "../../atoms";
import useFocus from "../../utils/focus";
import { createMagazine } from "../../utils/queries";

const CreateMagazine = () => {
  const [multientry, setMultientry] = useRecoilState(multientrySwitch);
  const [createdMagazine, setCreatedMagazine] = useState(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(createMagazine);
  const { addToast } = useToasts();
  const [focusOnName, setFocusOnName] = useFocus();

  const toggleMultientry = () => setMultientry((current) => !current);

  const submitHandler = (valuesIn, formikBag) => {
    const values = { ...valuesIn };

    mutate(values, {
      onSuccess: (data) => {
        const { error, magazine } = data;
        formikBag.setSubmitting(false);

        if (error) {
          addToast(error.description, { appearance: "error" });
        } else {
          if (multientry) {
            formikBag.resetForm();
            setFocusOnName();
          }

          queryClient.invalidateQueries(["magazines"]);
          queryClient.setQueryData(["magazine", String(magazine.id)], {
            magazine,
          });

          addToast(`Magazine "${magazine.name}" created`, {
            appearance: "success",
          });
          setCreatedMagazine(magazine.id);
        }
      },
      onError: (error) => {
        if (error.response) {
          addToast(error.response.data.error.description, {
            appearance: "error",
          });
        } else {
          addToast(error.message, { appearance: "error" });
        }
        formikBag.setSubmitting(false);
      },
    });
  };

  if (createdMagazine && !multientry) {
    return <Redirect push to={{ pathname: `/magazines/${createdMagazine}` }} />;
  }

  const emptyMagazine = { name: "", language: "", aliases: "", notes: "" };

  return (
    <>
      <Helmet>
        <title>Add a Magazine</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Add a Magazine</Header>
          </Col>
          <Col className="text-right">
            <div className="mr-0 pr-0 align-middle">
              <span>Enter multiple magazines: </span>
              <Form.Check
                id="enterMultiple"
                inline
                custom
                type="switch"
                className="mr-0 pr-0 align-middle"
                label=""
                checked={multientry}
                onChange={toggleMultientry}
              />
            </div>
          </Col>
        </Row>
        <MagazineForm
          submitHandler={submitHandler}
          magazine={emptyMagazine}
          autoFocusRef={focusOnName}
        />
      </Container>
    </>
  );
};

export default CreateMagazine;
