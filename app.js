const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/urlShortner")
  .then(() => {
    console.log("MongoDb Connection Established");
  })
  .catch((err) => {
    console.log("oh uh !! something went wrong");
    console.log(err);
  });

const ShortUrl = require("./models/UrlShortener");

app.get("/", async (req, res) => {
  const shorturl = await ShortUrl.find();
  res.render("home", { shorturl });
});

app.post("/shortUrl", async (req, res) => {
  // await ShortUrl.create({ full: req.body.fullUrl });
  const p = new ShortUrl({ full: req.body.fullUrl });
  await p.save();
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
