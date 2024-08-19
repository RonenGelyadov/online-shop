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

server.get("/products", (req, res) => {
  res.render("products.ejs");
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