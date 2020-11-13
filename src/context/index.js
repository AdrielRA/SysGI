import React from "react";
import Context, { useContext } from "./context";
import UploadContext, { useUploadContext } from "./uploadContext";

export { useContext, useUploadContext };

export default ({ children }) => (
  <Context>
    <UploadContext>{children}</UploadContext>
  </Context>
);
