import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CategoriesBar = ({ onSelectCategory }) => {
  const [types, setTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const typeResponse = await fetch('https://rickandmortyapi.com/api/character');
      const typeData = await typeResponse.json();
      const allTypes = Array.from(new Set(typeData.results.map(character => character.type)));
      setTypes(allTypes.filter(type => type !== ''));
      
      const genderResponse = await fetch('https://rickandmortyapi.com/api/character');
      const genderData = await genderResponse.json();
      const allGenders = Array.from(new Set(genderData.results.map(character => character.gender)));
      setGenders(allGenders.filter(gender => gender !== ''));

      const statusResponse = await fetch('https://rickandmortyapi.com/api/character');
      const statusData = await statusResponse.json();
      const allStatuses = Array.from(new Set(statusData.results.map(character => character.status)));
      setStatuses(allStatuses.filter(status => status !== ''));

      const locationResponse = await fetch('https://rickandmortyapi.com/api/location');
      const locationData = await locationResponse.json();
      setLocations(locationData.results.map(location => location.name));
    };

    fetchData();
  }, []);

  return (
    <div className="categories-bar">
      <select onChange={(e) => onSelectCategory('Type', e.target.value)}>
        <option value="">SELECT TYPE</option>
        {types.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
      <select onChange={(e) => onSelectCategory('Gender', e.target.value)}>
        <option value="">SELECT GENDER</option>
        {genders.map((gender, index) => (
          <option key={index} value={gender}>{gender}</option>
        ))}
      </select>
      <select onChange={(e) => onSelectCategory('Status', e.target.value)}>
        <option value="">SELECT STATUS</option>
        {statuses.map((status, index) => (
          <option key={index} value={status}>{status}</option>
        ))}
      </select>
      <select onChange={(e) => onSelectCategory('Location', e.target.value)}>
        <option value="">SELECT LOCATION</option>
        {locations.map((location, index) => (
          <option key={index} value={location}>{location}</option>
        ))}
      </select>
    </div>
  );
};

CategoriesBar.propTypes = {
  onSelectCategory: PropTypes.func.isRequired,
};

const Card = ({ characters, search }) => {
  const [filteredCharacters, setFilteredCharacters] = useState(characters);
  const [errorMessage, setErrorMessage] = useState(""); 

  const filterCharacters = async (category, value) => {
    let filtered = characters;
    if (value !== "") {
      if (category === 'Type') {
        filtered = characters.filter(character => character.type === value);
      } else if (category === 'Gender') {
        filtered = characters.filter(character => character.gender === value);
      } else if (category === 'Status') {
        filtered = characters.filter(character => character.status === value);
      } else if (category === 'Location') {
        filtered = characters.filter(character => character.location && character.location.name === value);
      }
    }

   
    if (filtered.length === 0) {
      setErrorMessage(`No se encontraron personajes con la categoría "${category}" seleccionada.`);
    } else {
      setErrorMessage("");
    }

    setFilteredCharacters(filtered);
  };

  return (
    <div>
      <CategoriesBar onSelectCategory={filterCharacters} />
      <div className='cards'>
        {errorMessage ? (
          <div className='container'> 
          <div className='error-message2'>{errorMessage}</div> 
          </div> 

        ) : (
          filteredCharacters
            .filter((character) => character.name.toLowerCase().includes(search.toLowerCase()))
            .map((character, index) => (
              <div className="card-container" key={index}>
                <p className={`status-info ${character.status.toLowerCase()}`}>{character.status} </p>
                <img className="images" src={character.image} alt="" />

                <div className='new'>
                  <h1 className="card-title"> {character.name} </h1>

                  <div className='response-info'>
                  <p className='specie-info'> <span className='subtitle'>Specie:</span>    <span className='infos'> {character.species}</span></p>
                  <p className='gender-info'> <span className='subtitle'>Gender:</span>  <span className='infos'>{character.gender}</span> </p>
                  </div>

                  <p className='type-info'> <span className='subtitle'>Type:</span>    <span className='infos'>{character.type}</span> </p>
                  <p className='location-info'> <span className='subtitle'>Location:</span> <span className='infos'>{character.location ? character.location.name : 'Unknown'}</span> </p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  characters: PropTypes.array.isRequired,
  search: PropTypes.string.isRequired,
};

export default Card;
