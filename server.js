const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
var knex = require("knex");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "123",
    database: "smartbrain",
  },
});

app.get("/", (req, res) => {
  res.send(db.select("*").from("users"));
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
});
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user);
      } else {
        res.status(400).json("unable to login");
      }
    })
    .catch((err) => res.status(400).json("unable to login"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries);
    }).catch(err=>res.status(400).json("unable to get entries"));
    
});

app.listen(3000, () => {
  console.log("app is running");
});
