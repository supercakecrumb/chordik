-- Create the chordik_user
CREATE USER chordik_user WITH PASSWORD 'chordik_password';

-- Create the chordik database
CREATE DATABASE chordik WITH OWNER chordik_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE chordik TO chordik_user;
GRANT ALL PRIVILEGES ON DATABASE chordik_db TO chordik_user;