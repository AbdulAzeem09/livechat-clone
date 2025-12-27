# LiveChat Clone - Premium Support Chat

A pixel-perfect recreation of LiveChat.com with exact design specifications. This is a full-featured customer support chat application with both a dashboard for agents and an embeddable widget for visitors.

![Dashboard Screenshot](https://github.com/user-attachments/assets/8854fe44-a13b-434d-b2b8-96b07122256c)

## ✨ Features

### 🎨 Dashboard (Agent Interface)
- **Exact LiveChat.com Design** - Pixel-perfect recreation with the signature #FF5100 orange
- **3-Panel Layout**:
  - Left: Conversation list (280px) with search and filters
  - Center: Active chat window with full messaging capabilities
  - Right: Visitor details panel (320px) with comprehensive visitor information
- **Top Navigation Bar** with status selector, notifications, and user menu
- **Real-time Chat Interface** with typing indicators and message status
- **Visitor Information** including location, browser, OS, and current page
- **Notes & Tags** for organizing customer interactions
- **Responsive Design** that adapts to mobile, tablet, and desktop

### 💬 Widget (Visitor Interface)
- **Floating Chat Button** with unread badge indicator
- **380x600px Chat Window** with smooth animations
- **Pre-chat Form** for collecting visitor information
- **Rating Form** for post-chat feedback
- **Gradient Header** with agent information and status
- **Message Bubbles** with timestamps
- **Mobile-Optimized** interface

![Widget Screenshot](https://github.com/user-attachments/assets/79c23d65-eb1c-41ca-ad0a-a426b4d42856)

## 🎨 Design System

### Color Palette (Exact LiveChat Colors)
```css
/* Primary Colors */
--lc-orange: #FF5100;           /* LiveChat signature orange */
--lc-orange-hover: #E64900;
--lc-orange-light: #FFF4F0;

/* Grays */
--lc-gray-900: #1B1B1B;         /* Darkest text */
--lc-gray-800: #2D2D2D;
--lc-gray-700: #424242;
--lc-gray-600: #5C5C5C;
--lc-gray-500: #767676;
--lc-gray-400: #9E9E9E;
--lc-gray-300: #BDBDBD;
--lc-gray-200: #E0E0E0;
--lc-gray-100: #F5F5F5;
--lc-gray-50: #FAFAFA;

/* Status Colors */
--lc-green: #4CAF50;            /* Online/Success */
--lc-yellow: #FFC107;           /* Away/Warning */
--lc-red: #F44336;              /* Busy/Error */
--lc-blue: #2196F3;             /* Info/Links */
```

### Typography
- **Font Family**: Source Sans Pro
- **Font Sizes**: 11px - 32px
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AbdulAzeem09/livechat-clone.git
cd livechat-clone
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
- Dashboard: http://localhost:5173/dashboard
- Widget Demo: http://localhost:5173/widget-demo

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/          # Agent dashboard components
│   │   ├── TopNav.tsx     # Navigation bar with status selector
│   │   ├── ConversationList.tsx  # Left sidebar with chat list
│   │   ├── ChatWindow.tsx        # Main chat area
│   │   └── VisitorDetails.tsx    # Right sidebar with visitor info
│   ├── widget/             # Visitor widget components
│   │   ├── WidgetLauncher.tsx    # Floating chat button
│   │   ├── ChatWidget.tsx        # Widget chat window
│   │   ├── PreChatForm.tsx       # Pre-chat form
│   │   └── RatingForm.tsx        # Post-chat rating
│   └── shared/             # Reusable components
│       ├── Avatar.tsx
│       ├── Button.tsx
│       └── IconButton.tsx
├── pages/
│   ├── Dashboard.tsx       # Main dashboard page
│   └── WidgetDemo.tsx     # Widget demonstration page
├── types/
│   └── index.ts           # TypeScript type definitions
├── utils/
│   └── mockData.ts        # Mock data for development
└── index.css              # Global styles with Tailwind
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Socket.io Client** - Real-time communication (ready for backend integration)

## 🎯 Key Features Implementation

### Dashboard Components

#### Top Navigation
- LiveChat logo with orange branding
- Navigation tabs (Chats, Traffic, Archives, Reports, Settings)
- Status selector (Online, Away, Busy, Offline)
- Notification bell with indicator
- User avatar with dropdown

#### Conversation List
- Search functionality
- Filter tabs (All, My chats, Unassigned, Queued)
- Conversation items with:
  - Visitor avatar
  - Name and message preview
  - Timestamp
  - Status indicator
  - Unread count badge

#### Chat Window
- Visitor information header
- Action buttons (Call, Video, More, Resolve)
- Message bubbles (agent and visitor)
- Typing indicator
- Message input with emoji, attachments, and canned responses

#### Visitor Details
- Visitor profile section
- Collapsible sections:
  - Details (location, browser, OS, time, page)
  - Notes (editable)
  - Tags (with add/remove)
  - Previous chats history

### Widget Components

#### Launcher Button
- Fixed position (bottom-right)
- Orange gradient with shadow
- Unread count badge
- Hover and click animations

#### Chat Window
- Gradient header with agent info
- Message area with smooth scroll
- Input field with rounded design
- "Powered by LiveChat" footer
- Smooth slide-up animation

## 🎨 Animations

- **Slide Up**: Widget opening (0.3s ease-out)
- **Fade In Up**: Message appearance (0.2s ease-out)
- **Typing Dots**: 3-dot animation for typing indicator
- **Hover Effects**: Subtle transitions on interactive elements

## 📱 Responsive Design

- **Desktop (>1024px)**: Full 3-panel layout
- **Tablet (768-1024px)**: 2-panel (hides visitor details)
- **Mobile (<768px)**: Single panel with navigation

## 🔮 Future Enhancements

- [ ] Real-time WebSocket integration
- [ ] User authentication
- [ ] File upload and sharing
- [ ] Emoji picker
- [ ] Canned responses library
- [ ] Chat history persistence
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced analytics
- [ ] Email notifications

## 📝 License

This project is for educational purposes.

## 👨‍💻 Author

**Abdul Azeem**
- GitHub: [@AbdulAzeem09](https://github.com/AbdulAzeem09)

## 🙏 Acknowledgments

- Design inspiration from [LiveChat.com](https://www.livechat.com)
- Icons by [Lucide](https://lucide.dev)
- Avatars by [DiceBear](https://dicebear.com)
