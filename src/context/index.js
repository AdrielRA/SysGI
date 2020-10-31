import React from "react";
import Context, { useContext } from "./context";

export { useContext };

export default ({ children }) => <Context>{children}</Context>;
