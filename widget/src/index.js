import React from 'react';
import ReactDOM from 'react-dom/client';
import Widget from './Widget';

function init(config = {}) {
  const container = document.createElement('div');
  container.id = 'livechat-widget-root';
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(<Widget apiUrl={config.apiUrl} />);
}

if (typeof window !== 'undefined') {
  window.LiveChatWidget = { init };
}

export default { init };
