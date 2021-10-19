const express = require("express");
const cors = require("cors");
const Note = require("./note");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.get("/api/notes", async (req, res) => {
  const result = await Note.find({});
  res.json(result);
});

app.post("/api/notes", async (req, res) => {
  const body = req.body;

  if (!body.title || !body.content) {
    res.status(400).send("Invalid request");
  } else {
    await new Note({ title: body.title, content: body.content }).save();
    res.sendStatus(200);
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const body = req.body;

  if (!body.title || !body.content) {
    res.status(400).send("Invalid request");
  } else {
    const entry = await Note.findByIdAndUpdate(req.params.id, {
      title: body.title,
      content: body.content,
    });
    if (entry) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
