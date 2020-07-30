import React, { useState, useContext } from "react";
import Toast from "react-bootstrap/Toast";
import { GoCheck, GoX } from "react-icons/go";

import AppContext from "../AppContext";

const Notification = ({ data }) => {
  const [show, setShow] = useState(true);
  const { status, result, resultMessage } = data;
  let textClass, textIcon;

  switch (status) {
    case "success":
      textClass = "text-success";
      textIcon = <GoCheck />;
      break;
    default:
      textClass = "text-danger";
      textIcon = <GoX />;
      break;
  }

  return (
    <Toast onClose={() => setShow(false)} show={show} delay={4000} autohide>
      <Toast.Header>
        <span className={`${textClass} mr-2`}>{textIcon}</span>
        <strong className="mr-auto">{result}</strong>
      </Toast.Header>
      <Toast.Body>{resultMessage}</Toast.Body>
    </Toast>
  );
};

const Notifications = () => {
  const { notifications } = useContext(AppContext);
  if (!notifications.length) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{ position: "relative", zIndex: 1000 }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: "25%" }}>
        {notifications.map((item, index) => (
          <Notification key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
