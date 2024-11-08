CREATE DATABASE spy_game;

\c spy_game

CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    socket_id VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    number_of_players INTEGER DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE words (
    word_id SERIAL PRIMARY KEY,
    target_word TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rounds (
    round_id SERIAL PRIMARY KEY,
    target_word_id VARCHAR(10) NOT NULL,
    game_id VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trials (
    trial_id SERIAL PRIMARY KEY,
    round_id VARCHAR(10),
    questioner_id VARCHAR(10),
    answerer_id VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO words (target_word) VALUES ('car wheel'), ('cruise');