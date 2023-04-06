import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.get("/tweets", (req, res) => {
  let page = req.query.page;
  const maxPage = Math.ceil(tweets.length / 10);
  if (Number(page) < 1) {
    res.status(400).send("Informe uma página válida");
    return;
  }
  if (Number(page) > maxPage) {
    res.send([]);
    return;
  }
  if (page === undefined) {
    page = 1;
  }
  const initial = page * (-10);
  const final = tweets.length - ((page - 1) * 10);
  res.send(tweets.slice(initial, final));
});

app.get("/users", (req, res) => {
  res.send(users);
});

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const userTweets = tweets.filter(el => el.username === username);
  res.send(userTweets);
});

app.post("/sign-up", (req, res) => {
  const data = req.body;
  if (data.username && data.avatar && typeof data.username === "string" && typeof data.avatar === "string") {
    users.push(data);
    res.status(201).send("OK");
  } else {
    res.status(400).send("Todos os campos são obrigatórios");
  }
});

app.post("/tweets", (req, res) => {
  const { user } = req.headers;
  const { tweet } = req.body;
  const i = users.findIndex(el => el.username === user);
  if (i === -1) {
    res.status(401).send("UNAUTHORIZED");
  } else if (!tweet || !user || typeof user !== "string" || typeof tweet !== "string") {
    res.status(400).send("Todos os campos são obrigatórios");
  } else {
    const newObj = { username: user, avatar: users[i].avatar, tweet: tweet };
    tweets.push(newObj);
    res.status(201).send("OK");
  }

});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

