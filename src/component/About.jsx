import React from "react";

export function About() {
  const aboutStyle = {
    textAlign: "center",
    padding: "20px",
   };

  const headingStyle = {
    color: "white",
    fontSize: "24px",
    marginBottom: "20px",
  };

  return (
    <div style={aboutStyle}>
      <h2 style={headingStyle}>
        The website was developed by Islam Abu Hamar{" "}
      </h2>
    </div>
  );
}
