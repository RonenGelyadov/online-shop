CREATE TABLE products (
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	price MONEY,
	stock INT,
	description TEXT,
	image BYTEA
);