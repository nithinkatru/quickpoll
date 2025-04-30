// ✅ client/src/pages/ViewPolls.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Link as ChakraLink,
  Text,
  Spinner,
  SimpleGrid,
  Input
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ViewPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/polls');
        setPolls(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const filteredPolls = polls.filter(poll =>
    poll.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6} maxW="6xl" mx="auto">
      <Heading mb={4}>📋 All Polls</Heading>
      <Input
        placeholder="Search polls by question..."
        mb={6}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {filteredPolls.map((poll) => (
          <Box
            key={poll._id}
            p={6}
            shadow="md"
            borderWidth="1px"
            borderRadius="xl"
            bg="white"
            _hover={{ transform: 'scale(1.02)', boxShadow: 'xl' }}
            transition="0.2s"
          >
            <ChakraLink
              as={Link}
              to={`/poll/${poll._id}`}
              fontSize="xl"
              fontWeight="bold"
              color="teal.500"
            >
              {poll.question}
            </ChakraLink>
            <Text mt={2} fontSize="sm" color="gray.500">
              Created: {new Date(poll.createdAt).toLocaleString()}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ViewPolls;