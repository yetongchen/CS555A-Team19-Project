import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Pagination,
  PaginationItem,
  CircularProgress,
} from "@mui/material";
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
  const [event_ids, setEventIds] = useState(undefined);
  const [loading, setLoading] = useState(true); // 新增加载状态

  let date = searchParams.get("date");
  console.log(date);
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
      const startDateTime = "2023-11-11T17:00:00Z";

      const url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${50}&apikey=${apiKey}&startDateTime=${startDateTime}`;
      try {
        const response = await axios.get(url);
        data = response.data;

        setTicketmasterData(data._embedded.events);
      } catch (error) {
        console.error("Error when get event detail", error);
      }
    }
    getEvents();
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
    let search = `?page=${value}`;
    if (state & city && start_date && end_date) {
      search += `&start_date=${start_date}&end_date=${end_date}&state=${state}&city=${city}`;
      navigate(`/events/date/${search}`);
    } else if (state & date) {
      search += `&state=${state}&date=${date}`;
      navigate(`/events/date/${search}`);
    }
    // if (currentPage < 0) {
    //   if (city) {
    //     return redirect(
    //       `events/date/?page=1&date=${date}&state=${state}&city=${city}`
    //     );
    //   } else {
    //     return redirect(`events/date/?page=1&date=${date}&state=${state}`);
    //   }
    // } else if (currentPage > lastPage) {
    //   if (city) {
    //     return redirect(
    //     `events/date/?page=${lastPage}&date=${date}&state=${state}&city=${city}`
    //   );
    // } else {
    //   return redirect(
    //     `events/date/?page=${lastPage}&date=${date}&state=${state}`
    //   );
    // }
    // }
    // if (city) {
    //   return redirect(
    //     `events/date/?page=${value}&date=${date}&state=${state}&city=${city}`
    //   );
    // } else {
    //   return redirect(`events/date/?page=${value}&date=${date}&state=${state}`);
    // }
  };

  useEffect(() => {
    async function getEventIDs() {
      try {
        setLoading(true);
        let res = null;
        const { data } = await axios.post("http://localhost:4000/eventIDs", {
          pages: 3,
          date,
          state,
          city,
        });

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
  }, [currentPage]); // Included dependencies

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
          {loading ? <h1>Loading...</h1> : cardsData}
          {loading ? (
            <></>
          ) : (
            ticketmasterData &&
            ticketmasterData
              .slice(
                pageDisplayForTM * (currentPage - 1),
                pageDisplayForTM * currentPage
              )
              .map((data) => {
                return <TicketMasterCard data={data} key={data.id} />;
              })
          )}
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
