// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from './components/Auth';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "./context/ThemeContext"
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageSkills from './pages/Admin/ManageSkills';
import ManageTrails from './pages/Admin/ManageTrails';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import SkillSelector from './components/Employee/SkillSelector';
import MyTrails from './components/Employee/MyTrails';
import VerifyProgress from './pages/Admin/VerifyProgress';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={<PrivateRoute element={<Dashboard />} allowedRoles={['ADMIN', 'EMPLOYEE']} />}
            />
            <Route
              path="/admin"
              element={<PrivateRoute element={<AdminDashboard />} allowedRoles={['ADMIN']} />}
            >
              <Route path="users" element={<ManageUsers />} />
              <Route path="skills" element={<ManageSkills />} />
              <Route path="trails" element={<ManageTrails />} />
              <Route path="progress" element={<VerifyProgress />} />
            </Route>
            <Route
              path="/employee"
              element={<PrivateRoute element={<EmployeeDashboard />} allowedRoles={['EMPLOYEE']} />}
            >
              <Route path="skills" element={<SkillSelector />} />
              <Route path="trails" element={<MyTrails />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
