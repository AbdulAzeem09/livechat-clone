import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { MessageSquare, Users, Clock, Star, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, agentsRes] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getAgents(),
      ]);
      
      setOverview(overviewRes.data);
      setAgents(agentsRes.data);
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{overview?.totalConversations || 0}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Conversations</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-600" />
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{overview?.activeChats || 0}</h3>
          <p className="text-sm text-gray-600 mt-1">Active Chats</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-gray-500">Avg</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{overview?.avgResponseTime || '0s'}</h3>
          <p className="text-sm text-gray-600 mt-1">Response Time</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-gray-500">Rating</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{overview?.avgRating || '0.0'}</h3>
          <p className="text-sm text-gray-600 mt-1">Satisfaction Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: `${(overview?.pendingChats / overview?.totalConversations * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{overview?.pendingChats || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(overview?.activeChats / overview?.totalConversations * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{overview?.activeChats || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Resolved</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(overview?.resolvedChats / overview?.totalConversations * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{overview?.resolvedChats || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance</h3>
          <div className="space-y-4">
            {agents.slice(0, 5).map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'online' ? 'bg-green-500' :
                    agent.status === 'away' ? 'bg-yellow-500' :
                    agent.status === 'busy' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-gray-900 font-medium">{agent.name}</span>
                </div>
                <div className="flex space-x-4 text-sm">
                  <span className="text-gray-600">
                    {agent.assignedConversations} assigned
                  </span>
                  <span className="text-green-600">
                    {agent.resolvedConversations} resolved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
