import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import axios from "axios";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import { PollForm } from "./PollForm";
import { PollCard } from "./PollCard";
import { Button, Grid, Typography } from "@mui/material";

import "../App.css";

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

function EventDetail({}) {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [venue, setVenue] = useState({});
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth(); // 获取 Firebase Auth 的实例
  const [userInfo, setUserInfo] = useState(null); // 新状态来存储从你的后端获取的用户信息
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const eventId = id;

  const [create, setCreate] = useState(false);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, [auth]);

  // 新的 useEffect 钩子来获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:4000/users/${user.uid}`
          );
          setUserInfo(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        // 如果用户未登录，清除 userInfo
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, [user]);

  useEffect(() => {
    getEventById(eventId)
      .then((eventData) => {
        setEvent(eventData);
        if (eventData.venue_id) {
          getVenueById(eventData.venue_id)
            .then(setVenue)
            .catch((error) => console.error("Error fetching venue", error));
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, [eventId]);

  useEffect(() => {
    async function getPolls() {
      console.log("useEffect fired");

      try {
        const { data } = await axios.get(
          `http://localhost:4000/polls/event/${id}`
        );
        const results = data.polls;

        if (results && results.length > 0) setPolls(results);
      } catch (error) {
        console.log(error);
      }
    }

    if (id) {
      getPolls();
    }
  }, [id, polls]);

  async function getVenueById(vid) {
    const apiUrl = `https://www.eventbriteapi.com/v3/venues/${vid}/`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
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
    const formatTime = (date) => date.toLocaleTimeString("en-US", {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
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

  // display all the posts
  useEffect(() => {
    displayPostForEvent(eventId)
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        console.error("Error fetching posts for event", error);
      });
  }, [eventId]);

  const postsForEvent = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/post/event/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const displayPostForEvent = async (id) => {
    try {
      const posts = await postsForEvent(id);
      return posts;
    } catch (error) {
      console.log(error);
    }
  };

  // add post
  const handleAddPost = async () => {
    try {
      const postData = {
        user_id: userInfo._id,
        event_id: eventId,
        name: userInfo.name,
        title: newPostTitle,
        text: newPostContent,
      };

      const response = await axios.post(
        "http://localhost:4000/post/new",
        postData
      );

      const newPost = response.data;

      let updatedPosts = await postsForEvent(id);
      setPosts(updatedPosts);
      setNewPostTitle("");
      setNewPostContent("");
      return newPost;
    } catch (error) {
      console.log(error);
    }
  };

  // formate posts date
  const formatPostDate = (datetime) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  
  const [hasJoined, setHasJoined] = useState(false);
  useEffect(() =>{
    if (userInfo && userInfo.events && userInfo.events.includes(eventId)) {
      setHasJoined(true);
    }
  }, [userInfo, eventId]);

    const joinEvent = async () => {
    if (!userInfo) {
      console.error("User must be logged in to join event");
      return;
    }
    setHasJoined(true);
    try {
      const response = await axios.post(`http://localhost:4000/users/addEventToUser/${userInfo._id}/${eventId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="outer-container">
      <div className="event-container">
        <img
          className="event-image"
          src={event.logo && event.logo.original.url}
          alt="Event Image"
        />
        <div className="event-details">
          <h1 className="event-name">{event.name && event.name.text}</h1>

          <div className="event-time-location">
            <CalendarMonthOutlinedIcon />
            <h2>Date and Time: </h2>
            {event.start && event.end && formatEventDateTime(event.start, event.end)}
            {/* <button className="join-button" onClick={joinEvent}>Join</button> */}
            <button 
              className={hasJoined ? "join-button joined" : "join-button"} 
              onClick={joinEvent} 
              disabled={hasJoined}
            >
              {hasJoined ? "Joined" : "Join"}
            </button>
          </div>

          <div className="event-address">
            <LocationOnOutlinedIcon />
            <h2>Address:</h2>
            <div>
              {event.online_event ? "Online" : formatVenueAddress(venue)}
            </div>
          </div>

          <div className="event-description">
            <div className="description-header">
              <DescriptionOutlinedIcon />
              <h2>Description:</h2>
            </div>
            <div>{event.description && event.description.text}</div>
          </div>

          <p className="event-ticket">
            {event.is_externally_ticketed &&
            event.external_ticketing &&
            event.external_ticketing.external_url ? (
              <>
                If you want the tickets, click the link:
                <a
                  className="event-link"
                  href={event.external_ticketing.external_url}
                >
                  {event.external_ticketing.external_url}
                </a>
              </>
            ) : (
              "No external ticketing link available."
            )}
          </p>

          <div className="event-posts">
            <CommentOutlinedIcon />
            <h2>Posts:</h2>
          </div>
          {posts &&
            posts.map((post) => (
              <div className="post-container" key={post._id}>
                <div className="post-header">
                  <span className="post-title">{post.title}</span>
                  <span className="post-author">
                    {formatPostDate(post.datetime)} By: {post.name}
                  </span>
                </div>
                <div className="post-content">{post.text}</div>
              </div>
            ))}
        </div>

        <div className="post-input-container">
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Enter post title"
                  />
                </td>
              </tr>
              <tr>
                <td>Content:</td>
                <td>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Enter post content"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleAddPost}>Add</button>
        </div>

        <br></br>
        <Button
          variant="standard"
          style={{
            fontSize: 18,
            backgroundColor: "#FFC085",
          }}
          onClick={() => {
            if (create) {
              setCreate(false);
            } else {
              setCreate(true);
            }
          }}
        >
          Click here to create a new poll
        </Button>
        <Grid
          container
          spacing={2}
          // direction="column"
          // alignItems="center"
          justifyContent="center"
          paddingTop="1%"
        >
          {create ? <PollForm /> : null}
        </Grid>

        <br></br>
        <h1>Polls:</h1>
        {polls && polls.length > 0 ? (
          <Grid
            container
            spacing={2}
            // alignItems="center"
            justifyContent="center"
            paddingTop="1%"
          >
            {userInfo ? (
              polls.map((poll) => {
                return (
                  <PollCard
                    pollData={poll}
                    userData={userInfo}
                    key={poll._id.toString()}
                  />
                );
              })
            ) : (
              <h2>Loading ...</h2>
            )}
          </Grid>
        ) : (
          <h2>No polls yet ...</h2>
        )}
      </div>
    </div>
  );
}

export default EventDetail;
