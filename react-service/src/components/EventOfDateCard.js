import React, { useEffect, useState } from "react";
import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/joy";
import "../App.css";
import axios from "axios";
import { Grid } from "@mui/material";

const apiKey = process.env.REACT_APP_EVENTBRITE_API_KEY;

function EventOfDateCard({ eventId }) {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let data = null;
    async function getEventById(id) {
      const apiUrl = `https://www.eventbriteapi.com/v3/events/${id}/?token=${apiKey}`;
      try {
        const response = await axios.get(apiUrl);
        data = response.data;
        if (data) data.start.local = data.start.local.replace("T", " ");
        setEventData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error when get event detail", error);
        throw error;
      }
    }
    getEventById(eventId);
  }, [eventId]);

  if (loading) {
    return (
      <div>
        <h1>EventOfDateCard</h1>
      </div>
    );
  } else {
    return (
      <Grid item xs={8} sm={8} md={4} lg={3} xl={3}>
        <Card sx={{ width: 320, height: 320 }}>
          <div>
            <Typography level="title-lg">{eventData.name.text}</Typography>
            <Typography level="body-sm">{eventData.start.local}</Typography>
            <IconButton
              aria-label="bookmark Bahamas Islands"
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ position: "absolute", top: "0.875rem", right: "0.5rem" }}
            >
              {/* <BookmarkAdd /> */}
            </IconButton>
          </div>
          <AspectRatio minHeight="120px" maxHeight="200px">
            <img src={eventData.logo.original.url} loading="lazy" alt="" />
          </AspectRatio>
          <CardContent orientation="horizontal">
            <div>
              <Typography level="body-xs">
                <a>
                  {eventData.description.text.length <= 70
                    ? eventData.description.text
                    : eventData.description.text.substr(0, 70) + "..."}
                </a>
              </Typography>
            </div>
            <Button
              variant="solid"
              size="md"
              color="primary"
              aria-label="Explore Bahamas Islands"
              sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
            >
              <a
                href={`/events/${eventId}`}
                style={{ color: "white" }}
                target="_blank"
              >
                Explore
              </a>
            </Button>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default EventOfDateCard;
