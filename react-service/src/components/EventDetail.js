import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css';

const apiKey = "HOXTF4SFSKCCDLS4V4XK";
// const id = "48288403916";
const id = "79728781933";

async function getEventById(id) {
  const apiUrl = `https://www.eventbriteapi.com/v3/events/${id}/`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error when get event detail', error);
    throw error;
  }
}

function EventDetail({}) {
  const [event, setEvent] = useState({});
  const eventId = id;

  useEffect(() => {
    getEventById(eventId)
      .then((eventData) => {
        setEvent(eventData);
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }, [eventId]);

  function formatDateTime(start, end) {
    const startDate = new Date(start.local);
    const endDate = new Date(end.local);
  
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const startDateString = startDate.toLocaleDateString('en-US', options);
    
    const startTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  
    const timeZone = start.timezone;
  
    return `${startDateString} · ${startTime} - ${endTime} ${timeZone}`;
  }

  const [showMore, setShowMore] = useState(false);
  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };

  const descriptionRef = useRef(null);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight, 10);
      const actualLines = descriptionRef.current.clientHeight / lineHeight;
      
      setIsDescriptionLong(actualLines > 3);
    }
  }, [event.description]);

  return (
    <div className="event-container">
      <img className="event-image" src={event.logo && event.logo.url} alt="Event Image" />
      <div className="event-details">
        <h1 className="event-name">{event.name && event.name.text}</h1>

        <div className="event-time-location">
          <h2>Date and Time: </h2>
          {event.start && event.end && formatDateTime(event.start, event.end)}
          <button className="join-button">Join</button>
        </div>
        
        <div className="event-address">
          <h2>Address:</h2>
          {event.venue && event.venue.name} 
          {event.venue && event.venue.address && event.venue.address.address_1}
        </div>

        {/*我想把它设计成只显示三行的样子，有一个show more可以点击查看所有的event-description，但是没实现。*/}
        <div className="event-description">
          <h2>Description: </h2>
          <div ref={descriptionRef}>
            {showMore || !isDescriptionLong
              ? event.description && event.description.text
              : `${event.description && event.description.text.split('\n').slice(0, 3).join('\n')}...`}
          </div>
          {isDescriptionLong && (
            <span className="show-more" onClick={handleShowMoreClick}>
              {showMore ? 'Show less' : 'Show more'}
            </span>
          )}
          </div>

        <p className="event-ticket">
          If you want the tickets, click the link:
          <a className="event-link" href={event.external_ticketing && event.external_ticketing.external_url}>
            {event.external_ticketing && event.external_ticketing.external_url}
          </a>
        </p>
      </div>
    </div>
  );
}

export default EventDetail;