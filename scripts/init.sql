-- scripts/init.sql
-- Use the database that docker-compose already created
USE poke_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_pokedex;
DROP TABLE IF EXISTS pokemon_abilities;
DROP TABLE IF EXISTS pokemon_types;
DROP TABLE IF EXISTS abilities;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS pokemon;
DROP TABLE IF EXISTS user_stats;
DROP TABLE IF EXISTS users;

-- 1. USERS - Store user accounts
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. POKEMON - Direct mapping from PokeAPI /pokemon/{id} endpoint
CREATE TABLE pokemon (
    id INT PRIMARY KEY, -- Exact ID from PokeAPI
    name VARCHAR(100) NOT NULL,
    height INT, -- In decimeters (as provided by API)
    weight INT, -- In hectograms (as provided by API)
    base_experience INT,
    sprite_front_default VARCHAR(255),
    sprite_front_shiny VARCHAR(255),
    sprite_official_artwork VARCHAR(255),
    is_default BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TYPES - From /type endpoint
CREATE TABLE types (
    id INT PRIMARY KEY, -- Exact ID from PokeAPI
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. POKEMON_TYPES - Junction table for Pokémon types
CREATE TABLE pokemon_types (
    pokemon_id INT NOT NULL,
    type_id INT NOT NULL,
    slot INT NOT NULL, -- 1 for primary, 2 for secondary
    PRIMARY KEY (pokemon_id, type_id, slot),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES types(id) ON DELETE CASCADE
);

-- 5. ABILITIES - From /ability endpoint
CREATE TABLE abilities (
    id INT PRIMARY KEY, -- Exact ID from PokeAPI
    name VARCHAR(100) NOT NULL UNIQUE,
    is_main_series BOOLEAN DEFAULT TRUE
);

-- 6. POKEMON_ABILITIES - Junction table for Pokémon abilities
CREATE TABLE pokemon_abilities (
    pokemon_id INT NOT NULL,
    ability_id INT NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,
    slot INT NOT NULL,
    PRIMARY KEY (pokemon_id, ability_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,
    FOREIGN KEY (ability_id) REFERENCES abilities(id) ON DELETE CASCADE
);

-- 7. USER_POKEDEX - Core table for user's personal Pokédex
CREATE TABLE user_pokedex (
    user_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    status ENUM('seen', 'caught') DEFAULT 'seen',
    first_seen_at TIMESTAMP NULL,
    first_caught_at TIMESTAMP NULL,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    custom_name VARCHAR(100),
    PRIMARY KEY (user_id, pokemon_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE
);

-- 8. USER_STATS - Track user progress
CREATE TABLE user_stats (
    user_id INT PRIMARY KEY,
    total_seen INT DEFAULT 0,
    total_caught INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert initial types
INSERT IGNORE INTO types (id, name) VALUES
(1, 'normal'), (2, 'fighting'), (3, 'flying'), (4, 'poison'), (5, 'ground'),
(6, 'rock'), (7, 'bug'), (8, 'ghost'), (9, 'steel'), (10, 'fire'),
(11, 'water'), (12, 'grass'), (13, 'electric'), (14, 'psychic'), (15, 'ice'),
(16, 'dragon'), (17, 'dark'), (18, 'fairy');

-- Create a test user
INSERT IGNORE INTO users (username, email, password_hash)
VALUES ('ash', 'ash@pokemon.com', '$2b$12$hashedpassword123');

-- Create indexes for better performance
CREATE INDEX idx_pokemon_name ON pokemon(name);
CREATE INDEX idx_user_pokedex_user ON user_pokedex(user_id);
CREATE INDEX idx_user_pokedex_status ON user_pokedex(status);
