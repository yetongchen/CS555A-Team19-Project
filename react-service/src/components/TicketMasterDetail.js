import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../App.css";
import noImage from '../images/no-image.png';
import EventBody from "./EventBody";

function TicketMasterDetail({props}) {
  const { id } = useParams();

  const [eventData, setEventData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(true);

  const chooseImage = (images) => {
    let image = undefined;
    if (images){
      let idx = 0;
      images.reduce((a, b, i) => b.width * b.height > a ? (idx = i, b.width * b.height) : a,0);
      image = images[idx].url;
    }
    return image;
  };
  
  const formatDateTime = (input) => {
    const timezone = input.timezone;
    const date = new Date(input.start.localDate + 'T' + input.start.localTime);
    
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate} · ${formattedTime} ${timezone}`;
  };

  const formatVenueAddress = (input) => {
    // Extract the necessary details from the input object
    const venueName = input[0].name;
    const addressLine = input[0].address.line1;
    const city = input[0].city.name;
    const stateCode = input[0].state.stateCode;
    const postalCode = input[0].postalCode;

    // Format the details into a string
    return `${venueName} · ${addressLine}, ${city}, ${stateCode}, ${postalCode}`;
  };

  useEffect(() => {
    console.log('Get ticketmaster event useEffect fired');
    async function fetchData() {
      try {
        const API_KEY = "WexwqeiVEcpNEH0CGKyB1BLhxYbi9yiQ";
        const {data: event} = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events/${id}?apikey=${API_KEY}`
        );
        let imageURL = chooseImage(event.images);
        if (imageURL && document.getElementById("event-container")){
          document.getElementById("event-container").style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 1.0), rgba(255, 255, 255, 0.7)), url('${imageURL}')`;
          document.getElementById("event-container").style.backgroundAttachment = 'fixed';
        }
        let data = {
          name: event.name,
          imageURL: imageURL ? imageURL : noImage,
          datetime: event.dates && formatDateTime(event.dates),
          address: event._embedded.venues && formatVenueAddress(event._embedded.venues),
          description: event.info,
          ticketURL: event.url
        };
        console.log("Event Data from ticketmaster API: ", data);
        setEventData(data);
        setLoading(false);
        setNotFound(false);
      } catch (error) {
        console.error("Error fetching event", error);
        setNotFound(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

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
    return <EventBody eventData={eventData} id={id} err={undefined} />;
  }
}

export default TicketMasterDetail;