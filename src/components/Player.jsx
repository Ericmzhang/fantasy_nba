import playerID from '@/data/player_id_positions.json';
import playerData from '@/data/player_data_prices.json'
import { useState } from "react";
import Dropdown from './PlayerDropdown';
function Player({ top = "0%", left = "0%", width = 120, height = 150, position = "Guard", myPlayers, onSelectPlayer, ind, bench  = false}) {
  const [isClicked, setIsClicked] = useState(false);
  const player_ids = playerID[position] || [];
  let relevantIndices = [];

  if (position === "Guard") {
    relevantIndices = [0, 1, 5, 6, 10, 11];
  } 
  else if (position === "Forward") {
    relevantIndices = [2, 3, 7, 8, 12, 13];
  } 
  else if (position === "Center") {
    relevantIndices = [4, 9, 14];
  }

  const takenIds = relevantIndices
  .map(i => {
    return myPlayers[i];
  })
  .filter(Boolean);

  const availablePlayers = player_ids.filter(
    player_id => {
      if (!myPlayers[ind] ){  //if no player currently chosen for this slot, show all not taken players
        return !takenIds.includes(player_id);
      }
      return !takenIds.includes(player_id) || player_id === myPlayers[ind];      
    }
  );

  function selectPlayer(player) {
      const prev_player = myPlayers[ind];
      onSelectPlayer(player, prev_player, ind);
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
          {myPlayers[ind]  ? 
            (
              <div>
                <img
                src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerData[myPlayers[ind]].PERSON_ID}.png`}
                alt={playerData[myPlayers[ind]].DISPLAY_FIRST_LAST}
                className="w-full h-full object-cover rounded"
                />
                <span>{playerData[myPlayers[ind]].DISPLAY_FIRST_LAST}</span>
              </div>
            ) 
            
            : `+ ${position}`}
        </button>
        {isClicked && (
          <Dropdown
            players={availablePlayers}
            onSelect={selectPlayer}
            onClose={() => setIsClicked(false)}
            positionAbove={bench}
          />
        )}
      </div>
    </div>
  );
}

export default Player
