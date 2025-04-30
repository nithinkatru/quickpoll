import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Heading, Button, VStack } from '@chakra-ui/react';
import CreatePoll from './pages/CreatePoll';
import PollResult from './pages/PollResult';
import ViewPolls from './pages/ViewPolls';

const App = () => {
  return (
    <Router>
      <Box p={8} bg="gray.100" minH="100vh" textAlign="center">
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <VStack spacing={4}>
                <Heading size="xl">🎯 QuickPoll</Heading>
                <Button as={Link} to="/create" colorScheme="blue" size="lg">
                  Create a Poll
                </Button>
                <Button as={Link} to="/polls" colorScheme="green" size="lg">
                  View Polls
                </Button>
              </VStack>
            }
          />
          
          {/* Create Poll Page */}
          <Route path="/create" element={<CreatePoll />} />
          
          {/* View Single Poll Result Page */}
          <Route path="/poll/:id" element={<PollResult />} />
          
          {/* View All Polls Page */}
          <Route path="/polls" element={<ViewPolls />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
