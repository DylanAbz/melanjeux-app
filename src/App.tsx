import './App.css';
import BottomBar from './components/BottomBar/BottomBar';
import SearchPage from './pages/SearchPage/SearchPage';
import RoomDetailsPage from './pages/RoomDetailsPage/RoomDetailsPage';
import FilterPage from './pages/FilterPage/FilterPage';
import BookingsPage from './pages/BookingsPage/BookingsPage';
import MessagesPage from './pages/MessagesPage/MessagesPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation


function App() {
  const location = useLocation(); // Get current location
  const hideBottomBar = location.pathname.startsWith('/room/'); // Hide if path starts with /room/

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/room/:id" element={<RoomDetailsPage />} />

        <Route path="/filter" element={<FilterPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {!hideBottomBar && <BottomBar />}
    </div>
  );
}

const WrappedApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default WrappedApp;
