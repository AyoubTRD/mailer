const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to db"))
  .catch((e) => console.error(e));

const Notification = mongoose.model("Notification", {
  title: String,
  message: String,
});

module.exports = {
  Notification,
};
