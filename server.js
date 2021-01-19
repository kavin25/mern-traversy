const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const config = require("config");
const { swaggerOptions, swaggerUIOptions } = require("./config/swagger");

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const items = require("./routes/api/items");
const users = require("./routes/api/users");
const auth = require("./routes/api/auth");

const app = express();

// BodyParser Middleware
app.use(express.json());

// Swagger
app.use(
  "/api/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs, swaggerUIOptions)
);

// DB Config
const db = config.get("mongoURI");

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`MongoDB Connected...`);
  })
  .catch((err) => console.log(err));

app.use("/api/items", items);
app.use("/api/users", users);
app.use("/api/auth", auth);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set Static Folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
