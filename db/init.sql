-- Runs automatically the FIRST time the postgres container starts with an empty data volume.
CREATE TABLE IF NOT EXISTS shortlinks (
    id         BIGSERIAL PRIMARY KEY,
    code       TEXT NOT NULL UNIQUE,
    long_url   TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
