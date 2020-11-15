import React from "react";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useQuery, useQueryCache, useMutation } from "react-query";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useToasts } from "react-toast-notifications";

import Header from "../../components/Header";
import MagazineForm from "../../forms/MagazineForm";
import { useFocus } from "../../utils/focus";
import { getMagazineById, updateMagazineById } from "../../utils/queries";

const UpdateMagazine = () => {
  const { magazineId } = useParams();
  const queryCache = useQueryCache();
  const [mutate] = useMutation(updateMagazineById);
  const { addToast } = useToasts();
  const [focus, setFocus] = useFocus();
  const { isLoading, error, data } = useQuery(
    ["magazine", magazineId],
    getMagazineById
  );

  if (isLoading) {
    return (
      <div className="text-center">
        <ScaleLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <strong>Error: {error.message}</strong>
      </div>
    );
  }

  const magazine = { ...data.magazine };

  magazine.createdAt = new Date(magazine.createdAt);
  magazine.updatedAt = new Date(magazine.updatedAt);

  const submitHandler = (values, formikBag) => {
    values = { ...values };

    mutate(values, {
      onSuccess: (data) => {
        const { error, magazine } = data;
        formikBag.setSubmitting(false);
        setFocus();

        if (error) {
          addToast(error.description, { appearance: "error" });
        } else {
          queryCache.invalidateQueries(["magazines"]);
          queryCache.setQueryData(["magazine", String(magazine.id)], {
            magazine,
          });

          addToast(`Magazine "${magazine.name}" updated`, {
            appearance: "success",
          });
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

  return (
    <>
      <Helmet>
        <title>Update Magazine</title>
      </Helmet>
      <Container className="mt-2">
        <Row>
          <Col>
            <Header>Update Magazine: {magazine.name}</Header>
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/magazines/delete/${magazine.id}`}>
              <Button>Delete</Button>
            </LinkContainer>
          </Col>
        </Row>
        <MagazineForm
          magazine={magazine}
          submitHandler={submitHandler}
          autoFocusRef={focus}
        />
      </Container>
    </>
  );
};

export default UpdateMagazine;
