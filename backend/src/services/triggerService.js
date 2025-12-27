const Trigger = require('../models/Trigger');
const Visitor = require('../models/Visitor');
const logger = require('../utils/logger');

/**
 * Evaluate triggers for a visitor
 */
const evaluateTriggers = async (visitorData) => {
  try {
    const triggers = await Trigger.find({
      isActive: true,
    }).sort({ priority: -1 });

    const matchedTriggers = [];

    for (const trigger of triggers) {
      if (trigger.checkConditions(visitorData)) {
        matchedTriggers.push(trigger);
        await trigger.incrementExecution();
      }
    }

    return matchedTriggers;
  } catch (error) {
    logger.error('Error evaluating triggers:', error);
    throw error;
  }
};

/**
 * Execute trigger actions
 */
const executeTriggerActions = async (trigger, visitorData, socketEmit) => {
  try {
    for (const action of trigger.actions) {
      switch (action.type) {
        case 'send_message':
          // Emit message to visitor via socket
          if (socketEmit) {
            socketEmit('trigger:message', {
              message: action.value,
              triggerId: trigger._id,
            });
          }
          break;

        case 'open_chat':
          // Emit chat open event
          if (socketEmit) {
            socketEmit('trigger:open_chat', {
              triggerId: trigger._id,
            });
          }
          break;

        case 'show_notification':
          // Emit notification
          if (socketEmit) {
            socketEmit('trigger:notification', {
              message: action.value,
              triggerId: trigger._id,
            });
          }
          break;

        case 'assign_to_agent':
          // Logic for auto-assignment will be handled separately
          logger.info(`Trigger ${trigger._id} requested agent assignment`);
          break;

        case 'add_tag':
          // Add tag to visitor
          if (visitorData.visitorId) {
            const visitor = await Visitor.findOne({ visitorId: visitorData.visitorId });
            if (visitor && !visitor.tags.includes(action.value)) {
              visitor.tags.push(action.value);
              await visitor.save();
            }
          }
          break;

        default:
          logger.warn(`Unknown trigger action type: ${action.type}`);
      }
    }
  } catch (error) {
    logger.error('Error executing trigger actions:', error);
    throw error;
  }
};

/**
 * Check time-based triggers
 */
const checkTimeBasedTriggers = async (visitorId, timeOnPage) => {
  try {
    const triggers = await Trigger.find({
      isActive: true,
      'conditions.type': 'time_on_page',
    });

    const matchedTriggers = triggers.filter(trigger => {
      const timeCondition = trigger.conditions.find(c => c.type === 'time_on_page');
      if (timeCondition) {
        const requiredTime = parseInt(timeCondition.value, 10);
        return timeOnPage >= requiredTime;
      }
      return false;
    });

    return matchedTriggers;
  } catch (error) {
    logger.error('Error checking time-based triggers:', error);
    throw error;
  }
};

/**
 * Check URL-based triggers
 */
const checkUrlBasedTriggers = async (url) => {
  try {
    const triggers = await Trigger.find({
      isActive: true,
      'conditions.type': 'page_url',
    });

    const matchedTriggers = triggers.filter(trigger => {
      return trigger.checkConditions({ page_url: url });
    });

    return matchedTriggers;
  } catch (error) {
    logger.error('Error checking URL-based triggers:', error);
    throw error;
  }
};

module.exports = {
  evaluateTriggers,
  executeTriggerActions,
  checkTimeBasedTriggers,
  checkUrlBasedTriggers,
};
