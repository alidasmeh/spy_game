import asyncpg

DATABASE_URL = "postgresql://postgres:password@db:5432/spy_game"

async def connect_to_db():
    conn = await asyncpg.connect(DATABASE_URL)
    return conn

async def close_db_connection(conn):
    await conn.close()

# Dependency to get the DB connection
async def get_db_connection() -> asyncpg.Connection:
    conn = await connect_to_db()
    try:
        yield conn
    finally:
        await close_db_connection(conn)
