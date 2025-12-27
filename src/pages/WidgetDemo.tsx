import React from 'react';
import { WidgetLauncher } from '../components/widget/WidgetLauncher';

export const WidgetDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lc-gray-50 to-lc-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-lc-gray-900 mb-4">
            LiveChat Widget Demo
          </h1>
          <p className="text-lg text-lc-gray-600">
            Click the chat button in the bottom right corner to start a conversation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-lc-gray-900 mb-4">
            Welcome to our website!
          </h2>
          <p className="text-lc-gray-700 mb-4">
            This is a demo page showing how the LiveChat widget appears on your website.
            The widget is fully functional and ready to help your visitors.
          </p>
          <p className="text-lc-gray-700">
            Our support team is available 24/7 to answer any questions you might have.
            Don't hesitate to reach out!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="w-12 h-12 bg-lc-orange-light rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-lc-gray-900 mb-2">Fast Response</h3>
            <p className="text-sm text-lc-gray-600">
              Get answers in under 2 minutes from our support team
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="w-12 h-12 bg-lc-orange-light rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-semibold text-lc-gray-900 mb-2">Easy to Use</h3>
            <p className="text-sm text-lc-gray-600">
              Simple and intuitive chat interface for seamless communication
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="w-12 h-12 bg-lc-orange-light rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-lc-gray-900 mb-2">Always Available</h3>
            <p className="text-sm text-lc-gray-600">
              24/7 support to help you whenever you need assistance
            </p>
          </div>
        </div>
      </div>

      <WidgetLauncher unreadCount={0} />
    </div>
  );
};
