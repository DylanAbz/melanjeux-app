import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const filters: Filters = {
      locations: [],
      themes: [],
      accessibility: false,
      dates: [],
      playerCount: 0,
  };

  useEffect(() => {
    if ((location.state as any)?.showCancelSuccess) {
        setShowToast(true);
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
        const url = searchQuery 
          ? `${import.meta.env.VITE_BACKEND_URL}/rooms?search=${encodeURIComponent(searchQuery)}`
          : `${import.meta.env.VITE_BACKEND_URL}/rooms`;
          
        const response = await fetch(url);
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
  }, [searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

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
      {/* Header visible uniquement sur Mobile */}
      <div className="mobile-only-header">
        <h1 className="search-page-title">Trouvez votre prochaine mission</h1>
        <div className="search-options">
          <SearchBar 
            placeholder="Rechercher" 
            value={searchQuery}
            onChange={handleSearchChange} 
          />
          <FilterButton onClick={handleOpenFilters} filterCount={activeFilterCount} />
        </div>
      </div>

      <div className="search-content-scroll">
        {loading && <p className="loading-text">Chargement des salles...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && rooms.length > 0 && (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                imageUrl={room.image}
                title={room.title}
                subtitle={room.escapeGame.nom}
                location={room.escapeGame.adresse.split(',')[0]}
                roomId={room.id}
              />
            ))}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && <p className="loading-text">Aucune salle trouvée.</p>}
      </div>

      <BottomSheetBar isOpen={isFilterOpen} onClose={handleCloseFilters} title="Filtrer">
        <FilterPage />
      </BottomSheetBar>

      <Toast show={showToast} message="Session quittée avec succès" onClose={() => setShowToast(false)} />
    </div>
  );
};

export default SearchPage;
