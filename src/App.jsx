import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./index.css";
import Signon from "./components/Signon";
import Dashboard from "./components/Dashboard";
import ToDo from "./components/ToDo/ToDo";
import Mood from "./components//Mood/Mood";
import Photos from "./components/PhotoJournal/Photos";
import Goals from "./components/Goals/Goals";
import Settings from "./components/Settings/Settings";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signon />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/todos" element={<ToDo />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
