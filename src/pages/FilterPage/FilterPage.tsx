import React, { useState, useEffect, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';
import 'react-datepicker/dist/react-datepicker.css';
import './FilterPage.css';
import Modal from '../../components/Modal/Modal';
import type { Filters } from '../../types';

registerLocale('fr', fr);

interface FilterPageProps {
    initialFilters: Filters;
    onApplyFilters: (filters: Filters) => void;
    isOpen: boolean;
}

const FilterPage: React.FC<FilterPageProps> = ({ initialFilters, onApplyFilters, isOpen }) => {
    // Local state to track changes without affecting the parent until "Apply"
    const [localFilters, setLocalFilters] = useState<Filters>(initialFilters);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const prevIsOpenRef = useRef<boolean>();
    useEffect(() => {
        // When the sheet is closing, apply the local filters to the parent state
        if (prevIsOpenRef.current && !isOpen) {
            onApplyFilters(localFilters);
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, localFilters, onApplyFilters]);

    // Handler for checkbox changes (locations, themes, accessibility)
    const handleCheckboxChange = (field: 'locations' | 'themes', value: string, isChecked: boolean) => {
        const currentValues = localFilters[field];
        const newValues = isChecked
            ? [...currentValues, value]
            : currentValues.filter(v => v !== value);
        setLocalFilters({ ...localFilters, [field]: newValues });
    };

    const handleAccessibilityChange = (isChecked: boolean) => {
        setLocalFilters({ ...localFilters, accessibility: isChecked });
    };

    // Handlers for player count
    const incrementPlayerCount = () => {
        setLocalFilters(prev => ({ ...prev, playerCount: prev.playerCount + 1 }));
    };
    const decrementPlayerCount = () => {
        setLocalFilters(prev => ({ ...prev, playerCount: prev.playerCount > 0 ? prev.playerCount - 1 : 0 }));
    };

    // Handlers for date selection
    const handleDateChange = (date: Date) => {
        if (!localFilters.dates.find(d => d.toDateString() === date.toDateString())) {
            const newDates = [...localFilters.dates, date].sort((a, b) => a.getTime() - b.getTime());
            setLocalFilters({ ...localFilters, dates: newDates });
        }
        setShowDatePicker(false);
    };

    const removeDate = (dateToRemove: Date) => {
        const newDates = localFilters.dates.filter(date => date !== dateToRemove);
        setLocalFilters({ ...localFilters, dates: newDates });
    };

    const locationOptions = ["Saint-Martin-d'Hères", 'Grenoble', 'Eybens', 'Gières'];
    const themeOptions = ['Horreur', 'Policier', 'Surnaturel', 'Espace', 'Pirate', 'Magie', 'Aventure', 'Histoire'];

    return (
        <div className="filter-page">
            <div className="filter-category">
                <h2 className="category-title">Salle</h2>
                <div className="filter-subcategory">
                    <h3 className="subcategory-title">Localisation</h3>
                    <div className="filter-options">
                        {locationOptions.map(location => (
                            <div key={location} className="filter-option">
                                <input
                                    type="checkbox"
                                    id={location}
                                    value={location}
                                    checked={localFilters.locations.includes(location)}
                                    onChange={(e) => handleCheckboxChange('locations', location, e.target.checked)}
                                />
                                <label htmlFor={location}>{location}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="filter-subcategory">
                    <h3 className="subcategory-title">Thème</h3>
                    <div className="filter-options">
                        {themeOptions.map(theme => (
                            <div key={theme} className="filter-option">
                                <input
                                    type="checkbox"
                                    id={theme}
                                    value={theme}
                                    checked={localFilters.themes.includes(theme)}
                                    onChange={(e) => handleCheckboxChange('themes', theme, e.target.checked)}
                                />
                                <label htmlFor={theme}>{theme}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="filter-subcategory">
                    <h3 className="subcategory-title">Accessibilité</h3>
                    <div className="filter-options">
                        <div className="filter-option">
                            <input
                                type="checkbox"
                                id="pmr"
                                value="pmr"
                                checked={localFilters.accessibility}
                                onChange={(e) => handleAccessibilityChange(e.target.checked)}
                            />
                            <label htmlFor="pmr">Accès PMR</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="separator"></div>

            <div className="filter-category">
                <h2 className="category-title">Session</h2>
                <div className="filter-subcategory">
                    <div className="filter-subcategory-header">
                        <h3 className="subcategory-title">Date</h3>
                        <button className="add-date-button" onClick={() => setShowDatePicker(true)} aria-label="Ajouter une date">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clipPath="url(#clip0_4404_1395)">
                                <path d="M9.09283 4.54596V13.6379" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M4.54688 9.09192H13.6388" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_4404_1395">
                                  <rect width="12.8579" height="12.8579" fill="white" transform="translate(0 9.09192) rotate(-45)"/>
                                </clipPath>
                              </defs>
                            </svg>
                        </button>
                    </div>
                    <div className="selected-dates-list">
                        {localFilters.dates.map(date => (
                            <div key={date.toISOString()} className="selected-date-item">
                                {date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                <button onClick={() => removeDate(date)} className="remove-date-btn">&times;</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="filter-subcategory">
                    <h3 className="subcategory-title">Nombre de joueurs pré-inscrits</h3>
                    <div className="player-counter">
                        <button onClick={decrementPlayerCount}>-</button>
                        <span>{localFilters.playerCount}</span>
                        <button onClick={incrementPlayerCount}>+</button>
                    </div>
                </div>
            </div>

            <Modal isOpen={showDatePicker} onClose={() => setShowDatePicker(false)}>
                <DatePicker
                    selected={null}
                    onChange={handleDateChange}
                    inline
                    locale="fr"
                    minDate={new Date()}
                />
            </Modal>
        </div>
    );
};

export default FilterPage;
