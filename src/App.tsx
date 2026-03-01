import './App.css';
import BottomBar from './components/BottomBar/BottomBar';
import SearchPage from './pages/SearchPage/SearchPage';
import RoomDetailsPage from './pages/RoomDetailsPage/RoomDetailsPage';
import FilterPage from './pages/FilterPage/FilterPage';
import BookingsPage from './pages/BookingsPage/BookingsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ReservationFlowPage from './pages/ReservationFlowPage/ReservationFlowPage';
import MessagesListPage from './pages/MessagesListPage/MessagesListPage';
import ChatRoomPage from './pages/ChatRoomPage/ChatRoomPage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';


function App() {
  const location = useLocation();
  const hideBottomBar = location.pathname.startsWith('/room/') || location.pathname === '/recap' || location.pathname.match(/^\/messages\/[^/]+$/);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/room/:id" element={<RoomDetailsPage />} />
        <Route path="/recap" element={<ReservationFlowPage />} />

        <Route path="/filter" element={<FilterPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/messages" element={<MessagesListPage />} />
        <Route path="/messages/:chatId" element={<ChatRoomPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {!hideBottomBar && <BottomBar />}
    </div>
  );
}

const WrappedApp = () => (
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

export default WrappedApp;
