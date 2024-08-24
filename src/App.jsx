import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./App.css";
import "./index.css";
import Signon from "./components/Signon";
import Dashboard from "./components/Dashboard";
import ToDo from "./components/ToDo/ToDo";
import Mood from "./components//Mood/Mood";
import Photos from "./components/PhotoJournal/Photos";
import Goals from "./components/Goals/Goals";
import Settings from "./components/Settings/Settings";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('jwtToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/signin" element={<Signon />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/todos" element={
            <ProtectedRoute>
              <ToDo />
            </ProtectedRoute>
          } />
          <Route path="/mood" element={
            <ProtectedRoute>
              <Mood />
            </ProtectedRoute>
          } />
          <Route path="/photos" element={
            <ProtectedRoute>
              <Photos />
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;