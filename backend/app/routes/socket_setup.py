import socketio

import services.player
import services.game

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=[]
)

sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    socketio_path="/"
)

@sio_server.on("connect")
async def connect(sid, environ, auth):
    print(f'Client connected: {sid}')

@sio_server.on("register")
async def register(sid, data):
    logger.info(f'register is called: {sid}')

    result = await services.player.create_new_user(data['username'], data['cover_image'], sid)

    if (result['status']==True):
        player_id = result['player_id']
        game_id = await services.game.find_an_empty_game()
        
        status = await services.player.update_game_id(player_id, game_id)

        if status == True:
            await sio_server.emit("register response", {"status": True, "player_id": player_id, "game_id": game_id }, sid)
        else:
            await sio_server.emit("register response", {"status": False, "message": "There was an error with updating user record."}, sid)
        
    else:
        await sio_server.emit("register response", result, sid)

@sio_server.on("is game full")
async def check_is_game_full(sid, data):
    logger.info(f'is_game_full is called: {sid}')
    logger.info(data)
    result = await services.game.is_game_full(data['game_id'])
    
    if result['status']==True:
        for player in result['players']:
            await sio_server.emit("game is full", {"status": True}, player['socket_id'])  

@sio_server.on("get players for group")
async def get_players_for_group(sid, data):
    logger.info(f'get_players_for_group is called: {sid}')
    logger.info(data)
    players = await services.game.get_players_by_group_id(data['game_id'])

    logger.info('players')
    logger.info(players)
    
        
    for player in players:
        await sio_server.emit("list of players", players, to=player['socket_id'])  