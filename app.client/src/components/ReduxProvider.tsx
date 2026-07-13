"use client";
import { store } from "@/redux/store";
import React, { type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import ModalStrip from "./ModalStrip";
import BackdropCircularProgressComponent from "./BackdropCircularProgressComponent";

const ReduxProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <BackdropCircularProgressComponent />
      <ModalStrip />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
