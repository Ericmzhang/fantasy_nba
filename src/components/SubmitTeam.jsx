import { useState } from 'react'
import Player from "./Player";
function SubmitTeam({myPlayers, balance}) {

  return (
    <div>
        <button className="border-2 border-gray-400 rounded-md px-4 py-2 hover:border-blue-500" >Submit Team</button>
    </div>
  );
}

export default SubmitTeam;
