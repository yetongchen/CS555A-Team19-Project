import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, List, Pagination, Input, Tabs, Modal } from 'antd';
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import EventOfDateCard from './EventOfDateCard';
import PostCard from "./PostCard";
import {Grid} from "@mui/material";


function UserProfile() {
  //const [userInfo, setUserInfo] = useState({});
  const [userComments, setUserComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [savedEvents, setSavedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); 
  const [currentPageComments, setCurrentPageComments] = useState(1); 
  const [currentPageEvents, setCurrentPageEvents] = useState(1); 
  const pageSize = 10;


  //const auth = getAuth();
  const [user, setUser] = useState(null);
  const auth = getAuth(); // 获取 Firebase Auth 的实例
  const [userInfo, setUserInfo] = useState(null);  // 新状态来存储从你的后端获取的用户信息

  const [eventCardsData, seteventCardsData] = useState(null);
  const [postCardsData, setpostCardsData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, [auth]);

  // 新的 useEffect 钩子来获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
        if (user) {
            try {
                const response = await axios.get(`http://localhost:4000/users/${user.uid}`);
                setUserInfo(response.data);
                console.log("response data: ", response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }else {
          // 如果用户未登录，清除 userInfo
          setUserInfo(null);
        }
    };

    fetchUserInfo();
}, [user]);

  useEffect(() => {
    async function setData() {
      try {
        setUserComments(userInfo.posts);
        setSavedEvents(userInfo.events);
        console.log("userInfo: ", userInfo);
      } catch (e) {
        console.log(e);
      }
    };
    setData();
  }, [userInfo]);                

  useEffect(() => {
    async function getEventCards() {
      try {
        let res =
          savedEvents &&
          savedEvents
            .map((id) => {
              return <EventOfDateCard eventId={id} key={id} />;
            });
        seteventCardsData(res);
      } catch (error) {
        console.log(error);
      }
    }
    getEventCards();
  }, [savedEvents]);

  useEffect(() => {
    async function getPostCards() {
      console.log("userComments: ", userComments);
      try {
        let res =
          userComments &&
          userComments
            .map((id) => {
              return <PostCard postId={id} key={id} />;
            });
        setpostCardsData(res);
      } catch (error) {
        console.log(error);
      }
    }
    getPostCards();
  }, [userComments]);


  // useEffect(() => {
  //   async function fetchUserData() {
  //     try {
  //       const user = auth.currentUser;
  //       if (user) {
  //         const userId = user.uid;
  //         const response = await axios.get(`/users/${userId}`);
  //         const userData = response.data;
  
  //         setUserInfo({
  //           name: userData.name,
  //           email: userData.email
  //         });
  
          
  //         axios.get(`/api/user/${userId}`).then(response => {
  //           setUserComments(response.data.map(post => post.text));
  //           setFilteredComments(response.data.map(post => post.text));
  //         });
  
          
  //         setSavedEvents(userData.events);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   fetchUserData();
  // }, [auth]);




  const handleSearchComments = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = userComments.filter(comment => comment.toLowerCase().includes(value));
    setFilteredComments(filtered);
    setCurrentPageComments(1);
  };

  const handleSearchEvents = (e) => { 
    const value = e.target.value.toLowerCase();
    const filtered = savedEvents.filter(event => event.toLowerCase().includes(value));
    setFilteredEvents(filtered);
    setCurrentPageEvents(1);
  };

  const currentComments = filteredComments.slice((currentPageComments - 1) * pageSize, currentPageComments * pageSize); 
  const currentEvents = filteredEvents.slice((currentPageEvents - 1) * pageSize, currentPageEvents * pageSize); 


  const showModal = () => {
    if (userInfo) {
      setEditName(userInfo.name);
    setEditEmail(userInfo.email);
    setIsModalVisible(true);
    }
  };

  const handleOk = async () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      try {
        await axios.patch(`http://localhost:4000/users/${userId}`, {
          name: editName,
          email: editEmail
        });
        setUserInfo({
          name: editName,
          email: editEmail
        });
      } catch (e) {
        console.log(e);
      }
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };






  return (
    <div className='user-profile-container'>
      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={editName}
          onChange={e => setEditName(e.target.value)}
          placeholder="Name"
        />
        <Input
          value={editEmail}
          onChange={e => setEditEmail(e.target.value)}
          placeholder="Email"
        />
      </Modal>


      <div className="user-profile-sidebar">
        <div className="user-profile">
          <h2>{userInfo && userInfo.name}</h2>
          <p>{userInfo && userInfo.email}</p>
          <button onClick={showModal}>Edit Profile</button>
        </div>
      </div>


      <div className="user-profile-content">
      <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Events" key="1">
            <Input placeholder="Search Events" onChange={handleSearchEvents} />
            {/* <List
              dataSource={currentEvents}
              renderItem={(event, index) => (
                <List.Item key={index}>
                  <EventOfDateCard event={event} />
                </List.Item>
              )}
            /> */}
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
              {eventCardsData}
            </Grid>
            <Pagination 
              current={currentPageEvents} 
              total={filteredEvents.length} 
              pageSize={pageSize} 
              onChange={page => setCurrentPageEvents(page)} 
            />
          </Tabs.TabPane>



          <Tabs.TabPane tab="Comments" key="2">
            <Input placeholder="Search Comments" onChange={handleSearchComments} />
            {/* <List
              dataSource={currentComments}
              renderItem={(comment, index) => (
                <List.Item key={index}>{comment}</List.Item>
              )}
            /> */}
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
              {postCardsData}
            </Grid>
            <Pagination 
              current={currentPageComments} 
              total={filteredComments.length} 
              pageSize={pageSize} 
              onChange={page => setCurrentPageComments(page)} 
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default UserProfile;
