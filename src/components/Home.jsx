import { useEffect, useState } from 'react'
import Player from "./Player";
import SubmitTeam from './SubmitTeam';
import teamData from '@/data/teams.json';
import Login from './Login';
import Logout from './Logout';
import { useAuth0 } from "@auth0/auth0-react";
import playerData from '@/data/player_data_prices.json';
function Home() {
  const teams = Object.keys(teamData)
  const [balance, setBalance] = useState(100.0)
  const [myPlayers, setMyPlayers] = useState(Array(15).fill(null));
  const [fullTeams, setFullTeams] = useState(new Set())
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [player_per_team, setPlayers_per_team] = useState(
    () => Object.fromEntries(teams.map((k) => [k, 0]))
  );

  useEffect(()=>{
    if(isAuthenticated){
      const params = new URLSearchParams({
        username: user.name  
      });
      fetch(`http://localhost:5000/api/get_team?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setBalance(data.balance);
        setMyPlayers(data.player_ids);
      })
    }
    else{
      setMyPlayers(Array(15).fill(null));
    }
  }, [user, isAuthenticated]);

  function selectPlayer(player_id, prev_player_id, index) {
      setMyPlayers(prev => {
        const updated = [...prev];
        updated[index] = player_id;
        return updated;
      });
      setPlayers_per_team(prev => {
        const updated = { ...prev };
        const updated_set = new Set(fullTeams);
        if(player_id!=null){
          updated[playerData[player_id].TEAM_ID] = updated[playerData[player_id].TEAM_ID] + 1;
          if(updated[playerData[player_id].TEAM_ID]>2){
            updated_set.add(playerData[player_id].TEAM_ID);
            console.log("team has more than 2 players\n")
          }
        }
        if(prev_player_id!=null){
          updated[playerData[prev_player_id].TEAM_ID] = updated[playerData[prev_player_id].TEAM_ID]-1
          if(updated[playerData[prev_player_id].TEAM_ID]<=2){
            updated_set.delete(playerData[prev_player_id].TEAM_ID);
          }
        }
        setFullTeams(updated_set);
        return updated;
      })
      const prev_price = prev_player_id ? playerData[prev_player_id].PRICE : 0;
      setBalance(prev => prev + prev_price - playerData[player_id].PRICE);
  }
  return (
    <div>
      {!isAuthenticated? <Login></Login> : !isLoading && isAuthenticated? (<div><Logout></Logout>Signed in as {user.name}</div>) : <div></div>}
      <div className="flex justify-center items-center h-screen text-center overflow-visible z-0">
        <div className="relative w-2/5 h-[900px] ">
          <h1>${balance.toFixed(1)}</h1>
          <img src="court.jpg" 
          style={{ width: '100%', height: '900px' }}
          className="w-full h-full object-cover"></img>
          <></>
          <Player top="55%" left="80%" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={0}></Player>
          <Player top="70%" left="50%" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={1}></Player>
          <Player top="15%" left="25%" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={2}></Player>
          <Player top="20%" left="75%" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={3}></Player>
          <Player top="40%" left="37%" position="Center" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={4}></Player>

          <Player top="84%" left="50%" width ="80" height="100" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={5}></Player>
          <Player top="69%" left="80%" width ="80" height="100" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={6}></Player>
          <Player top="29%" left="25%" width ="80" height="100" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={7}></Player>
          <Player top="34%" left="75%" width ="80" height="100" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={8}></Player>
          <Player top="54%" left="37%" width ="80" height="100" position="Center" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={9}></Player>
        </div>
        <div>
          <Player top="100%" left="32%" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={10} bench = {true}></Player>
          <Player top="100%" left="37%" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={11} bench = {true}></Player>
          <Player top="100%" left="42%" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={12} bench = {true}></Player>
          <Player top="100%" left="47%" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={13} bench = {true}></Player>
          <Player top="100%" left="52%" position="Center" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={14} bench = {true}></Player>
        </div>
        <SubmitTeam myPlayers={myPlayers} balance={balance} fullTeams={fullTeams} user={user} isAuthenticated={isAuthenticated}></SubmitTeam>
        {
          fullTeams.size !==0 && (
            <div>
              Cannot have more than two players from {teamData[fullTeams.values().next().value]?.full_name}
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Home;
