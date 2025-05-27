import React, { useState, useEffect, useRef } from "react";
import playerData from '@/data/player_data_prices.json'

function Dropdown({ players, onSelect, onClose, positionAbove }) {
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const filteredPlayers = players.filter(player_id => {
    return playerData[player_id].DISPLAY_FIRST_LAST.toLowerCase().includes(search.toLowerCase());
    } 
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <div
      ref={dropdownRef}
      className="absolute z-[999] bg-white border rounded shadow-lg w-[300px] max-h-96 overflow-y-auto"
      style={{ 
        top: positionAbove ? 'auto' : '100%', 
        bottom: positionAbove ? '100%' : 'auto', 
        left: 0 
      }}
    >
      <input
        type="text"
        placeholder="Search players..."
        className="w-full p-2 border-b"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredPlayers.map((player_id, idx) => {
        const imgUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerData[player_id].PERSON_ID}.png`;
        return (
          <div
            key={idx}
            className="flex items-center space-x-2 gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onSelect(player_id);
              onClose();
            }}
          >
            <div className="w-10 text-right">${playerData[player_id].PRICE}</div>
            <img
              src={imgUrl}
              alt={playerData[player_id].DISPLAY_FIRST_LAST}
              className="w-10 h-10 object-cover rounded"
            />
            <span>{playerData[player_id].DISPLAY_FIRST_LAST}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Dropdown;
