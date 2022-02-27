DROP TABLE IF EXISTS flokkur;
DROP TABLE IF EXISTS vorur;

CREATE TABLE flokkur (
  id serial primary key,
  title character VARCHAR (64) NOT NULL UNIQUE
)

CREATE TABLE vorur (
  id serial primary key,
  title character VARCHAR(64) NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  description verying(256) NOT NULL,
  image VARCHAR(255) NOT NULL,
  "flokkur" INTEGER NOT NULL,
  CONSTRAINT "flokkur" FOREIGN KEY ("flokkur") REFERENCES flokkur (id) ON DELETE CASCADE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp

)

CREATE TABLE karfa (
  id 
)



DROP ROLE IF EXISTS "vef2-user";
CREATE USER "vef2-user" WITH ENCRYPTED PASSWORD '123';
GRANT ALL PRIVILEGES ON DATABASE vef2 TO "vef2-user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "vef2-user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "vef2-user";

