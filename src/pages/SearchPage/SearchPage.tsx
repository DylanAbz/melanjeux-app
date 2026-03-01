import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchPage.css';
import { SearchBar } from "../../components/SearchBar/SearchBar.tsx";
import FilterButton from "../../components/FilterButton/FilterButton.tsx";
import BottomSheetBar from "../../components/BottomSheetBar/BottomSheetBar.tsx";
import FilterPage from '../FilterPage/FilterPage.tsx';
import RoomCard from "../../components/RoomCard/RoomCard.tsx";
import Toast from "../../components/Toast/Toast.tsx";
import type { Filters, Room } from "../../types.ts";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [filters, setFilters] = useState<Filters>({
      locations: [],
      themes: [],
      accessibility: false,
      dates: [],
      playerCount: 0,
  });

  useEffect(() => {
    if ((location.state as any)?.showCancelSuccess) {
        setShowToast(true);
        // Clear state to avoid showing toast again on refresh
        // Delay slightly to ensure state is caught but cleaned
        const timer = setTimeout(() => {
            navigate(location.pathname, { replace: true, state: {} });
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/rooms');
        if (!response.ok) throw new Error('Failed to fetch rooms');
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError('Erreur lors du chargement des salles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleApplyFilters = (newFilters: Filters) => {
      setFilters(newFilters);
      console.log("Filters applied:", newFilters);
  };

  const handleOpenFilters = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFilterOpen(false);
  };

  const calculateActiveFilters = (f: Filters): number => {
      let count = 0;
      if (f.locations.length > 0) count++;
      if (f.themes.length > 0) count++;
      if (f.accessibility) count++;
      if (f.dates.length > 0) count++;
      if (f.playerCount > 0) count++;
      return count;
  };

  const activeFilterCount = calculateActiveFilters(filters);

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1 className="search-page-title">
          <span>Trouvez votre prochaine mission</span>
        </h1>
        <div className="search-options">
          <SearchBar
            className={"searchbar"}
            placeholder={"Rechercher"}
            autoFocus={false}
            onChange={(value) => {
              console.log(value);
            }}
          />
          <FilterButton onClick={handleOpenFilters} filterCount={activeFilterCount} />
        </div>
      </div>
      <div className="room-card-list-container">
        {loading && <p>Chargement des salles...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && rooms.length === 0 && <p>Aucune salle trouvée.</p>}
        {!loading && !error && rooms.map((room) => (
          <RoomCard
            key={room.id}
            imageUrl={room.image}
            title={room.title}
            subtitle={room.escapeGame.nom}
            location={room.escapeGame.adresse}
            roomId={room.id}
          />
        ))}
      </div>
      <BottomSheetBar
        isOpen={isFilterOpen}
        onClose={handleCloseFilters}
        title="Filtrer"
      >
        <FilterPage
          initialFilters={filters}
          onApplyFilters={handleApplyFilters}
          isOpen={isFilterOpen}
        />
      </BottomSheetBar>

      <Toast 
        message="Vous avez quitté la session avec succès" 
        show={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};

export default SearchPage;

