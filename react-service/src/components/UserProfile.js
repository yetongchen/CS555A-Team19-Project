import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, List, Pagination, Input } from 'antd';
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
          setUserInfo(response.data);

          axios.get(`/api/user/${userId}`).then(response => {
            setUserComments(response.data.map(post => post.text));
            setFilteredComments(response.data.map(post => post.text));
          });
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
