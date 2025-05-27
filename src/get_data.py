from nba_api.stats.endpoints import commonplayerinfo, playercareerstats
from nba_api.stats.static import teams, players
import time
import json
    

def get_active_players_json():  #get json all active players. player id -> player object
    all_data = {}
    players_list = players.get_active_players()
    for player in players_list:
        player_id = player['id']
        try:
            info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
            player_json = info.get_normalized_json()
            player_info = json.loads(player_json)["CommonPlayerInfo"][0]
            all_data[player_info["PERSON_ID"]] = player_info
            time.sleep(0.5)
        except Exception as e:
            print(f"Error fetching for {player['full_name']}: {e}")
            continue
    with open("data/player_data.json", "w") as f:
        json.dump(all_data, f, indent=2)

def add_prices(filename): # read in player id -> player object json and adds prices    4272
    with open(filename, "r") as f:
        player_info = json.load(f)  
    for player_id in player_info:
        career_stats = playercareerstats.PlayerCareerStats(player_id).get_normalized_json()
        career_stats = json.loads(career_stats)["SeasonTotalsRegularSeason"]
        price = 4.0
        if(len(career_stats)!=0):
            latest_season = career_stats[-1]
            score = latest_season["PTS"]+1.2*latest_season["REB"]+1.5*latest_season["AST"]+3*latest_season["BLK"]+3*latest_season["STL"]-2*latest_season["TOV"]
            price = 4 + (score - 400) * (12 - 4) / (4272 - 400)
            price = max(price,4.0)
            price = round(price*2)/2
        player_info[player_id]["PRICE"] = price
        time.sleep(0.5)
    with open("data/player_data_prices.json", "w") as f:
        json.dump(player_info, f, indent=2)   


def group_players_by_position_data(filename): #read json of all active players and format it based on positions
    with open(filename, "r") as f:
        player_info = json.load(f)  
    player_positions = {
        "Guard": [],
        "Forward": [],
        "Center": [],
        "Unknown": []
    }
    for player_id, stats  in player_info.items():
        position = stats["POSITION"]
        if position == "Guard" or position == "Guard-Forward":
            player_positions["Guard"].append({player_id: stats})
        elif position == "Forward" or position == "Forward-Guard" or position == "Forward-Center":
            player_positions["Forward"].append({player_id: stats})
        elif position == "Center" or position == "Center-Forward":
            player_positions["Center"].append({player_id: stats})
        else:
            print("player position not found\n")
    with open("data/player_positions.json", "w") as f:
        json.dump(player_positions, f, indent=2)

def group_players_by_position_ids(filename): #read json of all active players and return list of player ids per position
    with open(filename, "r") as f:
        player_info = json.load(f)  
    player_positions = {
        "Guard": [],
        "Forward": [],
        "Center": [],
        "Unknown": []
    }
    for player_id, stats  in player_info.items():
        position = stats["POSITION"]
        if position == "Guard" or position == "Guard-Forward":
            player_positions["Guard"].append(player_id)
        elif position == "Forward" or position == "Forward-Guard" or position == "Forward-Center":
            player_positions["Forward"].append(player_id)
        elif position == "Center" or position == "Center-Forward":
            player_positions["Center"].append(player_id)
        else:
            print("player position not found\n")
    with open("data/player_id_positions.json", "w") as f:
        json.dump(player_positions, f, indent=2)

def get_teams():
    teams_json = teams.get_teams()
    teams_dict = {team["id"]: team for team in teams_json}
    with open("data/teams.json", "w") as f:
        json.dump(teams_dict, f, indent=2)

# group_players_by_position("data/player_data_prices.json")

# get_active_players_json()
# add_prices("data/player_data.json")
group_players_by_position_ids("data/player_data_prices.json")