# 🚀 LiveChat Clone - چلانے کی مکمل گائیڈ

یہ گائیڈ آپ کو LiveChat Clone ایپلیکیشن کو اپنے کمپیوٹر پر چلانے میں مدد کرے گی۔

## 📋 فہرست
1. [ضروری چیزیں](#ضروری-چیزیں)
2. [انسٹالیشن](#انسٹالیشن)
3. [ایپلیکیشن چلانا](#ایپلیکیشن-چلانا)
4. [مسائل کا حل](#مسائل-کا-حل)

---

## ضروری چیزیں

شروع کرنے سے پہلے، یہ چیزیں آپ کے کمپیوٹر پر ہونی چاہیے:

### درکار سافٹویئر:
- **Node.js** (ورژن 18 یا اوپر) - [یہاں سے ڈاؤن لوڈ کریں](https://nodejs.org/)
- **MongoDB** (ورژن 4.4 یا اوپر) - [یہاں سے ڈاؤن لوڈ کریں](https://www.mongodb.com/try/download/community)
- **Git** - [یہاں سے ڈاؤن لوڈ کریں](https://git-scm.com/downloads)

### چیک کریں کہ یہ انسٹال ہیں:
```bash
node --version    # v18.x.x یا اوپر دکھانا چاہیے
npm --version     # 9.x.x یا اوپر دکھانا چاہیے
mongod --version  # 4.4 یا اوپر دکھانا چاہیے
git --version     # git version دکھانا چاہیے
```

---

## انسٹالیشن

### قدم 1: Repository کو Clone کریں

اپنا Terminal/Command Prompt کھولیں اور چلائیں:

```bash
git clone https://github.com/AbdulAzeem09/livechat-clone.git
cd livechat-clone
```

### قدم 2: MongoDB انسٹال کریں اور شروع کریں

#### Windows کے لیے:
1. https://www.mongodb.com/try/download/community سے MongoDB ڈاؤن لوڈ کریں
2. Default settings کے ساتھ انسٹال کریں
3. MongoDB خود بخود service کے طور پر شروع ہو جائے گا

#### macOS کے لیے (Homebrew استعمال کرتے ہوئے):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux کے لیے (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### قدم 3: Dependencies انسٹال کریں

Root directory میں یہ command چلائیں:

```bash
npm run install:all
```

یہ backend, dashboard, اور widget کے لیے تمام dependencies انسٹال کر دے گا۔

### قدم 4: Environment Variables سیٹ اپ کریں

#### Backend Setup:
```bash
cd backend
cp .env.example .env
```

`.env` فائل میں یہ ہونا چاہیے (local development کے لیے default values ٹھیک ہیں):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/livechat
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

#### Dashboard Setup:
```bash
cd ../dashboard
cp .env.example .env
```

`.env` فائل میں یہ ہونا چاہیے:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### قدم 5: Database کو Seed کریں (اختیاری لیکن تجویز کردہ)

یہ demo users اور sample data شامل کرے گا:

```bash
cd ../backend
npm run seed
```

Seeding کے بعد demo credentials:
- Email: demo@livechat.com
- Password: demo123

---

## ایپلیکیشن چلانا

آپ کو **تین الگ الگ Terminal windows** میں تین services چلانی ہیں:

### Terminal 1: Backend Server شروع کریں

```bash
# Root directory سے
cd backend
npm run dev
```

انتظار کریں: ✅ `Server running in development mode on port 5000`

### Terminal 2: Dashboard (React App) شروع کریں

```bash
# Root directory سے
cd dashboard
npm start
```

انتظار کریں: ✅ Dashboard خود بخود `http://localhost:3000` پر کھل جائے گا

### Terminal 3: Widget Build کریں (اختیاری)

```bash
# Root directory سے
cd widget
npm run build
```

یہ embeddable chat widget بنائے گا جو کسی بھی website میں شامل کیا جا سکتا ہے۔

---

## ٹیسٹنگ

### Dashboard ٹیسٹ کریں:

1. Browser کھولیں اور جائیں: `http://localhost:3000`
2. اگر database seed نہیں کیا تو "Register" پر کلک کریں
3. یا demo credentials سے login کریں:
   - Email: demo@livechat.com
   - Password: demo123

### API ٹیسٹ کریں:

```bash
# Health check
curl http://localhost:5000/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@livechat.com","password":"demo123"}'
```

### Widget ٹیسٹ کریں:

1. Widget build کرنے کے بعد، `widget/demo.html` کو اپنے browser میں کھولیں
2. نیچے دائیں کونے میں chat button پر کلک کریں
3. Conversation شروع کریں
4. یہ dashboard میں نظر آنا چاہیے!

---

## مسائل کا حل

### مسئلہ: Port 5000 پہلے سے استعمال میں ہے

**حل 1:** Port 5000 استعمال کرنے والے process کو بند کریں
```bash
# macOS/Linux پر:
lsof -ti:5000 | xargs kill -9

# Windows پر:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**حل 2:** `backend/.env` میں port تبدیل کریں
```
PORT=5001
```

اور `dashboard/.env` کو update کریں:
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_SOCKET_URL=http://localhost:5001
```

### مسئلہ: MongoDB سے connect نہیں ہو رہا

**چیک کریں کہ MongoDB چل رہا ہے:**
```bash
# macOS:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongodb

# Windows:
services.msc (MongoDB تلاش کریں)
```

**MongoDB شروع کریں اگر نہیں چل رہا:**
```bash
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongodb

# Windows: services.msc سے MongoDB service شروع کریں
```

### مسئلہ: Module not found errors

**حل:** Dependencies دوبارہ انسٹال کریں
```bash
# Root directory سے
npm run install:all
```

یا انفرادی طور پر انسٹال کریں:
```bash
cd backend && npm install
cd ../dashboard && npm install
cd ../widget && npm install
```

### مسئلہ: Dashboard شروع نہیں ہو رہا

**حل:** Cache صاف کریں اور دوبارہ انسٹال کریں
```bash
cd dashboard
rm -rf node_modules package-lock.json
npm install
npm start
```

### مسئلہ: Browser میں CORS errors

**حل:** چیک کریں کہ `backend/.env` میں صحیح CORS_ORIGIN ہے:
```
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

---

## متبادل: Docker استعمال کریں 🐳

اگر آپ کے پاس Docker ہے، تو سب کچھ ایک command سے چلائیں:

```bash
docker-compose up -d
```

یہ شروع کرے گا:
- MongoDB port 27017 پر
- Backend API port 5000 پر
- Dashboard port 3000 پر

Dashboard یہاں access کریں: http://localhost:3000

بند کرنے کے لیے:
```bash
docker-compose down
```

---

## فوری حوالہ

### مفید Commands:

```bash
# تمام dependencies انسٹال کریں
npm run install:all

# Backend شروع کریں
npm run dev:backend

# Dashboard شروع کریں
npm run dev:dashboard

# Widget build کریں
npm run build:widget

# Database seed کریں
cd backend && npm run seed

# MongoDB status چیک کریں
mongosh  # MongoDB shell کھولتا ہے
```

### اہم URLs:
- Dashboard: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health
- MongoDB: mongodb://localhost:27017

### Default Ports:
- Frontend Dashboard: 3000
- Backend API: 5000
- MongoDB: 27017

---

## اگلے قدم

Application کامیابی سے چلانے کے بعد:

1. ✅ Dashboard کی features دریافت کریں
2. ✅ Real-time chat functionality ٹیسٹ کریں
3. ✅ Demo page پر widget آزمائیں
4. ✅ [README.md](./README.md) میں مکمل documentation پڑھیں
5. ✅ [FEATURES.md](./FEATURES.md) میں advanced features چیک کریں

---

## مزید مدد چاہیے?

- 📖 مکمل documentation کے لیے [README.md](./README.md) پڑھیں
- 🚀 Quick tips کے لیے [QUICKSTART.md](./QUICKSTART.md) دیکھیں
- 🧪 Testing guides کے لیے [TESTING.md](./TESTING.md) دیکھیں
- 🏗️ System design کے لیے [ARCHITECTURE.md](./ARCHITECTURE.md) دیکھیں
- 🐛 [GitHub Issues](https://github.com/AbdulAzeem09/livechat-clone/issues) پر issues رپورٹ کریں

---

## English Quick Start

If you prefer English instructions, see [SETUP.md](./SETUP.md) for a detailed setup guide.

---

**خوش کوڈنگ! 🎉**

---

# English Translation / انگریزی ترجمہ

## How to Run This Application

This is a LiveChat Clone application with three components:
1. **Backend** - Node.js server with MongoDB
2. **Dashboard** - React application for agents
3. **Widget** - Embeddable chat widget

### Quick Steps:

1. **Install Requirements:**
   - Node.js 18+
   - MongoDB 4.4+

2. **Clone and Install:**
   ```bash
   git clone https://github.com/AbdulAzeem09/livechat-clone.git
   cd livechat-clone
   npm run install:all
   ```

3. **Setup Environment:**
   ```bash
   cd backend && cp .env.example .env
   cd ../dashboard && cp .env.example .env
   cd ../backend && npm run seed
   ```

4. **Run (3 separate terminals):**
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd dashboard && npm start
   
   # Terminal 3
   cd widget && npm run build
   ```

5. **Access:**
   - Dashboard: http://localhost:3000
   - Login: demo@livechat.com / demo123

For detailed instructions, see [SETUP.md](./SETUP.md)
