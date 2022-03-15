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
  email VARCHAR(256) NOT NULL UNIQUE,
  username character varying(64) NOT NULL UNIQUE,
  password character varying(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE flokkur (
  id serial primary key,
  title character varying(64) NOT NULL UNIQUE
);

CREATE TABLE vorur (
  id serial primary key,
  title VARCHAR(64) NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  description VARCHAR(256) NOT NULL,
  image VARCHAR(255) NOT NULL,
  "flokkurID" INTEGER NOT NULL,
  CONSTRAINT "flokkurID" FOREIGN KEY ("flokkurID") REFERENCES flokkur (id) ON DELETE CASCADE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE karfa (
  id VARCHAR(255) NOT null UNIQUE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE linaIKorfu (
  "varaID" INTEGER NOT NULL,
  CONSTRAINT "varaID" FOREIGN KEY ("varaID") REFERENCES vorur (id) ON DELETE CASCADE,
  "karfaID" VARCHAR(255) NOT NULL,
  CONSTRAINT "karfaID" FOREIGN KEY ("karfaID") REFERENCES karfa (id) ON DELETE CASCADE,
  fjoldi INTEGER NOT NULL,
  CHECK (fjoldi > 0)
);

CREATE TABLE pontun (
  id VARCHAR(255) NOT NULL UNIQUE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  name VARCHAR(64) NOT NULL
);

CREATE TABLE linaIPontun (
  "varaID" INTEGER NOT NULL,
  CONSTRAINT "varaID" FOREIGN KEY ("varaID") REFERENCES vorur (id) ON DELETE CASCADE,
  "karfaID" VARCHAR(255) NOT NULL,
  CONSTRAINT "karfaID" FOREIGN KEY ("karfaID") REFERENCES karfa (id) ON DELETE CASCADE,
  fjoldi INTEGER NOT NULL,
  CHECK (fjoldi > 0)
);

CREATE TYPE pontunState AS ENUM ('NEW', 'PREPARE', 'COOKING', 'READY', 'FINISHED');

CREATE TABLE stodurPantana (
  "pontunID" VARCHAR(255) NOT NULL,
  CONSTRAINT "pontunID" FOREIGN KEY ("pontunID") REFERENCES pontun (id) ON DELETE CASCADE,
  state pontunState NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

DROP ROLE IF EXISTS "vef2-user";
CREATE USER "vef2-user" WITH ENCRYPTED PASSWORD '123';
GRANT ALL PRIVILEGES ON DATABASE vef2 TO "vef2-user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "vef2-user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "vef2-user";

