import React from "react";

export const CardItem = props => (
  <div className="card-body">
    <h5 className="card-title">
      <a href={props.link} target="_blank">{props.title}</a>
    </h5>
    <h6 className="card-subtitle mb-2 text-muted">{props.date}</h6>
    <p className="card-text">{props.summary}</p>
  </div>
);
