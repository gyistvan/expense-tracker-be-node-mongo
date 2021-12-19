import express from "express";
import routes from "./src/routes/appRoutes";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";

export const JSON_SECRET = "etBE";

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;
const URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost/APPdb"

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      "RESTFULAPIs",
      function (err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

routes(app);

app.get("/", (req, res) => {
  res.send(`node and express server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`your server is running on port ${PORT}`);
});
