import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  LinearProgress,
} from "@mui/material";

const vote = async (poll_id, user_id, option) => {
  const poll = await axios.post(`http://localhost:4000/polls/${poll_id}`, {
    userID: user_id,
    option: option,
  });

  return poll;
};

export const PollCard = ({ pollData, userData }) => {
  // userData
  const [userID, setUserID] = useState(undefined);

  // pollData
  const [pollID, setPollID] = useState(undefined);
  const [title, setTitle] = useState("N/A");
  const [description, setDescription] = useState("N/A");
  const [options, setOptions] = useState(undefined);

  // Vote
  const [helperText, setHelperText] = useState("");
  const [value, setValue] = useState("");
  const [totalVoter, setTotalVoter] = useState(0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    // poll
    if (pollData) {
      setPollID(pollData._id);
      setTitle(pollData.title);
      setDescription(pollData.description);
      setOptions(pollData.options);
    }
    // user
    if (userData) {
      setUserID(userData._id);
    }
  }, []);

  useEffect(() => {
    if (options) {
      let total = 0;
      Object.keys(options).map((option) => {
        total += options[option].length;
      });
      setTotalVoter(total);
    }
  }, [options]);

  useEffect(() => {
    if (userID && options) {
      let curVal = "";
      let voted = false;

      Object.keys(options).map((option) => {
        if (options[option].includes(userID)) {
          curVal = option;
          voted = true;
        }
      });
      setValue(curVal);
      setVoted(voted);
    }
  }, [userID, options]);

  useEffect(() => {
    if (value === "") {
      setHelperText("Seems like you haven't vote yet!");
    }
    if (value) setHelperText(" ");
  }, [value]);

  const handleRadioChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pollID && userID) {
      const newPoll = await vote(pollID, userID, value);

      if (newPoll) {
        // alert("Done!!");
        setOptions(newPoll.data.options);
      }
    }
  };

  return (
    <Grid item>
      <Card
        sx={{ width: 345, height: "100%" }}
        style={{ backgroundColor: "snow" }}
      >
        <CardContent>
          <h1>{title}</h1>

          <br></br>
          <h2>Description:</h2>
          <p>{description}</p>
        </CardContent>

        <CardContent>
          {voted ? <h2>Results:</h2> : <p>(Vote to see results)</p>}
          {voted &&
            options &&
            Object.keys(options).map((option, i) => {
              const percentage = options[option].length
                ? ((options[option].length / totalVoter) * 100).toFixed(2)
                : 0.0;
              return (
                <p key={`result_${i}`}>
                  {`${option} (${percentage}%): `}
                  <LinearProgress
                    sx={{
                      borderRadius: 100,
                      height: 10,
                      backgroundColor: "#c899f7",
                      // backgroundColor: "white",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 100,
                        backgroundColor: "#6f48eb",
                      },
                    }}
                    variant="determinate"
                    value={parseFloat(percentage)}
                  />
                </p>
              );
            })}
        </CardContent>

        <CardContent style={{ textAlign: "left" }}>
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 3 }} variant="standard">
              <h2>Options:</h2>
              <br></br>
              <RadioGroup value={value} onChange={handleRadioChange}>
                {options &&
                  Object.keys(options).map((option, i) => {
                    return (
                      <FormControlLabel
                        value={option}
                        label={option}
                        control={<Radio />}
                        key={i}
                      />
                    );
                  })}
              </RadioGroup>
              {/* <FormHelperText>{helperText}</FormHelperText> */}
              <br></br>
              <Button
                style={{
                  borderRadius: 100,
                  fontWeight: "bold",
                  backgroundColor: "#6f48eb",
                  color: "white",
                }}
                type="submit"
                variant="standard"
              >
                Vote
              </Button>
            </FormControl>
          </form>
        </CardContent>
      </Card>
    </Grid>
  );
};
