import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let users = [];
let tweets = [];

app.get("/tweets", (req, resp) => {
  resp.send(tweets.slice(-10));
});

app.get("/users", (req, resp) => {
  resp.send(users);
});

app.post("/sign-up", (req, resp) => {
  const data = req.body;
  if (data.username && data.avatar && typeof data.username === "string" && typeof data.avatar === "string") {
    users.push(data);
    resp.status(201).send("OK");
  } else {
    resp.status(400).send({ message: "Todos os campos são obrigatórios" });
  }
});

app.post("/tweets", (req, resp) => {
  const data = req.body;
  const i = users.findIndex(el => el.username === data.username);
  if (i === -1) {
    resp.status(401).send("UNAUTHORIZED");
  } else {
    const newObj = { username: data.username, avatar: users[i].avatar, tweet: data.tweet };
    tweets.push(newObj);
    resp.status(201).send("OK");
  }

});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

