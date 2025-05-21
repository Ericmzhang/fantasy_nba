from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.static import teams
import time
import json




def get_active_players_json():  #get json strings of all active players
    all_data = []
    players = players.get_active_players()
    for player in players:
        player_id = player['id']
        try:
            info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
            player_json = info.get_normalized_json()
            all_data.append(player_json)
            time.sleep(0.5)
        except Exception as e:
            print(f"Error fetching for {player['full_name']}: {e}")
            continue
    with open("data/player_data.json", "w") as f:
        json.dump(all_data, f, indent=2)

def add_prices(filename): # add prices to json strings of all active players and return as json
    with open(filename, "r") as f:
        player_info = json.load(f)  # This will be a list of strings
    players = []
    for player in player_info:
        try:
            player = json.loads(player)
            info = player["CommonPlayerInfo"][0]
            info["PRICE"] = 5.0
            players.append(info)
        except json.JSONDecodeError as e:
            exit
    with open("data/player_data_prices.json", "w") as f:
        json.dump(players, f, indent=2)   #return as json


def group_players_by_position(filename): #read json of all active players and format it based on positions
    with open(filename, "r") as f:
        player_info = json.load(f)  
    print(player_info)
    player_positions = {
        "Guard": [],
        "Forward": [],
        "Center": [],
        "Unknown": []
    }
    for info in player_info:
        position = info["POSITION"]
        if position == "Guard" or position == "Guard-Forward":
            player_positions["Guard"].append(info)
        elif position == "Forward" or position == "Forward-Guard" or position == "Forward-Center":
            player_positions["Forward"].append(info)
        elif position == "Center" or position == "Center-Forward":
            player_positions["Center"].append(info)
        else:
            print("player position not found\n")
    with open("data/player_positions.json", "w") as f:
        json.dump(player_positions, f, indent=2)

def get_teams():
    teams_json = teams.get_teams()
    teams_dict = {team["id"]: team for team in teams_json}
    with open("data/teams.json", "w") as f:
        json.dump(teams_dict, f, indent=2)

# group_players_by_position("data/player_data_prices.json")
# add_prices("data/player_data.json")
get_teams()