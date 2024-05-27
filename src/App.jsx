import React, { useEffect, useState } from 'react';
import Card from './components/Card.jsx';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); 
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    const fetching = async () => {
      setLoading(true); 
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${search}&page=${page}`);
        const data = await response.json();
        setTimeout(() => { 
          if (data.results) {
            setCharacters(data.results);
            setTotalPages(data.info.pages); 
            setErrorMessage(""); 
          } else {
            setCharacters([]);
            setErrorMessage(`No se encontraron personajes con el nombre "${search}". Quizá quieras ver a: ${suggestions.join(", ")}`);
          }
          setLoading(false); 
        }, 400); 
      } catch (error) {
        setTimeout(() => {
          setCharacters([]);
          setErrorMessage(`Error al buscar personajes: ${error.message}`);
          setLoading(false); 
        }, 200); 
      }
    };
    fetching();
  }, [search, page]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 0) {
      fetchSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setPage(1); 
  };

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const fetchSuggestions = async (value) => {
    const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${value}`);
    const data = await response.json();
    if (data.results) {
      const limitedSuggestions = data.results.slice(0, 3).map(character => character.name);
      setSuggestions(limitedSuggestions);
    } else {
      setSuggestions([]);
    }
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault(); 
      setHighlightedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); 
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === 'Enter' && highlightedIndex !== -1) {
      setSearch(suggestions[highlightedIndex]);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
  };

  const renderPageButtons = () => {
    const pageNumbers = [];
    const maxPageDisplay = 4;
    const startPage = Math.max(1, page - Math.floor(maxPageDisplay / 2));
    const endPage = Math.min(totalPages, startPage + maxPageDisplay - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`page-btn ${page === i ? 'active' : ''}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div>
      <div className='header-container'>
        <img className='logo' src="./images/log.webp" alt="" />
        <img className='banner-img' src="./images/banner.png" alt="" />
        <div className='Search'>
          <div className='writter'>
            <input 
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              value={search}
              placeholder='Search Character'
            />
            <button className="search-btn" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((name, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleSuggestionClick(name)}
                    className={index === highlightedIndex ? 'highlighted' : ''}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className='navbar'>
        <div className='btn-baground'>
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            className='back-btn'
          >
            <i className="fas fa-arrow-circle-left"> </i> Back
          </button>
          <div className="page-buttons">
            {renderPageButtons()}
          </div>
          <button
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            className='next-btn'
          >
            Next <i className="fas fa-arrow-circle-right"></i>
          </button>
        </div>
      </div>

      {loading ? ( 
        <div className='loading'>
        <p> Loading</p>
        <img src="./images/loading.png" alt="" />
        </div>
  
      ) : errorMessage ? (

        <div className='error-message'>{errorMessage}</div>
       
      ) : (
        <Card characters={characters} search={search}></Card> 
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <img src="./images/logo.png" alt="" />
            <p>StalyinDev</p>
          </div>
          <div className="footer-right">
            <div className='footer-links'>
              <h4>Rick and Morty</h4>
              <a href="https://rickandmortyapi.com/" target="_blank" rel="noopener noreferrer">Api</a>
              <a href="https://www.freepnglogos.com/pics/rick-and-morty#google_vignette" target="_blank" rel="noopener noreferrer">Images</a>
            </div>
            <div className='code-share'>
              <h4>Open Source</h4>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
          <div className="social-icons">
            <a href="https://www.facebook.com/Stalyin" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://github.com/Stalyin" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/Stalyin" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://wa.me/+593963313195" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
