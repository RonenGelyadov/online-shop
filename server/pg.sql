CREATE TABLE products (
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	price MONEY,
	stock INT,
	description TEXT,
	image BYTEA
  category VARCHAR(255)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  date DATE NOT NULL,
  customer VARCHAR(255)
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255)
);

CREATE TABLE orderProducts (
  orderID INT,
  productID INT,
  quantity INT,
  PRIMARY KEY (orderID, ProductID),
  FOREIGN KEY (orderID) REFERENCES orders(id),
  FOREIGN KEY (productID) REFERENCES products(id)
);
