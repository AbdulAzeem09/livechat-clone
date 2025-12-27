const axios = require('axios');
const logger = require('../utils/logger');

/**
 * OpenAI GPT Integration Service
 * User needs to provide OPENAI_API_KEY in environment variables
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

/**
 * Generate AI response
 */
const generateResponse = async (conversationHistory, systemPrompt = null) => {
  try {
    if (!OPENAI_API_KEY) {
      logger.warn('OpenAI API key not configured');
      return null;
    }

    const messages = [
      {
        role: 'system',
        content: systemPrompt || 'You are a helpful customer support assistant.',
      },
      ...conversationHistory,
    ];

    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    logger.error('OpenAI API error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Detect intent from user message
 */
const detectIntent = async (message) => {
  try {
    if (!OPENAI_API_KEY) {
      return null;
    }

    const response = await generateResponse(
      [{ role: 'user', content: message }],
      'Classify the intent of this customer message into one of: question, complaint, request, greeting, farewell. Respond with only the intent category.'
    );

    return response?.toLowerCase().trim();
  } catch (error) {
    logger.error('Intent detection error:', error);
    return null;
  }
};

/**
 * Suggest response based on conversation
 */
const suggestResponse = async (conversationHistory) => {
  try {
    if (!OPENAI_API_KEY) {
      return null;
    }

    return await generateResponse(
      conversationHistory,
      'Based on the conversation, suggest a helpful and professional response. Keep it concise and friendly.'
    );
  } catch (error) {
    logger.error('Response suggestion error:', error);
    return null;
  }
};

/**
 * Summarize conversation
 */
const summarizeConversation = async (messages) => {
  try {
    if (!OPENAI_API_KEY) {
      return null;
    }

    const conversationText = messages
      .map(m => `${m.sender.type}: ${m.content}`)
      .join('\n');

    const response = await generateResponse(
      [{ role: 'user', content: conversationText }],
      'Summarize this customer support conversation in 2-3 sentences.'
    );

    return response;
  } catch (error) {
    logger.error('Conversation summarization error:', error);
    return null;
  }
};

/**
 * Analyze sentiment
 */
const analyzeSentiment = async (message) => {
  try {
    if (!OPENAI_API_KEY) {
      return null;
    }

    const response = await generateResponse(
      [{ role: 'user', content: message }],
      'Analyze the sentiment of this message. Respond with only: positive, negative, or neutral.'
    );

    return response?.toLowerCase().trim();
  } catch (error) {
    logger.error('Sentiment analysis error:', error);
    return null;
  }
};

module.exports = {
  generateResponse,
  detectIntent,
  suggestResponse,
  summarizeConversation,
  analyzeSentiment,
};
