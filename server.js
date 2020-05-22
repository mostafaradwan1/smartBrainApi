const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const database = {
  users: [
    {
      id: "123",
      name: "john",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "1234",
      name: "sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};
app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  res.json("signin");
});

app.post("/register", (req, res) => {
  console.log(req.body.email);
  const { email, name, password } = req.body;
  database.users.push({
    id: 12356,
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = true;
  database.users.forEach((user) => {
    if (user.id == id) {
      found = true;
      return res.json(user);
    }
    if (!found) {
      res.status(400).json("not found");
    }
  });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = true;
  database.users.forEach((user) => {
    if (user.id == id) {
      user.entries++;
      found = true;
      return res.json(user.entries);
    }
    if (!found) {
      res.status(400).json("not found");
    }
  });
});

app.listen(3000, () => {
  console.log("app is running");
});

// bcrypt.hash("bacon",null,null,function(err,result){

// })
