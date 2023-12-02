import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../App.css";
import noImage from '../images/no-image.png';
import EventBody from "./EventBody";

const apiKey = process.env.REACT_APP_EVENTBRITE_API_KEY;
// const id = "692750504407";
// const id = "735668072007";

async function getEventById(id) {
  const apiUrl = `https://www.eventbriteapi.com/v3/events/${id}/`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error when get event detail", error);
    throw error;
  }
}

function EventDetail({props}) {
  const { id } = useParams();
  const eventId = id;

  const [event, setEvent] = useState({});
  const [venue, setVenue] = useState({});
  const [eventData, setEventData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEventById(eventId)
      .then((data) => {
        setEvent(data);
        setLoading(false);
        setNotFound(false);
        if (
          data.logo &&
          data.logo.original.url &&
          document.getElementById("event-container")
        ) {
          document.getElementById(
            "event-container"
          ).style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 1.0), rgba(255, 255, 255, 0.7)), url('${data.logo.original.url}')`;
          document.getElementById(
            "event-container"
          ).style.backgroundAttachment = "fixed";
        }
        if (data.venue_id) {
          getVenueById(data.venue_id)
            .then(setVenue)
            .catch((error) => {
              console.error("Error fetching event", error);
              setError("There was a problem fetching event details.");
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching event", error);
        setNotFound(true);
        setLoading(false);
      });
  }, [eventId]);

  useEffect(() => {
    let data = {
      name: event.name && event.name.text,
      imageURL: event.logo && event.logo.original.url ? event.logo.original.url : noImage,
      datetime: event.start && event.end && formatEventDateTime(event.start, event.end),
      address: event.online_event ? "Online" : formatVenueAddress(venue),
      description: event.description && event.description.text,
      ticketURL: event.url
    };
    console.log("Event Data from eventbrite API: ", data);
    setEventData(data);
  }, [event, venue]);

  async function getVenueById(vid) {
    const apiUrl = `https://www.eventbriteapi.com/v3/venues/${vid}/`;
    setError(null);

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching venue", error);
      setError("There was a problem fetching venue details.");
    }
  }

  function formatEventDateTime(start, end) {
    const startDate = new Date(start.local);
    const endDate = new Date(end.local);

    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const startDateString = startDate.toLocaleDateString("en-US", dateOptions);

    // Function to format time
    const formatTime = (date) =>
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);

    const timeZone = start.timezone;

    return `${startDateString} · ${startTime} - ${endTime} ${timeZone}`;
  }

  function formatVenueAddress(venue) {
    let addressParts = [];
    if (venue.name) {
      addressParts.push(venue.name);
    }

    if (venue.address) {
      if (venue.address.address_1) {
        addressParts.push(venue.address.address_1);
      }
      if (venue.address.address_2) {
        addressParts.push(venue.address.address_2);
      }
      let cityRegionPostal = [];
      if (venue.address.city) {
        cityRegionPostal.push(venue.address.city);
      }
      if (venue.address.region) {
        cityRegionPostal.push(venue.address.region);
      }
      if (venue.address.postal_code) {
        cityRegionPostal.push(venue.address.postal_code);
      }
      if (cityRegionPostal.length > 0) {
        addressParts.push(cityRegionPostal.join(", "));
      }
    }
    return addressParts.join(" ");
  }

  if (loading) {
    return (
      <div>
        <h2 style={{"text-align": "center"}}>Loading....</h2>
      </div>
    );
  } else if (notFound) {
    return (
      <div>
        <h2 style={{"text-align": "center"}}>Error 404: There was a problem fetching event details</h2>
      </div>
    );
  } else {
    return <EventBody eventData={eventData} id={id} err={error} />;
  }
}

export default EventDetail;