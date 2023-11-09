import React, { useState, useEffect } from "react";
import { useSearchParams, redirect, Link } from "react-router-dom";
import {
  Box,
  Grid,
  Pagination,
  PaginationItem,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import "../App.css";
import EventOfDateCard from "./EventOfDateCard";
import TicketMasterCard from "./TicketMasterCard";
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
  let start_date = searchParams.get("start_date");
  let end_date = searchParams.get("end_date");
  let city = searchParams.get("city");
  let state = searchParams.get("state");
  state = state ? state.replace(/\s+/g, "-") : state;
  city = city ? city.replace(/\s+/g, "-") : city;
  let pageDisplay = 20;

  let pageDisplayForTM = 10;

  const [ticketmasterData, setTicketmasterData] = useState(undefined);

  useEffect(() => {
    let data = null;
    async function getEvents() {
      const apiKey = "WexwqeiVEcpNEH0CGKyB1BLhxYbi9yiQ";
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${50}&apikey=${apiKey}&startDateTime=${start_date}Z`;
      try {
        const response = await axios.get(url);
        data = response.data;

        setTicketmasterData(data._embedded.events);
      } catch (error) {
        console.error("Error when get event detail", error);
      }
    }

    if (start_date) {
      getEvents();
    }
  }, []);

  // useEffect(() => {
  //   if (ticketmasterData && cardsData) {
  //     const TMCards = ticketmasterData.map((data) => {
  //       return <TicketMasterCard data={data} />;
  //     });
  //     console.log(cardsData);
  //     console.log(TMCards);
  //   }
  // }, [ticketmasterData]);

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
              return (
                <EventOfDateCard
                  eventId={id}
                  key={id}
                  // timeRange={{ start: "17:00", end: "20:00" }}
                />
              );
            });
        setCardsData(res);
        setLastPage(Math.ceil(event_ids.length / pageDisplay));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        return <h1>Page Not Found</h1>;
      }
    }
    getEventIDs();
  }, [currentPage, event_ids]);

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
          {cardsData && cardsData}
          {ticketmasterData &&
            ticketmasterData
              .slice(
                pageDisplayForTM * (currentPage - 1),
                pageDisplayForTM * currentPage
              )
              .map((data) => {
                return <TicketMasterCard data={data} key={data.id} />;
              })}
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

export default EventOfDate;
