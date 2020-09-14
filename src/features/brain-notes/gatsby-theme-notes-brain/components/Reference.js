import React from "react";

import "./Reference.css";

export const Reference = ({ node }) => {
  return (
    <div className="reference">
      <div>
        <h5>{node.title}</h5>
        {node.content}
      </div>
    </div>
  );
};
