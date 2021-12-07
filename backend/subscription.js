const mongoose = require("mongoose");

// Throwaway Mongodb instance, so now the secret is in git. Too bad.
mongoose.connect(
  "mongodb+srv://pwanotes:pwanotes@cluster0.raiwq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

const subscriptionSchema = new mongoose.Schema({
    endpoint: { type: String, unique: true },
    expirationTime: { type: Number, unique: false },
    keys: {
      auth: { type: String, unique: false },
      p256dh: { type: String, unique: false },
    }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
