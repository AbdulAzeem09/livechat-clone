// LiveChat Widget - Embeddable chat widget
(function() {
  'use strict';

  class LiveChatWidget {
    constructor(config) {
      this.config = {
        apiUrl: config.apiUrl || 'http://localhost:5000',
        position: config.position || 'bottom-right',
        primaryColor: config.primaryColor || '#4F46E5',
        ...config
      };
      this.isOpen = false;
      this.init();
    }

    init() {
      this.createWidget();
      this.attachEventListeners();
    }

    createWidget() {
      // Create widget container
      const container = document.createElement('div');
      container.id = 'livechat-widget';
      container.innerHTML = `
        <style>
          #livechat-widget {
            position: fixed;
            ${this.config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
            ${this.config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            z-index: 9999;
          }
          .livechat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: ${this.config.primaryColor};
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          }
          .livechat-window {
            display: none;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 40px rgba(0,0,0,0.16);
            margin-bottom: 10px;
          }
          .livechat-window.open {
            display: block;
          }
        </style>
        <div class="livechat-window">
          <div style="padding: 20px; text-align: center;">
            <h3>LiveChat Widget</h3>
            <p>Chat with us!</p>
          </div>
        </div>
        <button class="livechat-button">💬</button>
      `;
      document.body.appendChild(container);
    }

    attachEventListeners() {
      const button = document.querySelector('.livechat-button');
      const window = document.querySelector('.livechat-window');
      
      if (!button || !window) {
        console.error('LiveChat Widget: Could not find widget elements');
        return;
      }
      
      button.addEventListener('click', () => {
        this.isOpen = !this.isOpen;
        window.classList.toggle('open');
      });
    }
  }

  // Make it globally available
  window.LiveChatWidget = LiveChatWidget;

  // Auto-initialize if config is present
  if (window.liveChatConfig) {
    new LiveChatWidget(window.liveChatConfig);
  }
})();
