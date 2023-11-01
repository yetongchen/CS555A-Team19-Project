import React, { useEffect, useState } from "react";

export const PollCard = ({ pollData }) => {
  const [title, setTitle] = useState("N/A");
  const [description, setDescription] = useState("N/A");

  useEffect(() => {
    setTitle(pollData.title);
    setDescription(pollData.description);
  }, []);

  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <br></br>
    </div>
  );
};
