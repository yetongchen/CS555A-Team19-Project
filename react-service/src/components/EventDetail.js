import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = "HOXTF4SFSKCCDLS4V4XK";
const accessToken = "UXCHJT4NQMRVWKRVEMRB";
const id = "48288403916";

async function getEventById(id) {
  const apiUrl = `https://www.eventbriteapi.com/v3/events/${id}/`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Api-Key': apiKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error('获取事件详细信息时出错:', error);
    throw error;
  }
}

function EventDetail({}) {
  const [event, setEvent] = useState({});
  const eventId = id; // 获取路由参数中的id

  useEffect(() => {
    getEventById(eventId)
      .then((eventData) => {
        setEvent(eventData);
      })
      .catch((error) => {
        console.error('出现错误：', error);
      });
  }, [eventId]);

  return (
    <div>
      <h1>{event.name && event.name.text}</h1>
      <p>{event.start && event.start.local}</p>
      <p>{event.end && event.end.local}</p>
      <p>{event.description && event.description.text}</p>
      {/* 其他需要显示的事件信息 */}
    </div>
  );
}

export default EventDetail;
