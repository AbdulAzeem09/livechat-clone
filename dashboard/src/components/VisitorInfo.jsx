import React, { useState, useEffect } from 'react';
import { conversationsAPI } from '../services/api';
import { MapPin, Mail, Phone, Globe, Monitor, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const VisitorInfo = ({ conversation }) => {
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (conversation) {
      setNotes(conversation.notes || '');
      setTags(conversation.tags || []);
    }
  }, [conversation]);

  const handleSaveNotes = async () => {
    try {
      await conversationsAPI.update(conversation._id, { notes });
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      
      conversationsAPI.update(conversation._id, { tags: updatedTags })
        .then(() => toast.success('Tag added'))
        .catch(() => toast.error('Failed to add tag'));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    
    conversationsAPI.update(conversation._id, { tags: updatedTags })
      .then(() => toast.success('Tag removed'))
      .catch(() => toast.error('Failed to remove tag'));
  };

  const handleAssignToMe = async () => {
    try {
      await conversationsAPI.assign(conversation._id);
      toast.success('Conversation assigned to you');
    } catch (error) {
      toast.error('Failed to assign conversation');
    }
  };

  const handleResolve = async () => {
    try {
      await conversationsAPI.resolve(conversation._id);
      toast.success('Conversation resolved');
    } catch (error) {
      toast.error('Failed to resolve conversation');
    }
  };

  const handleClose = async () => {
    try {
      await conversationsAPI.close(conversation._id);
      toast.success('Conversation closed');
    } catch (error) {
      toast.error('Failed to close conversation');
    }
  };

  if (!conversation) {
    return null;
  }

  const visitor = conversation.visitor;

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Information</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Details</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{visitor?.email || 'No email'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{visitor?.currentPage || 'Unknown page'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {visitor?.city && visitor?.country 
                    ? `${visitor.city}, ${visitor.country}` 
                    : 'Location unknown'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Device Information</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Monitor className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{visitor?.browser || 'Unknown browser'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Monitor className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{visitor?.os || 'Unknown OS'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Conversation Details</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Started: {format(new Date(conversation.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              {conversation.rating && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600">Rating: {conversation.rating}/5 ⭐</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag..."
                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this conversation..."
              rows="4"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveNotes}
              className="mt-2 w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Save Notes
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleAssignToMe}
              className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              Assign to Me
            </button>
            <button
              onClick={handleResolve}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Mark as Resolved
            </button>
            <button
              onClick={handleClose}
              className="w-full px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
            >
              Close Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorInfo;
