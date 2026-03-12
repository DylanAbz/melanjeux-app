import debounce from "lodash.debounce";
import "./SearchBar.css";
import React, {useState, useMemo, useEffect, type FormEvent, type ChangeEvent} from "react";
import {SearchIcon} from "../../../public/SearchIcon.tsx";


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

    // Sync internal value with prop value (e.g. when URL changes)
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    const debouncedOnChange = useMemo(
        () =>
            debounce((term: string) => {
                onChange?.(term);
            }, 500), // Increased to 500ms for better stability
        [onChange]
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setInternalValue(next); // Update UI immediately
        debouncedOnChange(next); // Debounce the URL/API update
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        debouncedOnChange.flush();
        onSubmit?.(internalValue);
    };

    const handleClear = () => {
        setInternalValue("");
        debouncedOnChange.cancel();
        onChange?.("");
    };

    return (
        <form
            role="search"
            className={`searchbar ${className}`}
            onSubmit={handleSubmit}
        >

            <div className="searchbar__wrapper">
                <span className="searchbar__icon">
                    <SearchIcon/>
                </span>
                <input
                    id="search-input"
                    type="search"
                    className="searchbar__input"
                    value={internalValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                />

                {internalValue && (
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

