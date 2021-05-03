const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();

app.use(cors())
app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));


app.use("/api/link", require("./routes/link.routes"));
app.use("/api/products", require("./routes/product.routes"));

const PORT = config.get("port") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    app.listen(PORT, () =>
      console.log(`app has been started on port http://localhost:${PORT}`)
    );
  } catch (e) {
    console.log("server Error", e.message);
    process.exit(1);
  }
}

start();
