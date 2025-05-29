from nba_api.live.nba.endpoints import scoreboard, boxscore
import threading
import json

GAME_ID = "0042400315"

i = 0
def get_boxscore():
    global i
    boxscore_dict = boxscore.BoxScore(GAME_ID).get_dict()
    with open("data/games/boxscore_{}_{}.json".format(GAME_ID,i), "w") as f:
        json.dump(boxscore_dict, f, indent=2)
    i+=1
    if(boxscore_dict["game"]["gameStatusText"]=="Final"):
        return
    threading.Timer(5.0, get_boxscore).start()

    
get_boxscore()