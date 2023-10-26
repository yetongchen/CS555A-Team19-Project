import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, List, Pagination, Input } from 'antd';
import { AuthContext } from "../firebase/Auth";
import { getPostByUserId } from '../../data-service/data/postData';


function UserProfile() {
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [userComments, setUserComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  
  useEffect(() => {
    async function fetchUserData() {
      try {
        if (currentUser) {
          const userId = currentUser.uid;
          const response = await axios.get(`/users/${userId}`);
          setUserInfo(response.data);

          const userPosts = await getPostByUserId(userId);
          setUserComments(userPosts.map(post => post.text));
          setFilteredComments(userPosts.map(post => post.text));
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchUserData();
  }, [currentUser]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = userComments.filter(comment => comment.toLowerCase().includes(value));
    setFilteredComments(filtered);
    setCurrentPage(1);
  };

  const currentComments = filteredComments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className='container'>
      <Card title="User Profile">
        <p>Name: {userInfo.name}</p>
        <p>Email: {userInfo.email}</p>
      </Card>

      <Card title="User Comments">
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
      </Card>

      <Card title="Saved Events">
        <List
          dataSource={savedEvents}
          renderItem={(event, index) => (
            <List.Item key={index}>{event}</List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default UserProfile;
