import React from "react";

export const DropDown = props => (
  <div className="form-group">
    <label htmlFor="resultNumberDropDown">Number of records to retrieve</label>
    <select className="form-control" id="resultNumberDropDown" {...props} >
      <option defaultValue>Select an option</option>
      <option>1</option>
      <option>5</option>
      <option>10</option>
    </select>
  </div>
);
