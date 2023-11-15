import { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import * as statesList from "../state.json";
import moment from "moment";
import "../styles/Home.css";
import { useGeolocated } from "react-geolocated";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";

import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Stack,
} from "@mui/material";

const Home = () => {
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const [date, setDate] = useState(new Date());
  const [state, setState] = useState("");
  const [coordsInfo, setCoords] = useState(undefined);

  const posters = [
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F591759059%2F226667758798%2F1%2Foriginal.20230906-185327?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=99cc3629ad04e9bf79a60e74c70a170a",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F578568249%2F330313065629%2F1%2Foriginal.20230818-215114?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C349%2C1350%2C675&s=857802a2a75afa3769e2fff791258164",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F590779259%2F184921408699%2F1%2Foriginal.20230905-195559?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C54%2C750%2C375&s=b3561f33a2dda0911d8a49b5568cb7f0",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F576228759%2F182195127389%2F1%2Foriginal.20230816-001530?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C1080%2C540&s=c8ab8ec1d01fa69c566073ce632a91fc",
  ];

  const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 === images.length ? 0 : prevIndex + 1
      );
    };
    const handlePrevious = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
      );
    };
    const handleDotClick = (index) => {
      setCurrentIndex(index);
    };

    return (
      <div className="carousel-images">
        <img key={currentIndex} src={images[currentIndex]} />
        <div className="slide_direction">
          <div className="left" onClick={handlePrevious}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 96 960 960"
              width="20"
            >
              <path d="M400 976 0 576l400-400 56 57-343 343 343 343-56 57Z" />
            </svg>
          </div>
          <div className="right" onClick={handleNext}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 96 960 960"
              width="20"
            >
              <path d="m304 974-56-57 343-343-343-343 56-57 400 400-400 400Z" />
            </svg>
          </div>
        </div>
        <div className="carousel-indicator">
          {images.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  // To get the current location
  const navigate = useNavigate();
  let { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  // When the user only select state and click the calendlar, it will fire to events/date/?page=1&date=${dateParms}&state=${state}
  // When the user use geolocation and click the calendlar, it will fire to `events/date/?page=1&date=${dateParms}&state=${coordsInfo.nearest[0].prov}&city=${coordsInfo.nearest[0].city}
  const hadleClickDate = (event, value) => {
    let dateParms = `${event.getFullYear()}-${
      event.getUTCMonth() + 1
    }-${event.getDate()}`;

    if (coordsInfo) {
      let state = coordsInfo.nearest[0].prov[0];
      let city = coordsInfo.nearest[0].city[0];
      state = state ? state.replace(/\s+/g, "-") : state;
      city = city ? city.replace(/\s+/g, "-") : city;
      console.log(state, city);
      navigate(
        `events/date/?page=1&date=${dateParms}&state=${state}&city=${city}`
      );
      setState(coordsInfo.nearest[0].prov);
    } else if (state) {
      navigate(`events/date/?page=1&date=${dateParms}&state=${state}`);
    } else {
      navigate("/");
    }
  };

  // To handle state drop down list
  const handleChange = (event) => {
    event.preventDefault();
    setState(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      state,
      moment(new Date(startDate.$d), "YYYY-MM-DD HH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      moment(new Date(endDate.$d), "YYYY-MM-DD HH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss"
      )
    );
    let start_date = moment(
      new Date(startDate.$d),
      "YYYY-MM-DD HH:mm:ss"
    ).format("YYYY-MM-DDTHH:mm:ss");
    let end_date = moment(new Date(endDate.$d), "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    if (coordsInfo) {
      let state = coordsInfo.nearest[0].prov[0];
      let city = coordsInfo.nearest[0].city[0];
      state = state ? state.replace(/\s+/g, "-") : state;
      city = city ? city.replace(/\s+/g, "-") : city;
      console.log(state, city);

      navigate(
        `events/date/?page=1&start_date=${start_date}&end_date=${end_date}&state=${state}&city=${city}`
      );
      setState(coordsInfo.nearest[0].prov);
    } else if (state) {
      navigate(
        `events/date/?page=1&start_date=${start_date}&end_date=${end_date}&state=${state}`
      );
    } else {
      navigate("/");
    }
    // setStartDate(
    //   moment(new Date(startDate.$d), "YYYY-MM-DD HH:mm:ss").format(
    //     "YYYY-MM-DD HH:mm:ss"
    //   )
    // );
    // setEndDate(
    //   moment(new Date(endDate.$d), "YYYY-MM-DD HH:mm:ss").format(
    //     "YYYY-MM-DD HH:mm:ss"
    //   )
    // );
  };

  // Get all the keys from stateList and create components for each state
  const values = Object.values(statesList.default);
  const statesData = values.map((ele) => {
    return (
      <MenuItem value={ele} key={ele}>
        {ele}
      </MenuItem>
    );
  });

  useEffect(() => {
    if (coords) {
      async function fetchDatabyId() {
        try {
          let data = await axios
            .get("http://localhost:4000/geo", {
              params: {
                latitude: coords.latitude,
                longitude: coords.longitude,
              },
            })
            .then((res) => {
              let geodata = res.data.geodata;
              setCoords(geodata);
            });
        } catch (error) {
          console.log(error);
        }
      }
      fetchDatabyId();
    }
  }, [coords]);

  return (
    <div className="main">
      <Carousel images={posters} />
      <div id="calendar">
        <form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "3%",
            }}
          >
            <Stack
              spacing={{ xs: 1, sm: 2 }}
              direction="row"
              useFlexGap
              flexWrap="wrap"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DateTimePicker", "DateTimePicker"]}
                >
                  <DateTimePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newDate) => setStartDate(newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DateTimePicker", "DateTimePicker"]}
                >
                  <DateTimePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newDate) => setEndDate(newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>

              <Button
                variant="outlined"
                href="#outlined-buttons"
                type="submit"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "right",
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Stack>
          </Box>
        </form>
        <div
          className="calendar-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 0,
            marginTop: 0,
          }}
        >
          <Box
            sx={{
              display: "block",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "3%",
              minWidth: "5%",
            }}
          >
            <FormControl
              fullWidth
              sx={{
                marginBottom: "3%",
              }}
            >
              <InputLabel id="demo-simple-select-label">State</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="State"
                value={state}
                onChange={handleChange}
              >
                {statesData}
              </Select>
            </FormControl>

            <Calendar
              onChange={setDate}
              value={date}
              onClickDay={hadleClickDate}
            />
          </Box>
        </div>

        <p className="text-center">
          <span className="bold">{new Date().toString().slice(0, -18)}</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
