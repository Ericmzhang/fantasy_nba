import React, { useState, useEffect, useRef } from "react";


function Dropdown({ players, onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const filteredPlayers = players.filter(player =>
    player.DISPLAY_FIRST_LAST.toLowerCase().includes(search.toLowerCase())
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
      className="absolute z-50 bg-white border rounded shadow-lg w-[300px] max-h-96 overflow-y-auto"
      style={{ top: '100%', left: 0 }}
    >
      <input
        type="text"
        placeholder="Search players..."
        className="w-full p-2 border-b"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredPlayers.map((player, idx) => {
        const imgUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.PERSON_ID}.png`;
        return (
          <div
            key={idx}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onSelect(player);
              onClose();
            }}
          >
            <img
              src={imgUrl}
              alt={player.DISPLAY_FIRST_LAST}
              className="w-10 h-10 object-cover rounded"
            />
            <span>{player.DISPLAY_FIRST_LAST}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Dropdown;
