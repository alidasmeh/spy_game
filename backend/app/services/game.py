import datetime
import random

from fastapi import Depends, FastAPI, Depends, HTTPException, status
import asyncpg
from asyncpg import Connection

from models.db import get_db_connection, connect_to_db
# import helpers

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

NUMBER_OF_PLAYERS = 5

async def find_an_empty_game():
    conn = await connect_to_db()
    
    last_game = await conn.fetch("SELECT * FROM games ORDER BY game_id DESC LIMIT 1")
    
    if len(last_game) > 0:
        max_number_players = last_game[0]['number_of_players']

        players_for_last_game = await conn.fetch("SELECT * FROM players WHERE game_id = $1", str(last_game[0]['game_id']))

        if len(players_for_last_game) < max_number_players:
            return last_game[0]['game_id']

    # there is no room empty room, or no room at all. 
    game_creation_result = await create_new_game()

    if game_creation_result['status'] == False:
        logger.error("find_an_empty_game > create_new_game ERROR.")
    
    logger.debug("game_creation_result['game_id']")
    logger.debug(game_creation_result['game_id'])
    return game_creation_result['game_id']

async def create_new_game():
    conn = await connect_to_db()

    try:
        inserted_id = await conn.fetchval("INSERT INTO games (number_of_players) VALUES ($1) RETURNING game_id", NUMBER_OF_PLAYERS)
        return {"status": True, "game_id": inserted_id}

    except Exception as e:
        logger.error(e)
        return {"status": False, "message": "db error. "}
    
async def is_game_full(game_id):
    conn = await connect_to_db()
    game = await conn.fetch("SELECT * FROM games WHERE game_id=$1", game_id)
    number_of_players = game[0]['number_of_players']

    players = await conn.fetch("SELECT * FROM players WHERE game_id=$1", str(game_id))

    if len(players) == int(number_of_players):
        return {"status": True, "players": players}
    
    return {"status": False}

async def get_players_by_group_id(game_id):
    conn = await connect_to_db()
    players = await conn.fetch("SELECT * FROM players WHERE game_id=$1", str(game_id))
    player_dicts = [dict(player) for player in players]
    return convert_date_object_to_string(player_dicts)

async def who_is_turn_by_group_id(game_id):
    conn = await connect_to_db()
    
    last_round = await conn.fetch(f"SELECT * FROM rounds WHERE game_id='{str(game_id)}' ORDER BY round_id DESC LIMIT 1")

    if len(last_round) == 0:
        await create_a_new_round(game_id)
        trials_for_current_round = [] # round is just created so there is no trial for that. 
    
    else: 
        last_round_id = last_round[0]['round_id']
        trials_for_current_round = await conn.fetch("SELECT * FROM trials WHERE round_id=$1 ORDER BY trial_id ASC", str(last_round_id))
        
    players_for_current_game = await conn.fetch("SELECT player_id FROM players WHERE game_id=$1 ORDER BY player_id ASC", str(game_id))

    if len(trials_for_current_round) == 0:
        return players_for_current_game[0]['player_id']
    
    index_for_finding_player_turn = len(trials_for_current_round)%NUMBER_OF_PLAYERS
    return players_for_current_game[index_for_finding_player_turn]['player_id']

async def run_a_trial(data):
    conn = await connect_to_db()

    last_round = await conn.fetch("SELECT * FROM rounds WHERE game_id=$1 ORDER BY round_id DESC LIMIT 1", str(data['game_id']))
    new_trial_id = await conn.fetch("INSERT INTO trials (round_id, questioner_id, answerer_id, word1, word2) VALUES ($1, $2, $3, $4, $5) RETURNING trial_id ", str(last_round[0]['round_id']), str(data['player_id']), str(data['target_player']), str(data['word1']), str(data['word2']))

    return new_trial_id

async def update_trial(trial_id, word):
    conn = await connect_to_db()
    try: 
        await conn.execute(f"UPDATE trials SET chosen_word='{word}' WHERE trial_id={trial_id} ")
        return True
    
    except asyncpg.exceptions.PostgresError as e:
        logger.error(f"update_trial > Error updating trial chosen_word: {e}")
        return False

async def get_number_of_trials_for_this_round(trial_id):
    conn = await connect_to_db()
    current_trial = await conn.fetch(f"SELECT * FROM trials WHERE trial_id='{trial_id}'")
    trials_in_current_round = await conn.fetch(f"SELECT * FROM trials WHERE round_id='{current_trial[0]['round_id']}'")

    return len(trials_in_current_round)

async def get_last_round_by_group_id(game_id):
    conn = await connect_to_db()
    last_round = await conn.fetch(f"SELECT * FROM rounds WHERE game_id='{game_id}' ORDER BY round_id DESC LIMIT 1")
    return last_round[0]

async def get_word_spy_status(game_id):
    conn = await connect_to_db()
    last_round = await conn.fetch(f"SELECT * FROM rounds WHERE game_id='{game_id}' ORDER BY round_id DESC LIMIT 1")
    
    # Because the round may not have been made by the time this line is called, this query must be repeated. 
    while len(last_round)==0: 
        last_round = await conn.fetch(f"SELECT * FROM rounds WHERE game_id='{game_id}' ORDER BY round_id DESC LIMIT 1")
    
    word = await conn.fetch(f"SELECT * FROM words WHERE word_id='{last_round[0]['target_word_id']}' ")
    return  word[0]['target_word'], last_round[0]['spy_id']

async def get_spy_id_for_current_round(game_id):
    conn = await connect_to_db()
    last_round = await conn.fetch(f"SELECT * FROM rounds WHERE game_id='{game_id}' ORDER BY round_id DESC LIMIT 1")
    return last_round[0]['spy_id']

async def get_target_word_for_current_round(game_id):
    conn = await connect_to_db()
    target_word = await find_word_for_this_group(conn, game_id)
    return target_word

def convert_date_object_to_string(original_list):
    player_dicts = []
    for record in original_list:
        player_dict = {}
        for key, value in record.items():
            if not isinstance(value, datetime.datetime):
                player_dict[key] = value
        player_dicts.append(player_dict)

    return player_dicts

async def find_word_for_this_group(conn, game_id):
    rounds = await conn.fetch("SELECT * FROM rounds WHERE game_id=$1", str(game_id))
    words = await conn.fetch("SELECT word_id FROM words")

    target_word = check_word_in_round_existance(words, rounds)

    if target_word == "":
        return "not found"

    return target_word

def check_word_in_round_existance(words, rounds):
    target_word = ""

    for word in words: 
        target_word = word["word_id"]
        for round in rounds: 
            if str(word["word_id"]) == str(round['target_word_id']):
                target_word = ""
        
        if target_word != "":
            return target_word
            
    return target_word

async def find_an_spy_for_this_round(conn, game_id):
    players = await conn.fetch("SELECT player_id FROM players WHERE game_id=$1 ORDER BY player_id ASC", str(game_id))
    spy = random.choice(players)
    return spy['player_id']
    
async def create_a_new_round(game_id):
    conn = await connect_to_db()

    # create new round
    target_word_id = await find_word_for_this_group(conn, game_id)
    spy_id = await find_an_spy_for_this_round(conn, game_id)
    unique_complex = f"{target_word_id}{game_id}"
    logger.info("create_a_new_round")
    logger.info("target_word_id")
    logger.info(target_word_id)
    logger.info("spy_id")
    logger.info(spy_id)
    # in this scenario I do not need to get the round_id
    await conn.fetch(f'INSERT INTO rounds (target_word_id, game_id, spy_id, unique_complex) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', str(target_word_id), str(game_id), str(spy_id), unique_complex)