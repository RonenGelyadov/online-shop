import express from "express";
import cors from "cors";
import env from "dotenv";
import bodyParser from "body-parser";
import pg from "pg";

const server = express();

server.use(cors());
env.config();

const port = process.env.PORT;
const serverPassword = process.env.SERVER_PASS;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

try {
  await db.connect();
} catch (err) {
  console.log (`Error connecting to DB: ${err.message}`);
}

server.use(express.json());
server.use(express.static("public"));
server.use(bodyParser.urlencoded({ extended: true }));

var isAuth = false;

server.get("/", (req, res) => {
  if (isAuth) {
    res.render("index.ejs");
  } else {
    res.render("login.ejs");
  }
});

server.post("/login-server", (req, res) => {
  const givenPass = req.body.password;
  if (givenPass === serverPassword) {
    isAuth = true;
    res.redirect("/");
  } else {
    isAuth = false;
    res.render("login.ejs", {
      comment: "Wrong password"
    });
  }
});

server.get("/products", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM products");
    let data = response.rows;
    if (data.length < 1) {
      data = null;
    }
    res.render("products.ejs", {
      products: data
    });
  } catch (err) {
    console.log (`Error fetching products: ${err.message}`);
    res.render("products.ejs");
  }
});

server.get("/orders", (req, res) => {
  res.render("orders.ejs");
});

server.get("/add-product", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM categories ORDER BY name");
    const data = response.rows;
    if (data.length < 1) {
      console.log ("Error fetching categories");
      res.send("Error fetching categories");
    } else {
      res.render("add-product.ejs", {
        categories: data
      });
    }
  } catch (err) {
    console.log (`Error fetching categories: ${err.message}`);
    res.send(`Error fetching categories: ${err.message}`);
  }
});

server.post("/add-product", async (req, res) => {
  const productData = {
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    stock: req.body.stock,
    description: req.body.description
  }
  if (productData.category === "none") {
    try {
      const response = await db.query("SELECT * FROM categories ORDER BY name");
      const data = response.rows;
      res.render("add-product.ejs", {
        comment: "Please select category",
        categories: data
      });
    } catch (err) {
      console.log (`Error fetching categories: ${err.message}`);
      res.send(`Error fetching categories: ${err.message}`);
    }
  } else {
    try {
      await db.query(
        "INSERT INTO products (name, category, price, stock, description) VALUES ($1, $2, $3, $4, $5)",
        [productData.name, productData.category, productData.price, productData.stock, productData.description]
      );
      res.redirect("/products");
    } catch (err) {
      console.log (`Error adding product: ${err.message}`);
      res.send(`Error adding product: ${err.message}`);
    }
  }
});

server.post("/delete-product", async (req, res) => {
  const id = req.body.id;
  try {
    await db.query(
      "DELETE FROM products WHERE id=$1",
      [id]
    );
    res.redirect("/products");
  } catch (err) {
    console.log (`Error deleting product: ${err.message}`);
    res.send(`Error deleting product: ${err.message}`);
  }
});

server.get("/add-category", (req, res) => {
  res.render("add-category.ejs");
});

server.post("/add-category", async (req, res) => {
  const givenName = req.body.name;
  try {
    await db.query(
      "INSERT INTO categories (name) VALUES ($1)",
      [givenName]
    );
    res.render("add-category.ejs", {
      comment: `${givenName} was added successfully !`
    });
  } catch (err) {
    console.log (`Error adding categories: ${err.message}`);
    res.send(`Error adding categories: ${err.message}`);
  }
});

server.get("/admin", (req, res) => {
  res.render("admin.ejs");
});

server.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});