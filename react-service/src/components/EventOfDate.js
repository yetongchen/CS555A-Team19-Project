import React, { useState, useEffect } from "react";
import { useSearchParams, redirect, Link } from "react-router-dom";
import {
  Box,
  Grid,
  Pagination,
  PaginationItem,
  CircularProgress,
} from "@mui/material";
import "../App.css";
import EventOfDateCard from "./EventOfDateCard";
import axios from "axios";

// Jason template
// const getEventIDs = async () => {
//   const { data } = await axios.post("http://localhost:4000/eventIDs", {
//     pages: 10,
//     date: "2023-10-31",
//     state: "NJ",
//     city: "hoboken",
//   });

//   return data.eventIDs;
// };

// const event_ids = await getEventIDs();

function EventOfDate() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page"))
  );
  const [lastPage, setLastPage] = useState(undefined);
  const [cardsData, setCardsData] = useState(null);
  const [event_ids, setEventIds] = useState(undefined);
  const [loading, setLoading] = useState(true);

  let date = searchParams.get("date");
  let city = searchParams.get("city");
  let state = searchParams.get("state");
  state = state ? state.replace(/\s+/g, "-") : state;
  city = city ? city.replace(/\s+/g, "-") : city;
  let pageDisplay = 20;

  const handleChange = (event, value) => {
    setCurrentPage(value);
    if (currentPage < 0) {
      if (city) {
        return redirect(
          `events/date/?page=1&date=${date}&state=${state}&city=${city}`
        );
      } else {
        return redirect(`events/date/?page=1&date=${date}&state=${state}`);
      }
    } else if (currentPage > lastPage) {
      if (city) {
        return redirect(
          `events/date/?page=${lastPage}&date=${date}&state=${state}&city=${city}`
        );
      } else {
        return redirect(
          `events/date/?page=${lastPage}&date=${date}&state=${state}`
        );
      }
    }
    if (city) {
      return redirect(
        `events/date/?page=${value}&date=${date}&state=${state}&city=${city}`
      );
    } else {
      return redirect(`events/date/?page=${value}&date=${date}&state=${state}`);
    }
  };

  useEffect(() => {
    async function getEventIDs() {
      try {
        const { data } = await axios.post("http://localhost:4000/eventIDs", {
          pages: 3,
          date,
          state,
          city,
        });
        console.log(data);
        setEventIds(data.eventIDs);
      } catch (error) {
        console.log(error);
      }
    }
    getEventIDs();
  }, []);

  useEffect(() => {
    function getEventIDs() {
      try {
        let res = null;
        res =
          event_ids &&
          event_ids
            .slice(pageDisplay * (currentPage - 1), pageDisplay * currentPage)
            .map((id) => {
              return <EventOfDateCard eventId={id} key={id} />;
            });
        setCardsData(res);
        setLastPage(Math.ceil(event_ids.length / pageDisplay));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        return <h1>Page Not Found</h1>
      }
    }
    getEventIDs();
  }, [currentPage, event_ids]);

  if (loading) {
    return (
      <section className="event-by-date-section">
        <div className="event-by-date-div">
          <Grid
            container
            spacing={1}
            sx={{
              marginTop: "3%",
              marginBottom: "1%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              maxWidth: "auto",
              maxHeight: "auto",
              alignItems: "center",
              flexGrow: 1,
              flexBasis: 0,
              overflow: "auto",
            }}
          ></Grid>
          <Box
            sx={{
              display: "block",
              alignItems: "center",
              marginRight: "6%",
            }}
          >
            <h1>Fetching Events...</h1>
            <br />
            <CircularProgress />
          </Box>
        </div>
      </section>
    );
  } else {
    return (
      <section className="event-by-date-section">
        <div className="event-by-date-div">
          <Grid
            container
            spacing={1}
            sx={{
              marginTop: "3%",
              marginBottom: "1%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              maxWidth: "auto",
              maxHeight: "auto",
              alignItems: "center",
              flexGrow: 1,
              flexBasis: 0,
              overflow: "auto",
            }}
          >
            {cardsData ? (
              cardsData
            ) : (
              <Box
                sx={{
                  display: "block",
                  alignItems: "center",
                  marginRight: "6%",
                }}
              >
                <h1>Fetching Events...</h1>
                <br />
                <CircularProgress />
              </Box>
            )}
          </Grid>
          <Box
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
            sx={{ marginRight: "6%" }}
          >
            <Pagination
              page={currentPage}
              count={lastPage}
              onChange={handleChange}
              sx={{ marginBottom: "1%", marginTop: "1%" }}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={
                    city
                      ? `?page=${item.page}&date=${date}&state=${state}&city=${city}`
                      : `?page=${item.page}&date=${date}&state=${state}`
                  }
                  {...item}
                />
              )}
            />
          </Box>
        </div>
      </section>
    );
  }
}

export default EventOfDate;
