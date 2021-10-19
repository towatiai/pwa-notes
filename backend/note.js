const mongoose = require("mongoose");

// Throwaway Mongodb instance, so now the secret is in git. Too bad.
mongoose.connect(
  "mongodb+srv://pwanotes:pwanotes@cluster0.raiwq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

const noteSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  content: { type: String, unique: false },
});

module.exports = mongoose.model("Note", noteSchema);
