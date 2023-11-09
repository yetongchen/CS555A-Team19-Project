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
import { Grid, Skeleton } from "@mui/material";
import noImage from "../images/no-image.png";

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
        console.log(data);
        if (data) data.start.local = data.start.local.replace("T", " ");
        setEventData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error when get event detail", error);
        setEventData(undefined);
        setLoading(false);
      }
    }
    getEventById(eventId);
  }, [eventId]);

  if (loading) {
    return (
      <Grid item xs={8} sm={8} md={5} lg={4} xl={3}>
        <Card className="event-by-date-card" sx={{ width: 320, height: 370 }}>
          <div>
            <Typography level="title-lg">
              <Skeleton sx={{ width: 290, height: 42, animation: "wave" }} />
            </Typography>
            <Typography level="body-sm">
              <Skeleton sx={{ width: 290, height: 18.4, animation: "wave" }} />
            </Typography>
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
            <Skeleton sx={{ width: 290, height: 163, animation: "wave" }} />
          </AspectRatio>
          <CardContent orientation="horizontal">
            <div>
              <Typography level="body-xs">
                <a>
                  <Skeleton
                    sx={{ width: 202.85, height: 64, animation: "wave" }}
                  />
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
              <a href="#" style={{ color: "white" }}>
                Explore
              </a>
            </Button>
          </CardContent>
        </Card>
      </Grid>
    );
  } else {
    return (
      <Grid item xs={8} sm={8} md={5} lg={4} xl={3}>
        <Card className="event-by-date-card" sx={{ width: 320, height: 370 }}>
          <div>
            {eventData && eventData.name ? (
              <Typography level="title-lg">
                {eventData && eventData.name.text}
              </Typography>
            ) : (
              <Typography level="title-lg">
                This event has been canceled{" "}
              </Typography>
            )}

            {eventData && eventData.start ? (
              <Typography level="body-sm">{eventData.start.local}</Typography>
            ) : (
              <Typography level="title-lg">
                The date is no longer valid
              </Typography>
            )}

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
            {eventData && eventData.logo ? (
              <img
                src={eventData.logo.original.url}
                loading="lazy"
                alt="logo"
              />
            ) : (
              <img src={noImage} loading="lazy" alt="no-image" />
            )}
          </AspectRatio>

          <CardContent orientation="horizontal">
            <div>
              {eventData &&
              eventData.description &&
              eventData.description.text ? (
                <Typography level="body-xs">
                  <a>
                    {eventData.description.text.length <= 100
                      ? eventData.description.text
                      : eventData.description.text.substr(0, 100) + "..."}
                  </a>
                </Typography>
              ) : (
                <a>No description available</a>
              )}
            </div>
            {eventData ? (
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
            ) : (
              <Button
                variant="solid"
                size="md"
                color="primary"
                aria-label="Explore Bahamas Islands"
                sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
              >
                <a href={`#`} style={{ color: "white" }}>
                  Explore
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default EventOfDateCard;
