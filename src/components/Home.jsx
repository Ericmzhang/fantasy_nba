import { useState } from 'react'
import Player from "./Player";
import SubmitTeam from './SubmitTeam';
import teamData from '@/data/teams.json';
import Login from './Login';
import Logout from './Logout';
import { useAuth0 } from "@auth0/auth0-react";
function Home() {
  const teams = Object.keys(teamData)
  const [balance, setBalance] = useState(100.0)
  const [myPlayers, setMyPlayers] = useState(Array(15).fill(null));
  const [fullTeams, setFullTeams] = useState(new Set())
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [player_per_team, setPlayers_per_team] = useState(
    () => Object.fromEntries(teams.map((k) => [k, 0]))
  );
  function selectPlayer(player, prev_player, index) {
      setMyPlayers(prev => {
        const updated = [...prev];
        updated[index] = player;
        return updated;
      });
      setPlayers_per_team(prev => {
        const updated = { ...prev };
        const updated_set = new Set(fullTeams);
        if(player!=null){
          updated[player.TEAM_ID] = updated[player.TEAM_ID] + 1;
          if(updated[player.TEAM_ID]>2){
            updated_set.add(player.TEAM_ID);
            console.log("team has more than 2 players\n")
          }
        }
        if(prev_player!=null){
          updated[prev_player.TEAM_ID] = updated [prev_player.TEAM_ID]-1
          if(updated[prev_player.TEAM_ID]<=2){
            updated_set.delete(prev_player.TEAM_ID);
          }
        }
        setFullTeams(updated_set);
        return updated;
      })
      const prev_price = prev_player ? prev_player.PRICE : 0;
      setBalance(prev => prev + prev_price - player.PRICE);
  }
  console.log(user)
  return (
    <div>
      {!isLoading && !isAuthenticated? <Login></Login> : !isLoading && isAuthenticated? <Logout></Logout> : <div></div>}
      <div className="flex justify-center items-center h-screen text-center">
        <div className="relative w-2/5 h-[900px] overflow-visible z-0">
          <h1>${balance.toFixed(1)}</h1>
          <img src="court.jpg" 
          style={{ width: '100%', height: '900px' }}
          className="w-full h-full object-cover"></img>
          <></>
          <Player top="55%" left="80%" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={1}></Player>
          <Player top="70%" left="50%" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={2}></Player>
          <Player top="15%" left="25%" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={3}></Player>
          <Player top="20%" left="75%" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={4}></Player>
          <Player top="40%" left="37%" position="Center" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={5}></Player>

          <Player top="84%" left="50%" width ="80" height="100" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={6}></Player>
          <Player top="69%" left="80%" width ="80" height="100" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={7}></Player>
          <Player top="29%" left="25%" width ="80" height="100" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={8}></Player>
          <Player top="34%" left="75%" width ="80" height="100" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={9}></Player>
          <Player top="54%" left="37%" width ="80" height="100" position="Center" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={10}></Player>
        </div>
        <div>
          <Player top="100%" left="32%" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={11}></Player>
          <Player top="100%" left="37%" position="Guard" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={12}></Player>
          <Player top="100%" left="42%" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={13}></Player>
          <Player top="100%" left="47%" position="Forward" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={14}></Player>
          <Player top="100%" left="52%" position="Center" myPlayers={myPlayers} onSelectPlayer={selectPlayer} ind={15}></Player>
        </div>
        <SubmitTeam myPlayers={myPlayers} balance={balance}></SubmitTeam>
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
