import React from "react";
import "../../style/approvalLoadersStyle.css";
import { Modal } from "react-bootstrap";

export default function ApprovalLoader() {
  return (
    <Modal
      className="approve-modal"
      style={{
        overflow: "hidden",
      }}
      show={true}
    >
      <div className="content">
        <div className="clip">
          <p>Approving</p>
        </div>
      </div>
    </Modal>
  );
}
