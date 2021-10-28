const express = require("express");
const cors = require("cors");
const Note = require("./note");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/api/notes", async (req, res) => {
  const result = await Note.find({});
  res.json(result);
});

app.post("/api/notes", async (req, res) => {
  const body = req.body;

  if (!body.title || !body.content) {
    res.status(400).send("Invalid request");
  } else {
    const note = await new Note({ title: body.title, content: body.content }).save();
    res.json(note);
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
    }, {new: true});
    if (entry) {
      res.json(entry);
    } else {
      res.sendStatus(404);
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
