import { useState } from 'react'

function SubmitTeam({myPlayers, balance, fullTeams, user, isAuthenticated}) {
  const [isClicked, setIsClicked ] = useState(false);
  const [numMissing, setNumMissing] = useState(0);
  const [insufficient, setInsufficient] = useState(false);
  function Submit(myPlayers, balance, fullTeams, user, isAuthenticated){
    if(!isClicked){
      setIsClicked(true);
    }
    if(!isAuthenticated){

      return
    }
    if(fullTeams.size!==0){
      console.log("Cannot have more than 2 players per team", balance);
    }
    if(balance<0){
      setInsufficient(true);
      console.log("Insufficient balance:", balance);
    }
    else{
      setInsufficient(false);
    }
    
    let count = 0;
    for (let i = 0; i < myPlayers.length; i++) {
      if(myPlayers[i]==null){
        count +=1;
      }
    }
    setNumMissing(count);
    if(count==15){
      setIsClicked(false);
      return;
    }

    console.log("Submit Team api for user", user);
    fetch('http://localhost:5000/api/submit_team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.name,
        players: myPlayers,
        balance: balance,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response:', data);
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });
  }

  return (
    <div className="flex flex-col items-start space-y-2 w-[250px]">
        <button className="border-2 border-gray-400 rounded-md px-4 py-2 hover:border-blue-500" onClick={()=> Submit(myPlayers, balance, fullTeams, user, isAuthenticated)} >Submit Team</button>
        <div style={{ minHeight: '3rem' }}>
          {
            !isAuthenticated && isClicked && (
              <div>Must be signed in to submit team</div>
            )
          }
          { numMissing>0 && (
            <div>Missing {numMissing} Players </div>
          )}
          {
            insufficient && (
              <div>Cannot choose team with balance of ${balance}</div>
            )
          }
        </div>
    </div>
  );
}

export default SubmitTeam;
