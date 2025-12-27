import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { WidgetDemo } from './pages/WidgetDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/widget-demo" element={<WidgetDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
