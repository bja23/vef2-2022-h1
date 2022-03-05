DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS flokkur;
DROP TABLE IF EXISTS vorur;
DROP TABLE IF EXISTS karfa;
DROP TABLE IF EXISTS linaIKorfu;
DROP TABLE IF EXISTS pontun;
DROP TABLE IF EXISTS linaIPontun;
DROP TABLE IF EXISTS stodurPantana;
DROP TABLE IF EXISTS pontunState;

CREATE TABLE users (
  id serial primary key,
  name character varying(64) NOT NULL,
  username character varying(64) NOT NULL UNIQUE,
  password character varying(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE flokkur (
  id serial primary key,
  title character VARCHAR (64) NOT NULL UNIQUE
);

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
);

CREATE TABLE karfa (
  id character VARCHAR(255) NOT null UNIQUE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE linaIKorfu (
  "vara" INTEGER NOT NULL,
  CONSTRAINT "vara" FOREIGN KEY ("vara") REFERENCES vorur (id) ON DELETE CASCADE,
  "vara" INTEGER NOT NULL,
  CONSTRAINT "karfa" FOREIGN KEY ("karfa") REFERENCES karfa (id) ON DELETE CASCADE,
  fjoldi INTEGER NOT NULL,
  CHECK (fjoldi > 0)
);

CREATE TABLE pontun (
  id character VARCHAR(255) NOT NULL UNIQUE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  name VARCHAR(64) NOT NULL
);

CREATE TABLE linaIPontun (
  "vara" INTEGER NOT NULL,
  CONSTRAINT "vara" FOREIGN KEY ("vara") REFERENCES vorur (id) ON DELETE CASCADE,
  "vara" INTEGER NOT NULL,
  CONSTRAINT "karfa" FOREIGN KEY ("karfa") REFERENCES karfa (id) ON DELETE CASCADE,
  fjoldi INTEGER NOT NULL,
  CHECK (fjoldi > 0)
);

CREATE TYPE pontunState AS ENUM ('NEW', 'PREPARE', 'COOKING', 'READY', ' FINISHED');

CREATE TABLE stodurPantana (
  "pontun" INTEGER NOT NULL,
  CONSTRAINT "pontun" FOREIGN KEY ("pontun") REFERENCES pontun (id) ON DELETE CASCADE,
  state stodurPantana NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

DROP ROLE IF EXISTS "vef2-user";
CREATE USER "vef2-user" WITH ENCRYPTED PASSWORD '123';
GRANT ALL PRIVILEGES ON DATABASE vef2 TO "vef2-user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "vef2-user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "vef2-user";

