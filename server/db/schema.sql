-- WROMANCEL catalog schema
-- One table: books. Tropes are stored as a text array.

CREATE TABLE IF NOT EXISTS books (
  id          SERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  author      TEXT        NOT NULL,
  pub_year    INTEGER     NOT NULL CHECK (pub_year BETWEEN 1900 AND 2100),
  pages       INTEGER     NOT NULL CHECK (pages BETWEEN 1 AND 5000),
  spicy       BOOLEAN     NOT NULL,
  tropes      TEXT[]      NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- prevent duplicate title+author (case-insensitive)
  UNIQUE (title, author)
);

-- Case-insensitive uniqueness guard (UNIQUE above is case-sensitive on its own)
CREATE UNIQUE INDEX IF NOT EXISTS books_title_author_lower_idx
  ON books (lower(title), lower(author));

-- Helps the search-as-you-type endpoint
CREATE INDEX IF NOT EXISTS books_title_trgm_idx ON books (lower(title));
CREATE INDEX IF NOT EXISTS books_author_trgm_idx ON books (lower(author));
