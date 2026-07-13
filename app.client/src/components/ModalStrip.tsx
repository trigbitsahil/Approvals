"use client";
import React, { type FunctionComponent } from "react";
import { useAppSelector } from "../redux/hooks";

const ModalStrip: FunctionComponent = (props) => {
  const { modalType, message } = useAppSelector(
    (state) => state.uielements.modalstrip
  );

  if (!modalType) return null;

  return (
    <>
      <div
        id="modalStripSuccess"
        className={
          "modal-strip modal-top modal-active background-" + modalType
        }
        style={{
          borderRadius: "10px",
          border: "solid 1px #ffffff",
          color: "#ffffff",
          padding: "20px",
          position: "fixed",
          width: "48%",
          display: "inline-block",
          left: "20%",
          margin: "150px",
          zIndex: 9999,
        }}
      >
        <div className="container">
          <div className="text-center">{message}</div>
        </div>
      </div>
    </>
  );
};

export default ModalStrip;
