// server.js

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
const pool = new Pool({
  user: 'me',     
  host: 'localhost',          
  database: 'nba_db',  
  password: 'cadecunningham2', 
  port: 5432,             
});

module.exports = pool;

// Test if the database connection is working
pool
  .connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

const POLL_GAME_INTERVAL = 10000; //30 seconds
const POLL_DAY_INTERVAL = 43200000; //12 hours
let player_stats = {};
let game_ids =[];
pollDayInfo();
pollGameStats();
setInterval(pollGameStats, POLL_GAME_INTERVAL);
setInterval(pollDayInfo, POLL_DAY_INTERVAL);

async function pollDayInfo(){
  while(true){
    const res = await fetch('https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json');
    if(res.ok){
      const day_info = await res.json();
      const games = day_info["scoreboard"]["games"];
      game_ids = games.map(game=>game.gameId);
      break;
    }
  }
}

async function pollGameStats(){
  const fetches = game_ids.map(async (game_id) => {
    const res = await fetch(`https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${game_id}.json`);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    return res.json();
  });
  try {
    const results = await Promise.all(fetches);
    results.forEach(data => {
      const home_players = data.game.homeTeam.players;
      home_players.forEach(player => {
        
      })
      const away_players = data.game.awayTeam.players;
      console.log(home_players);
    });
  } catch (err) {
    console.error(err);
  }
}

app.get('/api/get_team', async (req, res) => {
  const username = req.query.username;
  try {
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    const user_id = existingUser.rows[0].id;
    const players = await pool.query('SELECT * FROM user_players WHERE user_id = $1 ORDER BY player_order ASC;',[user_id]);  
    const player_ids = players.rows.map(obj => obj.player_id.toString());
    const balance_res = await pool.query('SELECT balance FROM users WHERE id = $1',[user_id]);
    const balance = parseFloat(balance_res.rows[0].balance);
    
    res.json({player_ids: player_ids, balance:balance });
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).send('Error fetching players');
  }
});

// Endpoint to save team. Receives username and 15 player ids
app.post('/api/submit_team', async (req, res) => {
  const {username, players, balance} = req.body;
  if (!username || !players || players.length !== 15) {
    return res.status(400).json({ error: 'User or players data is invalid' });
  }
  console.log(players);
  try {
    //Insert user if not exists
    const user_result = await pool.query(
      `INSERT INTO users (username, balance)
       VALUES ($1, $2)
       ON CONFLICT (username) DO NOTHING
       RETURNING id`,
      [username, balance]
    );
    //Get user_id
    let user_id;
    if (user_result.rows.length > 0) {
      user_id = userResult.rows[0].id;
    } 
    else {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );
      user_id = existingUser.rows[0].id;
    }
    await pool.query("DELETE FROM user_players WHERE user_id = $1;",[user_id])
    const insertPromises = players.map((player_id, ind) => {
      return pool.query(
        'INSERT INTO user_players (user_id, player_id, player_order) VALUES ($1, $2, $3)',
        [user_id, player_id, ind]
      );
    });
    await Promise.all(insertPromises);

    res.json({ message: 'Players saved successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save players' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
