const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// POST /api/polls - Create new poll with optional expiry
router.post('/', async (req, res) => {
  const { question, options, durationMinutes } = req.body;

  const expiresAt = durationMinutes
    ? new Date(Date.now() + durationMinutes * 60 * 1000)
    : null;

  try {
    const newPoll = new Poll({
      question,
      options: options.map((text) => ({ text })),
      expiresAt,
    });

    const savedPoll = await newPoll.save();
    res.status(201).json(savedPoll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating poll' });
  }
});

// GET /api/polls - List all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching polls' });
  }
});

// GET /api/polls/:id - Get single poll by ID
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching poll' });
  }
});

// POST /api/polls/:id/vote - Vote on a poll
router.post('/:id/vote', async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid vote request' });
    }

    // Check if poll has expired
    if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
      return res.status(403).json({ message: 'Poll has expired' });
    }

    poll.options[optionIndex].votes += 1;
    const updatedPoll = await poll.save();
    res.json(updatedPoll);
  } catch (err) {
    res.status(500).json({ message: 'Error voting on poll' });
  }
});

module.exports = router;
