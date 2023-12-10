import { Typography, Container, Box, Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type UserData = {
  name: string;
  avatarUrl: string;
  joinedDate: string;
  // ... other properties you expect from the API
};

function PublicProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Fetch user data from backend using the username from the URL
    fetch(`/api/users/${username}`)
      .then(response => response.json())
      .then(data => setUserData(data));
  }, [username]);

  if (!userData) return <div>Loading...</div>;

  return (
    <Container maxWidth="md">
      <Box mt={4} textAlign="center">
        <Avatar alt={userData.name} src={userData.avatarUrl} />
        <Typography variant="h4" gutterBottom>
          {userData.name}
        </Typography>
        <Typography variant="subtitle1">
          Joined Date: {userData.joinedDate}
        </Typography>
        {/* Add more user details here */}
      </Box>
    </Container>
  );
}

export default PublicProfile;
