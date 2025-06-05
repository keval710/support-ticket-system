import { type ReactNode } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

interface RouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: RouteProps) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: RouteProps) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children;
};

const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;