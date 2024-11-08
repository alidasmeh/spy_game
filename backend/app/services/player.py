from fastapi import Depends
from models.db import get_db_connection, connect_to_db
import asyncpg
from asyncpg import Connection
from fastapi import FastAPI, Depends, HTTPException, status

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_new_user(username, img, sid):
    conn = await connect_to_db()

    try:
        inserted_id = await conn.fetchval("INSERT INTO players (username, image_url, socket_id) VALUES ($1, $2, $3) RETURNING player_id", username, img, sid)
        return {"status": True, "player_id": inserted_id}

    except asyncpg.exceptions.UniqueViolationError as e:
        return {"status": False, "message": "username is duplicated."}
        
    except Exception as e:
        logger.error(e)
        return {"status": False, "message": "db error. "}
    

async def update_game_id(player_id, game_id):
    conn = await connect_to_db()

    try :
        await conn.execute("UPDATE players SET game_id=$1 WHERE player_id=$2", str(game_id) ,player_id)
        return True
    except asyncpg.exceptions.PostgresError as e:
        logger.error(f"update_game_id > Error updating player game_id: {e}")
        return False
        