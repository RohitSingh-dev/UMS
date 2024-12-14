import PropTypes from "prop-types";
import { useRef } from "react";
import { useMountEffect } from "primereact/hooks";
import { Messages } from "primereact/messages";

const WarningAlert = ({ details, header, alertType }) => {
  const msgs = useRef(null);

  useMountEffect(() => {
    if (msgs.current) {
      msgs.current.clear();
      msgs.current.show([
        {
          sticky: true,
          severity: alertType,
          summary: header,
          detail: details,
        },
      ]);
    }
  });
  return <Messages ref={msgs} />;
};

WarningAlert.propTypes = {
  header: PropTypes.node.isRequired,
  details: PropTypes.node.isRequired,
  alertType: PropTypes.string.isRequired,
};

export default WarningAlert;
