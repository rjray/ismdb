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
import useFocus from "../../utils/focus";
import { getMagazineById, updateMagazineById } from "../../utils/queries";

const UpdateMagazine = () => {
  const { magazineId } = useParams();
  const queryCache = useQueryCache();
  const [mutate] = useMutation(updateMagazineById);
  const { addToast } = useToasts();
  const [focusOnName, setFocusOnName] = useFocus();
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

  const submitHandler = (valuesIn, formikBag) => {
    const values = { ...valuesIn };

    mutate(values, {
      onSuccess: (mutatedData) => {
        const { error: mutationError, magazine: mutatedMagazine } = mutatedData;
        formikBag.setSubmitting(false);
        setFocusOnName();

        if (mutationError) {
          addToast(mutationError.description, { appearance: "error" });
        } else {
          queryCache.invalidateQueries(["magazines"]);
          queryCache.setQueryData(["magazine", String(mutatedMagazine.id)], {
            mutatedMagazine,
          });

          addToast(`Magazine "${mutatedMagazine.name}" updated`, {
            appearance: "success",
          });
        }
      },
      onError: (mutationError) => {
        if (mutationError.response) {
          addToast(mutationError.response.data.error.description, {
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
          autoFocusRef={focusOnName}
        />
      </Container>
    </>
  );
};

export default UpdateMagazine;
