import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, List, Pagination, Input, Tabs } from 'antd';
import { getAuth } from "firebase/auth";


function UserProfile() {
  const [userInfo, setUserInfo] = useState({});
  const [userComments, setUserComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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




  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = userComments.filter(comment => comment.toLowerCase().includes(value));
    setFilteredComments(filtered);
    setCurrentPage(1);
  };

  const currentComments = filteredComments.slice((currentPage - 1) * pageSize, currentPage * pageSize);




  return (
    <div className='user-profile-container'>
      <div className="user-profile-sidebar">
        <div className="user-profile">
          <h2>{userInfo.name}</h2>
          <p>{userInfo.email}</p>
          <button>Edit Profile</button>
        </div>
      </div>
      
      <div className="user-profile-content">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Events" key="1">
            <Input placeholder="Search comments" onChange={handleSearch} />
            <List
              dataSource={currentComments}
              renderItem={(comment, index) => (
                <List.Item key={index}>{comment}</List.Item>
              )}
            />
            <Pagination 
              current={currentPage} 
              total={filteredComments.length} 
              pageSize={pageSize} 
              onChange={page => setCurrentPage(page)} 
            />
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="Collections" key="2">
            <List
              dataSource={savedEvents}
              renderItem={(event, index) => (
                <List.Item key={index}>{event}</List.Item>
              )}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
);
}



export default UserProfile;
