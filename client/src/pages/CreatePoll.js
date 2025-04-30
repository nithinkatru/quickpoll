// ✅ client/src/pages/CreatePoll.js
import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { createPoll } from '../services/api';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [durationMinutes, setDurationMinutes] = useState('');

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => setOptions([...options, '']);

  const removeOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
  };

  const handleCreatePoll = async () => {
    try {
      await createPoll({
        question,
        options,
        durationMinutes: durationMinutes ? Number(durationMinutes) : null,
      });
      alert('Poll created!');
    } catch (err) {
      alert('Failed to create poll');
    }
  };

  return (
    <Box p={6} maxW="xl" mx="auto">
      <Heading mb={4}>Create a New Poll</Heading>
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {options.map((opt, index) => (
          <Box key={index} display="flex" alignItems="center" gap={2}>
            <Input
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            {options.length > 2 && (
              <IconButton
                icon={<CloseIcon />}
                onClick={() => removeOption(index)}
                aria-label="Remove option"
              />
            )}
          </Box>
        ))}
        <Input
          placeholder="Duration in minutes (optional)"
          type="number"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
        />
        <Button onClick={addOption} leftIcon={<AddIcon />}>Add Option</Button>
        <Button
          colorScheme="blue"
          onClick={handleCreatePoll}
          isDisabled={!question || options.some((opt) => opt.trim() === '')}
        >
          Create Poll
        </Button>
      </VStack>
    </Box>
  );
};

export default CreatePoll;
