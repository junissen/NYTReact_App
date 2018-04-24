import React from "react";
import "./Grid.css";

export const Row = ({ fluid, children }) => (
  <div className={`row${fluid ? "-fluid" : ""} gridRow`}>
    {children}
  </div>
);
