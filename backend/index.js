const express = require("express");
const cors = require("cors");
const Note = require("./note");
const Subscription = require("./subscription");
const path = require("path");
const webpushInit = require("./webpush");
const webpush = require("web-push");

webpushInit();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/api/notes", async (req, res) => {
  const result = await Note.find({});
  res.json(result);
});

app.post("/api/notes/sync", async (req, res) => {
  const body = req.body;

  let operations = [];
  operations = operations.concat(body
    .filter(n => n.deleted && n._id)
    .map(n => ({ deleteOne: { filter: { "_id": n._id } } })));

  operations = operations.concat(body
    .filter(n => n.hasChanged && !n.deleted && n._id)
    .map(n => ({ updateOne: { filter: { "_id": n._id }, update: { title: n.title, content: n.content } }})));

  const newNotes = body
    .filter(n => !n._id)
    .map(n => ({ title: n.title, content: n.content }));
  
  let insertResult, updateResult;
  try {
    [updateResult, insertResult] = await Promise.all(
      [Note.bulkWrite(operations), Note.insertMany(newNotes)]);
  } catch(e) {
    res.status(500);
    res.json(e);
    return;
  }
  
  
  // We need to use the same array, because inserted ids are given in that order.
  newNotes.forEach((n, i) => {
    body[body.findIndex(bn => bn.id == n.id)]._id = insertResult.insertedIds[i]
  });

  let notes = await Note.find({});
  let deletedNotes = body.filter(n => n._id && notes.every(rn => rn._id.toString() !== n._id)).map(n => ({ ...n, deleted: true}));
  notes = notes.map(n => ({ ...n.toObject(), id: body.find(bn => bn._id === n._id.toString())?.id }));
  res.json({deletedNotes, notes});
});


app.post("/api/notes", async (req, res) => {
  const body = req.body;
  if (!body.title && !body.content) {
    res.status(400).send("Invalid request");
  } else {
    try {
      const note = await new Note({ title: body.title, content: body.content }).save();
      res.json(note);
      // Send notification to all subscribers
      const notification = { title: `New note: ${body.title}` };
      const notifications = [];
      const subscriptions = await Subscription.find();
      subscriptions.forEach(sub => {
        notifications.push(
          webpush.sendNotification(sub, JSON.stringify(notification))
            .catch(e => console.log('subscription expired '))
        );
      });
      await Promise.all(notifications);
    } catch(e) {
      res.status(500);
      res.json(e);
    }
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const body = req.body;

  if (!body.title && !body.content) {
    res.status(400).send("Invalid request");
  } else {
    const result = await Note.findByIdAndUpdate(req.params.id, {
      title: body.title,
      content: body.content,
    }, { new: true });
    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  }
});

app.delete("/api/notes/:id", async (req, res) => {

  const result = await Note.deleteOne({ "_id": req.params.id });
  if (result.deletedCount) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

app.post("/api/subscriptions", async (req, res) => {
  const body = req.body;
  if (!body.endpoint && !body.keys) {
    res.status(400).send("Invalid request");
  } else {
    try {
      const subscription = await new Subscription({ endpoint: body.endpoint, keys: body.keys }).save();
      res.json(subscription);
    } catch(e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
