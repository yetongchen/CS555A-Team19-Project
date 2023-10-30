import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Home.css";
import EventOfDate from "./EventOfDate";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [state, setState] = useState("");
  const navigate = useNavigate();

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

  const hadleClickDate = (event, value) => {
    // console.log(event);
    // console.log(event.getDate(), event.getUTCMonth() + 1, event.getFullYear());
    if (state) {
      let dateParms = `${event.getFullYear()}-${
        event.getUTCMonth() + 1
      }-${event.getDate()}`;
      navigate(`events/date/?page=1&date=${dateParms}&state=${state}`);
    }else{
        navigate("/")
    }
  };

  const handleChange = (event) => {
    setState(event.target.value);
  };

  const statesList = {
    AL: "Alabama",
    AK: "Alaska",
    AS: "American Samoa",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    DC: "District Of Columbia",
    FM: "Federated States Of Micronesia",
    FL: "Florida",
    GA: "Georgia",
    GU: "Guam",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MH: "Marshall Islands",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    MP: "Northern Mariana Islands",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PW: "Palau",
    PA: "Pennsylvania",
    PR: "Puerto Rico",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VI: "Virgin Islands",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
  };

  const keys = Object.keys(statesList);
  const statesData = keys.map((ele) => {
    return (
      <MenuItem value={ele} key={ele}>
        {ele}
      </MenuItem>
    );
  });

  return (
    <div className="main">
      <Carousel images={posters} />
      <div id="calendar">
        <Box
          sx={{
            minWidth: 120,
            maxWidth: 120,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "20%",
          }}
        >
          <FormControl fullWidth>
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
        </Box>
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
          <Calendar
            onChange={setDate}
            value={date}
            onClickDay={hadleClickDate}
          />
          {/* onClickDay needs to pass the date value props to eventofDate for retrieving the event ID from file eventId */}
        </div>
        <p className="text-center">
          <span className="bold">SelectedDate:</span> {date.toDateString()}
        </p>
      </div>
    </div>
  );
};

export default Home;
