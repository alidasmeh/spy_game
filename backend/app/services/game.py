from fastapi import Depends
from models.db import get_db_connection, connect_to_db
import asyncpg
from asyncpg import Connection
from fastapi import FastAPI, Depends, HTTPException, status

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
        inserted_id = await conn.fetchval("INSERT INTO games (number_of_players) VALUES ($1) RETURNING game_id", 4)
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