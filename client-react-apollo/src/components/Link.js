import React from "react";

function Link(props) {
  const { link } = props;

  return (
    <div>
      <div>
        {link.description} ({link.url})
      </div>
    </div>
  );
}

export default Link;
