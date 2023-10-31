import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, redirect, Link } from "react-router-dom";
import { Box, Grid, Pagination, PaginationItem } from "@mui/material";
// import { ArrowBackIcon, ArrowForwardIcon } from "@mui/icons-material";
import "../App.css";
// import getEventIds from "../../../data-service/eventId/EventID.js";
import EventOfDateCard from "./EventOfDateCard";
import axios from "axios";

const getEventIDs = async () => {
  const { data } = await axios.post("http://localhost:4000/eventIDs", {
    pages: 1,
    date: "2023-10-31",
    state: "NJ",
    city: "hoboken",
  });

  return data.eventIDs;
};

const event_ids = await getEventIDs();

function EventOfDate() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page"));

  let cardsData = null;
  let pageDisplay = 20;
  let lastPage = Math.ceil(event_ids.length / pageDisplay);
  console.log(lastPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
    if (currentPage < 0) {
      return redirect(`events/date/?page=1`);
    } else if (currentPage > lastPage) {
      return redirect(`events/date/?page=${lastPage}`);
    }
    return redirect(`events/date/?page=${value}`);
  };

  //   useEffect(() => {
  //     setCurrentPage(searchParams.get("page"));
  //   }, [currentPage]);

  //   require to add useEffect when the event_ids changed
  cardsData =
    event_ids &&
    event_ids
      .slice(pageDisplay * (currentPage - 1), pageDisplay * currentPage)
      .map((id) => {
        return <EventOfDateCard eventId={id} key={id} />;
      });
  console.log(Math.ceil(event_ids.length / pageDisplay));
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
          {cardsData}
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
                to={`?page=${item.page}`}
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
