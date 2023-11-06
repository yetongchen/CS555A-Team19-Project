import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Home.css";
import { useGeolocated } from "react-geolocated";
import axios from "axios";

import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";

const Home = () => {
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

    const goToNext = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };
    const goToPrevious = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };
    const goToImage = (index) => {
      setCurrentIndex(index);
    };

    // Automatically switch to the next image every 3 seconds
    useEffect(() => {
      const interval = setInterval(goToNext, 5000);
      // Clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, []);

    const transformValue = `translateX(-${currentIndex * 100}%)`;

    return (
      <div className="carousel-images" >
        <div className="carousel-wrapper">
        <div className="carousel-images-container" style={{ transform: transformValue }}>
          {images.map((image, index) => (
           <img key={index} src={image} alt={`Image ${index}`} />
          ))}
        </div>
        {/* <img key={currentIndex} src={images[currentIndex]} /> */}
        <div className="slide_direction">
          <button onClick={goToPrevious} className="left-arrow">
            <svg viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M4 12l8 8 1.5-1.5L8 13h12v-2H8l5.5-5.5L12 4z"></path>
            </svg> 
          </button>
          <button onClick={goToNext} className="right-arrow">
            <svg viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.5 5.5L16 11H4v2h12l-5.5 5.5L12 20l8-8-8-8z"></path>
            </svg>
          </button>
        </div>
        </div>
        <div className="carousel-indicator">
          {images.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => goToImage(index)}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  // To get the current location
  const navigate = useNavigate();
  let { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
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
      state = state ? state.replace(/\s+/g, '-') : state;
      city = city ? city.replace(/\s+/g, '-') : city;
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
    setState(event.target.value);
  };

  // A list of states and their abbr.
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

  // Get all the keys from stateList and create components for each state
  const keys = Object.keys(statesList);
  const statesData = keys.map((ele) => {
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
