import "dotenv/config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import db from "./db";

const SECRET = process.env.SECRET || "";
if (!SECRET) throw new Error("SECRET must be provided");

//checking username and password exist/match
export async function login(req: Request, res: Response) {
  let { username, password } = req.body;

  if (typeof username !== "string") {
    res.status(400).send("invalid username");
    return;
  }
  if (typeof password !== "string") {
    res.status(400).send("invalid password");
    return;
  }

  let user = await db.one("SELECT * FROM member WHERE username = $1", username);

  if (user && password !== user.password) {
    res.status(403).send("incorrect username or password");
    return;
  }

  // do the hard part
  let token = jwt.sign({ foo: "bar" }, SECRET, {
    subject: String(user.userid),
  });

  res.send(token);
}

//decoding the token - checking it's real and not made up
export const jwtStrat = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
    jsonWebTokenOptions: { algorithms: ["HS256"] },
  },
  async (payload, done) => {
    try {
      let user = await db.one(
        "SELECT * FROM member WHERE UserID = $1",
        payload.sub
      );

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (e) {
      return done(e, false);
    }
  }
);

passport.use(jwtStrat);

export let auth = passport.authenticate("jwt", { session: false });
