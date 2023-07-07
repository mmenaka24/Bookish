import "dotenv/config";
import express from "express";

import { jwtStrat, login } from "./auth";
import router from "./routes";
import passport from "passport";
import session from "express-session";

const SECRET = process.env.SECRET;
if (!SECRET) throw new Error("SECRET must be provided");

const app = express();
const port = 8000;

//body parsing
app.use(express.json());

app.post("/login", login);

// app.use(
//   session({
//     secret: SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use("/", router);

app.listen(port, () => {
  console.log(`Test backend is running on port ${port}`);
});
