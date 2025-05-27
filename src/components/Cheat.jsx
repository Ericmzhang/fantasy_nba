import { useState, useEffect } from 'react'
function Cheat({setMyPlayers, setBalance}) {

  function Submit(setMyPlayers, setBalance){
    const cheatPlayers = [
        '1630534', '1641725',
        '1630173', '1630583',
        '203500',  '1628960',
        '1629638', '203937',
        '203507',  '1628389',
        '1630631', '1630175',
        '1628384', '1630166',
        '1628386'
      ]
    const balance = 2.0;
    setMyPlayers(cheatPlayers)
    setBalance(balance);
  }

  return (
    <div className="flex flex-col items-start space-y-2 w-[250px]">
        <button className="border-2 border-gray-400 rounded-md px-4 py-2 hover:border-blue-500" onClick={()=> Submit(setMyPlayers, setBalance)} >Cheat</button>
    </div>
  );
}

export default Cheat;
