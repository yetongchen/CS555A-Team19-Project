import React, { useState, useEffect } from "react";
import { useParams, redirect, Link } from "react-router-dom";
import { Box, Grid, Pagination, PaginationItem } from "@mui/material";
import axios from "axios";

// const createPoll = async () => {
//   const { newPoll } = await axios.post("http://localhost:4000/event/:eventId", {
//     pages: 10,
//     date: "2023-10-31",
//     state: "NJ",
//     city: "hoboken",
//   });

//   return newPoll;
// };

export const PollForm = () => {
  let { eventID } = useParams();

  const [title, setTitle] = useState("");

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(title);
  };

  return (
    <div>
      <h1>Poll Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={title || ""}
            onChange={handleChange}
          />
        </label>
        <input type="submit" />
      </form>
    </div>
  );
};
