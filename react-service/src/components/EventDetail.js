import React, { useState, useEffect, useRef } from 'react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import axios from 'axios';
import '../App.css';

const apiKey = "HOXTF4SFSKCCDLS4V4XK";
// const id = "48288403916";
// const id = "79728781933";
const id = "737523611977";

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
  const [venue, setVenue] = useState({});
  const eventId = id;

  useEffect(() => {
    getEventById(eventId)
      .then((eventData) => {
        setEvent(eventData);
        if (eventData.venue_id){
          getVenueById(eventData.venue_id)
          .then(setVenue)
          .catch(error => console.error('Error fetching venue', error));
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }, [eventId]);

  async function getVenueById(vid) {
    const apiUrl = `https://www.eventbriteapi.com/v3/venues/${vid}/`;
  
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error when get venue detail', error);
      throw error;
    }
  }

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
            addressParts.push(cityRegionPostal.join(', '));
        }
    }
    return addressParts.join(' ');
}


  return (
    <div className="event-container">
      <img className="event-image" src={event.logo && event.logo.url} alt="Event Image" />
      <div className="event-details">
        <h1 className="event-name">{event.name && event.name.text}</h1>

        <div className="event-time-location">
          <CalendarMonthOutlinedIcon />
          <h2>Date and Time: </h2>
          {event.start && event.end && formatDateTime(event.start, event.end)}
          <button className="join-button">Join</button>
        </div>
        
        <div className="event-address">
          <LocationOnOutlinedIcon />
          <h2>Address:</h2>
          <div>
            {event.online_event ? "Online": formatVenueAddress(venue)}
          </div>
        </div>

        {/*我想把它设计成只显示三行的样子，有一个show more可以点击查看所有的event-description，但是没实现。*/}
        <div className="event-description">
          <div className="description-header">
            <DescriptionOutlinedIcon />
            <h2>Description:</h2>
          </div>
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
          {event.is_externally_ticketed && event.external_ticketing && event.external_ticketing.external_url ? (
              <>
                  If you want the tickets, click the link:
                  <a className="event-link" href={event.external_ticketing.external_url}>
                      {event.external_ticketing.external_url}
                  </a>
              </>
          ) : (
              'No external ticketing link available.'
          )}
      </p>

        <div className='event-comments'>
          <CommentOutlinedIcon />
          <h2>Comments:</h2>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;