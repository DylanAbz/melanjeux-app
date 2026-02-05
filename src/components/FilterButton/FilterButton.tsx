import React from 'react';
import './FilterButton.css';

interface FilterButtonProps {
  onClick: () => void;
  filterCount?: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, filterCount }) => {
  return (
    <button className="filter-button" onClick={onClick}>
      <img src="/filter.svg" alt="Filtres" />
      {filterCount > 0 && (
        <span className="filter-badge">{filterCount}</span>
      )}
    </button>
  );
};

export default FilterButton;
