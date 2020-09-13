import React from "react";

import "./Reference.css";

const Reference = ({ node }) => {
  return (
    <div>
        <div>
          <h5>{node.title}</h5>
          {node.content}
        </div>
    </div>
  );
};

export default Reference;
