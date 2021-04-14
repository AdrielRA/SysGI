import React from "react";
import UserContext, { useUserContext } from "./userContext";
import UploadContext, { useUploadContext } from "./uploadContext";

export { useUserContext, useUploadContext };

export default ({ children }) => (
  <UserContext>
    <UploadContext>{children}</UploadContext>
  </UserContext>
);
