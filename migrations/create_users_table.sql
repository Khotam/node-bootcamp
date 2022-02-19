CREATE TYPE user_type AS ENUM ('admin', 'user', 'courier');

CREATE TABLE users (
    id uuid not null,
    email varchar unique not null,
    username varchar not null,
    password varchar not null,
    type user_type not null DEFAULT 'user'
);
