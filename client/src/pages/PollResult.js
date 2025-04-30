// ✅ client/src/pages/PollResult.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Progress,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  IconButton
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5050');

const PollResult = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchPoll = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/polls/${id}`);
      setPoll(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
    socket.on('pollUpdated', (updatedPoll) => {
      if (updatedPoll._id === id) {
        setPoll(updatedPoll);
      }
    });
    return () => socket.off('pollUpdated');
  }, [id]);

  const isExpired = poll?.expiresAt && new Date(poll.expiresAt) < new Date();

  const handleVote = async (optionIndex) => {
    const votedKey = `voted_poll_${id}`;
    if (localStorage.getItem(votedKey)) {
      toast({
        title: 'Already Voted',
        description: 'You can only vote once.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isExpired) {
      toast({
        title: 'Poll Expired',
        description: 'This poll is no longer active.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post(`http://localhost:5050/api/polls/${id}/vote`, { optionIndex });
      localStorage.setItem(votedKey, true);
      toast({
        title: 'Vote Cast',
        description: 'Thanks for voting!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to vote.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const pollUrl = `${window.location.origin}/poll/${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pollUrl);
    toast({
      title: 'Link Copied',
      description: 'Poll link copied to clipboard.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) return <Spinner size="xl" />;
  if (!poll) return <Text color="red.500">Poll not found.</Text>;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <Box p={6} maxW="xl" mx="auto">
      <Heading mb={4}>{poll.question}</Heading>
      <Button colorScheme="purple" mb={4} onClick={onOpen} leftIcon={<ExternalLinkIcon />}>Share</Button>

      <VStack spacing={4} align="stretch">
        {poll.options.map((option, index) => {
          const percentage = totalVotes ? (option.votes / totalVotes) * 100 : 0;
          return (
            <Box key={index}>
              <Text fontWeight="bold">{option.text}</Text>
              <Progress value={percentage} size="sm" colorScheme="blue" mb={2} />
              <Text fontSize="sm" color="gray.600">{option.votes} votes</Text>
              {!isExpired && (
                <Button colorScheme="green" size="sm" onClick={() => handleVote(index)}>
                  Vote
                </Button>
              )}
            </Box>
          );
        })}
        {isExpired && (
          <Text mt={4} color="red.500">⚠️ This poll has expired. Voting is closed.</Text>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>📎 Share This Poll</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Copy this link:</Text>
            <Box display="flex" alignItems="center" mb={4}>
              <Input value={pollUrl} isReadOnly mr={2} />
              <IconButton icon={<CopyIcon />} onClick={handleCopy} aria-label="Copy" />
            </Box>
            <Text mb={2}>Or scan this QR code:</Text>
            <QRCodeSVG value={pollUrl} size={150} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PollResult;