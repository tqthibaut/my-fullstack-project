// Home.tsx
import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import LoginModal from '../components/LoginModal';
import Channel from '../components/Channel';
import Chatroom from '../components/Chatroom';
import CarouselComponent from '../components/Carousel';
import { useAuth } from '../contexts/AuthContext';
import  Navigation  from '../components/Navigation';
// Other imports

function Home() {
  // States
  const [channels, setChannels] = useState<string[]>([]); // Replace with actual data type
  // const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // useEffect(() => {
  //   // Fetch channel names (replace with actual API call)
  //   const fetchedChannels = ["Channel 1", "Channel 2", "Channel 3"];
  //   setChannels(fetchedChannels);
  //   setSelectedChannel(fetchedChannels[0]);
  // }, []);

  // const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
  //   setSelectedChannel(newValue);
  // };

  const sectionHeight = `calc((100vh - 64px) / 3)`;

  return (
    // FUCKING navbar, so you have to play with height and gap, IDK
    // if it's the right way but IDGAF at this point.
    <Box display="flex"flexDirection="column" height="calc(100vh - 80px)" 
          overflow="hidden" gap={1}>

      {/* Text Section */}
      <Box bgcolor="#f0f0f0" borderRadius={10} p={2}
           width="100%" height={sectionHeight}
           display="flex" flexDirection="column" justifyContent="center" 
           alignItems="center" boxShadow={3}>
        <p>Welcome to my site! ...</p>
      </Box>

      {/* Carousel Section */}
      <Box bgcolor="#f0f0f0" boxShadow={3} 
            borderRadius={10} p={2}
            width="100%" height={sectionHeight}
            overflow="hidden"
            >
        <CarouselComponent />
      </Box>

      {/*                   Chat Window Section
        Useful properties:
          justifyContent="center", alignItems="center"
      */}
    <Box bgcolor={isLoggedIn ? "white" : "grey"} boxShadow={3} borderRadius={10} p={2} width="100%" height="33%">
      {isLoggedIn ? (
      // <Chatroom style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />
        <Box><h3>CHATROOM</h3>
        <p> Yeah, you did it, you solved the Auth thingy, now go make that
          effing chatroom.</p></Box>
  ) : (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
      <p>You must be logged in to access the Chat Feature</p>
    </Box>
  )}
</Box>
    </Box>
  );
}

export default Home;