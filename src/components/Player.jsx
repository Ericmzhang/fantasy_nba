import playerData from '@/data/player_positions.json';
import { useState } from "react";
import Dropdown from './PlayerDropdown';
function Player({ top = "0%", left = "0%", width = 120, height = 150, position = "Guard", myPlayers, onSelectPlayer, ind }) {
  const [isClicked, setIsClicked] = useState(false);
  const players = playerData[position] || [];
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  let relevantIndices = [];

  if (position === "Guard") {
    relevantIndices = [1, 2, 6, 7, 11, 12];
  } 
  else if (position === "Forward") {
    relevantIndices = [3, 4, 8, 9, 13, 14];
  } 
  else if (position === "Center") {
    relevantIndices = [5, 10, 15];
  }

  const takenIds = relevantIndices
  .map(i => myPlayers[i]?.PERSON_ID)
  .filter(Boolean);

  const availablePlayers = players.filter(
    p => !takenIds.includes(p.PERSON_ID) || p.PERSON_ID === selectedPlayer?.PERSON_ID
  );

  function selectPlayer(player) {
      const prev_player = selectedPlayer ? selectedPlayer : null;
      onSelectPlayer(player, prev_player, ind);
      setSelectedPlayer(player)
      setIsClicked(false);
  }

  return (
    <div
      className= {`absolute bg-white shadow-md flex items-center justify-center overflow-visible ${isClicked ? "z-50" : "z-10"}`}
      style={{
        top,
        left,
        width: `${width}px`,
        height: `${height}px`,
        transform: 'translate(-50%, -50%)',
        borderRadius: "6px",
      }}
    >
      <div className="relative w-64">
        <button
          className="p-2 bg-gray-100 rounded w-full text-left"
          onClick={() => setIsClicked(true)}
        >
          {selectedPlayer ? 
            (
              <div>
                <img
                src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${selectedPlayer.PERSON_ID}.png`}
                alt={selectedPlayer.DISPLAY_FIRST_LAST}
                className="w-full h-full object-cover rounded"
                />
                <span>{selectedPlayer.DISPLAY_FIRST_LAST}</span>
              </div>
            ) 
            
            : `+ ${position}`}
        </button>
        {isClicked && (
          <Dropdown
            players={availablePlayers}
            onSelect={selectPlayer}
            onClose={() => setIsClicked(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Player
