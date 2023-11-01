import React, { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Grid,
  Button,
} from "@mui/material";

export const PollCard = ({ pollData }) => {
  const [title, setTitle] = useState("N/A");
  const [description, setDescription] = useState("N/A");
  const [options, setOptions] = useState("N/A");

  useEffect(() => {
    setTitle(pollData.title);
    setDescription(pollData.description);
    setOptions(pollData.options);
  }, []);

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <List>
        {options &&
          Object.keys(options).map((option) => {
            return (
              <ListItemButton>
                <ListItemText
                  primary={option}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "16px",
                    fontWeight: "bolder",
                  }}
                />
              </ListItemButton>
            );
          })}
      </List>
      <br></br>
    </div>
  );
};
