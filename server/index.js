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

db.connect();

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

server.get("/admin", (req, res) => {
  res.render("admin.ejs");
});

server.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});