CREATE TABLE v_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);