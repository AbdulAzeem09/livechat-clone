/**
 * Agent Assignment Utilities
 * Handles agent assignment logic (round-robin, load balancing)
 */

const User = require('../models/User');
const Conversation = require('../models/Conversation');

class AgentAssignment {
  /**
   * Assign agent to conversation using round-robin
   * @param {string} conversationId - Conversation ID
   * @param {string} departmentId - Department ID (optional)
   * @returns {Promise<Object>} Assigned agent
   */
  async assignRoundRobin(conversationId, departmentId = null) {
    try {
      const query = {
        role: { $in: ['agent', 'admin', 'super_admin'] },
        status: { $in: ['online', 'away'] },
      };

      if (departmentId) {
        query.department = departmentId;
      }

      // Get all available agents
      const agents = await User.find(query).sort({ lastLogin: 1 });

      if (agents.length === 0) {
        return null;
      }

      // Simple round-robin: pick the agent who logged in earliest
      const selectedAgent = agents[0];

      // Update conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        assignedAgent: selectedAgent._id,
        status: 'active',
      });

      return selectedAgent;
    } catch (error) {
      console.error('Round-robin assignment error:', error);
      return null;
    }
  }

  /**
   * Assign agent based on load balancing (least busy)
   * @param {string} conversationId - Conversation ID
   * @param {string} departmentId - Department ID (optional)
   * @returns {Promise<Object>} Assigned agent
   */
  async assignLoadBalancing(conversationId, departmentId = null) {
    try {
      const query = {
        role: { $in: ['agent', 'admin', 'super_admin'] },
        status: { $in: ['online', 'away'] },
      };

      if (departmentId) {
        query.department = departmentId;
      }

      // Get all available agents with their current workload
      const agents = await User.find(query);

      if (agents.length === 0) {
        return null;
      }

      // Find agent with lowest current chat count
      let selectedAgent = agents[0];
      let minChats = selectedAgent.currentChatCount || 0;

      for (const agent of agents) {
        const chatCount = agent.currentChatCount || 0;
        const maxChats = agent.maxConcurrentChats || 5;

        if (chatCount < maxChats && chatCount < minChats) {
          selectedAgent = agent;
          minChats = chatCount;
        }
      }

      // Check if agent has capacity
      if (minChats >= (selectedAgent.maxConcurrentChats || 5)) {
        return null;
      }

      // Update conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        assignedAgent: selectedAgent._id,
        status: 'active',
      });

      // Increment agent's current chat count
      await User.findByIdAndUpdate(selectedAgent._id, {
        $inc: { currentChatCount: 1 },
      });

      return selectedAgent;
    } catch (error) {
      console.error('Load balancing assignment error:', error);
      return null;
    }
  }

  /**
   * Assign agent based on skills
   * @param {string} conversationId - Conversation ID
   * @param {Array} requiredSkills - Required skills
   * @returns {Promise<Object>} Assigned agent
   */
  async assignBySkills(conversationId, requiredSkills = []) {
    try {
      if (requiredSkills.length === 0) {
        return this.assignLoadBalancing(conversationId);
      }

      const agents = await User.find({
        role: { $in: ['agent', 'admin', 'super_admin'] },
        status: { $in: ['online', 'away'] },
        skills: { $in: requiredSkills },
      });

      if (agents.length === 0) {
        // Fallback to load balancing if no skilled agent available
        return this.assignLoadBalancing(conversationId);
      }

      // Among skilled agents, use load balancing
      let selectedAgent = agents[0];
      let minChats = selectedAgent.currentChatCount || 0;

      for (const agent of agents) {
        const chatCount = agent.currentChatCount || 0;
        if (chatCount < minChats) {
          selectedAgent = agent;
          minChats = chatCount;
        }
      }

      await Conversation.findByIdAndUpdate(conversationId, {
        assignedAgent: selectedAgent._id,
        status: 'active',
      });

      await User.findByIdAndUpdate(selectedAgent._id, {
        $inc: { currentChatCount: 1 },
      });

      return selectedAgent;
    } catch (error) {
      console.error('Skill-based assignment error:', error);
      return null;
    }
  }

  /**
   * Transfer conversation to another agent
   * @param {string} conversationId - Conversation ID
   * @param {string} newAgentId - New agent ID
   * @returns {Promise<boolean>} Success
   */
  async transferConversation(conversationId, newAgentId) {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return false;
      }

      const oldAgentId = conversation.assignedAgent;

      // Update conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        assignedAgent: newAgentId,
      });

      // Decrement old agent's count
      if (oldAgentId) {
        await User.findByIdAndUpdate(oldAgentId, {
          $inc: { currentChatCount: -1 },
        });
      }

      // Increment new agent's count
      await User.findByIdAndUpdate(newAgentId, {
        $inc: { currentChatCount: 1 },
      });

      return true;
    } catch (error) {
      console.error('Transfer conversation error:', error);
      return false;
    }
  }

  /**
   * Release agent from conversation (on close/resolve)
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<boolean>} Success
   */
  async releaseAgent(conversationId) {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.assignedAgent) {
        return false;
      }

      // Decrement agent's current chat count
      await User.findByIdAndUpdate(conversation.assignedAgent, {
        $inc: { currentChatCount: -1 },
      });

      return true;
    } catch (error) {
      console.error('Release agent error:', error);
      return false;
    }
  }
}

module.exports = new AgentAssignment();
