import React from 'react';
import { Button } from '../shared/Button';

interface PreChatFormProps {
  onSubmit: (data: { name: string; email: string }) => void;
}

export const PreChatForm: React.FC<PreChatFormProps> = ({ onSubmit }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onSubmit({ name, email });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-lc-gray-900 mb-2">
        👋 Hi there!
      </h2>
      <p className="text-lc-gray-600 mb-6">
        Fill in the form below to start chatting with us.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-lc-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-lc-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lc-orange text-sm"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-lc-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-lc-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lc-orange text-sm"
            placeholder="Enter your email"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 bg-lc-orange hover:bg-lc-orange-hover text-white font-semibold rounded-lg"
        >
          Start chat
        </Button>
      </form>
    </div>
  );
};
