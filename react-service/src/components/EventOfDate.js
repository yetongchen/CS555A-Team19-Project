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
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Grid, Pagination, PaginationItem } from "@mui/material";
import "../App.css";
import EventOfDateCard from "./EventOfDateCard";
import TicketMasterCard from "./TicketMasterCard";
import axios from "axios";

function EventOfDate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page"), 10) || 1
  );
  const [lastPage, setLastPage] = useState(undefined);
  const [cardsData, setCardsData] = useState(null);
  const [loading, setLoading] = useState(true); // 新增加载状态

  let date = searchParams.get("date");
  let state = searchParams.get("state");
  let city = searchParams.get("city");
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
    let search = `?page=${value}&date=${date}`;
    if (state) search += `&state=${state}`;
    if (city) search += `&city=${city}`;
    navigate(`/events/date/${search}`);
  };

  useEffect(() => {
    async function getEventIDs() {
      try {
        setLoading(true); // 开始加载时设置为true
        const { data } = await axios.post("http://localhost:4000/eventIDs", {
          pages: 3,
          date,
          state,
          city,
        });
        console.log(data);
        setEventIds(data.eventIDs);

        if (data.eventIDs && data.eventIDs.length > 0) {
          const pageDisplay = 20;
          const paginatedEventIds = data.eventIDs.slice(
            pageDisplay * (currentPage - 1),
            pageDisplay * currentPage
          );
          const cards = paginatedEventIds.map((id) => (
            <EventOfDateCard eventId={id} key={id} />
          ));
          setCardsData(cards);
          setLastPage(Math.ceil(data.eventIDs.length / pageDisplay));
        } else {
          setCardsData(<h1>Oops. No Events for today! Try another day.</h1>);
          setLastPage(0);
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setCardsData(
            <h1>
              Server is busy. Too many requests. Come back 10 minutes later.
            </h1>
          );
        } else {
          console.error("Error fetching events:", error);
          setCardsData(<h1>Error fetching events. Please try again later.</h1>);
        }
      } finally {
        setLoading(false); // 加载结束时设置为false
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
  }, [currentPage, date, state, city]); // Included dependencies

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
          {loading ? <h1>Loading...</h1> : cardsData}
        </Grid>
        {lastPage > 1 && (
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
                  component="button" // Changed to button for better accessibility
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    handleChange(e, item.page);
                  }}
                  {...item}
                />
              )}
            />
          </Box>
        )}
      </div>
    </section>
  );
}

export default EventOfDate;
