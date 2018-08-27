DROP TABLE IF EXISTS quotes_tags;
DROP TABLE IF EXISTS quotes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tags;

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  firstname       VARCHAR(255) NOT NULL,
  lastname        VARCHAR(255) NOT NULL,
  username        VARCHAR(255) UNIQUE NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  avatar          VARCHAR(255),
  password_digest VARCHAR(255) NOT NULL,
  date_created    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ON users (username);

CREATE TABLE quotes (
  id            SERIAL PRIMARY KEY,
  content       TEXT,
  author        VARCHAR(255),
  creator_id    INTEGER REFERENCES users (id) ON DELETE CASCADE,
  date_created  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ON quotes (author);
CREATE INDEX ON quotes (date_created);

CREATE TABLE tags (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(64) NOT NULL UNIQUE,
  description   VARCHAR(255),
  date_created  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ON tags (name);
CREATE INDEX ON tags (date_created);

CREATE TABLE quotes_tags (
  quote_id  INTEGER REFERENCES quotes (id) ON DELETE CASCADE,
  tag_id    INTEGER REFERENCES tags (id) ON DELETE CASCADE,
  PRIMARY KEY(quote_id, tag_id)
);
