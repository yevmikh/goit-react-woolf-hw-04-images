import React, { useState } from 'react';
import moduleCss from './searchBar.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Searchbar = ({ currentQuery, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = event => {
    setInputValue(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const trimmedQuery = inputValue.trim();

    if (trimmedQuery === currentQuery) {
      toast.info('You are currently searching this.');
    } else if (trimmedQuery) {
      onSubmit(trimmedQuery);
      setInputValue('');
    }
  };

  return (
    <header className={moduleCss.searchbar}>
      <form className={moduleCss.form} onSubmit={handleSubmit}>
        <button type="submit" className={moduleCss.buttonSearch}>
          <span className={moduleCss.buttonSearchLabel}>
            <svg viewBox="0 0 1024 1024">
              <path
                d="M848.471 928l-263.059-263.059c-48.941
            36.706-110.118 55.059-177.412 55.059-171.294
            0-312-140.706-312-312s140.706-312 312-312c171.294
            0 312 140.706 312 312 0 67.294-24.471 128.471-55.059
            177.412l263.059 263.059-79.529 79.529zM189.623 408.078c0
            121.364 97.091 218.455 218.455 218.455s218.455-97.091
            218.455-218.455c0-121.364-103.159-218.455-218.455-218.455-121.364
            0-218.455 97.091-218.455 218.455z"
              ></path>
            </svg>
          </span>
        </button>
        <input
          className={moduleCss.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={inputValue}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};

export default Searchbar;
