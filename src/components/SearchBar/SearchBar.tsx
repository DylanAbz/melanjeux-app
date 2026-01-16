import searchIcon from "/public/search.svg";
import debounce from "lodash.debounce";
import "./SearchBar.css";
import React, { useState, useMemo } from "react";


type SearchBarProps = {
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    className?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({
                                                        value,
                                                        onChange,
                                                        onSubmit,
                                                        placeholder = "Rechercher",
                                                        autoFocus = false,
                                                        className = "",
                                                    }) => {
    const [internalValue, setInternalValue] = useState(value ?? "");

    const debouncedOnChange = useMemo(
        () =>
            debounce((term: string) => {
                onChange?.(term);
            }, 300),
        [onChange]
    );

    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        if (value === undefined) {
            setInternalValue(next);
        }
        debouncedOnChange(next);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        debouncedOnChange.flush();
        onSubmit?.(currentValue);
    };

    const handleClear = () => {
        if (value === undefined) {
            setInternalValue("");
        }
        debouncedOnChange("");
        onChange?.("");
    };

    return (
        <form
            role="search"
            className={`searchbar ${className}`}
            onSubmit={handleSubmit}
        >

            <div className="searchbar__wrapper">
                <img src={searchIcon} alt="Search Icon" className="searchbar__icon" />
                <input
                    id="search-input"
                    type="search"
                    className="searchbar__input"
                    value={currentValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                />

                {currentValue && (
                    <button
                        type="button"
                        className="searchbar__clear"
                        onClick={handleClear}
                        aria-label="Effacer la recherche"
                    >
                        ×
                    </button>
                )}
            </div>
        </form>
    );
};
