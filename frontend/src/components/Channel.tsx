// import React from 'react';
// import { useParams } from 'react-router-dom';
// import Chatroom from './Chatroom';

// const Channel: React.FC = () => {
//   const { channelId } = useParams<{ channelId: string }>();

//   return (
//     <div>
//       <h2>Channel: {channelId}</h2>
//       <Chatroom room={channelId} />
//       {/* Additional channel-specific features can be added here */}
//     </div>
//   );
// };

// export default Channel;


import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
// Other imports

const Channel: React.FC<{ channelName: string }> = ({ channelName }) => {
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  // State for users in the channel
  const socket = io(`http://localhost:3000`, { query: { channelName } });

  useEffect(() => {
    socket.on('message', (msg) => {
      setChatHistory(prev => [...prev, msg]);
    });
    socket.on('updateChannelMembers', (members) => {
      // Update the user list
    });

    return () => {
      socket.disconnect();
    };
  }, [channelName]);

  // sendMessage function and other logic

  return (
    <div>
      {/* Chat and input logic */}
    </div>
  );
};

export default Channel;
