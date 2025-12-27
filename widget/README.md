# LiveChat Widget

Embeddable chat widget for the LiveChat Clone application.

> 📖 **New to this project?** Check out the main setup guides:
> - [Complete Setup Guide](../SETUP.md) - Step-by-step installation
> - [Urdu Guide](../RUNNING_UR.md) - اردو میں گائیڈ
> - [Quick Start](../QUICKSTART.md) - Get started in 5 minutes
> - [Command Cheatsheet](../CHEATSHEET.md) - Quick reference

## Features

- Floating chat button with gradient design (60x60px)
- Responsive chat window (380x600px on desktop)
- Pre-chat form for visitor information
- Real-time messaging with Socket.io
- Typing indicators
- Unread message counter
- Sound notifications
- Post-chat rating system
- Mobile-responsive design
- Auto-reconnect on disconnect
- Customizable colors and branding

## Quick Start

### Prerequisites

- Node.js 18+
- Backend API running on port 5000

### Build the Widget

1. Install dependencies:
```bash
npm install
```

2. Build the widget bundle:
```bash
npm run build
```

This creates `dist/widget.js` and `dist/widget.css`.

### Integration

Add the widget to any website:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="path/to/widget.css">
</head>
<body>
    <!-- Your website content -->
    
    <script src="path/to/widget.js"></script>
    <script>
        LiveChatWidget.init({
            apiUrl: 'http://localhost:5000',
            primaryColor: '#FF5100',
            position: 'bottom-right'
        });
    </script>
</body>
</html>
```

### Testing

Open `demo.html` in your browser to test the widget:

```bash
# After building
open demo.html
# OR
npx serve .
```

## Configuration Options

```javascript
LiveChatWidget.init({
    // Required
    apiUrl: 'http://localhost:5000',           // Backend API URL
    
    // Optional
    primaryColor: '#FF5100',                   // Widget theme color
    position: 'bottom-right',                  // 'bottom-right' or 'bottom-left'
    offsetX: 20,                               // Distance from edge (px)
    offsetY: 20,                               // Distance from bottom (px)
    greeting: 'Hi! How can we help you?',      // Initial greeting message
    requireEmail: true,                        // Require email in pre-chat form
    soundEnabled: true,                        // Enable sound notifications
    autoOpen: false,                           // Auto-open chat on page load
    hiddenFields: {                            // Hidden form fields to track
        page: window.location.href,
        referrer: document.referrer
    }
});
```

## Available Scripts

- `npm run build` - Build production bundle
- `npm run dev` - Start development mode with watch
- `npm run watch` - Watch for changes and rebuild

## Project Structure

```
widget/
├── src/
│   ├── Widget.jsx        # Main widget component
│   ├── index.js          # Entry point and initialization
│   └── styles.css        # Widget styles
├── dist/                 # Build output (generated)
│   ├── widget.js        # Compiled JavaScript bundle
│   └── widget.css       # Compiled CSS
├── demo.html             # Demo page for testing
├── package.json
└── webpack.config.js     # Webpack configuration
```

## Customization

### Styling

Edit `src/styles.css` to customize the widget appearance. Main classes:

- `.livechat-button` - Floating chat button
- `.livechat-window` - Chat window container
- `.livechat-header` - Window header
- `.livechat-messages` - Message list container
- `.livechat-input` - Message input area

### Branding

Change colors via configuration:

```javascript
LiveChatWidget.init({
    apiUrl: 'http://localhost:5000',
    primaryColor: '#yourcolor',
    headerText: 'Your Company Name'
});
```

## Advanced Usage

### API Methods

After initialization, access widget methods:

```javascript
// Open chat window
LiveChatWidget.open();

// Close chat window
LiveChatWidget.close();

// Toggle chat window
LiveChatWidget.toggle();

// Send a message programmatically
LiveChatWidget.sendMessage('Hello!');

// Set visitor data
LiveChatWidget.setVisitorData({
    name: 'John Doe',
    email: 'john@example.com',
    customField: 'value'
});

// Listen to events
LiveChatWidget.on('message', (message) => {
    console.log('New message:', message);
});

LiveChatWidget.on('ready', () => {
    console.log('Widget is ready');
});
```

### Events

The widget emits the following events:

- `ready` - Widget initialized and ready
- `open` - Chat window opened
- `close` - Chat window closed
- `message` - New message received
- `typing` - Agent is typing
- `connected` - Connected to server
- `disconnected` - Disconnected from server

## Building for Production

1. Build the widget:
```bash
npm run build
```

2. Upload `dist/widget.js` and `dist/widget.css` to your CDN or web server

3. Update your website integration to use production URLs:
```html
<link rel="stylesheet" href="https://your-cdn.com/widget.css">
<script src="https://your-cdn.com/widget.js"></script>
```

## CDN Deployment

### Using GitHub Pages

1. Build the widget
2. Push `dist/` to a `gh-pages` branch
3. Enable GitHub Pages in repository settings
4. Access at: `https://username.github.io/repo/widget.js`

### Using jsDelivr

After pushing to GitHub:
```html
<script src="https://cdn.jsdelivr.net/gh/username/repo@version/dist/widget.js"></script>
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Bundle size: ~50KB (minified + gzipped)
- Initial load time: < 100ms
- Memory usage: < 5MB
- WebSocket connection for real-time updates

## Security

- HTTPS recommended for production
- CORS configured on backend
- No sensitive data stored in widget
- Messages encrypted in transit
- XSS protection enabled

## Troubleshooting

### Widget not loading

1. Check console for errors
2. Verify API URL is correct
3. Ensure backend is running
4. Check CORS settings

### Connection issues

1. Verify Socket.io server is running
2. Check firewall settings
3. Ensure WebSocket protocol is supported
4. Check browser console for errors

### Styling conflicts

Add namespace to prevent CSS conflicts:

```css
.livechat-widget * {
    all: initial;
    font-family: inherit;
}
```

## Development

### Watch Mode

```bash
npm run dev
```

This watches for changes and rebuilds automatically.

### Testing Changes

1. Make changes to `src/Widget.jsx` or `src/styles.css`
2. Widget rebuilds automatically in watch mode
3. Refresh `demo.html` to see changes

## Need Help?

- Check the [main documentation](../README.md)
- Review [setup guide](../SETUP.md)
- See [API documentation](../README.md#-rest-api-endpoints)
- Report issues on GitHub

---

Built with React, Socket.io-client, and Webpack
