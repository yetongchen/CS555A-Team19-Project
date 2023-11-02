import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, List, Pagination, Input, Tabs, Modal } from 'antd';
import { getAuth } from "firebase/auth";
import EventOfDateCard from './EventOfDateCard';



function UserProfile() {
  const [userInfo, setUserInfo] = useState({});
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


  const auth = getAuth();



  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const response = await axios.get(`/users/${userId}`);
          const userData = response.data;
  
          setUserInfo({
            name: userData.name,
            email: userData.email
          });
  
          // 设置评论
          axios.get(`/api/user/${userId}`).then(response => {
            setUserComments(response.data.map(post => post.text));
            setFilteredComments(response.data.map(post => post.text));
          });
  
          // 设置用户保存的活动
          setSavedEvents(userData.events);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchUserData();
  }, [auth]);




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
    setEditName(userInfo.name);
    setEditEmail(userInfo.email);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      try {
        await axios.patch(`/users/${userId}`, {
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
          <h2>{userInfo.name}</h2>
          <p>{userInfo.email}</p>
          <button onClick={showModal}>Edit Profile</button>
        </div>
      </div>


      <div className="user-profile-content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Events" key="1">
            <Input placeholder="Search Events" onChange={handleSearchEvents} />
            <List
              dataSource={currentEvents}
              renderItem={(event, index) => (
                <List.Item key={index}>{event}</List.Item>
              )}
            />
            <Pagination 
              current={currentPageEvents} 
              total={filteredEvents.length} 
              pageSize={pageSize} 
              onChange={page => setCurrentPageEvents(page)} 
            />
          </Tabs.TabPane>



          <Tabs.TabPane tab="Comments" key="2">
            <Input placeholder="Search Comments" onChange={handleSearchComments} />
            <List
              dataSource={currentComments}
              renderItem={(comment, index) => (
                <List.Item key={index}>{comment}</List.Item>
              )}
            />
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
