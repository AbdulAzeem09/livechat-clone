import React from 'react';
import { MapPin, Globe, Monitor, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import type { Conversation } from '../../types';
import { Avatar } from '../shared/Avatar';

interface VisitorDetailsProps {
  conversation: Conversation;
  onUpdateNotes: (notes: string) => void;
  onAddTag: (tag: string) => void;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-lc-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-lc-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-sm text-lc-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-lc-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-lc-gray-600" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

interface InfoRowProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="w-4 h-4 text-lc-gray-500 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-lc-gray-500">{label}</p>
      <p className="text-sm text-lc-gray-900 break-words">{value}</p>
    </div>
  </div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2 py-1 bg-lc-gray-100 text-lc-gray-700 text-xs rounded-md">
    {children}
  </span>
);

export const VisitorDetails: React.FC<VisitorDetailsProps> = ({ conversation, onUpdateNotes, onAddTag }) => {
  const [notes, setNotes] = React.useState(conversation.notes || '');
  const [isEditingNotes, setIsEditingNotes] = React.useState(false);

  const handleSaveNotes = () => {
    onUpdateNotes(notes);
    setIsEditingNotes(false);
  };

  return (
    <aside className="w-[320px] bg-white border-l border-lc-gray-200 overflow-y-auto">
      {/* Visitor Header */}
      <div className="p-4 border-b border-lc-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={conversation.visitor.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lc-gray-900 truncate">{conversation.visitor.name}</h3>
            <p className="text-sm text-lc-gray-500 truncate">{conversation.visitor.email}</p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <CollapsibleSection title="Details" defaultOpen>
        <div className="space-y-1">
          {conversation.visitor.location && (
            <InfoRow icon={MapPin} label="Location" value={conversation.visitor.location} />
          )}
          {conversation.visitor.browser && (
            <InfoRow icon={Globe} label="Browser" value={conversation.visitor.browser} />
          )}
          {conversation.visitor.os && (
            <InfoRow icon={Monitor} label="Operating System" value={conversation.visitor.os} />
          )}
          {conversation.visitor.localTime && (
            <InfoRow icon={Clock} label="Local time" value={conversation.visitor.localTime} />
          )}
          {conversation.visitor.currentPage && (
            <InfoRow icon={Eye} label="Current page" value={conversation.visitor.currentPage} />
          )}
        </div>
      </CollapsibleSection>

      {/* Notes Section */}
      <CollapsibleSection title="Notes">
        {isEditingNotes ? (
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 text-sm border border-lc-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-lc-orange"
              placeholder="Add notes about this visitor..."
              rows={4}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveNotes}
                className="px-3 py-1 bg-lc-orange text-white text-sm rounded-lg hover:bg-lc-orange-hover"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setNotes(conversation.notes || '');
                  setIsEditingNotes(false);
                }}
                className="px-3 py-1 bg-lc-gray-200 text-lc-gray-700 text-sm rounded-lg hover:bg-lc-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-lc-gray-700 mb-2">{notes || 'No notes yet'}</p>
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-sm text-lc-orange hover:text-lc-orange-hover"
            >
              {notes ? 'Edit notes' : 'Add notes'}
            </button>
          </div>
        )}
      </CollapsibleSection>

      {/* Tags Section */}
      <CollapsibleSection title="Tags">
        <div className="flex flex-wrap gap-2">
          {conversation.tags?.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
          <button
            onClick={() => {
              const newTag = prompt('Enter new tag:');
              if (newTag) onAddTag(newTag);
            }}
            className="inline-flex items-center px-2 py-1 border border-dashed border-lc-gray-300 text-lc-gray-500 text-xs rounded-md hover:border-lc-gray-400"
          >
            + Add tag
          </button>
        </div>
      </CollapsibleSection>

      {/* Previous Chats Section */}
      <CollapsibleSection title="Previous chats">
        <div className="space-y-3">
          <div className="p-3 bg-lc-gray-50 rounded-lg">
            <p className="text-xs text-lc-gray-500 mb-1">Dec 20, 2024</p>
            <p className="text-sm text-lc-gray-700">Asked about pricing plans...</p>
          </div>
          <div className="p-3 bg-lc-gray-50 rounded-lg">
            <p className="text-xs text-lc-gray-500 mb-1">Dec 15, 2024</p>
            <p className="text-sm text-lc-gray-700">Technical support for API integration...</p>
          </div>
        </div>
      </CollapsibleSection>
    </aside>
  );
};
