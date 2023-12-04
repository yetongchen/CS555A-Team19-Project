import React, { useState, useEffect } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import axios from "axios";
import { getAuth, onAuthStateChanged} from "firebase/auth";

import { PollForm } from "./PollForm";
import { PollCard } from "./PollCard";
import { Grid } from "@mui/material";

import "../App.css";

function EventBody({eventData, id, err}) {
  const eventId = id;
  
  const [user, setUser] = useState(null);
  const auth = getAuth(); // 获取 Firebase Auth 的实例
  const [userInfo, setUserInfo] = useState(null); // 新状态来存储从你的后端获取的用户信息
  
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  
  const [create, setCreate] = useState(false);
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState(err);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, [auth]);

  // new useEffect to get userInfo
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
        // if the user is not logged in，clear userInfo
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, [user]);

  useEffect(() => {
    async function getPolls() {
      setError(null);
      console.log("useEffect fired");

      try {
        const { data } = await axios.get(
          `http://localhost:4000/polls/event/${id}`
        );
        const results = data.polls;

        if (results && results.length > 0) setPolls(results);
      } catch (error) {
        console.log(error);
        setError("There was a problem fetching polls.");
      }
    }

    if (id) {
      getPolls();
    }
  }, [id, polls]);
  
  useEffect(() => {
    postsForEvent(id)
      .then(async (posts) => {
        const postsWithUserInfo = await Promise.all(
          posts.map(async (post) => {
            const userInfo = await axios.get(`http://localhost:4000/users/${post.user_id}`);
            post.imageURL = userInfo.data.imageURL;
            console.log("displayPostForEvent userInfo: ", post);
            return post; // add userInfo to post object
          })
        );
        setPosts(postsWithUserInfo);
      })
      .catch((error) => {
        console.error("Error fetching posts for event", error);
      });
  }, [id]);

  const postsForEvent = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/post/event/${id}`
      );
      if(response.data.error){
        console.log(response.data);
        setError(response.data.error);
      }else{
        setError(null);
        return response.data;
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    }
  };

  // add post
  const handleAddPost = async () => {
    setError(null);
    if (!userInfo) {
      console.error("User must be logged in to add post");
      setError("You must be logged in to add a post");
      return;
    }
    try {
      const postData = {
        user_id: userInfo._id,
        imageURL: userInfo.imageURL,
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
      if(newPost.error){
        console.log(newPost.error);
        setError(newPost.error);
      }else{
        setError(null);
        let updatedPosts = await postsForEvent(id);
        setPosts(updatedPosts);
        setNewPostTitle("");
        setNewPostContent("");
        return newPost;
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
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
    setError(null);
    if (!userInfo) {
      console.error("User must be logged in to join event");
      setError("You must be logged in to join an event");
      return;
    }
    setHasJoined(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:4000/users/addEventToUser/${userInfo._id}/${eventId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="outer-container">
      <div className="event-container" id="event-container">
        <img src={eventData.imageURL}
          alt="Event"
        />
        <div className="event-details">
          <h1 className="event-name">{eventData.name}</h1>

          <div className="event-time-location">
            <CalendarMonthOutlinedIcon />
            <h2>Date and Time: </h2>
            {eventData.datetime ? eventData.datetime : "N/A"}
            
          </div>

          <div className="event-address">
            <LocationOnOutlinedIcon />
            <h2>Address:</h2>
            <div>
            {eventData.address ? eventData.address : "N/A"}
            </div>
          </div>

          <div className="event-description">
            <div className="description-header">
              <DescriptionOutlinedIcon />
              <h2>Description:</h2>
            </div>
            <div>{eventData.description ? eventData.description : "N/A"}</div>
          </div>

          <p className="event-ticket">
            {eventData.ticketURL ? (
              <dd>
                Link: <a
                  className="event-link"
                  rel='noopener noreferrer'
                  target='_blank'
                  href={eventData.ticketURL}
                >
                  {eventData.name}
                </a>
              </dd>
            ) : (
              <dd>No external ticketing link available.</dd>
            )}
          </p>
            <button 
              className={hasJoined ? "join-button joined" : "join-button"} 
              onClick={joinEvent} 
              disabled={hasJoined}
            >
              {hasJoined ? "Joined" : "Join"}
            </button>
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
                  {post && post.imageURL && (
                    <div className="post-photo">
                      <img src={post.imageURL} alt="User Avatar" />
                    </div>
                  )}</span>
                  
                </div>
                <div className="post-content">{post.text}</div>
              </div>
            ))}
        </div>

        <div className="post-input-container">
          {error && <p style={{color: 'red'}}>{error}</p>}
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
        <button className="add-poll-button"
          onClick={() => {
            if (!userInfo) {
              console.log("User must be logged in to create poll");
              setError("You must be logged in to create a poll");
              return;
            } else if (create) {
              setCreate(false);
            } else {
              setCreate(true);
            }
          }}
        >
          Create a new poll
        </button>
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

export default EventBody;