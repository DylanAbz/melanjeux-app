import './App.css';
import BottomBar from './components/BottomBar/BottomBar';
import Sidebar from './components/Sidebar/Sidebar';
import SearchPage from './pages/SearchPage/SearchPage';
import RoomDetailsPage from './pages/RoomDetailsPage/RoomDetailsPage';
import FilterPage from './pages/FilterPage/FilterPage';
import BookingsPage from './pages/BookingsPage/BookingsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import EditName from './pages/EditProfilePage/EditName';
import EditBirthDate from './pages/EditProfilePage/EditBirthDate';
import EditCity from './pages/EditProfilePage/EditCity';
import ReservationFlowPage from './pages/ReservationFlowPage/ReservationFlowPage';
import MessagesListPage from './pages/MessagesListPage/MessagesListPage';
import ChatRoomPage from './pages/ChatRoomPage/ChatRoomPage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchBar } from './components/SearchBar/SearchBar';
import FilterButton from './components/FilterButton/FilterButton';

const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Recherche';
    if (pathname === '/bookings') return 'Réservations';
    if (pathname === '/messages') return 'Messages';
    if (pathname === '/profile') return 'Mon Compte';
    if (pathname.startsWith('/room/')) return 'Détails de la salle';
    return 'Mélanjeux';
};

function App() {
  const location = useLocation();
  const hideBottomBar = location.pathname.startsWith('/room/') || 
                       location.pathname === '/recap' || 
                       location.pathname.match(/^\/messages\/[^/]+$/) ||
                       location.pathname.startsWith('/profile/edit');

  return (
    <div className="App">
      {/* Layout Desktop Header - hidden on mobile via CSS */}
      <header className="desktop-layout-header">
        <div className="orange-search-bar">
          <div className="desktop-search-wrapper">
             {location.pathname === '/recap' ? (
                <h1 className="desktop-page-title">Réserver</h1>
             ) : (
                <>
                  <SearchBar placeholder="Rechercher une salle" />
                  <FilterButton onClick={() => {}} filterCount={0} />
                </>
             )}
          </div>
        </div>
      </header>

      <div className="app-body-layout">
        <Sidebar />
        <main className="main-content-layout">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/room/:id" element={<RoomDetailsPage />} />
            <Route path="/recap" element={<ReservationFlowPage />} />

            <Route path="/filter" element={<FilterPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/messages" element={<MessagesListPage />} />
            <Route path="/messages/:chatId" element={<ChatRoomPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/edit/name" element={<EditName />} />
            <Route path="/profile/edit/birthdate" element={<EditBirthDate />} />
            <Route path="/profile/edit/city" element={<EditCity />} />
          </Routes>
        </main>
      </div>

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
